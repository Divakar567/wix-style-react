import React from 'react';
import { createUniDriverFactory } from 'wix-ui-test-utils/uni-driver-factory';

import ColorInput from './ColorInput';
import { colorInputPrivateDriverFactory } from './ColorInput.driver.private';

describe.only('ColorInput', () => {
  const createDriver = createUniDriverFactory(colorInputPrivateDriverFactory);

  it('should render Input component', async () => {
    const { inputDriver } = createDriver(<ColorInput />);
    expect((await inputDriver()).exists()).toBe(true);
  });
});
