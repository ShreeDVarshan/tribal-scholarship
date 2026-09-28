import { AIProvider } from './provider.interface';
import { MockAIProvider } from './mock.provider';
import { GeminiProvider } from './gemini.provider';
import { OpenRouterProvider } from './openrouter.provider';

let _provider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (_provider) return _provider;

  const configured = process.env.AI_PROVIDER || 'mock';

  if (configured === 'gemini' && process.env.GEMINI_API_KEY) {
    const provider = new GeminiProvider(process.env.GEMINI_API_KEY);
    if (provider.isAvailable()) {
      console.log('🤖 AI Provider: Google Gemini');
      _provider = provider;
      return _provider;
    }
  }

  if (configured === 'openrouter' && process.env.OPENROUTER_API_KEY) {
    const provider = new OpenRouterProvider(
      process.env.OPENROUTER_API_KEY,
      process.env.OPENROUTER_MODEL
    );
    if (provider.isAvailable()) {
      console.log('🤖 AI Provider: OpenRouter');
      _provider = provider;
      return _provider;
    }
  }

  // Default fallback: Mock
  console.log('🤖 AI Provider: Mock (Demo Mode)');
  _provider = new MockAIProvider();
  return _provider;
}
