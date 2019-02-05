import React from 'react';
import styles from './ColorInput.st.css';
import Input from '../Input';

class ColorInput extends React.PureComponent {
  static displayName = 'ColorInput';

  render() {
    const { dataHook } = this.props;
    return (
      <div className={styles} data-hook={dataHook}>
        <Input dataHook="colorinput-input" />
      </div>
    );
  }
}

export default ColorInput;
