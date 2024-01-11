import { llmRepo } from '../repository/llm/llmRepo';
import { playwrightRepo } from '../repository/playwrightRepo';

export const appUseCase = {
  automata: async (url: string, requirements: string) => {
    const { browser, context, page } = await playwrightRepo.init();
    const chain = await llmRepo.initVision();

    await playwrightRepo.go(page, url);
    const screenshot = await playwrightRepo.takeScreenshot(page);
    const visionResponse = await llmRepo.vision(screenshot, requirements, chain);

    switch (visionResponse.status) {
      case 'clicked':
        await playwrightRepo.click(
          page,
          visionResponse.coordinates.x,
          visionResponse.coordinates.y
        );
        break;
      case 'scrolled':
        await playwrightRepo.scroll(
          page,
          visionResponse.coordinates.x,
          visionResponse.coordinates.y
        );
        break;
      case 'completed':
        break;
    }

    await playwrightRepo.teardown(browser, context);
    return visionResponse;
  },
};
