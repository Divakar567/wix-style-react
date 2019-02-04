import React from 'react';
import styles from './ColorInput.st.css';

class ColorInput extends React.PureComponent {
  static displayName = 'ColorInput';

  render() {
    const { dataHook } = this.props;
    return <div className={styles} data-hook={dataHook} />;
  }
}

export default ColorInput;
