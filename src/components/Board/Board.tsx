import React, { FC } from 'react';
import { BoardRow } from './BoardRow/BoardRow';
import style from './Board.module.css';
import { ITeamsConfig } from 'features/desktop-window/DesktopWindow';

interface IBoard {
  hasSecond: boolean;
  teamsConfig: ITeamsConfig;
  localName: string;
}
export const Board: FC<IBoard> = ({ hasSecond, teamsConfig, localName }) => {
  return (
    <div className={style.container}>
      <div className={style.rowsContainer}>
        <BoardRow
          name={teamsConfig.topTeam.name}
          points={
            teamsConfig.topTeam.member1.kills +
            teamsConfig.topTeam.member2.kills
          }
          youName={hasSecond && localName === teamsConfig.topTeam.name}
        />
        {hasSecond && (
          <BoardRow
            name={teamsConfig.bottomTeam?.name}
            points={
              teamsConfig.bottomTeam.member1.kills +
              teamsConfig.bottomTeam.member2.kills
            }
          />
        )}
      </div>
    </div>
  );
};
