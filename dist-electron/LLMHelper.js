"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMHelper = void 0;
const factory_1 = require("./llm/factory");
const fs_1 = __importDefault(require("fs"));
class LLMHelper {
    provider;
    systemPrompt = `You are Wingman AI, a helpful, proactive assistant for any kind of problem or situation (not just coding). For any user input, analyze the situation, provide a clear problem statement, relevant context, and suggest several possible responses or actions the user could take next. Always explain your reasoning. Present your suggestions as a list of options or next steps.`;
    constructor(config) {
        this.provider = factory_1.LLMFactory.createProvider(config);
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
    async extractProblemFromImages(imagePaths) {
        try {
            const prompt = `Please analyze these images and extract the key information.`;
            return await this.provider.generateResponse(prompt, imagePaths);
        }
        catch (error) {
            console.error("Error extracting problem from images:", error);
            throw error;
        }
    }
    async generateSolution(problemInfo) {
        console.log("[LLMHelper] Calling LLM for solution...");
        try {
            const prompt = `Given this problem or situation:\n${JSON.stringify(problemInfo, null, 2)}\n\nProvide a solution with code implementation if applicable.`;
            const response = await this.provider.generateResponse(prompt);
            console.log("[LLMHelper] Parsed LLM response:", response);
            // Ensure the response matches our expected format
            if (!response.solution) {
                throw new Error("Invalid response format: missing solution object");
            }
            return response;
        }
        catch (error) {
            console.error("[LLMHelper] Error in generateSolution:", error);
            throw error;
        }
    }
    async debugSolutionWithImages(problemInfo, currentCode, debugImagePaths) {
        try {
            const prompt = `Given:\n1. The original problem or situation: ${JSON.stringify(problemInfo, null, 2)}\n2. The current response or approach: ${currentCode}\n3. Please analyze the debug information in the provided images`;
            return await this.provider.generateResponse(prompt, debugImagePaths);
        }
        catch (error) {
            console.error("Error debugging solution with images:", error);
            throw error;
        }
    }
    async analyzeAudioFile(audioPath) {
        try {
            const prompt = "Describe this audio clip in a short, concise answer and suggest several possible actions or responses.";
            const response = await this.provider.generateResponse(prompt, [audioPath]);
            return {
                text: response.solution.suggested_responses.join("\n"),
                timestamp: Date.now()
            };
        }
        catch (error) {
            console.error("Error analyzing audio file:", error);
            throw error;
        }
    }
    async analyzeAudioFromBase64(data, mimeType) {
        try {
            // Note: This might need to be implemented differently depending on the provider's capabilities
            const prompt = "Describe this audio clip in a short, concise answer and suggest several possible actions or responses.";
            const response = await this.provider.generateResponse(prompt);
            return {
                text: response.solution.suggested_responses.join("\n"),
                timestamp: Date.now()
            };
        }
        catch (error) {
            console.error("Error analyzing audio from base64:", error);
            throw error;
        }
    }
    async analyzeImageFile(imagePath) {
        try {
            const prompt = "Describe the content of this image in a short, concise answer and suggest several possible actions or responses.";
            const response = await this.provider.generateResponse(prompt, [imagePath]);
            return {
                text: response.solution.suggested_responses.join("\n"),
                timestamp: Date.now()
            };
        }
        catch (error) {
            console.error("Error analyzing image file:", error);
            throw error;
        }
    }
}
exports.LLMHelper = LLMHelper;
//# sourceMappingURL=LLMHelper.js.map