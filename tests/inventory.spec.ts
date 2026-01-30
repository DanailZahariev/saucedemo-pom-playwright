import {expect, test} from "@playwright/test";
import {PageManager} from "../page-objects/pageManager";
import users from '../test-data/users.json';
import products from '../test-data/products.json';


test.describe("Saucedemo - Inventory", () => {
    let pm: PageManager;

    test.beforeEach(async ({page}) => {
        pm = new PageManager(page);
        await pm.onLoginPage().goto();

        await pm.onLoginPage().login(users.validUser.username, users.validUser.password);

        await expect(page).toHaveURL(/.*inventory.html/);
    });

    test("Render inventory list", async () => {
        const inventoryPage = pm.onInventoryPage();

        await expect(inventoryPage.getInventoryList()).toBeVisible();

        expect(await inventoryPage.getItemsCount()).toEqual(6);
    });

    test("Add and remove items from listing", async () => {
        const inventoryPage = pm.onInventoryPage();

        await inventoryPage.addProductToCart(products.productOne.name);
        await inventoryPage.addProductToCart(products.productTwo.name);
        await expect(inventoryPage.getCardItemsBadgeCount()).toHaveText('2');

        await inventoryPage.removeProductFromCart(products.productOne.name);
        await expect(inventoryPage.getCardItemsBadgeCount()).toHaveText('1');

        await inventoryPage.removeProductFromCart(products.productTwo.name);
        await expect(inventoryPage.getCardItemsBadgeCount()).not.toBeVisible();
    });

    test("Sort products by name A-Z", async () => {
        const inventoryPage = pm.onInventoryPage();
        await inventoryPage.sortProductsByName('az');

        const currentNames = await inventoryPage.getProductNames();
        const sortedNames = [...currentNames].sort((a, b) => a.localeCompare(b));

        expect(currentNames).toEqual(sortedNames);
    });

    test("Sort products by name Z-A", async () => {
        const inventoryPage = pm.onInventoryPage();

        await inventoryPage.sortProductsByName('za');
        const currentNames = await inventoryPage.getProductNames();
        const sortedNames = [...currentNames].sort((a, b) => b.localeCompare(a));

        expect(currentNames).toEqual(sortedNames);
    });

    test("Sort products by price high-low", async () => {
        const inventoryPage = pm.onInventoryPage();

        await inventoryPage.sortProductsByPrice("hilo");
        const currentPrices = await inventoryPage.getProductPrices();
        const sortedPrices = [...currentPrices].sort((a, b) => b - a);

        expect(currentPrices).toEqual(sortedPrices);
    });

    test("Sort products by price low-high", async () => {
        const inventoryPage = pm.onInventoryPage();

        await inventoryPage.sortProductsByPrice("lohi");
        const currentPrices = await inventoryPage.getProductPrices();

        const sortedPrices = [...currentPrices].sort((a, b) => a - b);
        expect(currentPrices).toEqual(sortedPrices);
    });

    test("Open product from inventory list", async ({page}) => {
        const inventoryPage = pm.onInventoryPage();

        const productDetails = pm.onProductDetails();
        await inventoryPage.openProductByName(products.productOne.name);

        await expect(page).toHaveURL(/.*inventory-item.html/);
        await expect(productDetails.getProductName()).toHaveText(products.productOne.name);
    });
});