import { llmRepo } from '../repository/llm/llmRepo';
import { playwrightRepo } from '../repository/playwrightRepo';

export const appUseCase = {
  automata: async (url: string, requirements: string) => {
    const { browser, context, page } = await playwrightRepo.init();
    const screenshot = await playwrightRepo.takeScreenshot(page, url);
    const visionResponse = await llmRepo.vision(screenshot, requirements);
    if (visionResponse === null) {
      await playwrightRepo.teardown(browser, context);
      return null;
    }

    await playwrightRepo.click(page, visionResponse.coordinates.x, visionResponse.coordinates.y);
    await playwrightRepo.teardown(browser, context);

    return visionResponse;
  },
};
