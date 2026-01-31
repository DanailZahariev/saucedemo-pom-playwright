import {expect, test} from "@playwright/test";
import {PageManager} from "../page-objects/pageManager";
import users from '../test-data/users.json';
import products from '../test-data/products.json';

test.describe("Saucedemo - Cart", async () => {
    let pm: PageManager;

    test.beforeEach(async ({page}) => {
        pm = new PageManager(page);
        await pm.onLoginPage().goto();
        await pm.onLoginPage().login(users.validUser.username, users.validUser.password);
        await expect(page).toHaveURL(/.*inventory.html/);
    });

    test("Show items added from Inventory", async ({page}) => {
        const inventoryPage = pm.onInventoryPage();
        const cartPage = pm.onCartPage();

        await inventoryPage.addProductToCart(products.productOne.name);
        await inventoryPage.addProductToCart(products.productTwo.name);

        await expect(inventoryPage.getCardItemsBadgeCount()).toHaveText('2');
        await inventoryPage.openCart();

        await expect(page).toHaveURL(/.*cart.html/);

        const totalCount = await cartPage.getCartItemsListCount();

        expect(totalCount).toEqual(2);
    });

    test("Remove and item and updates the card badge", async ({page}) => {
        const inventoryPage = pm.onInventoryPage();
        const cartPage = pm.onCartPage();

        await inventoryPage.addProductToCart(products.productOne.name);
        await inventoryPage.addProductToCart(products.productTwo.name);
        await inventoryPage.addProductToCart(products.productThree.name);

        await expect(inventoryPage.getCardItemsBadgeCount()).toHaveText('3');
        await inventoryPage.openCart();

        await cartPage.removeItemByName(products.productOne.name);

        const totalCount = await cartPage.getCartItemsListCount();
        const currentItems = await cartPage.getCarProductNames();

        expect(totalCount).toEqual(2);
        await expect(inventoryPage.getCardItemsBadgeCount()).toHaveText('2');
        expect(currentItems).toEqual([products.productTwo.name, products.productThree.name]);
    });

    test("Continue shopping returns to inventory and keep items", async ({page}) => {
        const inventoryPage = pm.onInventoryPage();
        const cartPage = pm.onCartPage();

        await inventoryPage.addProductToCart(products.productOne.name);
        await inventoryPage.addProductToCart(products.productTwo.name);
        await inventoryPage.openCart();

        await cartPage.clickContinueShopping();

        await expect(page).toHaveURL(/.*inventory.html/);
        await expect(inventoryPage.getCardItemsBadgeCount()).toHaveText('2');
        expect(inventoryPage.getInventoryList().filter({hasText: products.productTwo.name}).getByRole('button',
            {name: 'Remove'}));

    });

    test("Checkout from cart goes to step one", async ({page}) => {
        const inventoryPage = pm.onInventoryPage();
        const cartPage = pm.onCartPage();
        const checkoutPage = pm.onCheckoutPage();

        await inventoryPage.addProductToCart(products.productOne.name);
        await inventoryPage.openCart();
        await cartPage.clickCheckout();

        await expect(page).toHaveURL(/.*checkout-step-one.html/);
        await expect(checkoutPage.getFirstnameInput()).toBeVisible();
        await expect(checkoutPage.getLastnameInput()).toBeVisible();
        await expect(checkoutPage.getZipCodeInput()).toBeVisible();
        await expect(checkoutPage.getFirstnameInput()).toBeEmpty();

    });

    test("Display consistent item price between inventory and cart", async ({page}) => {
        const inventoryPage = pm.onInventoryPage();
        const cartPage = pm.onCartPage();

        await inventoryPage.addProductToCart(products.productOne.name);
        const inventoryItemPrice = await inventoryPage.getProductPrice(products.productOne.name);

        await inventoryPage.openCart();
        const cartItemPrice = await cartPage.getProductPrice(products.productOne.name);
        await cartPage.clickContinueShopping();

        expect(cartItemPrice).toEqual(inventoryItemPrice);

    });
});
