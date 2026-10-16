import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly userDropdown: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
    this.logoutLink = page.getByText('Logout', { exact: true });
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async logout(): Promise<void> {
    await this.userDropdown.click();
    await this.logoutLink.click();
  }

  errorMessage(): Locator {
    return this.page.getByText('Invalid credentials', { exact: true });
  }

  requiredFieldMessages(): Locator {
    return this.page.getByText('Required', { exact: true });
  }
}