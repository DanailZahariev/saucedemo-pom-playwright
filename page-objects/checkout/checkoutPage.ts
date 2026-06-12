import {Locator, Page} from "@playwright/test";
import {BasePage} from "../base/BasePage";

export class CheckoutPage extends BasePage {

    private readonly firstnameInput: Locator;
    private readonly lastnameInput: Locator;
    private readonly zipCode: Locator;
    private readonly errorLocator: Locator;
    private readonly continueBtn: Locator
    private readonly cancelBtn: Locator;
    private readonly summaryInfo: Locator;
    private readonly productInfo: Locator;
    private readonly finishBtn: Locator;
    private readonly completeHeader: Locator;

    constructor(page: Page) {
        super(page);
        this.firstnameInput = page.getByPlaceholder('First Name');
        this.lastnameInput = page.getByPlaceholder("Last Name");
        this.zipCode = page.getByPlaceholder("Zip/Postal Code");
        this.errorLocator = page.getByTestId("error");
        this.continueBtn = page.getByRole("button", {name: "Continue"});
        this.cancelBtn = page.getByRole("button", {name: "Cancel"});
        this.summaryInfo = page.locator('.summary_info');
        this.finishBtn = page.getByRole("button", {name: "Finish"});
        // this.completeHeader = page.locator('[data-test="complete-header"]');
        this.completeHeader = page.getByText("Thank you for your order!");
        this.productInfo = page.getByTestId("inventory-item");
    }

    async fillShippingInfo(firstName: string, lastName: string, zipCode: string): Promise<void> {
        await this.firstnameInput.fill(firstName);
        await this.lastnameInput.fill(lastName);
        await this.zipCode.fill(zipCode);
    }

    async clickFinish() {
        await this.clickElement(this.finishBtn);
    }

    async clickContinue() {
        await this.clickElement(this.continueBtn);
        return this;
    }

    async clickCancel() {
        await this.clickElement(this.cancelBtn);
    }

    getCompleteHeader(): Locator {
        return this.completeHeader;
    }

    getSummaryInfo(): Locator {
        return this.summaryInfo;
    }

    async getProductPriceInfo(productName: string) {
        return this.getInnerText(this.productInfo.filter({hasText: productName})
            .getByTestId("inventory-item-price"));
    }

    async getProductNameInfo(productName: string) {
        return this.getInnerText(this.productInfo.filter({hasText: productName})
            .getByTestId("inventory-item-name"));
    }

    getErrorMessage() {
        return this.errorLocator;
    }

    getFirstnameInput(): Locator {
        return this.firstnameInput;
    }

    getLastnameInput(): Locator {
        return this.lastnameInput;
    }

    getZipCodeInput(): Locator {
        return this.zipCode;
    }

}