import React, { FC, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { WINDOW_NAMES } from 'app/constants';
import { setEvent, setInfo } from './background-slice';
import { useWindow, useRunningGame } from 'overwolf-hooks';
import { useGameEventProvider } from 'hooks/useGameEventProvider';

const { DESKTOP, INGAME } = WINDOW_NAMES;

enum Game {
  'GameExample' = 21626,
}
// const gameFeatures = ['kill', 'match'];

const BackgroundWindow: FC = () => {
  const [currentGame] = useRunningGame();
  const [desktopWindow] = useWindow(DESKTOP);
  const [ingameWindow] = useWindow(INGAME);
  const [{ event, info }] = useGameEventProvider<
    GameExample.Info,
    GameExample.Event
  >();
  const dispatch = useDispatch();

  const openStartupWindow = useCallback(() => {
    const gameRunning =
      currentGame?.id === Game.GameExample && currentGame?.gameRunning;
    const currentWindow = gameRunning ? ingameWindow : desktopWindow;
    // gameRunning && setGameFeatures(gameFeatures);
    currentWindow?.restore();
  }, [desktopWindow, ingameWindow, currentGame]);

  useEffect(() => {
    // console.log('EVENT', event);
    event && dispatch(setEvent({ event }));
  }, [event, dispatch]);
  useEffect(() => {
    // console.log('INFO', info);
    info && dispatch(setInfo({ info }));
  }, [info, dispatch]);
  useEffect(() => {
    openStartupWindow();
  }, [openStartupWindow]);

  return <></>;
};

export default BackgroundWindow;
