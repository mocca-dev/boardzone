import React, { FC, useEffect, useState } from 'react';
import { DesktopHeader } from './DesktopHeader';
import style from './DesktopWindow.module.css';
import { useTranslation } from 'react-i18next';
import { SubTitle } from 'components/SubTitle';
import { FormInput } from 'components/FormInput';
import { Board } from 'components/Board/Board';
import switchBtn from './switch-btn.png';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { setShow, setText } from './loader-slice';
import {
  resetTeamsConfig,
  setTeamsConfig,
} from 'features/background-window/board-slice';
// import { Loader } from 'components/Loader/Loader';
import {
  setMode,
  setShowDifference,
  setShowPrevPoints,
  setTeamType,
} from './settings-slice';
import { RootReducer } from 'app/rootReducer';
import { useSelector } from 'react-redux';
import { useTotals } from 'hooks/useTotals';
// import { Tip } from 'components/Tip/Tip';

export interface IRoster {
  assists: any;
  deaths: any;
  is_bot: any;
  is_local: any;
  kills: any;
  ping: any;
  player: any;
  rank: any;
  score: any;
  team_id: any;
  armor: any;
  cash: any;
}
interface ITeamMemberConfig {
  name: string;
  kills: number;
  armor: number;
  cash: number;
}

interface ITeamConfig {
  name: string;
  member1: ITeamMemberConfig;
  member2: ITeamMemberConfig;
  previousMatchPoints: number;
}
export interface ITeamsConfig {
  topTeam: ITeamConfig;
  bottomTeam: ITeamConfig;
}

const getKeyValue = (key: string) => (obj: Record<string, any>) => obj[key];
const validateNumberInput = (number: string): number => {
  const num = parseInt(number);
  if (num <= 99) {
    return num;
  } else {
    return 99;
  }
};

const setSelectedTeamType = (
  value: string,
  dispatch: Function,
  t: any
): void => {
  switch (value) {
    case t('components.desktop.duo'):
      dispatch(setMode({ mode: false }));
      dispatch(setTeamType({ teamType: 2 }));
      break;
    case t('components.desktop.trio'):
      dispatch(setMode({ mode: false }));
      dispatch(setTeamType({ teamType: 3 }));
      break;
    case t('components.desktop.squad'):
      dispatch(setMode({ mode: true }));
      dispatch(setTeamType({ teamType: 4 }));
      break;
    default:
      dispatch(setTeamType({ teamType: 0 }));
  }
};

