export type EnvironmentName = 'demo' | 'staging' | 'local';

export interface EnvironmentConfig {
  name: EnvironmentName;
  baseUrl: string;
  username: string;
  password: string;
}

const requestedEnvironment = process.env.TEST_ENV ?? 'demo';
const environmentNames: EnvironmentName[] = ['demo', 'staging', 'local'];

if (!environmentNames.includes(requestedEnvironment as EnvironmentName)) {
  throw new Error(
    `Unsupported TEST_ENV "${requestedEnvironment}". Use one of: ${environmentNames.join(', ')}`,
  );
}

const environmentName = requestedEnvironment as EnvironmentName;
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

const selected = defaults[environmentName];

export const environment: EnvironmentConfig = {
  name: environmentName,
  baseUrl: process.env.BASE_URL ?? selected.baseUrl,
  username: process.env.ORANGEHRM_USERNAME ?? selected.username,
  password: process.env.ORANGEHRM_PASSWORD ?? selected.password,
};
