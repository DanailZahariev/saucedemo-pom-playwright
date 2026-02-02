import {Locator, Page} from "@playwright/test";
import {BasePage} from "../base/BasePage";
import {CheckoutPage} from "../checkout/checkoutPage";
import {InventoryPage} from "../inventory/inventoryPage";

export class CartPage extends BasePage {

    private readonly cartItems: Locator;
    private readonly cartItemNames: Locator;
    private readonly checkoutBtn: Locator;
    private readonly continueShoppingBtn: Locator;

    constructor(page: Page) {
        super(page);
        this.cartItems = page.locator('[data-test="inventory-item"]');
        this.checkoutBtn = page.locator('[data-test="checkout"]');
        this.cartItemNames = page.locator('[data-test="inventory-item-name"]');
        this.continueShoppingBtn = page.locator('[data-test="continue-shopping"]');
    }

    async getProductPrice(productName: string): Promise<string> {
        const itemContainer = this.getCartItemByName(productName);
        return this.getInnerText(itemContainer.locator('[data-test="inventory-item-price"]'));
    }

    async getProductName(productName: string): Promise<string> {
        const itemContainer = this.getCartItemByName(productName);
        return this.getInnerText(itemContainer.locator('[data-test="inventory-item-name"]'));
        // return this.getInnerText(this.cartItems
        //     .filter({hasText: productName})
        //     .locator('[data-test="inventory-item-name"]'));
    }

    async getCartItemsListCount(): Promise<number> {
        return this.cartItems.count();
    }

    async removeItemByName(productName: string): Promise<this> {
        const itemContainer = this.getCartItemByName(productName);
        const removeButton = itemContainer.locator('button');
        await this.clickElement(removeButton);
        return this;
    }

    async getCartProductNames(): Promise<string[]> {
        return this.getAllTextContents(this.cartItemNames);
    }

    async clickContinueShopping(): Promise<InventoryPage> {
        await this.clickElement(this.continueShoppingBtn)
        return new InventoryPage(this.page);
    }

    async clickCheckout(): Promise<CheckoutPage> {
        await this.clickElement(this.checkoutBtn);
        return new CheckoutPage(this.page);
    }

    private getCartItemByName(productName: string): Locator {
        return this.cartItems.filter({hasText: productName});
    }
}