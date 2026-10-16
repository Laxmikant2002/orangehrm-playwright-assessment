export type EnvironmentName = 'demo' | 'staging' | 'local';

export interface EnvironmentConfig {
  name: EnvironmentName;
  baseUrl: string;
  username: string;
  password: string;
}

const environmentName = (process.env.TEST_ENV ?? 'demo') as EnvironmentName;
const defaults: Record<EnvironmentName, Omit<EnvironmentConfig, 'name'>> = {
  demo: {
    baseUrl: 'https://opensource-demo.orangehrmlive.com',
    username: 'Admin',
    password: 'admin123',
  },
  staging: {
    baseUrl: 'https://opensource-demo.orangehrmlive.com',
    username: 'Admin',
    password: 'admin123',
  },
  local: {
    baseUrl: 'http://localhost:3000',
    username: 'Admin',
    password: 'admin123',
  },
};

const selected = defaults[environmentName] ?? defaults.demo;

export const environment: EnvironmentConfig = {
  name: defaults[environmentName] ? environmentName : 'demo',
  baseUrl: process.env.BASE_URL ?? selected.baseUrl,
  username: process.env.ORANGEHRM_USERNAME ?? selected.username,
  password: process.env.ORANGEHRM_PASSWORD ?? selected.password,
};
