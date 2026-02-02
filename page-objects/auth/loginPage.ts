import {Locator, Page} from "@playwright/test";
import {BasePage} from "../base/BasePage";
import {InventoryPage} from "../inventory/inventoryPage";

export class LoginPage extends BasePage {

    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.usernameInput = page.locator('[data-test="username"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');
        this.errorMessage = page.locator('[data-test="error"]');
    }

    async goto() {
        await this.page.goto("https://www.saucedemo.com/");
        return this;
    }

    private async performLoginAction(username: string, password: string): Promise<void> {
        await this.fillField(this.usernameInput, username);
        await this.fillField(this.passwordInput, password);
        await this.clickElement(this.loginButton);
    }

    async loginSuccess(username: string, password: string): Promise<InventoryPage> {
        await this.performLoginAction(username, password);
        return new InventoryPage(this.page);
    }

    async loginFailure(username: string, password: string): Promise<this> {
        await this.performLoginAction(username, password);
        return this;
    }

    getErrorMessage(): Locator {
        return this.errorMessage;
    }
}