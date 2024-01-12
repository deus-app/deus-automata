import type { UserRequirementsModel, VisionModel } from '$/commonTypesWithClient/models';
import type { ConversationChain } from 'langchain/chains';
import { llmRepo } from '../repository/llm/llmRepo';
import type { PlaywrightRepoInterface } from '../repository/playwrightRepo';
import { createPlaywrightRepo } from '../repository/playwrightRepo';

export const appUseCase = {
  init: async (userRequirements: UserRequirementsModel) => {
    const playwrightRepo = await createPlaywrightRepo();
    const chain = await llmRepo.initVisionChain();

    await playwrightRepo.gotoUrl(userRequirements.url);
    const vision = await appUseCase.automata(playwrightRepo, userRequirements.requirements, chain);
    await playwrightRepo.teardown();

    return vision;
  },
  automata: async (
    playwrightRepo: PlaywrightRepoInterface,
    requirements: string,
    chain: ConversationChain
  ): Promise<VisionModel> => {
    const screenshot = await playwrightRepo.takeScreenshot();
    const vision = await llmRepo.vision(screenshot, requirements, chain);

    switch (vision.status) {
      case 'completed':
        return vision;
      case 'clicked':
        await playwrightRepo.click(vision.coordinates);
        break;
      case 'scrolled':
        await playwrightRepo.scroll(vision.coordinates);
        break;
      default:
        throw new Error('Invalid status');
    }

    return await appUseCase.automata(playwrightRepo, requirements, chain);
  },
};
