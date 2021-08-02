import React, { FC } from 'react';
import style from './BoardHeader.module.css';

export const BoardHeader: FC = () => {
  return (
    <div className={style.container}>
      <h3 className={style.logo}>BZ</h3> BoardZone
    </div>
  );
};
