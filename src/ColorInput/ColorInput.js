import React from 'react';
import { node, bool } from 'prop-types';
import Input from '../Input';
import styles from './ColorInput.st.css';

const Hash = () => <div className={styles.hash}>#</div>;
class ColorInput extends React.PureComponent {
  static displayName = 'ColorInput';

  static propTypes = {
    /** placeholder to display */
    placeholder: node,
    /** when set to true this component is disabled */
    disabled: bool,
  };

  static defaultProps = {
    placeholder: 'Please choose a color',
  };

  state = {
    value: '',
    clicked: false,
  };

  _onChange = evt => {
    const value = evt.target.value.replace(/[^0-9A-F]/gi, '');
    this.setState({ value });
  };

  _onClick = () => {
    this.setState({ clicked: true });
  };

  _onBlur = () => {
    this.setState({ clicked: false });
  };

  render() {
    const { dataHook, disabled, placeholder } = this.props;
    const { value, clicked } = this.state;
    const prefix = clicked || value ? <Hash /> : undefined;
    const placeHolder = !clicked ? placeholder : undefined;
    return (
      <div {...styles('root')} data-hook={dataHook}>
        <Input
          prefix={prefix}
          placeholder={placeHolder}
          dataHook="colorinput-input"
          onChange={this._onChange}
          onInputClicked={this._onClick}
          onFocus={this._onClick}
          onBlur={this._onBlur}
          disabled={disabled}
          value={value}
        />
      </div>
    );
  }
}

export default ColorInput;
