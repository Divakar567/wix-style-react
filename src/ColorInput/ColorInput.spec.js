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
    [
      ['12', '000000'],
      ['123', '112233'],
      ['1234', '000000'],
      ['12345', '000000'],
      ['123456', '123456'],
      ['1234$#74', '000000'],
      ['1234AB', '1234AB'],
      ['%4EB7F', '000000'],
    ].map(([expectation, output]) =>
      it(`given ${expectation} should return ${output} when blurred`, async () => {
        const { inputDriver } = createDriver(<ColorInput disabled />);
        (await inputDriver()).click();
        (await inputDriver()).enterText(expectation);
        expect((await inputDriver()).getValue()).toBe(expectation);
        (await inputDriver()).blur();
        expect((await inputDriver()).getValue()).toBe(output);
      }),
    );
  });

  describe(`prefix '#'`, () => {
    it(`should be hidden when not clicked`, async () => {
      const { inputDriver } = createDriver(<ColorInput />);
      expect((await inputDriver()).hasPrefix()).toBe(false);
    });

    it(`should be visible when input is clicked`, async () => {
      const { inputDriver } = createDriver(<ColorInput />);
      (await inputDriver()).click();
      expect((await inputDriver()).hasPrefix()).toBe(true);
    });

    it(`should be visible when input is focused`, async () => {
      const { inputDriver } = createDriver(<ColorInput />);
      (await inputDriver()).focus();
      expect((await inputDriver()).hasPrefix()).toBe(true);
    });

    it(`should be visible when value is present but input is blurred`, async () => {
      const { inputDriver } = createDriver(<ColorInput />);
      (await inputDriver()).click();
      (await inputDriver()).enterText('123456');
      (await inputDriver()).blur();
      expect((await inputDriver()).hasPrefix()).toBe(true);
    });

    it(`should be hidden when onBlur`, async () => {
      const { inputDriver } = createDriver(<ColorInput />);
      (await inputDriver()).click();
      (await inputDriver()).blur();
      expect((await inputDriver()).hasPrefix()).toBe(false);
    });
  });

  describe(`'placeholder' prop`, () => {
    const defaultPlaceholder = 'Please choose a color';

    it(`by default should be defined`, async () => {
      const { inputDriver } = createDriver(<ColorInput />);
      expect((await inputDriver()).getPlaceholder()).toBe(defaultPlaceholder);
    });

    it(`should be equal to given`, async () => {
      const customPlaceHolder = 'Please choose';
      const { inputDriver } = createDriver(
        <ColorInput placeholder={customPlaceHolder} />,
      );
      expect((await inputDriver()).getPlaceholder()).toBe(customPlaceHolder);
    });

    it(`should be undefined when input is clicked`, async () => {
      const { inputDriver } = createDriver(<ColorInput />);
      (await inputDriver()).click();
      expect((await inputDriver()).getPlaceholder()).toBe('');
    });
  });
});
