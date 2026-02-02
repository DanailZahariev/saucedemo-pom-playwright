import {test, expect} from "@playwright/test";
import {PageManager} from "../page-objects/pageManager";
import users from '../test-data/users.json';
import {USERS} from "../test-data/testData";

test.describe("Saucedemo - Login", () => {
    let pm: PageManager;

    test.beforeEach(async ({page}) => {
        pm = new PageManager(page);
        await pm.loginPage().goto();
    });

    test("Successfully logged in", async ({page}) => {
        await pm.loginPage()
            .loginSuccess(USERS.STANDARD.username!, USERS.STANDARD.password!);

        await expect(page).toHaveURL(/.*inventory.html/);
        await expect(page.locator(".inventory_list")).toBeVisible();
    });

    test("Fail to logged in with wrong password", async ({page}) => {
        const errorText = await pm.loginPage()
            .loginFailure(USERS.INVALID_PASS.username!, USERS.INVALID_PASS.password!)
            .then(err => err.getErrorMessage());


        await expect(errorText).toBeVisible();
        await expect(errorText).toContainText("Username and password do not match");
    });

    test("Failed to login with locked-out user", async ({page}) => {
        const errorText = await pm.loginPage()
            .loginFailure(USERS.LOCKED_OUT.username!, USERS.LOCKED_OUT.password!)
            .then(err => err.getErrorMessage());

        await expect(errorText).toBeVisible();
        await expect(errorText).toContainText(
            'Sorry, this user has been locked out'
        );
    });

    test("Validation: username is required", async ({page}) => {
        const errorText = await pm.loginPage()
            .loginFailure(USERS.INVALID_USERNAME.username!, USERS.INVALID_USERNAME.password!)
            .then(err => err.getErrorMessage());

        await expect(errorText).toBeVisible();
        await expect(errorText).toContainText("Username is required");
    });

    test("Validation: password is required", async ({page}) => {
        const errorText = await pm.loginPage().loginFailure(USERS.MISSING_PASSWORD.username!, USERS.MISSING_PASSWORD.password!)
            .then(err => err.getErrorMessage());

        await expect(errorText).toBeVisible();
        await expect(errorText).toContainText("Password is required");
    });
});