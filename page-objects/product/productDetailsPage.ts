import {Locator, Page} from "@playwright/test";
import {BasePage} from "../base/BasePage";
import InventoryPage from "../inventory/inventoryPage";

export class ProductDetailsPage extends BasePage {

    private readonly addToCartBtn: Locator;
    private readonly removeFromCartBtn: Locator;
    private readonly backToProductsItem: Locator;
    private readonly itemTitle: Locator;

    constructor(page: Page) {
        super(page);
        this.addToCartBtn = page.locator('[data-test="add-to-cart"]');
        this.removeFromCartBtn = page.locator('[data-test="remove"]');
        this.backToProductsItem = page.locator('[data-test="back-to-products"]');
        this.itemTitle = page.locator('[data-test="inventory-item-name"]');
    }

    async addToCart() {
        await this.clickElement(this.addToCartBtn);
        return this;
    }

    async removeFromCart() {
        await this.clickElement(this.removeFromCartBtn);
        return this;
    }

    async backToProducts(): Promise<InventoryPage> {
        await this.clickElement(this.backToProductsItem);
        return new InventoryPage(this.page)
    }

    getProductName(): Locator {
        return this.itemTitle;
    }
}