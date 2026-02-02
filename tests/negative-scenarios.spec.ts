import {expect, test} from "@playwright/test";
import {PageManager} from "../page-objects/pageManager";
import products from '../test-data/products.json';
import {USERS} from "../test-data/testData";

test.describe("Tests for negative scenarios (Edge Cases)", () => {
    let pm: PageManager;

    test.beforeEach(async ({page}) => {
        pm = new PageManager(page);
        await pm.loginPage().goto();
    });

    test("Verify product images are not broken (problem_user)", async () => {
        test.fail();

        const inventoryPage = await pm.loginPage()
            .loginSuccess(USERS.PROBLEM.username!, USERS.PROBLEM.password!);

        const allSrcs = await inventoryPage.getProductImageSources();

        const uniqueSrcs = new Set(allSrcs);
        expect(uniqueSrcs.size).toEqual(allSrcs.length);
    });

    test('Login performance check (performance_glitch_user)', async ({page}) => {
        test.fail();

        const startTime = Date.now();

        await pm.loginPage()
            .loginSuccess(USERS.PERFORMANCE.username!, USERS.PERFORMANCE.password!);

        const duration = Date.now() - startTime;
        console.log(`Login took: ${duration}ms`);

        expect(duration).toBeLessThan(5000);
    });

    test('Verify correct prices (visual_user data integrity)', async () => {
        test.fail();

        const expectedPrices = Object.values(products)
            .map(p => Number(p.price.replace("$", "")))
            .sort((a, b) => a - b);

        const inventoryPage = await pm.loginPage()
            .loginSuccess(USERS.VISUAL.username!, USERS.VISUAL.password!);

        const actualPrices = await inventoryPage.getProductPrices();
        actualPrices.sort((a, b) => a - b);

        expect(actualPrices).toEqual(expectedPrices);
    });
});