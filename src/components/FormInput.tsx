import { IRoster } from 'features/desktop-window/DesktopWindow';
import React, { FC, useEffect, useState } from 'react';
import style from './FormInput.module.css';
import skull from './skull.png';
interface IFormInput {
  label?: string;
  type: string;
  value: any;
  isYou?: boolean;
  options?: IRoster[];
  afterIconText?: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export const FormInput: FC<IFormInput> = ({
  label,
  type,
  value,
  onChange,
  isYou,
  options,
  afterIconText,
}) => {
  const [radioLables, setRadioLabels] = useState<string[]>([]);
  const [mappedOptions, setMappedOptions] = useState<IRoster[] | undefined>([]);

  useEffect(() => {
    if (type === 'radio' && label) {
      setRadioLabels(label.split('-'));
    }
  }, [label, type]);

  useEffect(() => {
    setMappedOptions(
      options?.map((option) => ({
        ...option,
        player: option.player.split('#')[0],
      }))
    );
  }, [options]);

  return (
    <label className={style.inputContainer}>
      {type !== 'radio' && (
        <div
          className={
            isYou ? style.inputLabel + ' ' + style.isYou : style.inputLabel
          }
        >
          {label && afterIconText ? (
            <span className={style.labelWithIcon}>
              <span>{label} </span>
              <span className={style.labelKills}>
                <img src={skull} height="15px" alt="skull" />
                {afterIconText}
              </span>
            </span>
          ) : (
            label
          )}
        </div>
      )}
      {type === 'text' && (
        <input type="text" value={value} onChange={onChange} disabled={isYou} />
      )}
      {type === 'select' && (
        <select value={value} onChange={onChange}>
          <option defaultValue="true">Selecciona un jugador...</option>
          {mappedOptions?.map((option) => (
            <option key={option.player} value={option.player}>
              {option.player}
            </option>
          ))}
        </select>
      )}
      {type === 'radio' && (
        <ul>
          {radioLables.map((radio) => (
            <li key={radio}>
              <input
                type="radio"
                id={radio}
                name={label}
                value={radio}
                onChange={onChange}
                defaultChecked={radioLables[1] === radio}
              />
              <label htmlFor={radio}>{radio}</label>
              <div className="check"></div>
            </li>
          ))}
        </ul>
      )}
    </label>
  );
};
