import React from 'react';
import { createUniDriverFactory } from 'wix-ui-test-utils/uni-driver-factory';

import ColorInput from './ColorInput';
import { colorInputPrivateDriverFactory } from './ColorInput.driver.private';
import { requestAnimationFramePolyfill } from '../../testkit/polyfills';

describe('ColorInput', () => {
  beforeAll(() => {
    requestAnimationFramePolyfill.install();
  });

  const renderColorInput = ({
    value = '',
    onChange = () => {},
    ...rest
  } = {}) => <ColorInput {...rest} value={value} onChange={onChange} />;

  const createDriver = createUniDriverFactory(colorInputPrivateDriverFactory);

  describe('Input ', () => {
    it('should render Input component', async () => {
      const { inputDriver } = createDriver(renderColorInput());
      expect((await inputDriver()).exists()).toBe(true);
    });
    it('should be in controlled mode when value is passed', async () => {
      const value = 'value';
      const { inputDriver } = createDriver(renderColorInput({ value }));
      expect((await inputDriver()).getValue()).toBe('VALUE');
    });
    it('keyboard key Enter should fire confirm event', async () => {
      const { inputDriver } = createDriver(renderColorInput());
      (await inputDriver()).enterText('aze');
      (await inputDriver()).keyDown('Enter');
      expect((await inputDriver()).getValue()).toBe('');
    });
    it(`should open ColorPicker when clicked`, async () => {
      const driver = createDriver(renderColorInput());
      (await driver.inputDriver()).click();
      expect((await driver.colorPickerDriver()).exists()).toBe(true);
    });
    it(`should close ColorPicker when confirmed with Enter`, async () => {
      const driver = createDriver(renderColorInput());
      (await driver.inputDriver()).click();
      (await driver.inputDriver()).keyDown('Enter');
      expect((await driver.colorPickerDriver()).exists()).toBe(false);
    });
    it(`error state should be set when given`, async () => {
      const { inputDriver } = createDriver(renderColorInput({ error: true }));
      (await inputDriver()).click();
      (await inputDriver()).blur();
      expect((await inputDriver()).hasError()).toBe(true);
    });
    describe(`value`, () => {
      it(`should convert letters to uppercase while typed`, async () => {
        const { inputDriver } = createDriver(renderColorInput());
        (await inputDriver()).enterText('abc');
        expect((await inputDriver()).getValue()).toBe('ABC');
      });
      it(`should strip # from pasted value`, async () => {
        const { inputDriver } = createDriver(renderColorInput());
        (await inputDriver()).enterText('#abc');
        expect((await inputDriver()).getValue()).toBe('ABC');
      });
    });

    it(`'size' by default should be medium`, async () => {
      const { inputDriver } = createDriver(renderColorInput());
      expect((await inputDriver()).isOfSize('normal')).toBe(true);
    });
    describe('`onChange` prop', () => {
      [
        ['12', ''],
        ['123', '#112233'],
        ['1234', ''],
        ['12345', ''],
        ['123456', '#123456'],
        ['1234$3A74', ''],
        ['1234AB', '#1234AB'],
        ['%4EB7F', ''],
      ].map(([expectation, output]) =>
        it(`given ${expectation} onChange should return ${output} when confirmed with key`, async () => {
          const onChange = jest.fn();
          const { inputDriver } = createDriver(renderColorInput({ onChange }));
          (await inputDriver()).enterText(expectation);
          expect((await inputDriver()).getValue()).toBe(expectation);
          (await inputDriver()).keyDown('Enter');
          expect(onChange).toHaveBeenCalledTimes(1);
          expect(onChange.mock.calls[0][0]).toBe(output);
        }),
      );
    });
  });

  describe(`prefix '#'`, () => {
    it(`should be hidden by default`, async () => {
      const { inputDriver } = createDriver(renderColorInput());
      expect((await inputDriver()).hasPrefix()).toBe(false);
    });

    it(`should be visible when input is clicked`, async () => {
      const { inputDriver } = createDriver(renderColorInput());
      (await inputDriver()).click();
      expect((await inputDriver()).hasPrefix()).toBe(true);
    });

    it(`should be visible when input is focused`, async () => {
      const { inputDriver } = createDriver(renderColorInput());
      (await inputDriver()).focus();
      expect((await inputDriver()).hasPrefix()).toBe(true);
    });

    it(`should be visible when value is given but input is confirmed with Enter`, async () => {
      const { inputDriver } = createDriver(renderColorInput({ value: '#123' }));
      (await inputDriver()).click();
      (await inputDriver()).keyDown('Enter');
      expect((await inputDriver()).hasPrefix()).toBe(true);
    });

    it(`should be hidden when value is empty and input is confirmed with Enter`, async () => {
      const { inputDriver } = createDriver(renderColorInput());
      (await inputDriver()).click();
      (await inputDriver()).keyDown('Enter');
      expect((await inputDriver()).hasPrefix()).toBe(false);
    });
  });

  describe('suffix ColorViewer', () => {
    it(`should be null state when value is empty string`, async () => {
      const driver = createDriver(renderColorInput());
      expect(await driver.isViewerNull()).toBe(true);
    });

    it(`should set size as given`, async () => {
      const driver = createDriver(renderColorInput({ size: 'small' }));
      expect(await driver.getViewerSize()).toBe('small');
    });

    it(`should call onChange when button confirm is clicked`, async () => {
      const onChange = jest.fn();
      const driver = createDriver(renderColorInput({ onChange }));
      (await driver.inputDriver()).click();
      (await driver.colorPickerDriver()).confirm();
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][0]).toBe('');
    });

    it(`should set previous confirmed value when button cancel is pressed`, async () => {
      const value = '#123456';
      const driver = createDriver(renderColorInput({ value }));
      (await driver.inputDriver()).click();
      (await driver.inputDriver()).enterText('1234');
      expect((await driver.inputDriver()).getValue()).toBe('1234');
      (await driver.colorPickerDriver()).cancel();
      expect((await driver.inputDriver()).getValue()).toBe(
        value.replace('#', ''),
      );
    });
  });

  describe('`disabled` prop', () => {
    it('should disable input', async () => {
      const disabled = true;
      const { inputDriver } = createDriver(renderColorInput({ disabled }));
      expect((await inputDriver()).isDisabled()).toBe(true);
    });

    it('should disable hash', async () => {
      const value = '#ffffff';
      const disabled = true;
      const driver = createDriver(renderColorInput({ disabled, value }));
      expect(await driver.isHashDisabled()).toBe(true);
    });
  });

  describe(`'placeholder' prop`, () => {
    const defaultPlaceholder = 'Please choose a color';

    it(`by default should be defined`, async () => {
      const { inputDriver } = createDriver(renderColorInput());
      expect((await inputDriver()).getPlaceholder()).toBe(defaultPlaceholder);
    });

    it(`should be equal to given`, async () => {
      const placeholder = 'Please choose';
      const { inputDriver } = createDriver(renderColorInput({ placeholder }));
      expect((await inputDriver()).getPlaceholder()).toBe(placeholder);
    });

    it(`should be hidden when input is clicked`, async () => {
      const { inputDriver } = createDriver(renderColorInput());
      (await inputDriver()).click();
      expect((await inputDriver()).getPlaceholder()).toBe('');
    });
  });
});
