import React, { FC } from 'react';
import style from './BoardRow.module.css';

interface IBoardRow {
  name?: string;
  points?: number;
  youName?: boolean;
  prevMatch: number;
  hasSecond: boolean;
}

export const BoardRow: FC<IBoardRow> = ({
  name = '--',
  points = '--',
  youName,
  prevMatch,
  hasSecond,
}) => {
  return (
    <div
      className={youName ? style.container + ' ' + style.you : style.container}
    >
      <span className={style.name}>{name}</span>
      {hasSecond && <span className={style.previousPoints}>{prevMatch}</span>}
      <span className={style.points}>{points}</span>
    </div>
  );
};
