import { llmRepo } from '../repository/llmRepo';
import { playwrightRepo } from '../repository/playwrightRepo';

export const appUseCase = {
  automata: async (url: string, requirements: string) => {
    const { browser, context, page } = await playwrightRepo.init();
    const screenshot = await playwrightRepo.takeScreenshot(page, url);
    const content = await llmRepo.vision(screenshot, requirements);
    await playwrightRepo.teardown(browser, context);

    return content;
  },
};
