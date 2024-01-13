import type { AutomataModel } from '$/commonTypesWithClient/automataModels';
import type { VisionModel } from './llm';

export const automataMethods = {
  create(results: string[] = []): AutomataModel {
    return {
      results,
    };
  },
  update: (automata: AutomataModel, vision: VisionModel): AutomataModel => {
    return {
      results: [...automata.results, vision.results],
    };
  },
};
