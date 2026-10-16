import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { environment } from '../config/environment';

export const test = base.extend<{
  loginPage: LoginPage;
  authenticatedPage: Page;
}>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  authenticatedPage: async ({ page, loginPage }, use) => {
    await loginPage.goto();
    await loginPage.login(environment.username, environment.password);
    await use(page);
  },
});

export { expect } from '@playwright/test';
