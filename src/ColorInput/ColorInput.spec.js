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
    it(`should not be converted while typed`, async () => {
      const userHex = '2C4';
      const { inputDriver } = createDriver(<ColorInput disabled />);
      (await inputDriver()).click();
      (await inputDriver()).enterText(userHex);
      expect((await inputDriver()).getValue()).toBe(userHex);
    }),
      [
        ['92', '000000'],
        ['2C4', '22CC44'],
        ['3491', '000000'],
        ['A88', 'AA8888'],
        ['ZA8', '000000'],
        ['2C45$#74', '000000'],
        ['4EB7F568A7', '000000'],
        ['4EB7F5', '4EB7F5'],
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

  describe(`'placeHolder' prop`, () => {
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

  describe(`'placeHolder' prop`, () => {
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
