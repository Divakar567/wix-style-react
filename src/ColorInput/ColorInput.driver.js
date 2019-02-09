import { baseUniDriverFactory } from 'wix-ui-test-utils/base-driver';
import { inputTestkitFactory, colorPickerTestkitFactory } from '../../testkit';

export const colorInputDriverFactory = base => {
  const inputTestkit = element =>
    inputTestkitFactory({
      wrapper: element,
      dataHook: 'colorinput-input',
    });

  const colorPickerTestkit = element =>
    colorPickerTestkitFactory({
      wrapper: element,
      dataHook: 'colorinput-colorpicker',
    });

  return {
    ...baseUniDriverFactory(base),
    inputDriver: async () => inputTestkit(await base.getNative()),
    colorPickerDriver: async () => colorPickerTestkit(await base.getNative()),
  };
};
