import { baseUniDriverFactory } from 'wix-ui-test-utils/base-driver';
import {
  colorPickerTestkitFactory,
  popoverTestkitFactory,
} from '../../testkit';
import inputDriverFactory from '../Input/Input.driver';

export const colorInputDriverFactory = base => {
  const colorViewerHook = '[data-hook="colorinput-viewer"]';
  const inputTestkit = element =>
    inputDriverFactory({
      element,
    });

  const colorPickerTestkit = element =>
    colorPickerTestkitFactory({
      wrapper: element,
      dataHook: 'colorinput-colorpicker',
    });

  const popoverTestkit = element =>
    popoverTestkitFactory({
      wrapper: element,
      dataHook: 'colorinput-popover',
    });

  return {
    ...baseUniDriverFactory(base),
    inputDriver: async () => inputTestkit(await base.getNative()),
    colorPickerDriver: async () => colorPickerTestkit(await base.getNative()),
    popoverDriver: async () => popoverTestkit(await base.getNative()),
    clickColorViewer: async () => base.$(colorViewerHook).click(),
  };
};
