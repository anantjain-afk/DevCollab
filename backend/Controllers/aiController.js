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

module.exports = {
      explainCode
};