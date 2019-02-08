import React from 'react';
import { node, bool } from 'prop-types';

import { validateHex } from './validateHex';
import Input from '../Input';
import styles from './ColorInput.st.css';

const Hash = ({ disabled }) => <div {...styles('hash', { disabled })}>#</div>;
const ColorViewer = ({ value }) => (
  <div style={{ backgroundColor: `#${value}` }} {...styles('viewer')} />
);
class ColorInput extends React.PureComponent {
  static displayName = 'ColorInput';

  static propTypes = {
    /** placeholder to display */
    placeholder: node,
    /** when set to true this component is disabled */
    disabled: bool,
    /** error message which appears in tooltip */
    errorMessage: node,
  };

  static defaultProps = {
    placeholder: 'Please choose a color',
  };

  state = {
    value: '',
    clicked: false,
    error: undefined,
  };

  _onChange = evt => {
    const value = evt.target.value;
    const error = value === '' ? 'error' : undefined;
    this.setState({ value, error });
  };

  _onClick = () => {
    this.setState({ clicked: true });
  };

  _onBlur = () => {
    const { value } = this.state;
    const hex = validateHex(value);
    const error = value === '' ? 'error' : undefined;
    this.setState({ clicked: false, error, value: hex });
  };

  render() {
    const { dataHook, disabled, placeholder, errorMessage } = this.props;
    const { value, clicked, error } = this.state;
    const prefix = clicked || value ? <Hash disabled={disabled} /> : undefined;
    const placeHolder = !clicked ? placeholder : undefined;
    const viewer = <ColorViewer value={value} />;
    return (
      <div {...styles('root')} data-hook={dataHook}>
        <Input
          status={error}
          statusMessage={errorMessage}
          prefix={prefix}
          placeholder={placeHolder}
          dataHook="colorinput-input"
          onChange={this._onChange}
          onInputClicked={this._onClick}
          onFocus={this._onClick}
          onBlur={this._onBlur}
          disabled={disabled}
          value={value}
          suffix={viewer}
        />
      </div>
    );
  }
}

export default ColorInput;
