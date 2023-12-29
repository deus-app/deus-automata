import { llmRepo } from '../repository/llmRepo';

export const appUseCase = {
  automata: async (url?: string) => {
    // const { browser, context, page } = await playwrightRepo.init();
    // const screenshot = await playwrightRepo.takeScreenshot(page, url);
    // await llmRepo.vision(screenshot);
    // await playwrightRepo.teardown(browser, context);

    // return screenshot;
    const content = await llmRepo.vision();
    return content;
  },
};
