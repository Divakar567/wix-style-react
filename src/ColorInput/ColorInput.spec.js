import React from 'react';
import { createUniDriverFactory } from 'wix-ui-test-utils/uni-driver-factory';

import ColorInput from './ColorInput';
import { colorInputPrivateDriverFactory } from './ColorInput.driver.private';

describe('ColorInput', () => {
  const createDriver = createUniDriverFactory(colorInputPrivateDriverFactory);

  it('should render Input component', async () => {
    const { inputDriver } = createDriver(<ColorInput />);
    expect((await inputDriver()).exists()).toBe(true);
  });

  describe('given `disabled` prop', () => {
    it('input should be disabled', async () => {
      const { inputDriver } = createDriver(<ColorInput disabled />);
      expect((await inputDriver()).isDisabled()).toBe(true);
    });
  });

  describe('`value` prop', () => {
    it('by default should be empty', async () => {
      const { inputDriver } = createDriver(<ColorInput />);
      expect((await inputDriver()).getValue()).toBe('');
    });
  });

  describe('when clicked', () => {
    it('input value shoud start with #', async () => {
      const { inputDriver } = createDriver(<ColorInput />);
      (await inputDriver()).click();
      expect((await inputDriver()).getValue()).toBe('#');
    });
  });
});
