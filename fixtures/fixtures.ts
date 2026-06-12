import {test as base} from "@playwright/test";
import {InventoryPage} from "../page-objects/inventory/inventoryPage";
import {LoginPage} from "../page-objects/auth/loginPage";
import {CartPage} from "../page-objects/cart/cartPage";
import {ProductDetailsPage} from "../page-objects/product/productDetailsPage";
import {CheckoutPage} from "../page-objects/checkout/checkoutPage";

type MyFixtures = {
    loginPage: LoginPage,
    authedInventoryPage: InventoryPage,
    inventoryPage: InventoryPage,
    cartPage: CartPage,
    checkoutPage: CheckoutPage,
    productDetailsPage: ProductDetailsPage;
};

export const test = base.extend<MyFixtures>({
    loginPage: async ({page}, use) => {
        await use(new LoginPage(page));
    },
    inventoryPage: async ({page}, use) => {
        await use(new InventoryPage(page));
    },
    cartPage: async ({page}, use) => {
        await use(new CartPage(page));
    },
    productDetailsPage: async ({page}, use) => {
        await use(new ProductDetailsPage(page));
    },
    checkoutPage: async ({page}, use) => {
        await use(new CheckoutPage(page));
    },
    authedInventoryPage: async ({page}, use) => {
        await page.goto('https://www.saucedemo.com/inventory.html');
        const inventoryPage = new InventoryPage(page);

        await use(inventoryPage);
    },
});

export {expect} from "@playwright/test";