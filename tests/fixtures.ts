import {test as base} from "@playwright/test";
import {PageManager} from "../page-objects/pageManager";
import {InventoryPage} from "../page-objects/inventory/inventoryPage";
import {USERS} from "../test-data/testData";

type MyFixtures = {
    pm: PageManager;
    authedInventoryPage: InventoryPage;
};

export const test = base.extend<MyFixtures>({
    pm: async ({page}, use) => {
        const pm = new PageManager(page);
        await use(pm);
    },

    authedInventoryPage: async ({pm}, use) => {
        await pm.loginPage().goto();
        const inventoryPage = await pm.loginPage().loginSuccess(USERS.STANDARD.username!, USERS.STANDARD.password!);
        await use(inventoryPage);
    },
});

export {expect} from "@playwright/test";