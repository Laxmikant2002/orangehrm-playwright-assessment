import { PimPage } from '../pages/PimPage';
import { expect, test } from './fixtures';

test.describe('Part 2: employee search edge cases and resilience', () => {
  test('shows no records for a validly formatted but unknown employee id', async ({
    authenticatedPage,
  }) => {
    const pimPage = new PimPage(authenticatedPage);
    await pimPage.navigateToPim();

    await pimPage.searchByEmployeeId('EMPLOYEE-DOES-NOT-EXIST');

    await expect(pimPage.employeeRows()).toHaveCount(0);
    await expect(pimPage.employeeListTable).toBeVisible();
  });

  test('clears an empty search and restores the employee list without stale filtering', async ({
    authenticatedPage,
  }) => {
    const pimPage = new PimPage(authenticatedPage);
    await pimPage.navigateToPim();
    await pimPage.searchByEmployeeId('EMPLOYEE-DOES-NOT-EXIST');
    await expect(pimPage.employeeRows()).toHaveCount(0);

    await pimPage.resetSearch();

    await expect(pimPage.employeeListTable).toBeVisible();
    await expect(pimPage.employeeRows()).not.toHaveCount(0);
  });

  test('keeps the employee view usable when the employee API is unavailable', async ({
    authenticatedPage,
  }) => {
    const pimPage = new PimPage(authenticatedPage);
    await pimPage.navigateToPim();
    await expect(pimPage.topbarHeader).toBeVisible();
    await expect(pimPage.employeeListTable).toBeVisible();

    let employeeRequestFailed = false;
    await authenticatedPage.route('**/api/v2/pim/employees**', (route) =>
      route.abort('failed').then(() => {
        employeeRequestFailed = true;
      }),
    );
    await pimPage.searchByEmployeeId('EMPLOYEE-DOES-NOT-EXIST');

    await expect.poll(() => employeeRequestFailed).toBe(true);
    await expect(pimPage.topbarHeader).toBeVisible();
    await expect(pimPage.employeeListTable).toBeVisible();
    await expect(authenticatedPage).toHaveURL(/\/pim\/viewEmployeeList/);
  });
});
