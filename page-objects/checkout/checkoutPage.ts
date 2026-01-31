import {Locator, Page} from "@playwright/test";

export class CheckoutPage {

    private readonly page: Page;
    private readonly firstnameInput: Locator
    private readonly lastnameInput: Locator
    private readonly zipCode: Locator

    constructor(page: Page) {
        this.page = page;
        this.firstnameInput = page.locator('[data-test="firstName"]');
        this.lastnameInput = page.locator('[data-test="lastName"]');
        this.zipCode = page.locator('[data-test="postalCode"]');
    }

    getFirstnameInput(): Locator {
        return this.firstnameInput;
    }

    getLastnameInput(): Locator {
        return this.lastnameInput;
    }

    getZipCodeInput(): Locator {
        return this.zipCode;
    }

}