import {expect, test} from "@playwright/test";
import {PageManager} from "../page-objects/pageManager";
import users from '../test-data/users.json';
import products from '../test-data/products.json';
import {InventoryPage} from "../page-objects/inventory/inventoryPage";
import {SortOption} from "../test-data/enums/enums";
import {USERS} from "../test-data/testData";


test.describe("Saucedemo - Inventory", () => {
    let pm: PageManager;
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({page}) => {
        pm = new PageManager(page);
        await pm.loginPage().goto()

        inventoryPage = await pm.loginPage().loginSuccess(USERS.STANDARD.username!, USERS.STANDARD.password!);

        await expect(page).toHaveURL(/.*inventory.html/);
    });

    test("Render inventory list", async () => {
        await expect(inventoryPage.getInventoryList()).toBeVisible();

        expect(await inventoryPage.getItemsCount()).toEqual(6);
    });

    test("Add and remove items from listing", async () => {
        await inventoryPage.addProductToCart(products.productOne.name);
        await inventoryPage.addProductToCart(products.productTwo.name);
        await expect(inventoryPage.getCardItemsBadgeCount()).toHaveText('2');

        await inventoryPage.removeProductFromCart(products.productOne.name);
        await expect(inventoryPage.getCardItemsBadgeCount()).toHaveText('1');

        await inventoryPage.removeProductFromCart(products.productTwo.name);
        await expect(inventoryPage.getCardItemsBadgeCount()).not.toBeVisible();
    });

    test("Sort products by name A-Z", async () => {
        await inventoryPage.sortProductsByName(SortOption.AZ);

        const currentNames = await inventoryPage.getProductNames();
        const sortedNames = [...currentNames].sort((a, b) => a.localeCompare(b));

        expect(currentNames).toEqual(sortedNames);
    });

    test("Sort products by name Z-A", async () => {
        await inventoryPage.sortProductsByName(SortOption.ZA);
        const currentNames = await inventoryPage.getProductNames();
        const sortedNames = [...currentNames].sort((a, b) => b.localeCompare(a));

        expect(currentNames).toEqual(sortedNames);
    });

    test("Sort products by price high-low", async () => {
        const inventoryPage = pm.inventoryPage();

        await inventoryPage.sortProductsByPrice(SortOption.HIGH_LOW);
        const currentPrices = await inventoryPage.getProductPrices();
        const sortedPrices = [...currentPrices].sort((a, b) => b - a);

        expect(currentPrices).toEqual(sortedPrices);
    });

    test("Sort products by price low-high", async () => {
        await inventoryPage.sortProductsByPrice(SortOption.LOW_HIGH);
        const currentPrices = await inventoryPage.getProductPrices();

        const sortedPrices = [...currentPrices].sort((a, b) => a - b);
        expect(currentPrices).toEqual(sortedPrices);
    });

    test("Open product from inventory list", async ({page}) => {
        const productDetailsPage = await inventoryPage.openProductByName(products.productOne.name);

        await expect(page).toHaveURL(/.*inventory-item.html/);
        await expect(productDetailsPage.getProductName()).toHaveText(products.productOne.name);
    });
});