import {expect, test} from "./fixtures";
import products from '../test-data/products.json';

test.describe("Saucedemo - Cart", async () => {
    test("Show items added from Inventory", async ({page, authedInventoryPage}) => {
        await authedInventoryPage.addProductToCart(products.productOne.name);
        await authedInventoryPage.addProductToCart(products.productTwo.name);

        await expect(authedInventoryPage.getCardItemsBadgeCount()).toHaveText('2');
        const cartPage = await authedInventoryPage.openCart();

        await expect(page).toHaveURL(/.*cart.html/);

        const totalCount = await cartPage.getCartItemsListCount();

        expect(totalCount).toEqual(2);
    });

    test("Remove and item and updates the card badge", async ({authedInventoryPage}) => {
        await authedInventoryPage.addProductToCart(products.productOne.name);
        await authedInventoryPage.addProductToCart(products.productTwo.name);
        await authedInventoryPage.addProductToCart(products.productThree.name);

        await expect(authedInventoryPage.getCardItemsBadgeCount()).toHaveText('3');
        const cartPage = await authedInventoryPage.openCart();

        await cartPage.removeItemByName(products.productOne.name);

        const totalCount = await cartPage.getCartItemsListCount();
        const currentItems = await cartPage.getCartProductNames();

        expect(totalCount).toEqual(2);
        await expect(authedInventoryPage.getCardItemsBadgeCount()).toHaveText('2');
        expect(currentItems).toEqual([products.productTwo.name, products.productThree.name]);
    });

    test("Continue shopping returns to inventory and keep items", async ({page, authedInventoryPage}) => {
        await authedInventoryPage.addProductToCart(products.productOne.name);
        await authedInventoryPage.addProductToCart(products.productTwo.name);
        const cartPage = await authedInventoryPage.openCart();

        await cartPage.clickContinueShopping();

        await expect(page).toHaveURL(/.*inventory.html/);
        await expect(authedInventoryPage.getCardItemsBadgeCount()).toHaveText('2');
        await expect(authedInventoryPage.getRemoveButton(products.productTwo.name))
            .toBeVisible();

    });

    test("Checkout from cart goes to step one", async ({page, authedInventoryPage}) => {
        await authedInventoryPage.addProductToCart(products.productOne.name);
        const cartPage = await authedInventoryPage.openCart();
        const checkoutPage = await cartPage.clickCheckout();

        await expect(page).toHaveURL(/.*checkout-step-one.html/);
        await expect(checkoutPage.getFirstnameInput()).toBeVisible();
        await expect(checkoutPage.getLastnameInput()).toBeVisible();
        await expect(checkoutPage.getZipCodeInput()).toBeVisible();
        await expect(checkoutPage.getFirstnameInput()).toBeEmpty();

    });

    test("Display consistent item price between inventory and cart", async ({authedInventoryPage}) => {
        await authedInventoryPage.addProductToCart(products.productOne.name);
        const inventoryItemPrice = await authedInventoryPage.getProductPrice(products.productOne.name);

        const cartPage = await authedInventoryPage.openCart();
        const cartItemPrice = await cartPage.getProductPrice(products.productOne.name);
        await cartPage.clickContinueShopping();

        expect(cartItemPrice).toEqual(inventoryItemPrice);

    });
});
