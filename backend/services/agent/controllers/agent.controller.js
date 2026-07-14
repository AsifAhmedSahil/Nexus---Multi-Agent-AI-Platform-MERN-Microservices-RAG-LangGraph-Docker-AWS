import axios from "axios";

export const agent = async (req, res) => {
  try {
    const { conversationId, prompt } = req.body;
    await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
      conversationId,
      role: "user",
      content: prompt,
    });

    const result = await Graph.invoke({
      prompt,
      conversationId,
    });

    const response = result.aiResponse;

    return res.status(200).josn(response);
  } catch (error) {
    return res.status(500).josn({ Message: `agent error ${error}` });
  }
};
