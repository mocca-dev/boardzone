import { BoxIcon } from 'components/BoxIcon/BoxIcon';
import { SkullIcon } from 'components/SkullIcon/SkullIcon';
import React, { FC } from 'react';
import style from './BoardCanRow.module.css';

interface IBoardCanRow {
  canBuyDeads: number;
  canBuyBox: boolean;
  currentDeads: number;
  totalCash: number;
}

export const BoardCanRow: FC<IBoardCanRow> = ({
  canBuyDeads,
  canBuyBox,
  currentDeads,
  totalCash,
}) => {
  return (
    <div className={style.container}>
      <span className={style.cell}>
        <BoxIcon isYou={canBuyBox} />
      </span>
      <span className={style.cell}>
        <span>
          {currentDeads}/{canBuyDeads}
        </span>
        <SkullIcon isYou={currentDeads >= 1} />
      </span>
      <span className={style.cell + ' ' + style.cash}>${totalCash}</span>
    </div>
  );
};
