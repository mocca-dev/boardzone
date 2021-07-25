import React, { FC } from 'react';
import { BoardRow } from './BoardRow/BoardRow';
import style from './Board.module.css';

interface IBoard {
  hasSecond: boolean;
  topData: { name: string; points: string; member1: string; member2: string };
  bottomData?: {
    name: string;
    points: string;
    member1: string;
    member2: string;
  };
  localName: string;
}
export const Board: FC<IBoard> = ({
  hasSecond,
  topData,
  bottomData,
  localName,
}) => {
  return (
    <div className={style.container}>
      <div className={style.rowsContainer}>
        <BoardRow
          name={topData.name}
          points={topData.points}
          youName={hasSecond && localName === topData.name}
        />
        {hasSecond && (
          <BoardRow name={bottomData?.name} points={bottomData?.points} />
        )}
      </div>
    </div>
  );
};
