import {Locator, Page} from "@playwright/test";

export class InventoryPage {

    private readonly page: Page;
    private readonly inventoryItems: Locator;
    private readonly sortSelector: Locator;
    private readonly cartLink: Locator;
    private readonly inventoryList: Locator;
    private readonly cardBadge: Locator;
    private readonly itemsNames: Locator;
    private readonly itemsPrices: Locator;

    constructor(page: Page) {
        this.page = page;
        this.inventoryItems = page.locator('[data-test="inventory-item"]');
        this.sortSelector = page.locator('[data-test="product-sort-container"]');
        this.cartLink = page.locator('[data-test="shopping-cart-link"]');
        this.inventoryList = page.locator('[data-test="inventory-list"]');
        this.cardBadge = page.locator('[data-test="shopping-cart-badge"]');
        this.itemsNames = page.locator('[data-test="inventory-item-name"]');
        this.itemsPrices = page.locator('[data-test="inventory-item-price"]');
    }

    async addProductToCart(productName: string) {
        const productBox = this.inventoryItems
            .filter({hasText: productName});
        const addToCartBtn = productBox.locator('button',
            {hasText: 'Add to cart'});

        await addToCartBtn.click();
    }

    async removeProductFromCart(productName: string) {
        const productBox = this.inventoryItems
            .filter({hasText: productName});
        const removeFromCartBtn = productBox.locator('button',
            {hasText: 'Remove'});
        await removeFromCartBtn.click();
    }

    async openProductByName(productName: string) {
        await this.itemsNames.filter({hasText: productName}).click();
    }

    async sortProductsByName(sortOption: string) {
        await this.sortSelector.selectOption(sortOption);
    }

    async sortProductsByPrice(sortOption: string) {
        await this.sortSelector.selectOption(sortOption);
    }

    async openCart() {
        await this.cartLink.click();
    }

    getInventoryList(): Locator {
        return this.inventoryList;
    }

    getItemsCount(): Promise<number> {
        return this.inventoryItems.count();
    }

    getCardItemsBadgeCount(): Locator {
        return this.cardBadge;
    }

    async getProductNames(): Promise<string[]> {
        return await this.itemsNames.allTextContents();
    }

    async getProductPrices(): Promise<number[]> {
        const priceList = await this.itemsPrices.allTextContents();

        return priceList.map(p => {
            const withoutSign = p.replace("$", "");

            return Number(withoutSign);
        });
    }
}