import {expect, test} from "@playwright/test";
import {PageManager} from "../page-objects/pageManager";
import users from '../test-data/users.json';
import products from '../test-data/products.json';
import {CartPage} from "../page-objects/cart/cartPage";
import {CheckoutPage} from "../page-objects/checkout/checkoutPage";
import {InventoryPage} from "../page-objects/inventory/inventoryPage";
import {USERS} from "../test-data/testData";

test.describe("Saucedemo - Cart", async () => {
    let pm: PageManager;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({page}) => {
        pm = new PageManager(page);
        await pm.loginPage().goto();
        inventoryPage = await pm.loginPage().loginSuccess(USERS.STANDARD.username!, USERS.STANDARD.password!);
        await expect(page).toHaveURL(/.*inventory.html/);
    });

    test("Show items added from Inventory", async ({page}) => {
        await inventoryPage.addProductToCart(products.productOne.name);
        await inventoryPage.addProductToCart(products.productTwo.name);

        await expect(inventoryPage.getCardItemsBadgeCount()).toHaveText('2');
        cartPage = await inventoryPage.openCart();

        await expect(page).toHaveURL(/.*cart.html/);

        const totalCount = await cartPage.getCartItemsListCount();

        expect(totalCount).toEqual(2);
    });

    test("Remove and item and updates the card badge", async ({page}) => {
        await inventoryPage.addProductToCart(products.productOne.name);
        await inventoryPage.addProductToCart(products.productTwo.name);
        await inventoryPage.addProductToCart(products.productThree.name);

        await expect(inventoryPage.getCardItemsBadgeCount()).toHaveText('3');
        cartPage = await inventoryPage.openCart();

        await cartPage.removeItemByName(products.productOne.name);

        const totalCount = await cartPage.getCartItemsListCount();
        const currentItems = await cartPage.getCartProductNames();

        expect(totalCount).toEqual(2);
        await expect(inventoryPage.getCardItemsBadgeCount()).toHaveText('2');
        expect(currentItems).toEqual([products.productTwo.name, products.productThree.name]);
    });

    test("Continue shopping returns to inventory and keep items", async ({page}) => {
        await inventoryPage.addProductToCart(products.productOne.name);
        await inventoryPage.addProductToCart(products.productTwo.name);
        cartPage = await inventoryPage.openCart();

        await cartPage.clickContinueShopping();

        await expect(page).toHaveURL(/.*inventory.html/);
        await expect(inventoryPage.getCardItemsBadgeCount()).toHaveText('2');
        await expect(inventoryPage.getRemoveButton(products.productTwo.name))
            .toBeVisible();

    });

    test("Checkout from cart goes to step one", async ({page}) => {
        await inventoryPage.addProductToCart(products.productOne.name);
        cartPage = await inventoryPage.openCart();
        checkoutPage = await cartPage.clickCheckout();

        await expect(page).toHaveURL(/.*checkout-step-one.html/);
        await expect(checkoutPage.getFirstnameInput()).toBeVisible();
        await expect(checkoutPage.getLastnameInput()).toBeVisible();
        await expect(checkoutPage.getZipCodeInput()).toBeVisible();
        await expect(checkoutPage.getFirstnameInput()).toBeEmpty();

    });

    test("Display consistent item price between inventory and cart", async ({page}) => {
        await inventoryPage.addProductToCart(products.productOne.name);
        const inventoryItemPrice = await inventoryPage.getProductPrice(products.productOne.name);

        cartPage = await inventoryPage.openCart();
        const cartItemPrice = await cartPage.getProductPrice(products.productOne.name);
        await cartPage.clickContinueShopping();

        expect(cartItemPrice).toEqual(inventoryItemPrice);

    });
});
