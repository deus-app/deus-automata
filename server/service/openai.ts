import { ChatOpenAI } from 'langchain/chat_models/openai';
import { OPENAI_KEY } from './envValues';

// TODO: Change max tokens value
export const llm = new ChatOpenAI({
  modelName: 'gpt-4-vision-preview',
  openAIApiKey: OPENAI_KEY,
  maxTokens: 256,
});
