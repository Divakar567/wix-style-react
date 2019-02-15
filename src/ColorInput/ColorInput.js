import React from 'react';
import { node, bool, string, func, oneOf } from 'prop-types';

import { polyfill } from 'react-lifecycles-compat';
import { placements } from '../Popover';
import Input from '../Input';
import { Hash, ColorViewer } from './components';

import { validateHex, extractHex } from './hex-helpers';

class ColorInput extends React.Component {
  static displayName = 'ColorInput';

  static propTypes = {
    /** placeholder to display */
    placeholder: node,
    /** when set to true this component is disabled */
    disabled: bool,
    /** sets error state */
    error: bool,
    /** error message which appears in tooltip */
    errorMessage: node,
    /** input size */
    size: oneOf(['small', 'medium', 'large']),
    /** colorpicker popover placement */
    popoverPlacement: oneOf([...placements]),
    /** colorpicker popover calculation to a dom element */
    popoverAppendTo: oneOf(['window', 'scrollParent', 'viewport', 'parent']),
    /** input value */
    value: string.isRequired,
    /** input onChange callback */
    onChange: func,
  };

  static defaultProps = {
    placeholder: 'Please choose a color',
    error: false,
    size: 'medium',
    popoverPlacement: 'bottom',
    popoverAppendTo: 'parent',
  };

  constructor(props) {
    super(props);
    this.state = {
      focused: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.value !== state.value) {
      return {
        ...state,
        value:
          props.value &&
          typeof props.value === 'string' &&
          props.value.toUpperCase(),
      };
    }
  }

  // Affixes
  _renderPrefix = () => {
    const { disabled, size } = this.props;
    const { focused, value } = this.state;
    return focused || value ? (
      <Hash disabled={disabled} size={this._sizeMapping(size)} />
    ) : (
      undefined
    );
  };

  _renderSuffix = () => {
    const { value, focused } = this.state;
    const { size, popoverPlacement, disabled } = this.props;
    return (
      <ColorViewer
        value={value}
        focused={focused}
        disabled={disabled}
        size={this._sizeMapping(size)}
        placement={popoverPlacement}
        onClick={this._onClick}
        onChange={this._onChange}
        onCancel={this._onCancel}
        onConfirm={this._onConfirm}
        onClickOutside={this._onConfirm}
      />
    );
  };

  // ColorInput methods
  _sizeMapping = size => (size === 'medium' ? 'normal' : size);

  _onChange = evt => {
    const value = extractHex(evt.target.value);
    this.setState({
      value: value === '' ? '' : `#${value}`,
    });
  };

  _onClick = () => {
    this.input.focus();
    this.setState({ focused: true });
  };

  _onFocus = () => this.setState({ focused: true });

  _onKeyDown = e => {
    e.key === 'Enter' && this._onConfirm();
    e.key === 'Escape' && this._onCancel();
  };

  _onConfirm = () => {
    const { onConfirm } = this.props;
    const value = validateHex(this.state.value);
    const callback = () => onConfirm && onConfirm(value);
    this.setState({ focused: false, value }, callback);
  };

  _onCancel = () => this.setState({ value: this.props.value, focused: false });

  render() {
    const { placeholder, errorMessage, size, ...rest } = this.props;
    const { focused, value } = this.state;
    const placeHolder = focused ? undefined : placeholder;
    return (
      <Input
        {...rest}
        ref={input => (this.input = input)}
        status={this.props.error ? 'error' : undefined}
        statusMessage={errorMessage}
        placeholder={placeHolder}
        size={this._sizeMapping(size)}
        onKeyDown={this._onKeyDown}
        onChange={this._onChange}
        onFocus={this._onFocus}
        onInputClicked={this._onClick}
        value={value.replace('#', '')}
        prefix={this._renderPrefix()}
        suffix={this._renderSuffix()}
      />
    );
  }
}

polyfill(ColorInput);

export default ColorInput;
