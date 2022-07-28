import dotenv from 'dotenv';

const didConfigDotEnv = false;
export const getEnv = (key: string): string => {
  if (!didConfigDotEnv) {
    dotenv.config();
  }
  const value = process.env[key];
  if (!value && process.env.NODE_ENV !== 'test') {
    throw new Error(`process.env missing key=${key}`);
  }
  return value ?? '';
};
