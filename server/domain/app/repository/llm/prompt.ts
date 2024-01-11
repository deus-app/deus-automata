import { visionParser } from '$/commonTypesWithClient/models';
import { HumanMessage, SystemMessage } from 'langchain/schema';
import { createLlmParser } from './parser';

type LlmPromptInterface = {
  initSystemMessage: () => SystemMessage;
  initHumanMessage: (screenshot: Buffer, requirements: string) => HumanMessage;
};

export const llmPrompt: LlmPromptInterface = {
  initSystemMessage: (): SystemMessage => {
    return new SystemMessage(
      'You are a senior UI/UX designer. Debug the website and improve based on the user requirements.'
    );
  },
  initHumanMessage: (screenshot: Buffer, requirements: string): HumanMessage => {
    const outputParser = createLlmParser(visionParser);
    return new HumanMessage({
      content: [
        {
          type: 'image_url',
          image_url: {
            url: bufferToBase64(screenshot),
            detail: 'low', // Detail is low for demo purposes
          },
        },
        {
          type: 'text',
          text: `Analyze the screenshot. 
          Please provide x and y pixel from the top left corner of where you want to click to inspect and interact. 
          Provide a structured response with the identified elements and their positions, along with any recommendations for adjustments.
          ${outputParser.getFormatInstruction()}
          `,
        },
        {
          type: 'text',
          text: `This is a requirements: ${requirements}`,
        },
      ],
    });
  },
};

const bufferToBase64 = (buffer: Buffer): string => {
  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
};
