import {test, expect} from "./fixtures";
import products from '../test-data/products.json';
import {USERS} from "../test-data/testData";


test.describe("Tests for negative scenarios (Edge Cases)", () => {
    test.beforeEach(async ({pm}) => {
        await pm.loginPage().goto();
    });

    test("Verify product images are not broken (problem_user)", async ({pm}) => {
        test.fail();

        const inventoryPage = await pm.loginPage()
            .loginSuccess(USERS.PROBLEM.username!, USERS.PROBLEM.password!);

        const allSrcs = await inventoryPage.getProductImageSources();

        const uniqueSrcs = new Set(allSrcs);
        expect(uniqueSrcs.size).toEqual(allSrcs.length);
    });

    test('Login performance check (performance_glitch_user)', async ({pm}) => {
        test.fail();

        const startTime = performance.now();

        await pm.loginPage()
            .loginSuccess(USERS.PERFORMANCE.username!, USERS.PERFORMANCE.password!);

        const duration = Date.now() - startTime;
        console.log(`Login took: ${duration}ms`);

        expect(duration).toBeLessThan(5000);
    });

    test('Verify correct prices (visual_user data integrity)', async ({pm}) => {
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