"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIProvider = void 0;
const openai_1 = __importDefault(require("openai"));
const fs_1 = __importDefault(require("fs"));
class OpenAIProvider {
    client;
    systemPrompt = `You are Wingman AI, a helpful, proactive assistant for any kind of problem or situation (not just coding). For any user input, analyze the situation, provide a clear problem statement, relevant context, and suggest several possible responses or actions the user could take next. Always explain your reasoning. Present your suggestions as a list of options or next steps.`;
    constructor(apiKey) {
        this.client = new openai_1.default({ apiKey });
    }
    async prepareImages(imagePaths) {
        return await Promise.all(imagePaths.map(async (path) => {
            const buffer = await fs_1.default.promises.readFile(path);
            return {
                data: buffer,
                type: 'image/png'
            };
        }));
    }
    async generateResponse(prompt, images) {
        try {
            const messages = [
                { role: 'system', content: this.systemPrompt },
                { role: 'user', content: [
                        { type: 'text', text: prompt }
                    ] }
            ];
            if (images && images.length > 0) {
                const imageFiles = await this.prepareImages(images);
                messages[1].content.push(...imageFiles);
            }
            const completion = await this.client.chat.completions.create({
                model: 'gpt-4-vision-preview',
                messages,
                response_format: { type: 'json_object' }
            });
            return JSON.parse(completion.choices[0].message.content || '{}');
        }
        catch (error) {
            console.error("Error generating response:", error);
            throw error;
        }
    }
}
exports.OpenAIProvider = OpenAIProvider;
//# sourceMappingURL=openai.js.map