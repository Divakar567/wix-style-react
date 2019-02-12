import React from 'react';
import Popover from '../../Popover';
import ColorPicker from '../../ColorPicker';
import styles from './ColorViewer.st.css';

export class ColorViewer extends React.Component {
  static defaultProps = {
    placement: 'bottom',
    appendTo: 'parent',
  };
  render() {
    const {
      value,
      clicked,
      onChange,
      onConfirm,
      onCancel,
      size,
      placement,
      appendTo,
      onClickOutside,
    } = this.props;
    return (
      <Popover
        showArrow
        fixed
        shown={clicked}
        placement={placement}
        appendTo={appendTo}
        onClickOutside={onClickOutside}
      >
        <Popover.Element>
          <div
            data-hook="colorinput-viewer"
            style={{ backgroundColor: value }}
            {...styles('root', {
              empty: value === '',
              size,
            })}
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
