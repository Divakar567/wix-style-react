import React from 'react';
import Popover from '../../Popover';
import ColorPicker from '../../ColorPicker';
import styles from './ColorViewer.st.css';

export class ColorViewer extends React.Component {
  render() {
    const { value, clicked, onChange, onConfirm, onCancel } = this.props;
    return (
      <Popover
        showArrow
        fixed
        shown={clicked}
        placement="bottom"
        appendTo="parent"
      >
        <Popover.Element>
          <div
            data-hook="colorinput-viewer"
            style={{ backgroundColor: value }}
            {...styles('root', { empty: value === '' })}
          />
        </Popover.Element>
        <Popover.Content>
          <ColorPicker
            dataHook="colorinput-colorpicker"
            showConverter={false}
            showInput={false}
            onCancel={onCancel}
            onChange={onChange}
            onConfirm={onConfirm}
            value={value}
          />
        </Popover.Content>
      </Popover>
    );
  }
}
