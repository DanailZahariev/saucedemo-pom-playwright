import {test, expect} from "./fixtures";
import products from '../test-data/products.json';
import {SortOption} from "../test-data/enums/enums";


test.describe("Saucedemo - Inventory", () => {

    test("Render inventory list", async ({authedInventoryPage}) => {
        await expect(authedInventoryPage.getInventoryList()).toBeVisible();

        expect(await authedInventoryPage.getItemsCount()).toEqual(6);
    });

    test("Add and remove items from listing", async ({authedInventoryPage}) => {
        await authedInventoryPage.addProductToCart(products.productOne.name);
        await authedInventoryPage.addProductToCart(products.productTwo.name);
        await expect(authedInventoryPage.getCardItemsBadgeCount()).toHaveText('2');

        await authedInventoryPage.removeProductFromCart(products.productOne.name);
        await expect(authedInventoryPage.getCardItemsBadgeCount()).toHaveText('1');

        await authedInventoryPage.removeProductFromCart(products.productTwo.name);
        await expect(authedInventoryPage.getCardItemsBadgeCount()).not.toBeVisible();
    });

    test("Sort products by name A-Z", async ({authedInventoryPage}) => {
        await authedInventoryPage.sortProductsByName(SortOption.AZ);

        const currentNames = await authedInventoryPage.getProductNames();
        const sortedNames = [...currentNames].sort((a, b) => a.localeCompare(b));

        expect(currentNames).toEqual(sortedNames);
    });

    test("Sort products by name Z-A", async ({authedInventoryPage}) => {
        await authedInventoryPage.sortProductsByName(SortOption.ZA);
        const currentNames = await authedInventoryPage.getProductNames();
        const sortedNames = [...currentNames].sort((a, b) => b.localeCompare(a));

        expect(currentNames).toEqual(sortedNames);
    });

    test("Sort products by price high-low", async ({authedInventoryPage}) => {

        await authedInventoryPage.sortProductsByPrice(SortOption.HIGH_LOW);
        const currentPrices = await authedInventoryPage.getProductPrices();
        const sortedPrices = [...currentPrices].sort((a, b) => b - a);

        expect(currentPrices).toEqual(sortedPrices);
    });

    test("Sort products by price low-high", async ({authedInventoryPage}) => {
        await authedInventoryPage.sortProductsByPrice(SortOption.LOW_HIGH);
        const currentPrices = await authedInventoryPage.getProductPrices();

        const sortedPrices = [...currentPrices].sort((a, b) => a - b);
        expect(currentPrices).toEqual(sortedPrices);
    });

    test("Open product from inventory list", async ({page, authedInventoryPage}) => {
        const productDetailsPage = await authedInventoryPage.openProductByName(products.productOne.name);

        await expect(page).toHaveURL(/.*inventory-item.html/);
        await expect(productDetailsPage.getProductName()).toHaveText(products.productOne.name);
    });
});