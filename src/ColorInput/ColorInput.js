import React from 'react';
import styles from './ColorInput.st.css';
import Input from '../Input';

class ColorInput extends React.PureComponent {
  static displayName = 'ColorInput';

  state = {
    value: '',
  };

  _onInputClicked = evt => {
    this.setState({ value: '#' });
  };

  render() {
    const { dataHook, disabled } = this.props;
    const { value } = this.state;
    return (
      <div className={styles} data-hook={dataHook}>
        <Input
          dataHook="colorinput-input"
          onInputClicked={this._onInputClicked}
          disabled={disabled}
          value={value}
        />
      </div>
    );
  }
}

export default ColorInput;
