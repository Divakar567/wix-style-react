import React from 'react';
import { storySettings } from './storySettings';
import {
  tab,
  api,
  playground,
  description,
  testkit,
} from 'wix-storybook-utils/Sections';

import { Layout, Cell } from 'wix-style-react/Layout';
import ColorInput from 'wix-style-react/ColorInput';
import { placements } from 'wix-style-react/Popover';

export default {
  category: storySettings.kind,
  storyName: storySettings.storyName,

  component: ColorInput,
  componentPath: '../../src/ColorInput/ColorInput.js',

  componentProps: setState => ({
    value: '',
    placeholder: 'Please choose a color',
    dataHook: storySettings.dataHook,
    onConfirm: value => setState({ value }),
    size: 'medium',
    error: false,
    errorMessage: '',
    popoverPlacement: 'bottom',
    popoverAppendTo: 'parent',
    disabled: false,
  }),

  componentWrapper: ({ component }) => (
    <Layout>
      <Cell span={6}>{component}</Cell>
    </Layout>
  ),

  exampleProps: {
    errorMessage: '',
    size: ['small', 'medium', 'large'],
    popoverPlacement: [...placements],
    popoverAppendTo: [
      { label: 'window', value: window },
      { label: 'scrollParent', value: 'scrollParent' },
      { label: 'viewport', value: 'viewport' },
      { label: 'parent', value: 'parent' },
      { label: 'null', value: null },
    ],
  },

  sections: [
    tab({
      title: 'Description',
      sections: [],
    }),

    tab({
      title: 'Playground',
      sections: [playground()],
    }),

    tab({
      title: 'API',
      sections: [api()],
    }),

    tab({
      title: 'Testkit',
      sections: [testkit()],
    }),
  ],
};
