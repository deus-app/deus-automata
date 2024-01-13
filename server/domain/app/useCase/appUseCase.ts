import type { ConversationChain } from 'langchain/chains';

import type { AutomataModel, UserRequirementsModel } from '$/commonTypesWithClient/automataModels';
import { automataMethods } from '../model/automata';
import { llmRepo } from '../repository/llm/llmRepo';
import type { PlaywrightRepoInterface } from '../repository/playwrightRepo';
import { createPlaywrightRepo } from '../repository/playwrightRepo';

export const appUseCase = {
  init: async (userRequirements: UserRequirementsModel): Promise<AutomataModel> => {
    const playwrightRepo = await createPlaywrightRepo();
    const chain = await llmRepo.initVisionChain();
    const automata = automataMethods.create();

    await playwrightRepo.gotoUrl(userRequirements.url);

    return await appUseCase
      .automata(playwrightRepo, userRequirements.requirements, automata, chain)
      .then(async (automata) => {
        await playwrightRepo.teardown();
        return automata;
      });
  },
  automata: async (
    playwrightRepo: PlaywrightRepoInterface,
    requirements: string,
    automata: AutomataModel,
    chain: ConversationChain
  ): Promise<AutomataModel> => {
    const screenshot = await playwrightRepo.takeScreenshot();
    const vision = await llmRepo.vision(screenshot, requirements, chain);
    const updatedAutomata = automataMethods.update(automata, vision);

    switch (vision.status) {
      case 'completed':
        return updatedAutomata;
      case 'clicked':
        await playwrightRepo.click(vision.coordinates);
        break;
      case 'scrolled':
        await playwrightRepo.scroll(vision.coordinates);
        break;
      default:
        throw new Error('Invalid status');
    }

    return await appUseCase.automata(playwrightRepo, requirements, automata, chain);
  },
};
