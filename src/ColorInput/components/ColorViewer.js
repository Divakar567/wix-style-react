import React from 'react';
import styles from './ColorViewer.st.css';

export const ColorViewer = ({ value }) => (
  <div
    data-hook="colorinput-viewer"
    style={{ backgroundColor: `#${value}` }}
    {...styles('root', { empty: value === '' })}
  />
);
