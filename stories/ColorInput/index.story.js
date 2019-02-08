import { storySettings } from './storySettings';

import ColorInput from '../../src/ColorInput';

export default {
  category: storySettings.kind,
  storyName: storySettings.storyName,

  component: ColorInput,
  componentPath: '../../src/ColorInput/ColorInput.js',

  componentProps: setState => ({
    value: '',
    dataHook: storySettings.dataHook,
    onChange: value => setState({ value }),
  }),

  exampleProps: {
    errorMessage: '',
    // Put here presets of props, for more info:
    // https://github.com/wix/wix-ui/blob/master/packages/wix-storybook-utils/docs/usage.md#using-list
  },
};
