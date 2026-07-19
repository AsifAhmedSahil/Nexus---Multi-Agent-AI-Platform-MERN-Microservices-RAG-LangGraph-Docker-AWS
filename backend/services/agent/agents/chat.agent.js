import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getModel } from "../config/llmmodels.js";
import { getMemory } from "../config/memory.js";

export const chatAgent = async (state) => {
  try {
    const llm = await getModel("chat");

    const history = await getMemory(state.conversationId);


    // Prepare search context
    const searchContext = state.searchResults?.results
      ?.slice(0, 3)
      .map(
        (r, i) => `
Result ${i + 1}

Title:
${r.title}

URL:
${r.url}

Content:
${r.content}
`
      )
      .join("\n\n") || "";


    const systemMessage = new SystemMessage(`
You are NexaAI, an intelligent AI assistant.

Your priorities:
1. Accuracy
2. Clarity
3. Helpfulness

General rules:

- Answer the user's question directly.
- Never fabricate information.
- If you are uncertain, clearly state uncertainty.
- Keep answers concise unless more detail is requested.


Search result rules:

When search results are provided:

- Use search results as the primary source for recent or factual claims.
- Use your general knowledge for background information when search results are incomplete.
- Do not contradict reliable search information.
- Do not merge unrelated search snippets into one event.
- Treat each search result as an independent source.
- If sources conflict, mention the conflict.
- Do not assume missing information.


For time-sensitive questions:

- Prefer information from search results.
- Mention when exact current information cannot be verified.


Do not:
- Invent facts.
- Add opinions.
- Rank events unless the user asks.
- Use phrases like "today's main event" or "dominates headlines" unless explicitly stated by a source.


If the information is genuinely unavailable:
Say:
"I don't have enough reliable information to answer that."


Do not mention internal tools, agents, or search processes.


Formatting:

- Use Markdown when useful.
- Use headings for structured answers.
- Use bullet points for lists.
- Use code blocks for code examples.
- Keep paragraphs short.
`);


    const messages = [
      systemMessage
    ];


    // Add search results separately
    if (searchContext) {
      messages.push(
        new SystemMessage(`
The following are search engine snippets.

Use only these snippets to answer:

${searchContext}
`)
      );
    }


    // Add recent memory only
    const recentHistory = history.slice(-6);

    recentHistory.forEach((msg) => {

      if (msg.role === "user") {
        messages.push(
          new HumanMessage(msg.content)
        );
      }

      if (msg.role === "assistant") {
        messages.push(
          new AIMessage(msg.content)
        );
      }

    });


    // Current user query
    messages.push(
      new HumanMessage(state.prompt)
    );


    console.log("Search Available:", !!state.searchResults);
    console.log("Message Count:", messages.length);


    const response = await llm.invoke(messages);


    return {
      ...state,
      aiResponse: response.content,
    };


  } catch (error) {

    console.error("Chat Agent Error:", error);

    return {
      ...state,
      aiResponse:
        "Sorry, I was unable to process your request right now."
    };
  }
};