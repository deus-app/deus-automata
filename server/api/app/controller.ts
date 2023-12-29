import { appUseCase } from '$/domain/app/useCase/appUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  post: async () => {
    const content = await appUseCase.automata('https://blog.langchain.dev/');

    if (content === null) {
      return {
        status: 400,
        body: 'GPT-4-Vision failed to generate content',
      };
    }

    // TODO: Change the body type
    return {
      status: 200,
      body: content.content,
    };
  },
}));
