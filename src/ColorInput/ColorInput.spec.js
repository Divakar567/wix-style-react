import React from 'react';
import { createUniDriverFactory } from 'wix-ui-test-utils/uni-driver-factory';

import ColorInput from './ColorInput';
import { colorInputPrivateDriverFactory } from './ColorInput.driver.private';

describe('ColorInput', () => {
  const createDriver = createUniDriverFactory(colorInputPrivateDriverFactory);

  it('should render', async () => {
    const driver = createDriver(<ColorInput />);
    expect(await driver.exists()).toBeTruthy();
  });
});
