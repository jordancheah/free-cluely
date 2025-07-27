# LLM Configuration

This file contains the necessary environment variables for configuring different LLM providers.

## Configuration Options

### Gemini (Default)
```env
PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash  # Optional, defaults to gemini-2.0-flash
```

### OpenAI
```env
PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4-vision-preview  # Optional, defaults to gpt-4-vision-preview
```

## Usage

1. Create a `.env` file in the root directory
2. Copy the configuration for your preferred LLM provider
3. Replace the API key with your actual key
4. Optionally customize the model name

## Example .env file
```env
# Choose your provider (gemini or openai)
PROVIDER=gemini

# Gemini configuration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash

# OpenAI configuration (uncomment if using OpenAI)
#OPENAI_API_KEY=your_openai_api_key_here
#OPENAI_MODEL=gpt-4-vision-preview
```
