import React, { FC } from 'react';

import style from './Tip.module.css';

export const Tip: FC = ({ children }) => {
  return <div className={style.tipContainer}>{children}</div>;
};
