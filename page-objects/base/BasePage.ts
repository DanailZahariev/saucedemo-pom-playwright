import {Locator, Page} from "@playwright/test";

export abstract class BasePage {

    protected readonly page: Page;

    protected constructor(page: Page) {
        this.page = page;
    }

    async waitForUrl(url: RegExp) {
        await this.page.waitForURL(url);
    }

    protected async getInnerText(locator: Locator): Promise<string> {
        await this.waitForVisible(locator);
        return await locator.innerText();
    }

    protected async getAllTextContents(locator: Locator): Promise<string[]> {
        await this.waitForVisible(locator.first());
        return await locator.allTextContents();
    }

    protected async clickElement(locator: Locator): Promise<void> {
        await this.waitForVisible(locator);
        await locator.click();
    }

    protected async fillField(locator: Locator, text: string): Promise<void> {
        await this.waitForVisible(locator);
        await locator.clear();
        await locator.fill(text);
    }

    private async waitForVisible(locator: Locator): Promise<void> {
        await locator.waitFor({state: "visible"});
    }

}