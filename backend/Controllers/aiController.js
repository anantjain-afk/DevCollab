const {GoogleGenAI} =  require('@google/genai');
const dotenv = require("dotenv");
const apiKey = process.env.GEMINI_API_KEY;
dotenv.config();
const ai = new GoogleGenAI({apiKey : apiKey});
async function explainCode(req,res) {
    try {
        const { code, promptType } = req.body;

    if (!code) {
      return res.status(400).json({ error: "No code provided" });
    }

    // 2. Construct the prompt
    let promptText = "";
    if (promptType === 'optimize') {
        promptText = `You are a senior developer. Please optimize the following code for performance and readability. Briefly explain what you changed:\n\n${code}`;
    } else {
        promptText = `You are a helpful coding tutor. Please explain what the following code does in simple terms:\n\n${code}`;
    }
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promptText,
    });
    res.status(200).json({ result: response.text } );

    } catch (error) {
        console.error("AI Error:", error);
    res.status(500).json({ error: "Failed to generate AI response" });
    }
        
}

async function generateSubtasks(req, res) {
    try {
        const { goal } = req.body;
        if (!goal) {
            return res.status(400).json({ error: "No goal provided" });
        }

        const prompt = `You are a project manager. Given the high-level goal: "${goal}", generate a list of 3-5 concrete, actionable subtasks. Return ONLY a valid JSON array of strings, for example: ["Task 1", "Task 2"]. Do not include any markdown formatting or extra text.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const text = response.text;
        // Clean up markdown code blocks if present
        const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
        const tasks = JSON.parse(jsonStr);

        res.status(200).json({ tasks });

    } catch (error) {
        console.error("AI Task Generation Error:", error);
        res.status(500).json({ error: "Failed to generate tasks" });
    }
}

module.exports = {
      explainCode,
      generateSubtasks
};