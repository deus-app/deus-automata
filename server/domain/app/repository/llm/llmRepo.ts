import { visionParser, type VisionModel } from '$/commonTypesWithClient/models';
import { OPENAI_KEY } from '$/service/envValues';
import { ConversationChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BufferMemory } from 'langchain/memory';
import { ChatPromptTemplate, MessagesPlaceholder } from 'langchain/prompts';
import { invokeOrThrow } from './invokeOrThrow';
import { llmPrompt } from './prompt';

const llm = new ChatOpenAI({
  modelName: 'gpt-4-vision-preview',
  openAIApiKey: OPENAI_KEY,
  // Max tokens for demo purposes
  maxTokens: 256,
});

export const llmRepo = {
  initVision: async (): Promise<ConversationChain> => {
    const memory = new BufferMemory();
    const systemMessage = llmPrompt.initSystemTemplateMessage();
    const prompt = ChatPromptTemplate.fromMessages([
      systemMessage,
      new MessagesPlaceholder('input'),
    ]);

    return new ConversationChain({ llm, memory, prompt });
  },
  vision: async (
    screenshot: Buffer,
    requirements: string,
    chain: ConversationChain
  ): Promise<VisionModel> => {
    const humanMessage = llmPrompt.initHumanMessage(screenshot, requirements);

    return await invokeOrThrow(humanMessage, visionParser, chain);
  },
};
