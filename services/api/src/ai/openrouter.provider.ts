import { AIProvider, AIMessage } from './provider.interface';

export class OpenRouterProvider implements AIProvider {
  providerName = 'OpenRouter';
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model = 'meta-llama/llama-3.1-8b-instruct:free') {
    this.apiKey = apiKey;
    this.model = model;
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  async generateResponse(messages: AIMessage[], systemContext: string): Promise<string> {
    const allMessages = [
      { role: 'system', content: systemContext },
      ...messages,
    ];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        'HTTP-Referer': 'https://janjathi-shiksha-setu.gov.in',
        'X-Title': 'Janjathi Shiksha Setu - JAGO',
      },
      body: JSON.stringify({
        model: this.model,
        messages: allMessages,
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json() as any;
    return data.choices?.[0]?.message?.content || 'I could not generate a response. Please try again.';
  }
}
