import {Locator, Page} from "@playwright/test";

export class CartPage {

    private readonly page: Page;
    private readonly cartItems: Locator;
    private readonly cartItemNames: Locator;
    private readonly checkoutBtn: Locator;
    private readonly continueShoppingBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartItems = page.locator('[data-test="inventory-item"]');
        this.checkoutBtn = page.locator('[data-test="checkout"]');
        this.cartItemNames = page.locator('[data-test="inventory-item-name"]');
        this.continueShoppingBtn = page.locator('[data-test="continue-shopping"]');
    }

    async getProductPrice(productName: string): Promise<string> {
        return await this.cartItems
            .filter({hasText: productName})
            .locator('[data-test="inventory-item-price"]')
            .innerText();
    }

    async getProductName(productName: string): Promise<string> {
        return await this.cartItems
            .filter({hasText: productName})
            .locator('[data-test="inventory-item-name"]')
            .innerText();
    }

    async getCartItemsListCount(): Promise<number> {
        return this.cartItems.count();
    }

    async removeItemByName(productName: string) {
        await this.cartItems.filter({hasText: productName})
            .locator('button').click()
    }

    async getCarProductNames(): Promise<string[]> {
        return await this.cartItemNames.allTextContents();
    }

    async clickContinueShopping() {
        await this.continueShoppingBtn.click();
    }

    async clickCheckout() {
        await this.checkoutBtn.click();
    }
}