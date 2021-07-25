import React, { FC, useEffect, useState } from 'react';
import { BoardRow } from './BoardRow/BoardRow';
import style from './Board.module.css';
import { ITeamsConfig } from 'features/desktop-window/DesktopWindow';

interface IBoard {
  hasSecond: boolean;
  teamsConfig: ITeamsConfig;
  localName: string;
}

export const Board: FC<IBoard> = ({ hasSecond, teamsConfig, localName }) => {
  const [topTotal, setTopTotal] = useState(0);
  const [bottomTotal, setBottomTotal] = useState(0);

  useEffect(() => {
    if (hasSecond) {
      setTopTotal(
        teamsConfig.topTeam.member1.kills + teamsConfig.topTeam.member2.kills
      );
      setBottomTotal(
        teamsConfig.bottomTeam.member1.kills +
          teamsConfig.bottomTeam.member2.kills
      );
    } else {
      setTopTotal(
        teamsConfig.topTeam.member1.kills +
          teamsConfig.topTeam.member2.kills +
          teamsConfig.bottomTeam.member1.kills +
          teamsConfig.bottomTeam.member2.kills
      );
    }
  }, [hasSecond, teamsConfig]);

  return (
    <div className={style.container}>
      <div className={style.rowsContainer}>
        <BoardRow
          name={teamsConfig.topTeam.name}
          points={topTotal}
          youName={hasSecond && localName === teamsConfig.topTeam.member1.name}
        />
        {hasSecond && (
          <BoardRow name={teamsConfig.bottomTeam?.name} points={bottomTotal} />
        )}
      </div>
    </div>
  );
};
