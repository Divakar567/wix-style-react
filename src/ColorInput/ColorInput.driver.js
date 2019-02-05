import { baseUniDriverFactory } from 'wix-ui-test-utils/base-driver';
import { inputTestkitFactory } from '../../testkit';

export const colorInputDriverFactory = base => {
  const inputTestkit = element =>
    inputTestkitFactory({
      wrapper: element,
      dataHook: 'colorinput-input',
    });
  return {
    ...baseUniDriverFactory(base),
    inputDriver: async () => inputTestkit(await base.getNative()),
  };
};
