import {test, expect} from "./fixtures";
import products from '../test-data/products.json';
import {USERS} from "../test-data/testData";


test.describe("Tests for negative scenarios (Edge Cases)", () => {
    test.beforeEach(async ({loginPage}) => {
        await loginPage.goto();
    });

    test("Fail to logged in with wrong password", async ({loginPage}) => {
        await loginPage.loginFailure(USERS.INVALID_PASS.username!, USERS.INVALID_PASS.password!);
        const errorText = loginPage.getErrorMessage();

        await expect(errorText).toBeVisible();
        await expect(errorText).toContainText("Username and password do not match");
    });

    test("Failed to login with locked-out user", async ({loginPage}) => {
        await loginPage.loginFailure(USERS.LOCKED_OUT.username!, USERS.LOCKED_OUT.password!);

        const errorText = loginPage.getErrorMessage();

        await expect(errorText).toBeVisible();
        await expect(errorText).toContainText(
            'Sorry, this user has been locked out'
        );
    });

    test("Validation: username is required", async ({loginPage}) => {
        await loginPage
            .loginFailure(USERS.INVALID_USERNAME.username!, USERS.INVALID_USERNAME.password!);

        const errorText = loginPage.getErrorMessage();

        await expect(errorText).toBeVisible();
        await expect(errorText).toContainText("Username is required");
    });

    test("Validation: password is required", async ({loginPage}) => {
        await loginPage.loginFailure(USERS.MISSING_PASSWORD.username!, USERS.MISSING_PASSWORD.password!)

        const errorText = loginPage.getErrorMessage();

        await expect(errorText).toBeVisible();
        await expect(errorText).toContainText("Password is required");
    });

    test("Verify product images are not broken (problem_user)", async ({loginPage}) => {
        test.fail();

        const inventoryPage = await loginPage
            .loginSuccess(USERS.PROBLEM.username!, USERS.PROBLEM.password!);

        const allSrcs = await inventoryPage.getProductImageSources();

        const uniqueSrcs = new Set(allSrcs);
        expect(uniqueSrcs.size).toEqual(allSrcs.length);
    });

    test('Login performance check (performance_glitch_user)', async ({loginPage}) => {
        test.fail();

        const startTime = performance.now();

        await loginPage
            .loginSuccess(USERS.PERFORMANCE.username!, USERS.PERFORMANCE.password!);

        const duration = Date.now() - startTime;
        console.log(`Login took: ${duration}ms`);

        expect(duration).toBeLessThan(5000);
    });

    test('Verify correct prices (visual_user data integrity)', async ({loginPage}) => {
        test.fail();

        const expectedPrices = Object.values(products)
            .map(p => Number(p.price.replace("$", "")))
            .sort((a, b) => a - b);

        const inventoryPage = await loginPage
            .loginSuccess(USERS.VISUAL.username!, USERS.VISUAL.password!);

        const actualPrices = await inventoryPage.getProductPrices();
        actualPrices.sort((a, b) => a - b);

        expect(actualPrices).toEqual(expectedPrices);
    });
});