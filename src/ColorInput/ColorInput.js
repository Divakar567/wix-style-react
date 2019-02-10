import React from 'react';
import Color from 'color';
import { node, bool, string, func } from 'prop-types';

import Input from '../Input';
import { Hash, ColorViewer } from './components';

import { validateHex } from './hex-helpers';
import styles from './ColorInput.st.css';

class ColorInput extends React.Component {
  static displayName = 'ColorInput';

  static propTypes = {
    /** placeholder to display */
    placeholder: node,
    /** when set to true this component is disabled */
    disabled: bool,
    /** error message which appears in tooltip */
    errorMessage: node,
    /** input value */
    value: string.isRequired,
    /** input onChange callback */
    onChange: func.isRequired,
  };

  static defaultProps = {
    placeholder: 'Please choose a color',
  };

  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
      value: props.value.toUpperCase(),
      error: undefined,
    };
  }

  // ColorPicker methods
  _onPickerChange = value =>
    this.setState({
      value: Color(value).hex(),
    });

  _onPickerCancel = () => this.setState({ value: this.props.value });

  // Affixes
  _renderPrefix = () => {
    const { disabled } = this.props;
    const { clicked, value } = this.state;
    return clicked || value ? <Hash disabled={disabled} /> : undefined;
  };

  _renderSuffix = () => {
    const { value, clicked } = this.state;
    return (
      <ColorViewer
        value={value}
        clicked={clicked}
        onChange={this._onPickerChange}
        onCancel={this._onPickerCancel}
        onConfirm={this._onBlur}
      />
    );
  };

  // ColorInput methods
  _isError = value => {
    return value === '' ? 'error' : undefined;
  };

  _onChange = evt => {
    const value = evt.target.value.toUpperCase().replace('#', '');
    this.setState({
      value: value === '' ? '' : `#${value}`,
      error: this._isError(value),
    });
  };

  _onClick = () => {
    this.setState({ clicked: true });
  };

  _onBlur = () => {
    const { onChange } = this.props;
    const value = validateHex(this.state.value);
    const error = this._isError(value);
    const callback = () => onChange && onChange(value);
    this.setState({ clicked: false, error, value }, callback);
  };

  render() {
    const { dataHook, disabled, placeholder, errorMessage } = this.props;
    const { clicked, error, value } = this.state;
    const placeHolder = clicked ? undefined : placeholder;
    return (
      <div {...styles('root')} data-hook={dataHook}>
        <Input
          status={error}
          statusMessage={errorMessage}
          placeholder={placeHolder}
          dataHook="colorinput-input"
          onChange={this._onChange}
          onInputClicked={this._onClick}
          onFocus={this._onClick}
          onBlur={this._onBlur}
          disabled={disabled}
          value={value.replace('#', '')}
          prefix={this._renderPrefix()}
          suffix={this._renderSuffix()}
        />
      </div>
    );
  }
}

export default ColorInput;
