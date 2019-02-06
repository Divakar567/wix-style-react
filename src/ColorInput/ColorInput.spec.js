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

  // describe('`value` prop', () => {
  //   [
  //     ['92', '929292'],
  //     ['2C4', '22CC44'],
  //     ['3491', '334499'],
  //     ['#ZA8', 'A8'],
  //   ].map(([expectation, output]) =>
  //     it(`given ${expectation} should return ${output}`, async () => {
  //       const { inputDriver } = createDriver(<ColorInput disabled />);
  //       (await inputDriver()).enterText(expectation);
  //       expect((await inputDriver()).getValue()).toBe(output);
  //     }),
  //   );
  // });

  describe(`prefix '#'`, () => {
    it(`should be hidden when not clicked`, async () => {
      const { inputDriver } = createDriver(<ColorInput />);
      expect((await inputDriver()).hasPrefix()).toBe(false);
    });

    it(`should display when input clicked`, async () => {
      const { inputDriver } = createDriver(<ColorInput />);
      (await inputDriver()).click();
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
});
