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
          text: `Analyze the screenshot and interact with elements in the website if needed, then return a response giving the changes needed.
          Provide x and y pixels relative to the top-left corner of the viewport of the element you want to inspect or scroll to.
          If you want to inspect a website, return a response with status 'clicked'. If you want to scroll, return a response with status 'scrolled'.
          If you are done inspecting a website, return a response with status 'completed'.
          ${outputParser.getFormatInstruction()}

          User requirements: "${requirements}"
          `,
        },
      ],
    });
  },
};

const bufferToBase64 = (buffer: Buffer): string => {
  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
};
