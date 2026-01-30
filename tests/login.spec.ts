import {test, expect} from "@playwright/test";
import {PageManager} from "../page-objects/pageManager";
import users from '../test-data/users.json';

test.describe("Saucedemo - Login", () => {
    let pm: PageManager;

    test.beforeEach(async ({page}) => {
        pm = new PageManager(page);
        await pm.onLoginPage().goto();
    });

    test("Successfully logged in", async ({page}) => {
        const loginPage = pm.onLoginPage();

        await loginPage.login(users.validUser.username, users.validUser.password);

        await expect(page).toHaveURL(/.*inventory.html/);
        await expect(page.locator(".inventory_list")).toBeVisible();
    });

    test("Fail to logged in with wrong password", async ({page}) => {
        const loginPage = pm.onLoginPage();

        await loginPage.login(users.wrongPassword.username, users.wrongPassword.password);

        await expect(loginPage.getErrorLocator()).toContainText("Username and password do not match");
        await expect(loginPage.getErrorLocator()).toBeVisible();
    });

    test("Failed to login with locked-out user", async ({page}) => {
        const loginPage = pm.onLoginPage();

        await loginPage.login(users.lockedOutUser.username, users.lockedOutUser.password);

        await expect(loginPage.getErrorLocator()).toBeVisible();
        await expect(loginPage.getErrorLocator()).toContainText(
            'Sorry, this user has been locked out'
        );
    });

    test("Validation: username is required", async ({page}) => {
        const loginPage = pm.onLoginPage();

        await loginPage.login(users.missingUsername.username, users.missingPassword.password);

        await expect(loginPage.getErrorLocator()).toBeVisible();
        await expect(loginPage.getErrorLocator()).toContainText("Username is required");
    });

    test("Validation: password is required", async ({page}) => {
        const loginPage = pm.onLoginPage();

        await loginPage.login(users.missingPassword.username, users.missingPassword.password);

        await expect(loginPage.getErrorLocator()).toBeVisible();
        await expect(loginPage.getErrorLocator()).toContainText("Password is required");
    });
});