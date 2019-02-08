import React from 'react';
import { storySettings } from './storySettings';

import { Layout, Cell } from 'wix-style-react/Layout';
import ColorInput from 'wix-style-react/ColorInput';

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

  componentWrapper: ({ component }) => (
    <Layout>
      <Cell span={5}>{component}</Cell>
    </Layout>
  ),

  exampleProps: {
    errorMessage: '',
    // Put here presets of props, for more info:
    // https://github.com/wix/wix-ui/blob/master/packages/wix-storybook-utils/docs/usage.md#using-list
  },
};
