import { useAppSelector } from 'app/hooks';
import React, { FC } from 'react';
import style from './Loader.module.css';
import puff from './puff.svg';

export const Loader: FC = () => {
  const { show, text } = useAppSelector((state) => state.loader);

  return (
    <>
      {show && (
        <div className={style.container}>
          <div className={style.content}>
            <img src={puff} alt="loader" />
            <span>{text}</span>
          </div>
        </div>
      )}
    </>
  );
};
