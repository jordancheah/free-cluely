"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiProvider = void 0;
const generative_ai_1 = require("@google/generative-ai");
const fs_1 = __importDefault(require("fs"));
class GeminiProvider {
    model;
    systemPrompt = `You are Wingman AI, a helpful, proactive assistant for any kind of problem or situation (not just coding). For any user input, analyze the situation, provide a clear problem statement, relevant context, and suggest several possible responses or actions the user could take next. Always explain your reasoning. Present your suggestions as a list of options or next steps.`;
    constructor(apiKey, modelName = "gemini-2.0-flash") {
        const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        this.model = genAI.getGenerativeModel({ model: modelName });
    }
    async fileToGenerativePart(imagePath) {
        const imageData = await fs_1.default.promises.readFile(imagePath);
        return {
            inlineData: {
                data: imageData.toString("base64"),
                mimeType: "image/png"
            }
        };
    }
    cleanJsonResponse(text) {
        text = text.replace(/^```(?:json)?\n/, '').replace(/\n```$/, '');
        return text.trim();
    }
    async generateResponse(prompt, images) {
        try {
            const imageParts = images ? await Promise.all(images.map(path => this.fileToGenerativePart(path))) : [];
            const fullPrompt = `${this.systemPrompt}\n\n${prompt}\n\nReturn response in JSON format:\n{
  "solution": {
    "code": "The code or implementation if applicable, otherwise leave empty",
    "problem_statement": "A clear statement of the problem or situation.",
    "context": "Relevant background or context.",
    "suggested_responses": ["First possible answer or action", "Second possible answer or action", "..."],
    "reasoning": "Explanation of why these suggestions are appropriate."
  }
}\nImportant: Return ONLY the JSON object, without any markdown formatting or code blocks.`;
            const result = await this.model.generateContent([fullPrompt, ...imageParts]);
            const response = await result.response;
            const text = this.cleanJsonResponse(response.text());
            return JSON.parse(text);
        }
        catch (error) {
            console.error("Error generating response:", error);
            throw error;
        }
    }
}
exports.GeminiProvider = GeminiProvider;
//# sourceMappingURL=gemini.js.map