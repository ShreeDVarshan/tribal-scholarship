export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIProvider {
  generateResponse(messages: AIMessage[], systemContext: string): Promise<string>;
  isAvailable(): boolean;
  providerName: string;
}
