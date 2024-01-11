import { visionParser, type VisionModel } from '$/commonTypesWithClient/models';
import { invokeOrThrow } from './invokeOrThrow';
import { llmPrompt } from './prompt';

export const llmRepo = {
  vision: async (screenshot: Buffer, requirements: string): Promise<VisionModel> => {
    const systemMessage = llmPrompt.initSystemMessage();
    const humanMessage = llmPrompt.initHumanMessage(screenshot, requirements);

    return await invokeOrThrow([systemMessage, humanMessage], visionParser);
  },
};
