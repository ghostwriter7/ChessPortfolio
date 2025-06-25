import { Logger } from '../logger/logger';

export const retry = async (
  fn: () => Promise<void>,
  logger: Logger,
  retries = 5,
  delayMs = 2000
) => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      logger.warn(`Attempt ${attempt} failed, retrying in ${delayMs}ms`);
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  logger.error(`Retried ${retries} times and failed.`);
  throw lastError;
};
