import { getModel } from "../config/llmmodels.js"

export const chatAgent = async(state)=>{
    const llm = await getModel("chat")
    const systemPrompt = "You are Nexus AI, an intelligent AI Assistant."
    const response = await llm.invoke([
        {
            "role":"system",
            "content":systemPrompt
        },
        {
            "role":"human",
            "content":state.prompt 
        }
    ])

    return {
        ...state,
        aiResponse:response.content
    }

}