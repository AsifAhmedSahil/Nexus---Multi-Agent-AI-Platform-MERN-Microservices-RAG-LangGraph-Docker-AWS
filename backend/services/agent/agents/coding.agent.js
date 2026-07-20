import { getModel } from "../config/llmmodels.js";

export const codingAgent = async (state) => {
  const intentLlm = await getModel("intent");
  const llm = await getModel("coding");

  const intentRes = await intentLlm.invoke(`
You are an intent classifier.

Return ONLY one of these values:

CODE_GENERATION
CODE_REVIEW
CODE_EXPLAINATION
DEBUGGING
OPTIMIZATION
CONVERSATION
DOCUMENTATION

User Request:
${state.prompt}
`);

  const intent = intentRes.content.trim();

  if (intent === "CODE_GENERATION") {
    const prompt = `
You are NexusAI, an expert senior software engineer.

Generate complete, production-ready code.

Rules:
- Understand the user's request carefully.
- Follow best practices.
- Write clean and modular code.
- Generate every required file.
- Include complete file contents.
- Do NOT explain anything.
- Do NOT use markdown.
- Do NOT wrap the response inside \`\`\` or \`\`\`json.
- Return ONLY valid JSON.
- The response must start with { and end with }.

Schema:

{
  "files": [
    {
      "name": "index.html",
      "content": "..."
    },
    {
      "name": "style.css",
      "content": "..."
    },
    {
      "name": "script.js",
      "content": "..."
    }
  ]
}

User Request:
${state.prompt}
`;

    const res = await llm.invoke(prompt);

    try {
      let json = res.content.trim();

      json = json
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "");

      const data = JSON.parse(json);

      return {
        ...state,
        aiResponse: "Code Generated Successfully",
        artifacts: [
          {
            id: Date.now(),
            type: "Project",
            files: data.files || [],
            title:state.prompt
          },
        ],
      };
    } catch (err) {
      console.error("JSON Parse Error:", err);
      console.log("LLM Response:\n", res.content);

      return {
        ...state,
        aiResponse: "Failed to generate valid project JSON.",
        artifacts: [],
      };
    }
  }

  const prompt = `
You are NexusAI.

The user's request type is:

${intent}

Return Markdown only.

Never generate project files.

Use headings like:

# Overview

## Explanation

## Problems

## Improvements

## Best Practices

## Optimized Code (if needed)

User Request:
${state.prompt}
`;

  const res = await llm.invoke(prompt);

  return {
    ...state,
    aiResponse: res.content,
    artifacts: [],
  };
};