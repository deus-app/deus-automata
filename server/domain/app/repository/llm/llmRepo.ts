import { OPENAI_KEY } from '$/service/envValues';
import { ConversationChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BufferMemory } from 'langchain/memory';
import { ChatPromptTemplate, MessagesPlaceholder } from 'langchain/prompts';

import type { VisionModel } from '../../model/llm';
import { visionParser } from '../../model/llm';
import { invokeOrThrow } from './invokeOrThrow';
import { llmPrompt } from './prompt';

// TODO: Change max tokens value
const llm = new ChatOpenAI({
  modelName: 'gpt-4-vision-preview',
  openAIApiKey: OPENAI_KEY,
  maxTokens: 256,
});

export type LlmRepoInterface = {
  initVisionChain: () => Promise<ConversationChain>;
  vision: (
    screenshot: Buffer,
    requirements: string,
    chain: ConversationChain
  ) => Promise<VisionModel>;
};

export const llmRepo: LlmRepoInterface = {
  initVisionChain: async (): Promise<ConversationChain> => {
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
