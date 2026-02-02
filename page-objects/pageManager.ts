import {LoginPage} from "./auth/loginPage";
import {Page} from "@playwright/test";
import {InventoryPage} from "./inventory/inventoryPage";
import {ProductDetailsPage} from "./product/productDetailsPage";
import {CartPage} from "./cart/cartPage";
import {CheckoutPage} from "./checkout/checkoutPage";

export class PageManager {

    private readonly page: Page;
    private _loginPage?: LoginPage;
    private _inventoryPage?: InventoryPage;
    private _productDetails?: ProductDetailsPage;
    private _cartPage?: CartPage;
    private _checkoutPage?: CheckoutPage;

    constructor(page: Page) {
        this.page = page;
    }

    loginPage(): LoginPage {
        if (!this._loginPage) {
            this._loginPage = new LoginPage(this.page);
        }
        return this._loginPage;
    }

    inventoryPage(): InventoryPage {
        if (!this._inventoryPage) {
            this._inventoryPage = new InventoryPage(this.page);
        }
        return this._inventoryPage;
    }

    productDetails(): ProductDetailsPage {
        if (!this._productDetails) {
            this._productDetails = new ProductDetailsPage(this.page);
        }
        return this._productDetails;
    }

    cartPage(): CartPage {
        if (!this._cartPage) {
            this._cartPage = new CartPage(this.page);
        }
        return this._cartPage;
    }

    checkoutPage(): CheckoutPage {
        if (!this._checkoutPage) {
            this._checkoutPage = new CheckoutPage(this.page);
        }
        return this._checkoutPage;
    }
}