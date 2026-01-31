import {LoginPage} from "./auth/loginPage";
import {Page} from "@playwright/test";
import {InventoryPage} from "./inventory/inventoryPage";
import {ProductDetailsPage} from "./product/productDetailsPage";
import {CartPage} from "./cart/cartPage";
import {CheckoutPage} from "./checkout/checkoutPage";

export class PageManager {

    private readonly page: Page;
    private readonly loginPage: LoginPage;
    private readonly inventoryPage: InventoryPage;
    private readonly productDetails: ProductDetailsPage;
    private readonly cartPage: CartPage;
    private readonly checkoutPage: CheckoutPage;

    constructor(page: Page) {
        this.page = page;
        this.loginPage = new LoginPage(this.page);
        this.inventoryPage = new InventoryPage(this.page);
        this.productDetails = new ProductDetailsPage(this.page);
        this.cartPage = new CartPage(this.page);
        this.checkoutPage = new CheckoutPage(this.page);
    }

    onLoginPage(): LoginPage {
        return this.loginPage;
    }

    onInventoryPage(): InventoryPage {
        return this.inventoryPage;
    }

    onProductDetails(): ProductDetailsPage {
        return this.productDetails;
    }

    onCartPage(): CartPage {
        return this.cartPage;
    }

    onCheckoutPage(): CheckoutPage {
        return this.checkoutPage;
    }
}