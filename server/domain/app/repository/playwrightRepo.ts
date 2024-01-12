import type { CoordinatesModel } from '$/commonTypesWithClient/models';
import { chromium } from 'playwright';

export type PlaywrightRepoInterface = {
  teardown: () => Promise<void>;
  takeScreenshot: () => Promise<Buffer>;
  gotoUrl: (url: string) => Promise<void>;
  click: (coordinates: CoordinatesModel) => Promise<void>;
  scroll: (coordinates: CoordinatesModel) => Promise<void>;
};

export const createPlaywrightRepo = async (): Promise<PlaywrightRepoInterface> => {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  return {
    teardown: async () => {
      await context.close();
      await browser.close();
      console.log('Closing browser...');
    },
    takeScreenshot: async (): Promise<Buffer> => {
      await page.waitForLoadState('domcontentloaded');
      return await page.screenshot();
    },
    gotoUrl: async (url: string) => {
      await page.goto(url);
    },
    click: async (coordinates: CoordinatesModel) => {
      await page.mouse.click(coordinates.x, coordinates.y);
      console.log('clicking', await page.url());
    },
    scroll: async (coordinates: CoordinatesModel) => {
      await page.mouse.wheel(coordinates.x, coordinates.y);
    },
  };
};
