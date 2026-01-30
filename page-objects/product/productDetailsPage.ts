import {Locator, Page} from "@playwright/test";

export class ProductDetailsPage {

    private readonly page: Page;
    private readonly addToCartBtn: Locator;
    private readonly removeFromCartBtn: Locator;
    private readonly backToProductsItem: Locator;
    private readonly itemTitle: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addToCartBtn = page.locator('[data-test="add-to-cart"]');
        this.removeFromCartBtn = page.locator('[data-test="remove"]');
        this.backToProductsItem = page.locator('[data-test="back-to-products"]');
        this.itemTitle = page.locator('[data-test="inventory-item-name"]');
    }

    async addToCart() {
        await this.addToCartBtn.click();
    }

    async removeFromCart() {
        await this.removeFromCartBtn.click();
    }

    async backToProducts() {
        await this.backToProductsItem.click();
    }

    getProductName(): Locator {
        return this.itemTitle;
    }
}