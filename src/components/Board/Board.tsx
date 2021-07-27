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
  const [difference, setDifference] = useState(0);

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

  useEffect(() => {
    hasSecond && setDifference(topTotal - bottomTotal);
  }, [topTotal, bottomTotal, hasSecond]);

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
      {hasSecond && (
        <span
          className={
            difference > 0
              ? style.difference + ' ' + style.high
              : style.difference + ' ' + style.low
          }
        >
          {Math.abs(difference)}
          <img
            className={
              difference > 0
                ? style.arrow + ' ' + style.high
                : style.arrow + ' ' + style.low
            }
            alt="arrow"
            src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjQ1MS44NDdweCIgaGVpZ2h0PSI0NTEuODQ3cHgiIHZpZXdCb3g9IjAgMCA0NTEuODQ3IDQ1MS44NDciIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ1MS44NDcgNDUxLjg0NzsiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPHBhdGggZD0iTTIyNS45MjMsMzU0LjcwNmMtOC4wOTgsMC0xNi4xOTUtMy4wOTItMjIuMzY5LTkuMjYzTDkuMjcsMTUxLjE1N2MtMTIuMzU5LTEyLjM1OS0xMi4zNTktMzIuMzk3LDAtNDQuNzUxDQoJCWMxMi4zNTQtMTIuMzU0LDMyLjM4OC0xMi4zNTQsNDQuNzQ4LDBsMTcxLjkwNSwxNzEuOTE1bDE3MS45MDYtMTcxLjkwOWMxMi4zNTktMTIuMzU0LDMyLjM5MS0xMi4zNTQsNDQuNzQ0LDANCgkJYzEyLjM2NSwxMi4zNTQsMTIuMzY1LDMyLjM5MiwwLDQ0Ljc1MUwyNDguMjkyLDM0NS40NDlDMjQyLjExNSwzNTEuNjIxLDIzNC4wMTgsMzU0LjcwNiwyMjUuOTIzLDM1NC43MDZ6Ii8+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8L3N2Zz4NCg=="
          />
        </span>
      )}
    </div>
  );
};
