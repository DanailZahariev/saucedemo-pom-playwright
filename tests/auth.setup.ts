import { test as setup } from '@playwright/test';
import { LoginPage } from '../page-objects/auth/loginPage';
import { USERS } from '../test-data/testData';

const authFile = 'playwright/.auth/user.json';

setup('Authenticate as standard user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.loginSuccess(USERS.STANDARD.username!, USERS.STANDARD.password!);

    await page.context().storageState({ path: authFile });
});