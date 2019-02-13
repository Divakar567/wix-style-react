import React from 'react';
import Color from 'color';
import { node, bool, string, func, oneOf } from 'prop-types';

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
      clicked: false,
      value:
        props.value &&
        typeof props.value === 'string' &&
        props.value.toUpperCase(),
    };
  }

  // Affixes
  _renderPrefix = () => {
    const { disabled, size } = this.props;
    const { clicked, value } = this.state;
    return clicked || value ? (
      <Hash disabled={disabled} size={this._sizeMapping(size)} />
    ) : (
      undefined
    );
  };

  _renderSuffix = () => {
    const { value, clicked } = this.state;
    const { size, popoverPlacement, disabled } = this.props;
    return (
      <ColorViewer
        value={value}
        clicked={clicked}
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
    this.setState({ clicked: true });
  };

  _onFocus = () => this.setState({ clicked: true });

  _onKeyDown = e => {
    e.key === 'Enter' && this._onConfirm();
    e.key === 'Escape' && this._onCancel();
  };

  _onConfirm = () => {
    const { onChange } = this.props;
    const value = validateHex(this.state.value);
    const callback = () => onChange && onChange(value);
    this.setState({ clicked: false, value }, callback);
  };

  _onCancel = () => this.setState({ value: this.props.value, clicked: false });

  render() {
    const { dataHook, disabled, placeholder, errorMessage, size } = this.props;
    const { clicked, value } = this.state;
    const placeHolder = clicked ? undefined : placeholder;
    return (
      <Input
        ref={input => (this.input = input)}
        status={this.props.error ? 'error' : undefined}
        statusMessage={errorMessage}
        placeholder={placeHolder}
        dataHook={dataHook}
        size={this._sizeMapping(size)}
        onKeyDown={this._onKeyDown}
        onChange={this._onChange}
        onFocus={this._onFocus}
        onInputClicked={this._onClick}
        disabled={disabled}
        value={value.replace('#', '')}
        prefix={this._renderPrefix()}
        suffix={this._renderSuffix()}
      />
    );
  }
}

export default ColorInput;
