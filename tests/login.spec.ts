import {test, expect} from "./fixtures";
import {USERS} from "../test-data/testData";

test.describe("Saucedemo - Login", () => {

    test.beforeEach(async ({loginPage}) => {
        await loginPage.goto();
    });

    test("Successfully logged in", async ({page, loginPage}) => {
        await loginPage
            .loginSuccess(USERS.STANDARD.username!, USERS.STANDARD.password!);

        await expect(page).toHaveURL(/.*inventory.html/);
        await expect(page.locator(".inventory_list")).toBeVisible();
    });
});