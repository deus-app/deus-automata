import { visionParser } from '$/commonTypesWithClient/models';
import { HumanMessage, SystemMessage } from 'langchain/schema';

type LlmPromptInterface = {
  initSystemMessage: () => SystemMessage;
  initHumanMessage: (screenshot: Buffer, requirements: string) => HumanMessage;
};

export const llmPrompt: LlmPromptInterface = {
  initSystemMessage: (): SystemMessage => {
    return new SystemMessage(
      'You are a senior web application developer. Follow the user instructions to complete the web service.'
    );
  },
  initHumanMessage: (screenshot: Buffer, requirements: string): HumanMessage => {
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
          Please provide one x and y pixel from top left position where you want to click to inspect and interact. 
          Provide a structured response with the identified elements and their positions, along with any recommendations for adjustments.
          Return response in JSON format based on below schema strictly without any text or comments.
          ${JSON.stringify(exampleVisionSchema)}

          If you don't want to provide any recommendations or any positions to click, please provide an empty JSON based on below schema.
          {}
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

const exampleVisionSchema = visionParser.parse({
  coordinates: {
    x: 100,
    y: 100,
  },
  recommendations: ['Change the button color to red'],
});
