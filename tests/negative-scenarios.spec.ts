import {expect, test} from "@playwright/test";
import {PageManager} from "../page-objects/pageManager";
import users from '../test-data/users.json';
import products from '../test-data/products.json';


test.describe("Tests for negative scenarios", () => {

    test("Test for error user", async ({page, browserName}) => {
        test.fail(browserName !== 'firefox', 'Firefox does not throw this console error in CI');
        const pm = new PageManager(page);
        const errors: string[] = [];

        page.on('pageerror', exception => {
            errors.push(exception.message);
        });

        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });

        await pm.onLoginPage().goto();
        await pm.onLoginPage().login(users.errorUser.username, users.errorUser.password);

        await pm.onInventoryPage().addProductToCart(products.productOne.name);

        expect(errors).toHaveLength(0);

    });

    test("Verify product images are not broken", async ({page}) => {
        test.fail();
        const pm = new PageManager(page);
        await pm.onLoginPage().goto();
        await pm.onLoginPage().login(users.problemUser.username, users.problemUser.password);

        const allSrcs = await page.locator('.inventory_item_img img')
            .evaluateAll(imgs =>
                imgs.map(img => (img as HTMLImageElement).src));

        const uniqueSrcs = new Set(allSrcs);

        expect(uniqueSrcs.size).toEqual(allSrcs.length);

    });

    test('Login performance check', async ({page}) => {
        test.fail();
        const pm = new PageManager(page);
        const loginPage = pm.onLoginPage();

        const startTime = Date.now();

        await loginPage.goto();
        await loginPage.login(users.performanceUser.username, users.performanceUser.password);

        await expect(page).toHaveURL(/.*inventory.html/);

        const duration = Date.now() - startTime;
        console.log(`Login took: ${duration}ms`);

        expect(duration).toBeLessThan(5000);

    });

    test('Verify correct prices for visual_user (Data Integrity Check)', async ({page}) => {
        test.fail();
        const pm = new PageManager(page);
        const inventoryPage = pm.onInventoryPage();
        const expectedPrices = Object.values(products)
            .map(product => {
                return Number(product.price.replace("$", ""));
            }).sort((a, b) => a - b);

        await pm.onLoginPage().goto();
        await pm.onLoginPage().login(users.visualUser.username, users.visualUser.password);

        const actualPrices = await inventoryPage.getProductPrices();
        actualPrices.sort((a, b) => a - b);

        expect(actualPrices).toEqual(expectedPrices);

    });
});