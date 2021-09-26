import React, { FC, useCallback, useEffect, useState } from 'react';
import { BoardRow } from './BoardRow/BoardRow';
import style from './Board.module.css';
import { BoardHeader } from './BoardHeader/BoardHeader';
import { useAppSelector } from 'app/hooks';
import { BoardCanRow } from './BoardCanRow/BoardCanRow';

import { WINDOW_NAMES } from 'app/constants';
import { useWindow, useDrag } from 'overwolf-hooks';
import { useTotals } from 'hooks/useTotals';

const { INGAME } = WINDOW_NAMES;

export const Board: FC = () => {
  const { mode, showPrevPoints, showDifference, teamType, showMoney } =
    useAppSelector((state) => state.settings);
  const [difference, setDifference] = useState(0);
  const [currentDeads, setCurrentDeads] = useState(0);
  const [canBuyDeads, setCanBuyDeads] = useState(0);
  const [totalCash, setTotalCash] = useState(0);
  const [canBuyBox, setCanBuyBox] = useState(false);
  const [hasSecond, setHasSecond] = useState(false);
  const { teamsConfig } = useAppSelector((state) => state.board);
  const [desktopWindow] = useWindow(INGAME);
  const { onDragStart, onMouseMove, setCurrentWindowID } = useDrag(null);
  const updateDragWindow = useCallback(() => {
    if (desktopWindow?.id) setCurrentWindowID(desktopWindow.id);
  }, [desktopWindow, setCurrentWindowID]);
  const { topTotal, bottomTotal } = useTotals({
    teamsConfig,
    teamType,
    mode,
  });

  useEffect(() => {
    updateDragWindow();
  }, [updateDragWindow]);

  useEffect(() => {
    hasSecond &&
      setDifference(
        topTotal +
          teamsConfig.topTeam.previousMatchPoints -
          (bottomTotal + teamsConfig.bottomTeam.previousMatchPoints)
      );
  }, [topTotal, bottomTotal, hasSecond, teamsConfig]);

  useEffect(() => {
    setHasSecond(mode && teamType === 4);
  }, [mode, teamType]);

  useEffect(() => {
    const { topTeam, bottomTeam } = teamsConfig;
    const newDeads = [
      !topTeam.member1.armor,
      !topTeam.member2.armor,
      !bottomTeam.member1.armor,
      !bottomTeam.member2.armor,
    ];
    let totalCash = topTeam.member1.cash + topTeam.member2.cash;

    if (!hasSecond && teamType > 2) {
      if (teamType === 3) {
        totalCash += bottomTeam.member1.cash;
      } else {
        totalCash += bottomTeam.member1.cash + bottomTeam.member2.cash;
      }
    }
    const howManyDeadsCanBuy = Math.floor(totalCash / 4000);

    setCanBuyDeads(
      howManyDeadsCanBuy > currentDeads ? currentDeads : howManyDeadsCanBuy
    );
    setCurrentDeads(newDeads.filter((dead) => dead).length);
    setCanBuyBox(Math.floor(totalCash / 10000) >= 1);
    setTotalCash(totalCash);
  }, [teamsConfig, currentDeads, hasSecond, teamType]);

  return (
    <div
      className={style.container}
      onMouseDown={(event) => onDragStart(event)}
      onMouseMove={(event) => onMouseMove(event)}
    >
      <BoardHeader />
      <div className={style.bodyContainer}>
        <div className={style.rowsContainer}>
          <BoardRow
            name={teamsConfig.topTeam.name}
            points={topTotal}
            prevMatch={
              showPrevPoints ? teamsConfig.topTeam.previousMatchPoints : -1
            }
            youName={hasSecond}
            hasSecond={hasSecond}
          />
          {hasSecond && (
            <BoardRow
              name={teamsConfig.bottomTeam?.name}
              points={bottomTotal}
              prevMatch={
                showPrevPoints ? teamsConfig.bottomTeam.previousMatchPoints : -1
              }
              hasSecond={true}
            />
          )}
        </div>
        {hasSecond && showDifference && (
          <span
            className={
              difference === 0
                ? style.difference + ' ' + style.mid
                : difference > 0
                ? style.difference + ' ' + style.high
                : style.difference + ' ' + style.low
            }
          >
            {Math.abs(difference)}
            {difference !== 0 && (
              <img
                className={
                  difference > 0
                    ? style.arrow + ' ' + style.high
                    : style.arrow + ' ' + style.low
                }
                alt="arrow"
                src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjQ1MS44NDdweCIgaGVpZ2h0PSI0NTEuODQ3cHgiIHZpZXdCb3g9IjAgMCA0NTEuODQ3IDQ1MS44NDciIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ1MS44NDcgNDUxLjg0NzsiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPHBhdGggZD0iTTIyNS45MjMsMzU0LjcwNmMtOC4wOTgsMC0xNi4xOTUtMy4wOTItMjIuMzY5LTkuMjYzTDkuMjcsMTUxLjE1N2MtMTIuMzU5LTEyLjM1OS0xMi4zNTktMzIuMzk3LDAtNDQuNzUxDQoJCWMxMi4zNTQtMTIuMzU0LDMyLjM4OC0xMi4zNTQsNDQuNzQ4LDBsMTcxLjkwNSwxNzEuOTE1bDE3MS45MDYtMTcxLjkwOWMxMi4zNTktMTIuMzU0LDMyLjM5MS0xMi4zNTQsNDQuNzQ0LDANCgkJYzEyLjM2NSwxMi4zNTQsMTIuMzY1LDMyLjM5MiwwLDQ0Ljc1MUwyNDguMjkyLDM0NS40NDlDMjQyLjExNSwzNTEuNjIxLDIzNC4wMTgsMzU0LjcwNiwyMjUuOTIzLDM1NC43MDZ6Ii8+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8L3N2Zz4NCg=="
              />
            )}
          </span>
        )}
      </div>
      {showMoney && (
        <div className={style.footerContainer}>
          <BoardCanRow
            canBuyBox={canBuyBox}
            canBuyDeads={canBuyDeads}
            currentDeads={currentDeads}
            totalCash={totalCash}
          />
        </div>
      )}
    </div>
  );
};
