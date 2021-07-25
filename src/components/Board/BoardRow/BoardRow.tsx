import React, { FC } from 'react';
import style from './BoardRow.module.css';

interface IBoardRow {
  name?: string;
  points?: number;
  youName?: boolean;
}

export const BoardRow: FC<IBoardRow> = ({
  name = '--',
  points = '--',
  youName,
}) => {
  return (
    <div
      className={youName ? style.container + ' ' + style.you : style.container}
    >
      <span className={style.name}>{name}</span>
      <span className={style.points}>{points}</span>
    </div>
  );
};
