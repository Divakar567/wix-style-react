import React from 'react';
import styles from './ColorViewer.st.css';

export const ColorViewer = ({ value }) => (
  <div
    style={{ backgroundColor: `#${value}` }}
    {...styles('root', { empty: value === ' ' })}
  />
);
