import React, { FC, useEffect, useState } from 'react';
import { SubTitle } from 'components/SubTitle';
import { RootReducer } from 'app/rootReducer';
import { useSelector } from 'react-redux';
import { Board } from 'components/Board/Board';

const InGameWindow: FC = () => {
  const { event, info } = useSelector((state: RootReducer) => state.background);
  const [teamsConfig, setTeamsConfig] = useState<any>({
    topTeam: {
      name: 'TopTeam',
      member1: { name: '', kills: 0 },
      member2: { name: '', kills: 0 },
      previousMatchPoints: 0,
    },
    bottomTeam: {
      name: 'BottomTeam',
      member1: { name: 'Selecciona a tu compañero', kills: 0 },
      member2: { name: 'Selecciona a tu compañero', kills: 0 },
      previousMatchPoints: 0,
    },
  });

  useEffect(() => {
    console.info('event', event); // or use https://github.com/AlbericoD/overwolf-modern-react-boilerplate#-remote-redux-debug
  }, [event]);

  useEffect(() => {
    console.info('info', info); // or use https://github.com/AlbericoD/overwolf-modern-react-boilerplate#-remote-redux-debug
  }, [info]);

  return (
    <Board
      localName={'Toneko'}
      hasSecond={false}
      teamsConfig={teamsConfig}
      showDifference={false}
      showPrevPoints={false}
      mode={false}
      teamType={1}
    />
  );
};

export default InGameWindow;
