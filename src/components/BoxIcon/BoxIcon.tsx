import React, { FC } from 'react';
import style from './BoxIcon.module.css';
import box from './box.png';

interface IBoxIcon {
  isYou: boolean;
}

export const BoxIcon: FC<IBoxIcon> = ({ isYou }) => {
  return (
    <img
      className={isYou ? style.box + ' ' + style.isYou : style.box}
      src={box}
      height="13px"
      alt="box"
    />
  );
};
