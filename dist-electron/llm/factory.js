"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMFactory = void 0;
const gemini_1 = require("./gemini");
const openai_1 = require("./openai");
class LLMFactory {
    static createProvider(config) {
        switch (config.provider.toLowerCase()) {
            case 'gemini':
                return new gemini_1.GeminiProvider(config.apiKey, config.model);
            case 'openai':
                return new openai_1.OpenAIProvider(config.apiKey);
            default:
                throw new Error(`Unsupported LLM provider: ${config.provider}`);
        }
    }
}
exports.LLMFactory = LLMFactory;
//# sourceMappingURL=factory.js.map