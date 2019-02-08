import React from 'react';
import styles from './Hash.st.css';

export const Hash = ({ disabled }) => (
  <div data-hook="colorinput-hash" {...styles('root', { disabled })}>
    #
  </div>
);
