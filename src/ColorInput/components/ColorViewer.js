import React from 'react';
import Popover from '../../Popover';
import ColorPicker from '../../ColorPicker';
import styles from './ColorViewer.st.css';

export class ColorViewer extends React.Component {
  render() {
    const { value, shown } = this.props;

    return (
      <Popover showArrow shown={shown} appendTo="parent" placement="bottom">
        <Popover.Element>
          <div
            data-hook="colorinput-viewer"
            style={{ backgroundColor: `#${value}` }}
            {...styles('root', { empty: value === '' })}
          />
        </Popover.Element>
        <Popover.Content>
          <ColorPicker
            showConverter={false}
            showInput={false}
            onCancel={() => 'Cancelled'}
            onChange={ev => ''}
            onConfirm={() => 'Confirmed'}
            value={`#${value}`}
          />
        </Popover.Content>
      </Popover>
    );
  }
}
