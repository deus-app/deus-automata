import { ConversationChain } from 'langchain/chains';
import { BufferMemory } from 'langchain/memory';
import { ChatPromptTemplate, MessagesPlaceholder } from 'langchain/prompts';

import { llm } from '$/service/openai';
import type { VisionModel } from '../../model/llm';
import { visionParser } from '../../model/llm';
import { invokeOrThrow } from './invokeOrThrow';
import { llmPrompt } from './prompt';

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
