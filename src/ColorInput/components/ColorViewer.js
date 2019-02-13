import React from 'react';
import Color from 'color';

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
      disabled,
      clicked,
      onClick,
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
        dataHook="colorinput-popover"
        shown={clicked}
        placement={placement}
        appendTo={appendTo}
        onClickOutside={onClickOutside}
      >
        <Popover.Element>
          <div
            data-hook="colorinput-viewer"
            onClick={disabled ? undefined : onClick}
            style={{ backgroundColor: value }}
            {...styles('root', { size })}
          >
            {value === '' && (
              <div data-hook="colorinput-viewer-line" {...styles('line')} />
            )}
          </div>
        </Popover.Element>
        <Popover.Content>
          <ColorPicker
            dataHook="colorinput-colorpicker"
            showConverter={false}
            showInput={false}
            onCancel={onCancel}
            onChange={hsl => onChange({ target: { value: Color(hsl).hex() } })}
            onConfirm={onConfirm}
            value={value}
          />
        </Popover.Content>
      </Popover>
    );
  }
}
