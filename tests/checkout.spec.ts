import {expect, test} from "@playwright/test";
import {PageManager} from "../page-objects/pageManager";
import products from '../test-data/products.json';
import users from '../test-data/users.json';
import {InventoryPage} from "../page-objects/inventory/inventoryPage";
import {CartPage} from "../page-objects/cart/cartPage";
import {CheckoutPage} from "../page-objects/checkout/checkoutPage";
import {USERS} from "../test-data/testData";


test.describe("Checkout - Saucedemo", async () => {
    let pm: PageManager;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    const PRODUCT_ONE = products.productOne;

    test.beforeEach(async ({page}) => {
        pm = new PageManager(page);

        await pm.loginPage().goto();
        inventoryPage = await pm.loginPage().loginSuccess(USERS.STANDARD.username!, USERS.STANDARD.password!);
        await expect(page).toHaveURL(/.*inventory.html/);
    });

    test("Complete checkout with valid data", async ({page}) => {
        await inventoryPage.addProductToCart(PRODUCT_ONE.name);
        cartPage = await inventoryPage.openCart();
        checkoutPage = await cartPage.clickCheckout();

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

    test("Validate: first name is required", async () => {
        await inventoryPage.addProductToCart(PRODUCT_ONE.name);
        cartPage = await inventoryPage.openCart();
        checkoutPage = await cartPage.clickCheckout();

        await checkoutPage.fillShippingInfo("", "Ivanov", "1000");
        await checkoutPage.clickContinue();

        await expect(checkoutPage.getErrorMessage()).toContainText('First Name is required');
    });

    test("Validate: last name is required", async () => {
        await inventoryPage.addProductToCart(PRODUCT_ONE.name);
        cartPage = await inventoryPage.openCart();
        checkoutPage = await cartPage.clickCheckout();

        await checkoutPage.fillShippingInfo("Ivan", "", "1000");
        await checkoutPage.clickContinue();

        await expect(checkoutPage.getErrorMessage()).toContainText('Last Name is required');
    });


    test("Validate: zip-code is required", async () => {
        await inventoryPage.addProductToCart(PRODUCT_ONE.name);
        cartPage = await inventoryPage.openCart();
        checkoutPage = await cartPage.clickCheckout();

        await checkoutPage.fillShippingInfo("Ivan", "Ivanov", "");
        await checkoutPage.clickContinue();

        await expect(checkoutPage.getErrorMessage()).toContainText('Postal Code is required');
    });

    test("Cancel on step one returns to cart and keep items", async ({page}) => {
        await inventoryPage.addProductToCart(PRODUCT_ONE.name);
        cartPage = await inventoryPage.openCart();
        checkoutPage = await cartPage.clickCheckout();

        await expect(page).toHaveURL(/.*checkout-step-one.html/);
        await checkoutPage.clickCancel();

        await expect(page).toHaveURL(/.*cart.html/);
        expect(await cartPage.getProductName(PRODUCT_ONE.name)).toEqual(PRODUCT_ONE.name);
    });
});