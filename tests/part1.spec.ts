import { LoginPage } from '../pages/LoginPage';
import { PimPage } from '../pages/PimPage';
import { environment } from '../config/environment';
import { expect, test } from './fixtures';

test.describe('Part 1: authentication and employee management', () => {
  test('logs in, opens employee management, and logs out', async ({
    loginPage,
    page,
  }) => {
    await loginPage.goto();
    await loginPage.login(environment.username, environment.password);

    await expect(page).toHaveURL(/dashboard\/index/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    const pimPage = new PimPage(page);
    await pimPage.navigateToPim();
    await expect(page).toHaveURL(/\/pim\/viewEmployeeList/);
    await expect(pimPage.topbarHeader).toBeVisible();

    await loginPage.logout();
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('rejects invalid credentials and keeps protected content inaccessible', async ({
    loginPage,
    page,
  }) => {
    await loginPage.goto();
    await loginPage.login('invalid-user', 'invalid-password');

    await expect(loginPage.errorMessage()).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toHaveCount(0);
  });

  test('does not submit when both credential fields are blank', async ({
    loginPage,
    page,
  }) => {
    await loginPage.goto();
    await loginPage.login('', '');

    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(loginPage.loginButton).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toHaveCount(0);
    await expect(loginPage.requiredFieldMessages()).toHaveCount(2);
  });

  test('redirects unauthenticated users away from the protected employee list', async ({
    page,
  }) => {
    await page.goto('/web/index.php/pim/viewEmployeeList');

    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.getByPlaceholder('Username')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toHaveCount(0);
  });

  test('renders employee data in the employee list', async ({
    authenticatedPage,
  }) => {
    const pimPage = new PimPage(authenticatedPage);
    await pimPage.navigateToPim();

    await expect(pimPage.topbarHeader).toBeVisible();
    await expect(pimPage.employeeListTable).toBeVisible();
    await expect(
      pimPage.employeeListTable
        .locator('.oxd-table-header-cell')
        .filter({ hasText: /^Id/ }),
    ).toBeVisible();
    await expect(pimPage.employeeRows()).not.toHaveCount(0);
    await expect(pimPage.employeeRows().first()).toContainText(/\S+/);
  });
});
