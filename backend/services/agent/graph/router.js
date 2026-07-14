import { getModel } from "../config/llmmodels.js"

export const router = async(state)=>{
    const llm = await getModel("router")
    const prompt = `You are an agent router. 
    
    Avaiable agents:
    -chat
    -search
    -coding
    -pdf
    -ppt
    -vision

    Rules:

    chat:
    general conversation,
    explanations,
    learning,
    questions.

    search:
    current events,
    latest information,
    news,
    recent developments,
    internet lookup

    coding:
    generate code,
    debuf code,
    build projects,
    architecture,
    api design

    pdf:
    Questions about generate pdfs,
    or document context.

    ppt:
    Questions about generate ppts,
    or ppt context.

    vision:
    Generate image,
    create image
    
    return only one word:

    chat
    search
    coding
    pdf
    ppt
    vision

    User Query:
    ${state.prompt}

    `


    const response = await llm.invoke(prompt)

    console.log(response)

    return {
        ...state,
        agent:response.content.trim().toLowerCase()
    }

 
}  