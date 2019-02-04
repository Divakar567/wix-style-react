import { baseUniDriverFactory } from 'wix-ui-test-utils/base-driver';

export const colorInputDriverFactory = base => {
  return {
    ...baseUniDriverFactory(base),
  };
};
