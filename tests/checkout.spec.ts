import {expect, test} from "./fixtures";
import products from '../test-data/products.json';

test.describe("Checkout - Saucedemo", async () => {
    const PRODUCT_ONE = products.productOne;

    test("Complete checkout with valid data", async ({page, authedInventoryPage}) => {
        await authedInventoryPage.addProductToCart(PRODUCT_ONE.name);
        const cartPage = await authedInventoryPage.openCart();
        const checkoutPage = await cartPage.clickCheckout();

        await expect(page).toHaveURL(/.*checkout-step-one.html/);
        await checkoutPage.fillShippingInfo("Ivan", "Ivanov", "1000");
        await checkoutPage.clickContinue();

        await expect(page).toHaveURL(/.*checkout-step-two.html/);
        await expect(checkoutPage.getSummaryInfo()).toBeVisible();
        const itemPrice = await checkoutPage.getProductPriceInfo(PRODUCT_ONE.name);

        expect(await checkoutPage.getProductNameInfo(PRODUCT_ONE.name)).toEqual(PRODUCT_ONE.name);
        expect(itemPrice).toEqual(products.productOne.price);

        await checkoutPage.clickFinish();

        await expect(page).toHaveURL(/.*checkout-complete.html/);
        await expect(checkoutPage.getCompleteHeader()).toHaveText('Thank you for your order!');

    });

    test("Validate: first name is required", async ({authedInventoryPage}) => {
        await authedInventoryPage.addProductToCart(PRODUCT_ONE.name);
        const cartPage = await authedInventoryPage.openCart();
        const checkoutPage = await cartPage.clickCheckout();

        await checkoutPage.fillShippingInfo("", "Ivanov", "1000");
        await checkoutPage.clickContinue();

        await expect(checkoutPage.getErrorMessage()).toContainText('First Name is required');
    });

    test("Validate: last name is required", async ({authedInventoryPage}) => {
        await authedInventoryPage.addProductToCart(PRODUCT_ONE.name);
        const cartPage = await authedInventoryPage.openCart();
        const checkoutPage = await cartPage.clickCheckout();

        await checkoutPage.fillShippingInfo("Ivan", "", "1000");
        await checkoutPage.clickContinue();

        await expect(checkoutPage.getErrorMessage()).toContainText('Last Name is required');
    });


    test("Validate: zip-code is required", async ({authedInventoryPage}) => {
        await authedInventoryPage.addProductToCart(PRODUCT_ONE.name);
        const cartPage = await authedInventoryPage.openCart();
        const checkoutPage = await cartPage.clickCheckout();

        await checkoutPage.fillShippingInfo("Ivan", "Ivanov", "");
        await checkoutPage.clickContinue();

        await expect(checkoutPage.getErrorMessage()).toContainText('Postal Code is required');
    });

    test("Cancel on step one returns to cart and keep items", async ({page, authedInventoryPage}) => {
        await authedInventoryPage.addProductToCart(PRODUCT_ONE.name);
        const cartPage = await authedInventoryPage.openCart();
        const checkoutPage = await cartPage.clickCheckout();

        await expect(page).toHaveURL(/.*checkout-step-one.html/);
        await checkoutPage.clickCancel();

        await expect(page).toHaveURL(/.*cart.html/);
        expect(await cartPage.getProductName(PRODUCT_ONE.name)).toEqual(PRODUCT_ONE.name);
    });
});