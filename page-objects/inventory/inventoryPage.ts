import {Locator, Page} from "@playwright/test";
import {BasePage} from "../base/BasePage";
import {CartPage} from "../cart/cartPage";
import {ProductDetailsPage} from "../product/productDetailsPage";

export class InventoryPage extends BasePage {

    private readonly inventoryItems: Locator;
    private readonly sortSelector: Locator;
    private readonly cartLink: Locator;
    private readonly inventoryList: Locator;
    private readonly cardBadge: Locator;
    private readonly itemsNames: Locator;
    private readonly itemsPrices: Locator;

    constructor(page: Page) {
        super(page);
        this.inventoryItems = page.locator('[data-test="inventory-item"]');
        this.sortSelector = page.locator('[data-test="product-sort-container"]');
        this.cartLink = page.locator('[data-test="shopping-cart-link"]');
        this.inventoryList = page.locator('[data-test="inventory-list"]');
        this.cardBadge = page.locator('[data-test="shopping-cart-badge"]');
        this.itemsNames = page.locator('[data-test="inventory-item-name"]');
        this.itemsPrices = page.locator('[data-test="inventory-item-price"]');
    }

    async addProductToCart(productName: string) {
        const addToCartBtn = this.getProductBox(productName)
            .locator('button', {hasText: 'Add to cart'});

        await this.clickElement(addToCartBtn); // Използваме BasePage wrapper
        return this;
    }

    async removeProductFromCart(productName: string) {
        const removeBtn = this.getProductBox(productName)
            .locator('button', {hasText: 'Remove'});

        await this.clickElement(removeBtn);
        return this;
    }

    async openProductByName(productName: string): Promise<ProductDetailsPage> {
        await this.clickElement(this.itemsNames.filter({hasText: productName}));
        return new ProductDetailsPage(this.page);
    }

    async sortProductsByName(sortOption: string): Promise<this> {
        await this.sortSelector.selectOption(sortOption);
        return this;
    }

    async sortProductsByPrice(sortOption: string): Promise<this> {
        await this.sortSelector.selectOption(sortOption);
        return this;
    }

    async openCart(): Promise<CartPage> {
        await this.clickElement(this.cartLink);
        return new CartPage(this.page);
    }

    async getProductPrices(): Promise<number[]> {
        const priceList = await this.getAllTextContents(this.itemsPrices);

        return priceList.map(p => {
            const withoutSign = p.replace("$", "");

            return Number(withoutSign);
        });
    }

    async getProductPrice(productName: string): Promise<string> {
        const productBox = this.getProductBox(productName)
            .locator('[data-test="inventory-item-price"]');
        return await this.getInnerText(productBox);
    }

    getRemoveButton(productName: string): Locator {
        return this.inventoryItems
            .filter({hasText: productName})
            .getByRole('button', {name: 'Remove'});
    }

    async getProductImageSources(): Promise<string[]> {
        return this.inventoryItems.locator('img').evaluateAll((imgs) =>
            imgs.map((img) => (img as HTMLImageElement).src)
        );
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
        return this.getAllTextContents(this.itemsNames);
    }

    private getProductBox(productName: string): Locator {
        return this.inventoryItems.filter({hasText: productName});
    }
}