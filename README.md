# NexusAI — Multi-Agent AI Platform

[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com)
[![LangGraph](https://img.shields.io/badge/LangGraph-1.x-1C3C3C)](https://langchain-ai.github.io/langgraph/)
[![MongoDB](https://img.shields.io/badge/MongoDB-9.x-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white)](https://redis.io)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-DD2C00?logo=firebase&logoColor=white)](https://firebase.google.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

**NexusAI** is a full-stack, multi-agent AI chat platform. It combines a **microservices backend** built on Node.js, Express, and LangGraph with a modern **React + Vite** frontend. Users authenticate with Google, maintain persistent conversation history in MongoDB, and chat with a family of specialized AI agents — general chat, web search, code generation, PDF, PPT, and vision — that are routed dynamically by an intelligent LangGraph orchestration layer.

---

## ✨ Key Features

- **🧠 Multi-Agent Orchestration** — A LangGraph `StateGraph` router dispatches each request to the most appropriate agent (`chat`, `search`, `coding`, `pdf`, `ppt`, `vision`), or you can force a specific agent from the UI.
- **💻 Code Generation with Live Preview** — The Coding agent produces multi-file projects as JSON artifacts. The **Artifact panel** renders them in a Monaco editor with a one-click live browser preview (HTML/CSS/JS).
- **🌐 Real-Time Web Search** — Tavily-powered search agent fetches current information and images, which the Chat agent uses as grounded context.
- **💬 Conversational Memory** — Per-conversation history is cached in Redis (last 20 messages) and combined with MongoDB-persisted messages for context-aware replies.
- **🔐 Google Authentication** — Firebase Admin verifies Google ID tokens; sessions are stored in Redis and issued as HTTP-only cookies.
- **📁 Persistent Conversations** — Conversations and messages (including images & artifacts) are persisted in MongoDB and fully restored on reload.
- **🎨 Modern Dark UI** — Tailwind CSS v4 design with collapsible sidebar, Markdown rendering, syntax-highlighted code blocks, image lightbox, and smooth animations.
- **⚙️ Microservices Architecture** — Independently deployable Gateway, Auth, Chat, and Agent services with a shared Redis infrastructure.

---

## 🏗️ Architecture Overview

```
                        ┌─────────────────────────────────────────────────┐
                        │                  FRONTEND (React)              │
                        │  Vite · Redux Toolkit · Tailwind · Firebase    │
                        └──────────────────────┬──────────────────────────┘
                                               │ HTTP (axios, withCredentials)
                                               ▼
                        ┌─────────────────────────────────────────────────┐
                        │              API GATEWAY  (Express)             │
                        │  CORS · cookie-parser · morgan · reverse proxy  │
                        └───────┬──────────────┬──────────────┬───────────┘
                                │              │              │
                      ┌─────────▼─────┐ ┌──────▼───────┐ ┌────▼────────────┐
                      │   AUTH SVC    │ │  CHAT SVC    │ │   AGENT SVC     │
                      │ Firebase Admin│ │ Mongoose     │ │ LangGraph Graph │
                      │ User upsert  │ │ Conversations │ │ Router → Agents │
                      │ Session issue │ │ & Messages   │ │ Chat/Search/    │
                      └───────┬───────┘ └──────┬────────┘ │ Coding/PDF/     │
                              │                │           │ PPT/Vision      │
                              │                │           └────────┬───────┘
                              ▼                ▼                     ▼
                       ┌──────────────┐ ┌──────────────┐  ┌──────────────────────┐
                       │    REDIS     │ │  MONGODB     │  │   LLM PROVIDERS      │
                       │ sessions +   │ │ users, convs │  │ Groq · Gemini ·      │
                       │ message cache│ │ & messages   │  │ OpenRouter · Tavily  │
                       └──────────────┘ └──────────────┘  └──────────────────────┘
```

### How a request flows

1. The user signs in with Google; Firebase returns an ID token.
2. The frontend sends the token to `POST /api/auth/login`. The **Auth service** verifies it, upserts the user in MongoDB, and creates a Redis-backed session returned as an HTTP-only cookie.
3. Every subsequent request (chat, agent, conversations) carries the session cookie. The **Gateway's** `protect` middleware validates it against Redis and forwards the user context.
4. When the user sends a message, the frontend calls `POST /api/agent/chat`. The **Agent service**:
   - saves the user message to the Chat service,
   - invokes a LangGraph workflow: a **router node** selects the agent (or honors an explicit choice),
   - executes the agent (e.g., search via Tavily, code generation via DeepSeek),
   - updates Redis memory and persists the assistant reply back to the Chat service,
   - returns the answer, images, and any generated artifacts.
5. The frontend renders the Markdown response, images, and — for coding requests — an interactive artifact with a live preview.

---

## 🧩 Tech Stack

| Layer | Technology |
| ----- | ---------- |
| **Frontend** | React 19, Vite 8, Tailwind CSS v4, Redux Toolkit, Firebase SDK |
| **Editor / Preview** | Monaco Editor, react-markdown, react-syntax-highlighter |
| **Backend** | Node.js, Express 5, `express-http-proxy` |
| **Agent Orchestration** | LangChain LangGraph, LangChain Core |
| **LLM Providers** | Groq (`gpt-oss-120b`), Google Gemini (`gemini-2.5-flash`), OpenRouter (DeepSeek) |
| **Web Search** | Tavily |
| **Database** | MongoDB (Mongoose 9) |
| **Cache / Sessions** | Redis (ioredis) |
| **Authentication** | Firebase Admin SDK (Google OAuth) |
| **Infrastructure** | Docker Compose (Redis), npm workspaces per service |

---

## 📁 Project Structure

```
nexus-ai-multi-agent-platform/
├── backend/
│   ├── docker-compose.yml              # Redis container
│   ├── package.json                    # root backend workspace deps (ioredis)
│   ├── shared/
│   │   └── redis/
│   │       └── redis.js                # shared ioredis client
│   ├── gateway/                        # API Gateway (port 8000)
│   │   ├── index.js                    # Express app + reverse proxies
│   │   ├── middleware/
│   │   │   └── auth.middleware.js      # Redis session `protect` guard
│   │   ├── controllers/
│   │   │   └── user.controllers.js     # GET /api/me
│   │   └── utils/
│   │       └── proxyWithHeader.js      # proxies + injects x-user-id
│   └── services/
│       ├── auth/                       # Auth Service (port 8001)
│       │   ├── index.js
│       │   ├── config/                 # db.js, firebase.js
│       │   ├── controllers/            # login, logout
│       │   ├── models/                 # User model
│       │   └── routes/                 # /login, /logout
│       ├── chat/                       # Chat Service (port 8002)
│       │   ├── index.js
│       │   ├── config/                 # db.js
│       │   ├── controllers/            # conversations & messages CRUD
│       │   ├── models/                 # Conversation, Message
│       │   └── routes/                 # /create-conversation, etc.
│       └── agent/                      # Agent Service (port 8003)
│           ├── index.js
│           ├── agents/                 # chat, search, coding, pdf, ppt, vision
│           ├── config/                 # llmmodels, memory, tavily, db
│           ├── controllers/            # /chat endpoint
│           ├── graph/                  # state.js, router.js, graph.js
│           ├── routes/                 # /chat route
│           └── utils/                  # getMessages.js
└── frontend/                           # React + Vite SPA
    ├── vite.config.js
    ├── utils/                          # axios instance, firebase init
    └── src/
        ├── App.jsx, main.jsx
        ├── pages/Home.jsx              # login modal + layout
        ├── components/                 # Sidebar, Nav, ChatArea, ChatInput,
        │                               # MessageList, MessageBubble, Artifact
        ├── features/                   # API feature helpers
        └── redux/                      # user, conversation, message slices
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+ and **npm**
- **Docker** (for Redis) or a locally running Redis instance
- **MongoDB** — local or Atlas connection string
- **Firebase project** — web app config + **service account key** (`serviceAccountKey.json`)
- API keys for the agent providers: **Groq**, **Google Gemini**, **OpenRouter**, and **Tavily**

### 1. Clone & install dependencies

```bash
git clone <your-repo-url>
cd nexus-ai-multi-agent-platform

# Backend services
cd backend/gateway && npm install
cd ../services/auth && npm install
cd ../services/chat && npm install
cd ../services/agent && npm install

# Frontend
cd ../../../frontend && npm install
```

> **Note:** `backend/` also has a root `package.json` for shared tooling (`ioredis`). If you want to run the whole stack from one workspace, you can promote it to an npm workspace and install at the root.

### 2. Start Redis

```bash
cd backend
docker compose up -d
```

This exposes Redis on `localhost:6379` (default). Alternatively, point `REDIS_URL` to any running Redis instance.

### 3. Configure environment variables

Create a `.env` file in **each** service directory (Gateway, Auth, Chat, Agent) and a `.env` in `frontend/`. See the [Environment Variables](#environment-variables) section for the full reference.

For the **Auth service**, place your Firebase **service account JSON** at:

```
backend/services/auth/serviceAccountKey.json
```

### 4. Run the backend services

Open a terminal for each service (or use a process manager like `pm2` / `concurrently`):

```bash
# Gateway (default port 8000)
cd backend/gateway && npm run dev

# Auth service (default port 8001)
cd backend/services/auth && npm run dev

# Chat service (default port 8002)
cd backend/services/chat && npm run dev

# Agent service (default port 8003)
cd backend/services/agent && npm run dev
```

> Each service reads its own `PORT` from its `.env`. Make sure the Gateway's `AUTH_SERVICE`, `CHAT_SERVICE`, and `AGENT_SERVICE` variables point to these ports.

### 5. Run the frontend

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173`, sign in with Google, and start chatting. Try **Auto** mode for smart routing, or pick a specific agent (Chat, Coding, PDF, PPT, Image, Search) from the toolbar.

---

## 🔧 Environment Variables

### Gateway (`backend/gateway/.env`)

| Variable | Description | Example |
| -------- | ----------- | ------- |
| `PORT` | Gateway port | `8000` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:5173` |
| `AUTH_SERVICE` | Auth service URL | `http://localhost:8001` |
| `CHAT_SERVICE` | Chat service URL | `http://localhost:8002` |
| `AGENT_SERVICE` | Agent service URL | `http://localhost:8003` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |

### Auth Service (`backend/services/auth/.env`)

| Variable | Description | Example |
| -------- | ----------- | ------- |
| `PORT` | Auth service port | `8001` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/nexusai` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |

Also requires `backend/services/auth/serviceAccountKey.json` (Firebase Admin service account).

### Chat Service (`backend/services/chat/.env`)

| Variable | Description | Example |
| -------- | ----------- | ------- |
| `PORT` | Chat service port | `8002` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/nexusai` |

### Agent Service (`backend/services/agent/.env`)

| Variable | Description | Example |
| -------- | ----------- | ------- |
| `PORT` | Agent service port | `8003` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/nexusai` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `CHAT_SERVICE` | Chat service URL (for persisting messages) | `http://localhost:8002` |
| `GROQ_API_KEY` | Groq API key (chat & search agents) | `gsk_...` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIza...` |
| `OPENROUTER_API_KEY` | OpenRouter API key (coding agent) | `sk-or-...` |
| `TAVILY_API_KEY` | Tavily API key (search agent) | `tvly-...` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
| -------- | ----------- | ------- |
| `VITE_SERVER_URL` | Gateway base URL | `http://localhost:8000` |
| `VITE_FIREBASE_API_KEY` | Firebase web API key | `AIza...` |

> The Firebase `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, and `appId` are hard-coded in `frontend/utils/firebase.js` — update them to match your Firebase project.

---

## 🔌 API Reference

All routes are proxied through the **Gateway** (`http://localhost:8000`). Auth, Chat, and Agent routes use cookies for session auth; the Chat service additionally receives the authenticated user via the `x-user-id` header.

### Auth

| Method | Endpoint | Description | Auth |
| ------ | -------- | ----------- | ---- |
| `POST` | `/api/auth/login` | Verify Firebase ID token, upsert user, create Redis session, set cookie | Public |
| `GET` | `/api/auth/logout` | Delete Redis session and clear cookie | Cookie |

### User

| Method | Endpoint | Description | Auth |
| ------ | -------- | ----------- | ---- |
| `GET` | `/api/me` | Return the currently authenticated user | Session |

### Chat

| Method | Endpoint | Description | Auth |
| ------ | -------- | ----------- | ---- |
| `GET` | `/api/chat/create-conversation` | Create a new conversation for the current user | Session |
| `GET` | `/api/chat/get-conversations` | List the user's conversations (newest first) | Session |
| `POST` | `/api/chat/update-conversation` | Update a conversation title (`{ id, title }`) | Session |
| `POST` | `/api/chat/save-message` | Persist a message (`{ conversationId, role, content, images?, artifacts? }`) | Session |
| `GET` | `/api/chat/get-messages/:conversationId` | Fetch all messages for a conversation | Session |

### Agent

| Method | Endpoint | Description | Auth |
| ------ | -------- | ----------- | ---- |
| `POST` | `/api/agent/chat` | Send a prompt to the agent graph (`{ prompt, conversationId, agent }`) | Session |

**Response shape (`/api/agent/chat`):**

```json
{
  "answer": "markdown response...",
  "images": ["https://..."],
  "artifacts": [
    {
      "id": 1234567890,
      "type": "Project",
      "title": "Netflix clone",
      "files": [
        { "name": "index.html", "content": "..." },
        { "name": "style.css", "content": "..." },
        { "name": "script.js", "content": "..." }
      ]
    }
  ]
}
```

---

## 🤖 Agent System

The Agent service is a **LangGraph state machine** defined in `backend/services/agent/graph/`.

### State

Each graph invocation carries an `agentState` (see `state.js`) with:

- `prompt` — the user's message
- `agent` — the selected agent (or `auto`)
- `conversationId` — for memory & persistence
- `aiResponse` — the final answer
- `searchResults`, `images`, `artifacts` — optional agent outputs

### Router

The router node (`router.js`) either:

- honors an explicit `agent` value passed from the frontend (Auto/Chat/Search/Coding/PDF/PPT/Image), or
- uses an LLM to classify the user's query and return one of: `chat`, `search`, `coding`, `pdf`, `ppt`, `vision`.

### Agents

| Agent | Purpose | Backing Model / Tool | Status |
| ----- | ------- | -------------------- | ------ |
| **Chat** | General conversation, explanations, learning, Q&A | Groq `gpt-oss-120b` + conversation memory | ✅ Implemented |
| **Search** | Current events, news, internet lookups | Tavily search (returns results + images) | ✅ Implemented |
| **Coding** | Code generation, debugging, review, architecture | OpenRouter DeepSeek; intent classifier + artifact JSON output | ✅ Implemented |
| **PDF** | PDF generation / document context | — | 🚧 Stub |
| **PPT** | Presentation generation | — | 🚧 Stub |
| **Vision** | Image generation | — | 🚧 Stub |

The graph wires `search → chat` so search results are synthesized into a grounded answer by the chat agent. Coding requests produce multi-file **artifacts** rendered in the frontend's Artifact panel.

### Memory

Conversation memory (`config/memory.js`) stores the last 20 messages per conversation in Redis under `messages-{conversationId}` (24h TTL). The Chat agent uses the last 6 messages as recent context.

---

## 🗺️ Roadmap

- [ ] Implement the **PDF**, **PPT**, and **Vision** agents (currently stubs).
- [ ] Add streaming responses (SSE / WebSockets) for a typewriter chat experience.
- [ ] Multi-model fallback & provider switching.
- [ ] Conversation rename/delete controls.
- [ ] Token/credit tracking and plan tiers.
- [ ] Dockerize all services with a unified `docker-compose.yml`.
- [ ] Add end-to-end tests and CI pipelines.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve NexusAI:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-idea`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-idea`).
5. Open a Pull Request.



---

## 📄 License

This project is for **educational and demonstration purposes**. If you plan to use it commercially, replace the LLM API keys, Firebase configuration, and branding with your own, and review the terms of service for each provider (Groq, Google, OpenRouter, Tavily) used by the agent service.

---



