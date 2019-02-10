import React from 'react';
import Popover from '../../Popover';
import ColorPicker from '../../ColorPicker';
import styles from './ColorViewer.st.css';

export class ColorViewer extends React.Component {
  render() {
    const { value, shown, onChange, onConfirm } = this.props;

    return (
      <Popover showArrow shown={shown} appendTo="parent" placement="bottom">
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
            onCancel={() => 'Cancelled'}
            onChange={onChange}
            onConfirm={onConfirm}
            value={value}
          />
        </Popover.Content>
      </Popover>
    );
  }
}
