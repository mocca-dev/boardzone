import React, { FC, useEffect } from 'react';
import { RootReducer } from 'app/rootReducer';
import { useSelector } from 'react-redux';
import { Board } from 'components/Board/Board';

const InGameWindow: FC = () => {
  const { event, info } = useSelector((state: RootReducer) => state.background);

  useEffect(() => {
    console.info('event', event); // or use https://github.com/AlbericoD/overwolf-modern-react-boilerplate#-remote-redux-debug
  }, [event]);

  useEffect(() => {
    console.info('info', info); // or use https://github.com/AlbericoD/overwolf-modern-react-boilerplate#-remote-redux-debug
  }, [info]);

  return <Board />;
};

export default InGameWindow;
