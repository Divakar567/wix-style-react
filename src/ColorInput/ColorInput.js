import React from 'react';
import { node, bool, string, func } from 'prop-types';

import Input from '../Input';
import { Hash, ColorViewer } from './components';

import { validateHex, normalizeValue } from './hexConverter';
import styles from './ColorInput.st.css';

class ColorInput extends React.PureComponent {
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
      value: normalizeValue(props.value),
      error: undefined,
    };
  }

  _renderPrefix = () => {
    const { disabled } = this.props;
    const { clicked, value } = this.state;
    return clicked || value ? <Hash disabled={disabled} /> : undefined;
  };

  _renderSuffix = () => <ColorViewer value={this.state.value} />;

  _onChange = evt => {
    const value = normalizeValue(evt.target.value);
    const error = value === '' ? 'error' : undefined;
    this.setState({ value, error });
  };

  _onClick = () => {
    this.setState({ clicked: true });
  };

  _onBlur = () => {
    const { onChange } = this.props;
    const value = validateHex(this.state.value);
    const error = value === '' ? 'error' : undefined;
    this.setState(
      { clicked: false, error, value },
      () => onChange && onChange(value),
    );
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
          value={value}
          prefix={this._renderPrefix()}
          suffix={this._renderSuffix()}
        />
      </div>
    );
  }
}

export default ColorInput;
