import { getModel } from "../config/llmmodels.js";
import { generatePpt } from "../utils/generatePpt.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { uploadToS3 } from "../utils/uploadToS3.js";

export const pptAgent = async (state) => {
  try {
    const llm = await getModel("ppt");
    const prompt = `
        You are a professional presentaion designer.

        Return only valid JSON.

        Format:

        {
        "title":"",
        "subtitle":"",
        "slides":[
        {
        "title":"",
        "points":[
        
        "",
        "",
        "",
        "",
        
        ]
        }
        ]
        }

        Rules:

        -- generate exacylt 6 content slides.
        - Each slide should have 4-6 concise bullet points.
        - No markdown
        - No Explaination.
        - No code block
        - Return ONLY JSON.

        Topic:

        ${state.prompt}

        
        `;
    const res = await llm.invoke(prompt);

    const data = JSON.parse(res.content);

    const ppt = await generatePpt(data);

    const buffer = await ppt.write({
      outputType: "nodebuffer",
    });

    const filename = `ppt-${Date.now()}.pptx`;

    await uploadToS3(
      filename,
      buffer,
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    );

    const downloadUrl = await getFromS3(filename, 24 * 60 * 60);

    return {
      ...state,
      aiResponse: `
# ✅ Presentation Generated

**${data.title}**

📥 [Download PPT](${downloadUrl})

Link expires in 10 minutes.
`,
    };
  } catch (error) {
    console.log(error)
    return {
            ...state,
            aiResponse: "Failed to generate PPT"
        }
  }
};
