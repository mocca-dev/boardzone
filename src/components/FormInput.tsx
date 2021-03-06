import { IRoster } from 'features/desktop-window/DesktopWindow';
import React, { FC, useEffect, useState } from 'react';
import style from './FormInput.module.css';
import { SkullIcon } from './SkullIcon/SkullIcon';
interface IFormInput {
  label?: string;
  type: string;
  value: any;
  isYou?: boolean;
  options?: IRoster[];
  afterIconText?: string;
  disabled?: boolean;
  small?: boolean;
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
  disabled,
  small,
}) => {
  const [mappedOptions, setMappedOptions] = useState<IRoster[] | undefined>([]);
  const [radioLables, setRadioLabels] = useState<string[]>([]);

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
      {type !== 'checkbox' && type !== 'radio' && (
        <div
          className={
            isYou
              ? style.inputLabel + ' .input-label ' + style.isYou
              : style.inputLabel + ' .input-label'
          }
        >
          {label && afterIconText ? (
            <span className={style.labelWithIcon}>
              <span>{label} </span>
              <span className={style.labelKills}>
                <SkullIcon isYou={!!isYou} />
                {afterIconText}
              </span>
            </span>
          ) : (
            label
          )}
        </div>
      )}
      {type === 'text' && (
        <input
          type="text"
          className={small ? style.small : ''}
          value={value}
          placeholder="No second team"
          onChange={onChange}
          disabled={isYou || disabled}
          maxLength={23}
        />
      )}
      {type === 'select' && (
        <select value={value} onChange={onChange}>
          <option defaultValue="true">Selecciona un compa??ero...</option>
          {mappedOptions?.map((option) => (
            <option key={option.player} value={option.player}>
              {option.player}
            </option>
          ))}
        </select>
      )}
      {type === 'checkbox' && (
        <label className={style.container}>
          <input
            type="checkbox"
            id={label}
            name={label}
            checked={value}
            onChange={onChange}
          />
          <span className={style.checkmark}></span>
          <span className={style.checkboxLabel}>{label}</span>
        </label>
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
                defaultChecked={radioLables[0] === radio}
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
