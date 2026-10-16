import { Page, Locator } from '@playwright/test';

export class PimPage {
  readonly page: Page;
  readonly pimMenuLink: Locator;
  readonly topbarHeader: Locator;
  readonly employeeListTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pimMenuLink = page.getByRole('link', { name: 'PIM' });
    this.topbarHeader = page.getByRole('heading', { name: 'PIM' });
    this.employeeListTable = page.locator('.oxd-table');
  }

  async navigateToPim(): Promise<void> {
    await this.pimMenuLink.click();
  }

  employeeRows(): Locator {
    return this.employeeListTable.locator('.oxd-table-body .oxd-table-row');
  }

  async searchByEmployeeId(employeeId: string): Promise<void> {
    const employeeIdInput = this.page
      .getByText('Employee Id', { exact: true })
      .locator('../..')
      .getByRole('textbox');
    await employeeIdInput.fill(employeeId);
    await this.page.getByRole('button', { name: 'Search' }).click();
  }

  async resetSearch(): Promise<void> {
    await this.page.getByRole('button', { name: 'Reset' }).click();
  }
}