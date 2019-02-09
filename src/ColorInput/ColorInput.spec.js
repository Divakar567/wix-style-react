import React from 'react';
import { createUniDriverFactory } from 'wix-ui-test-utils/uni-driver-factory';

import ColorInput from './ColorInput';
import { colorInputPrivateDriverFactory } from './ColorInput.driver.private';

describe('ColorInput', () => {
  const renderColorInput = ({
    value = '',
    onChange = () => {},
    ...rest
  } = {}) => <ColorInput {...rest} value={value} onChange={onChange} />;

  const createDriver = createUniDriverFactory(colorInputPrivateDriverFactory);

  it('should render Input component', async () => {
    const { inputDriver } = createDriver(renderColorInput());
    expect((await inputDriver()).exists()).toBe(true);
  });

  describe('should be in controlled mode', () => {
    it('when value is passed', async () => {
      const value = 'value';
      const { inputDriver } = createDriver(renderColorInput({ value }));
      expect((await inputDriver()).getValue()).toBe('VALUE');
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

    it(`should be visible when value is given but input is blurred`, async () => {
      const { inputDriver } = createDriver(renderColorInput({ value: '#123' }));
      (await inputDriver()).click();
      (await inputDriver()).blur();
      expect((await inputDriver()).hasPrefix()).toBe(true);
    });

    it(`should be hidden when value is undefined and input is blurred`, async () => {
      const { inputDriver } = createDriver(renderColorInput());
      (await inputDriver()).click();
      (await inputDriver()).blur();
      expect((await inputDriver()).hasPrefix()).toBe(false);
    });
  });

  describe(`suffix Viewer`, () => {
    it(`should be null when value is empty string`, async () => {
      const driver = createDriver(renderColorInput());
      expect(await driver.isViewerNull()).toBe(true);
    });

    it(`should be null when value is empty string`, async () => {
      const driver = createDriver(renderColorInput());
      expect(await driver.isViewerNull()).toBe(true);
    });
  });

  describe('suffix ColorPicker', () => {
    it(`should be open when input is clicked`, async () => {
      const driver = createDriver(renderColorInput());
      (await driver.inputDriver()).click();
      expect((await driver.colorPickerDriver()).exists()).toBe(true);
    });
    it(`should close onBlur`, async () => {
      const driver = createDriver(renderColorInput());
      (await driver.inputDriver()).click();
      (await driver.inputDriver()).blur();
      expect((await driver.colorPickerDriver()).exists()).toBe(false);
    });

    it(`should call onChange when button confirm is clicked`, async () => {
      const onChange = jest.fn();
      const driver = createDriver(renderColorInput({ onChange }));
      (await driver.inputDriver()).click();
      (await driver.colorPickerDriver()).confirm();
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][0]).toBe('');
    });
  });

  describe(`error state`, () => {
    it(`should be set when value is empty and input is blurred`, async () => {
      const { inputDriver } = createDriver(renderColorInput());
      (await inputDriver()).click();
      (await inputDriver()).blur();
      expect((await inputDriver()).hasError()).toBe(true);
    });
    it(`should be set when value is deleted`, async () => {
      const text = 'hello';
      const { inputDriver } = createDriver(renderColorInput());
      (await inputDriver()).enterText(text);
      (await inputDriver()).enterText('');
      expect((await inputDriver()).hasError()).toBe(true);
    });
  });

  describe(`input value`, () => {
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

  describe('`onChange` prop', () => {
    [
      ['12', '#000000'],
      ['123', '#112233'],
      ['1234', '#000000'],
      ['12345', '#000000'],
      ['123456', '#123456'],
      ['1234$3A74', '#000000'],
      ['1234AB', '#1234AB'],
      ['%4EB7F', '#000000'],
    ].map(([expectation, output]) =>
      it(`given ${expectation} onChange should return ${output} when blurred`, async () => {
        const onChange = jest.fn();
        const { inputDriver } = createDriver(renderColorInput({ onChange }));
        (await inputDriver()).enterText(expectation);
        expect((await inputDriver()).getValue()).toBe(expectation);
        (await inputDriver()).blur();
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0]).toBe(output);
      }),
    );
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
