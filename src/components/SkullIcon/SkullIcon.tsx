import React, { FC } from 'react';
import style from './SkullIcon.module.css';
import skull from './../skull.png';

interface ISkullIcon {
  isYou: boolean;
}

export const SkullIcon: FC<ISkullIcon> = ({ isYou }) => {
  return (
    <img
      className={isYou ? style.skull + ' ' + style.isYou : style.skull}
      src={skull}
      height="13px"
      alt="skull"
    />
  );
};
