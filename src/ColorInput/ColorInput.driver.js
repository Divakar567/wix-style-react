import { baseUniDriverFactory } from 'wix-ui-test-utils/base-driver';
import { colorPickerTestkitFactory } from '../../testkit';
import inputDriverFactory from '../Input/Input.driver';

export const colorInputDriverFactory = base => {
  const inputTestkit = element =>
    inputDriverFactory({
      element,
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
