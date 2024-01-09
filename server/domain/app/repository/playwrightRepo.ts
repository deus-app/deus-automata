import type { Browser, BrowserContext, Page } from 'playwright';
import { chromium } from 'playwright';

export const playwrightRepo = {
  init: async () => {
    console.log('Launching browser...');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    return { browser, context, page };
  },
  teardown: async (browser: Browser, context: BrowserContext) => {
    await context.close();
    await browser.close();

    console.log('Closing browser...');
  },
  takeScreenshot: async (page: Page, url: string): Promise<Buffer> => {
    await page.goto(url);
    await page.waitForLoadState('domcontentloaded');
    const buffer = await page.screenshot();

    return buffer;
  },
  click: async (page: Page, x: number, y: number) => {
    await page.mouse.click(x, y);
  },
};
