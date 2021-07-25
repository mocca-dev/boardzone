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
    <div className={style.container}>
      <span className={style.name}>{name}</span>
      <span className={style.points}>{points}</span>
      {youName && (
        <>
          <span className={style.youTagTriangle}></span>
          <span className={style.youTag}>YOU</span>
        </>
      )}
    </div>
  );
};
