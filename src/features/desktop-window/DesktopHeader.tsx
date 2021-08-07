import React, { FC, useState, useCallback, useEffect } from 'react';
import { WINDOW_NAMES } from 'app/constants';
import { useWindow, useDrag } from 'overwolf-hooks';
import { useTranslation } from 'react-i18next';
import { SVGComponent } from './DesktopHeaderSVG';
import style from './DesktopHeader.module.css';

interface Languaje {
  en: { nativeName: string };
  es: { nativeName: string };
}

const lngs: Languaje = {
  en: { nativeName: 'English' },
  es: { nativeName: 'Español' },
};
const { DESKTOP, BACKGROUND } = WINDOW_NAMES;

const langBtnClass = (style: any, lng: string, i18n: any): string => {
  let langClass: string = style.langBtn;
  lng === 'en' ? (langClass += ' ' + style.en) : (langClass += ' ' + style.es);
  if (i18n.language === lng) langClass += ' ' + style.langSelected;
  return langClass;
};

const toggleLang = (i18n: any, lng: string): void => {
  i18n.changeLanguage(lng);
  localStorage.setItem('lang', lng);
};

export const DesktopHeader: FC = () => {
  const { i18n } = useTranslation();
  const [maximized, setMaximize] = useState(false);
  const [desktopWindow] = useWindow(DESKTOP);
  const [backgroundWindow] = useWindow(BACKGROUND);
  const { onDragStart, onMouseMove, setCurrentWindowID } = useDrag(null);

  const toggleIcon = useCallback(() => {
    setMaximize((value) => {
      if (value) desktopWindow?.restore();
      else desktopWindow?.maximize();
      return !value;
    });
  }, [desktopWindow]);

  const updateDragWindow = useCallback(() => {
    if (desktopWindow?.id) setCurrentWindowID(desktopWindow.id);
  }, [desktopWindow, setCurrentWindowID]);

  useEffect(() => {
    updateDragWindow();
  }, [updateDragWindow]);

  useEffect(() => {
    const lang = localStorage.getItem('lang') || '';
    i18n.changeLanguage(lang);
  }, [i18n]);

  return (
    <>
      <SVGComponent />
      <header
        className={style.header}
        onMouseDown={(event) => onDragStart(event)}
        onMouseMove={(event) => onMouseMove(event)}
      >
        <h3 className={style['header-title']}>BZ</h3>{' '}
        <span>In Game board settings</span>
        <div className={style['window-controls-group']}>
          <div className={style.langContainer}>
            {Object.keys(lngs).map((lng) => (
              <button
                key={lng}
                className={langBtnClass(style, lng, i18n)}
                type="button"
                onClick={() => toggleLang(i18n, lng)}
              ></button>
            ))}
          </div>
          {/* <button
            className={`${style.icon} ${style['window-control']} ${style['window-control-social']} ${style.discord} `}
            onClick={() =>
              overwolf.utils.openUrlInDefaultBrowser('https://discord.gg/')
            }
          >
            <svg>
              <use xlinkHref="#window-control_discord" />
            </svg>
          </button>
          <button
            className={`${style.icon} ${style['window-control']}`}
            onClick={() => (window.location.href = 'overwolf://settings')}
          >
            <svg>
              <use xlinkHref="#window-control_settings" />
            </svg>
          </button>
          <button className={`${style.icon} ${style['window-control']}`}>
            <svg>
              <use xlinkHref="#window-control_support" />
            </svg>
          </button> */}
          <button
            className={`${style.icon} ${style['window-control']}`}
            onClick={() => desktopWindow?.minimize()}
          >
            <svg>
              <use xlinkHref="#window-control_minimize" />
            </svg>
          </button>
          <button
            className={`${style.icon} ${style['toggle-icons']} ${
              style['window-control']
            }
            ${maximized && style['toggled']}`}
            onClick={() => toggleIcon()}
          >
            <svg>
              <use xlinkHref="#window-control_maximize" />
            </svg>
            <svg>
              <use xlinkHref="#window-control_restore" />
            </svg>
          </button>
          <button
            className={`${style.icon} ${style['window-control']} ${style['window-control-close']}`}
            onClick={() => backgroundWindow?.close()}
          >
            <svg>
              <use xlinkHref="#window-control_close" />
            </svg>
          </button>
        </div>
      </header>
    </>
  );
};