const DesktopWindow: FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { teamsConfig } = useAppSelector((state) => state.board);
  const { mode, showPrevPoints, showDifference, teamType } = useAppSelector(
    (state) => state.settings
  );
  const [localPlayer, setLocalPlayer] = useState<IRoster>();
  const [team, setTeam] = useState<IRoster[]>([
    {
      assists: null,
      deaths: null,
      is_bot: null,
      is_local: null,
      kills: 1,
      ping: null,
      player: 'Teammate1',
      rank: null,
      score: null,
      team_id: null,
      armor: null,
      cash: null,
    },
    {
      assists: null,
      deaths: null,
      is_bot: null,
      is_local: null,
      kills: 1,
      ping: null,
      player: 'Teammate2',
      rank: null,
      score: null,
      team_id: null,
      armor: null,
      cash: null,
    },
    {
      assists: null,
      deaths: null,
      is_bot: null,
      is_local: null,
      kills: 1,
      ping: null,
      player: 'Teammate3',
      rank: null,
      score: null,
      team_id: null,
      armor: null,
      cash: null,
    },
  ]);
  const { event, info } = useSelector((state: RootReducer) => state.background);
  const { topTotal, bottomTotal } = useTotals({
    teamsConfig,
    teamType,
    mode,
  });

  // useEffect(() => {
  //   console.log('DESKTOP', overwolf.windows.getWindowsStates('in_game'));
  // });

  const resetBoard = () => {
    dispatch(
      resetTeamsConfig({
        topPrevPoints: topTotal,
        bottomPrevPoints: bottomTotal,
      })
    );

    setTeam([]);
  };

  const resetPrevs = () => {
    dispatch(
      setTeamsConfig({
        config: {
          ...teamsConfig,
          topTeam: {
            ...teamsConfig.topTeam,
            previousMatchPoints: 0,
          },
          bottomTeam: {
            ...teamsConfig.bottomTeam,
            previousMatchPoints: 0,
          },
        },
      })
    );
  };

  useEffect(() => {
    const currentEvent = event.events && event.events[0];
    console.info('eventDesktop', currentEvent, event.events);
    if (currentEvent && currentEvent.name === 'match_end') {
      dispatch(
        resetTeamsConfig({
          topPrevPoints: topTotal,
          bottomPrevPoints: bottomTotal,
        })
      );

      setTeam([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  useEffect(() => {
    // console.log('INFON', info);
    // dispatch(setTeamsConfig({ config: null }));
    setLocalPlayer({
      assists: null,
      deaths: null,
      is_bot: null,
      is_local: null,
      kills: 2,
      ping: null,
      player: 'YourNickname',
      rank: null,
      score: null,
      team_id: null,
      armor: null,
      cash: null,
    });
    if (info) {
      // dispatch(setShow({ show: true }));
      if (!localPlayer) dispatch(setText({ text: 'Searching for you...' }));

      if (
        Object.keys(info.info).length !== 0 &&
        info.feature === 'match_info'
      ) {
        const rosterKey = Object.keys(info.info.match_info)[0];

        if (rosterKey.includes('roster')) {
          const roster: IRoster = JSON.parse(
            getKeyValue(rosterKey)(info.info.match_info)
          );
          if (roster.is_local) {
            setLocalPlayer(roster);
            dispatch(
              setTeamsConfig({
                config: {
                  ...teamsConfig,
                  topTeam: {
                    ...teamsConfig.topTeam,
                    name: 'Team' + roster.player.split('#')[0],
                    member1: {
                      name: roster.player,
                      kills: roster.kills,
                      armor: roster.armor,
                      cash: roster.cash,
                    },
                  },
                },
              })
            );
          } else if (
            typeof roster === 'object' &&
            roster.team_id === localPlayer?.team_id &&
            roster.player !== localPlayer?.player
          ) {
            dispatch(setText({ text: 'Searching for your team...' }));

            const isAlreadyInTheTeam = team?.some(
              (member) => roster.player === member.player
            );
            if (!isAlreadyInTheTeam) {
              setTeam([...team, { ...roster }]);
            } else {
              const rosterIndex = team.findIndex(
                (player) => player.player === roster.player
              );

              const updatedRoster = {
                ...team[rosterIndex],
                kills: roster.kills,
                armor: roster.armor,
                cash: roster.cash,
              };
              const newTeam = [
                ...team.slice(0, rosterIndex),
                updatedRoster,
                ...team.slice(rosterIndex + 1, team.length),
              ];

              setTeam(newTeam);
            }
          }
        }

        dispatch(setShow({ show: false }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info]);

  useEffect(() => {
    if (team.length > teamType) {
      dispatch(setShow({ show: false }));
    }
    if (team.length === 1) {
      dispatch(
        setTeamsConfig({
          config: {
            ...teamsConfig,
            topTeam: {
              ...teamsConfig.topTeam,
              member2: {
                name: team[0].player,
                kills: team[0].kills,
                armor: team[0].armor,
                cash: team[0].cash,
              },
            },
          },
        })
      );
    } else if (team.length === 2) {
      dispatch(
        setTeamsConfig({
          config: {
            ...teamsConfig,
            topTeam: {
              ...teamsConfig.topTeam,
              member2: {
                name: team[0].player,
                kills: team[0].kills,
                armor: team[0].armor,
                cash: team[0].cash,
              },
            },
            bottomTeam: {
              ...teamsConfig.bottomTeam,
              member1: {
                name: team[1].player,
                kills: team[1].kills,
                armor: team[1].armor,
                cash: team[1].cash,
              },
            },
          },
        })
      );
    } else if (team.length === 3) {
      dispatch(
        setTeamsConfig({
          config: {
            ...teamsConfig,
            topTeam: {
              ...teamsConfig.topTeam,
              member2: {
                name: team[0].player,
                kills: team[0].kills,
                armor: team[0].armor,
                cash: team[0].cash,
              },
            },
            bottomTeam: {
              ...teamsConfig.bottomTeam,
              name: 'Team' + team[1].player.split('#')[0],
              member1: {
                name: team[1].player,
                kills: team[1].kills,
                armor: team[1].armor,
                cash: team[1].cash,
              },
              member2: {
                name: team[2].player,
                kills: team[2].kills,
                armor: team[2].armor,
                cash: team[2].cash,
              },
            },
          },
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [team]);

  const fillRemainingMemebers = (partner?: IRoster): void => {
    if (team.length >= 2) {
      const remainingMemebers = team.filter(
        (member) => !member.player.includes(partner?.player)
      );

      const player1 = remainingMemebers[0];
      const player2 = remainingMemebers[1];

      const updatedTeamsConfig = {
        ...teamsConfig,
        topTeam: {
          ...teamsConfig.topTeam,
          member2: {
            name: partner?.player,
            kills: partner?.kills,
            armor: partner?.armor,
            cash: partner?.cash,
          },
        },
        bottomTeam: {
          ...teamsConfig.bottomTeam,
          name: 'Team' + player1.player.split('#')[0],
          member1: {
            name: player1.player,
            kills: player1.kills,
            armor: player1.armor,
            cash: player1.cash,
          },
          member2: {
            name: player2.player,
            kills: player2.kills,
            armor: player2.armor,
            cash: player2.cash,
          },
        },
      };
      dispatch(setTeamsConfig({ config: updatedTeamsConfig }));
    }
  };

  const switchMembers = (e: any) => {
    e.preventDefault();
    dispatch(
      setTeamsConfig({
        config: {
          ...teamsConfig,
          bottomTeam: {
            ...teamsConfig.bottomTeam,
            name: 'Team' + teamsConfig.bottomTeam.member2.name.split('#')[0],
            member1: { ...teamsConfig.bottomTeam.member2 },
            member2: { ...teamsConfig.bottomTeam.member1 },
          },
        },
      })
    );
  };

  return (
    <>
      <DesktopHeader />
      <div className={style.container}>
        {/* <Loader /> */}
        <main className={style.main}>
          <form action="">
            <span className={style.teamRow}>
              <span className={style.col}>
                <SubTitle>{t('components.desktop.type')}</SubTitle>
                <div className={style.formRow}>
                  <FormInput
                    onChange={(e) =>
                      setSelectedTeamType(e.target.value, dispatch, t)
                    }
                    value=""
                    type="radio"
                    label={`${t('components.desktop.duo')}-${t(
                      'components.desktop.trio'
                    )}-${t('components.desktop.squad')}`}
                  />
                </div>
                <span>
                  <SubTitle>
                    {t('components.desktop.reset.titleSection')}
                  </SubTitle>
                  <div className={style.formRow}>
                    <button
                      className={style.primaryBtn}
                      onClick={(e) => {
                        e.preventDefault();
                        resetBoard();
                      }}
                    >
                      {t('components.desktop.reset.btnLabel')}
                    </button>
                  </div>
                </span>
              </span>
              {/* <Tip>
                <strong>{t('components.desktop.positionTip.title')}</strong>
                <p>
                  {t('components.desktop.positionTip.firstLine')}{' '}
                  <strong>{t('components.desktop.positionTip.crtlTab')}</strong>{' '}
                  {t('components.desktop.positionTip.secondLine')}{' '}
                  <strong>{t('components.desktop.positionTip.crtlTab')}</strong>
                </p>
                <strong>{t('components.desktop.restartTip.title')}</strong>
                <p>{t('components.desktop.restartTip.firstLine')}</p>
              </Tip> */}
            </span>

            {/* <span>
              <SubTitle>{t('components.desktop.money')}</SubTitle>
              <div className={style.formRow}>
                <div className={style.formRow}>
                  <FormInput
                    onChange={() =>
                      dispatch(setShowMoney({ showMoney: !showMoney }))
                    }
                    value={showMoney}
                    type="checkbox"
                    label={t('components.desktop.moneyLabel')}
                  />
                </div>
              </div>
            </span> */}
            <SubTitle>{t('components.desktop.teamsHeader')}</SubTitle>
            <div className={style.formRow}>
              <FormInput
                label={t('components.desktop.topTeamName')}
                onChange={(e) =>
                  dispatch(
                    setTeamsConfig({
                      config: {
                        ...teamsConfig,
                        topTeam: {
                          ...teamsConfig.topTeam,
                          name: e.target.value,
                        },
                      },
                    })
                  )
                }
                value={teamsConfig.topTeam.name}
                type="text"
              />
              <FormInput
                label={t('components.desktop.youLabel')}
                afterIconText={teamsConfig.topTeam.member1.kills + ''}
                isYou={true}
                onChange={() => {}}
                value={localPlayer ? localPlayer?.player.split('#')[0] : ''}
                type="text"
              />
              <FormInput
                label={t('components.desktop.player2')}
                afterIconText={teamsConfig.topTeam.member2.kills + ''}
                options={team}
                onChange={(e) => {
                  const selectedMember = team.find((member) =>
                    member.player.includes(e.target.value)
                  );
                  if (selectedMember) fillRemainingMemebers(selectedMember);
                }}
                value={teamsConfig.topTeam.member2.name.split('#')[0]}
                type="select"
              />
              {mode && showPrevPoints && teamType === 4 && (
                <FormInput
                  label={t('components.desktop.prevMatchPoints')}
                  onChange={(e) => {
                    const { value } = e.target;
                    dispatch(
                      setTeamsConfig({
                        config: {
                          ...teamsConfig,
                          topTeam: {
                            ...teamsConfig.topTeam,
                            previousMatchPoints:
                              value === '' ? 0 : validateNumberInput(value),
                          },
                        },
                      })
                    );
                  }}
                  small={true}
                  value={teamsConfig.topTeam.previousMatchPoints}
                  type="text"
                />
              )}
            </div>
            {teamType >= 3 && (
              <div className={style.formRow}>
                {teamType === 4 && (
                  <FormInput
                    label={t('components.desktop.bottomTeamName')}
                    onChange={(e) =>
                      dispatch(
                        setTeamsConfig({
                          config: {
                            ...teamsConfig,
                            bottomTeam: {
                              ...teamsConfig.bottomTeam,
                              name: e.target.value,
                            },
                          },
                        })
                      )
                    }
                    value={!mode ? '' : teamsConfig.bottomTeam.name}
                    type="text"
                    disabled={!mode}
                  />
                )}
                <span
                  className={
                    teamsConfig.topTeam.member2.name
                      ? style.membersWithSwitch + ' ' + style.withBtn
                      : style.membersWithSwitch
                  }
                >
                  <FormInput
                    label={
                      Number(teamType) === 3
                        ? t('components.desktop.player3')
                        : t('components.desktop.player1')
                    }
                    afterIconText={teamsConfig.bottomTeam.member1.kills + ''}
                    onChange={() => {}}
                    value={teamsConfig.bottomTeam.member1.name.split('#')[0]}
                    type="text"
                    disabled={true}
                  />
                  {(teamType === 3 || teamType === 4) &&
                    teamsConfig.topTeam.member2.name && (
                      <button
                        className={style.switchBtn}
                        onClick={(e) => switchMembers(e)}
                      >
                        <img src={switchBtn} alt="switch" />
                      </button>
                    )}
                  {Number(teamType) === 4 && (
                    <>
                      <FormInput
                        label={t('components.desktop.player2')}
                        afterIconText={
                          teamsConfig.bottomTeam.member2.kills + ''
                        }
                        onChange={() => {}}
                        value={
                          teamsConfig.bottomTeam.member2.name
                            ? teamsConfig.bottomTeam.member2.name.split('#')[0]
                            : ''
                        }
                        type="text"
                        disabled={true}
                      />
                      {mode && showPrevPoints && (
                        <FormInput
                          label={t('components.desktop.prevMatchPoints')}
                          onChange={(e) => {
                            const { value } = e.target;
                            dispatch(
                              setTeamsConfig({
                                config: {
                                  ...teamsConfig,
                                  bottomTeam: {
                                    ...teamsConfig.bottomTeam,
                                    previousMatchPoints:
                                      value === ''
                                        ? 0
                                        : validateNumberInput(value),
                                  },
                                },
                              })
                            );
                          }}
                          small={true}
                          value={teamsConfig.bottomTeam.previousMatchPoints}
                          type="text"
                        />
                      )}
                    </>
                  )}
                </span>
              </div>
            )}
            {teamType >= 3 && (
              <span className={style.inputsContainer}>
                {teamType === 4 && (
                  <span className={style.checkContainer}>
                    <FormInput
                      onChange={() => dispatch(setMode({ mode: !mode }))}
                      value={mode}
                      type="checkbox"
                      label={t('components.desktop.mode')}
                    />
                  </span>
                )}
                {teamType === 4 && mode && (
                  <span className={style.checkContainer}>
                    <FormInput
                      onChange={() =>
                        dispatch(
                          setShowDifference({
                            showDifference: !showDifference,
                          })
                        )
                      }
                      value={showDifference}
                      type="checkbox"
                      label={t('components.desktop.difference')}
                    />
                  </span>
                )}
                {teamType === 4 && mode && (
                  <span className={style.checkContainer}>
                    <FormInput
                      onChange={() =>
                        dispatch(
                          setShowPrevPoints({
                            showPrevPoints: !showPrevPoints,
                          })
                        )
                      }
                      value={showPrevPoints}
                      type="checkbox"
                      label={t('components.desktop.showPrevMatchPoints')}
                    />
                  </span>
                )}
                {teamType === 4 && mode && (
                  <span>
                    <button
                      className={style.primaryBtn}
                      onClick={(e) => {
                        e.preventDefault();
                        resetPrevs();
                      }}
                    >
                      {t('components.desktop.resetPrev')}
                    </button>
                  </span>
                )}
              </span>
            )}
          </form>
        </main>
        <aside className={style.aside}>
          <SubTitle>{t('components.desktop.preview')}</SubTitle>
          <Board />
        </aside>
        {/* <footer className={style.footer}>
          <Title color="white">{t("components.desktop.footer")}</Title>
        </footer> */}
      </div>
    </>
  );
};

export default DesktopWindow;
