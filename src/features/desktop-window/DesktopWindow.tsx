import React, { FC, useEffect, useState } from 'react';
import { DesktopHeader } from './DesktopHeader';
import style from './DesktopWindow.module.css';
import { useTranslation } from 'react-i18next';
import { SubTitle } from 'components/SubTitle';
import { FormInput } from 'components/FormInput';
import { Board } from 'components/Board/Board';
import eventsData from './events-mock.json';
import switchBtn from './switch-btn.png';

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
}

interface IRosterOption extends IRoster {
  disabled: boolean;
}

interface ITeamMemberConfig {
  name: string;
  kills: number;
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

const DesktopWindow: FC = () => {
  const { t } = useTranslation();
  const [teamsConfig, setTeamsConfig] = useState<ITeamsConfig>({
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
  const [playersAmount, setPlayersAmount] = useState('2v2');
  const [showDifference, setShowDifference] = useState('1');
  const [localPlayer, setLocalPlayer] = useState<IRoster>();
  const [team, setTeam] = useState<IRoster[]>([]);

  // Process raw data and setting the local player
  useEffect(() => {
    eventsData.some((event) => {
      const rosterKey = Object.keys(event.info.match_info)[0];
      const roster: IRoster = getKeyValue(rosterKey)(event.info.match_info);
      if (roster.is_local) {
        setLocalPlayer(roster);
        setTeamsConfig({
          ...teamsConfig,
          topTeam: {
            ...teamsConfig.topTeam,
            name: 'Team' + roster.player.split('#')[0],
            member1: { name: roster.player, kills: roster.kills },
          },
        });
        return true;
      }
      return false;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fill the team
  useEffect(() => {
    eventsData.some((event) => {
      const rosterKey = Object.keys(event.info.match_info)[0];
      const roster: IRosterOption = getKeyValue(rosterKey)(
        event.info.match_info
      );
      // Roster must be of type IRoster and must be in the team and must not
      // be the local and there can be more than 4 members
      if (
        typeof roster === 'object' &&
        roster.team_id === localPlayer?.team_id &&
        roster.player !== localPlayer?.player &&
        team.length < 3
      ) {
        const isAlreadyInTheTeam = team?.some(
          (member) => roster.player === member.player
        );
        if (!isAlreadyInTheTeam) {
          setTeam([...team, { ...roster }]);
        }
      }
      return false;
    });
  }, [localPlayer, team]);

  useEffect(() => {
    if (team.length === 1) {
      setTeamsConfig({
        ...teamsConfig,
        topTeam: {
          ...teamsConfig.topTeam,
          member2: { name: team[0].player, kills: team[0].kills },
        },
      });
    } else if (team.length === 2) {
      setTeamsConfig({
        ...teamsConfig,
        topTeam: {
          ...teamsConfig.topTeam,
          member2: { name: team[0].player, kills: team[0].kills },
        },
        bottomTeam: {
          ...teamsConfig.bottomTeam,
          member1: { name: team[1].player, kills: team[1].kills },
        },
      });
    } else if (team.length === 3) {
      setTeamsConfig({
        ...teamsConfig,
        topTeam: {
          ...teamsConfig.topTeam,
          member2: { name: team[0].player, kills: team[0].kills },
        },
        bottomTeam: {
          ...teamsConfig.bottomTeam,
          name: 'Team' + team[1].player.split('#')[0],
          member1: { name: team[1].player, kills: team[1].kills },
          member2: { name: team[2].player, kills: team[2].kills },
        },
      });
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
          },
        },
        bottomTeam: {
          ...teamsConfig.bottomTeam,
          name: 'Team' + player1.player.split('#')[0],
          member1: {
            name: player1.player,
            kills: player1.kills,
          },
          member2: {
            name: team.length === 3 && player2.player,
            kills: team.length === 3 && player2.kills,
          },
        },
      };
      setTeamsConfig(updatedTeamsConfig);
    }
  };

  const switchMembers = (e: any) => {
    e.preventDefault();
    setTeamsConfig({
      ...teamsConfig,
      bottomTeam: {
        ...teamsConfig.bottomTeam,
        name: 'Team' + teamsConfig.bottomTeam.member2.name.split('#')[0],
        member1: { ...teamsConfig.bottomTeam.member2 },
        member2: { ...teamsConfig.bottomTeam.member1 },
      },
    });
  };

  return (
    <>
      <DesktopHeader />
      <div className={style.container}>
        {/* <header className={style.header}>
        </header> */}
        <main className={style.main}>
          <form action="">
            {team.length === 3 && (
              <>
                <span>
                  <SubTitle>{t('components.desktop.mode')}</SubTitle>
                  <div className={style.formRow}>
                    <FormInput
                      onChange={(e) => setPlayersAmount(e.target.value)}
                      value=""
                      type="radio"
                      label={`${t('components.desktop.all')}-2v2`}
                    />
                  </div>
                </span>
                <span>
                  <SubTitle>{t('components.desktop.difference')}</SubTitle>
                  <div className={style.formRow}>
                    <FormInput
                      onChange={(e) => setShowDifference(e.target.value)}
                      value=""
                      type="radio"
                      label={`${t('components.desktop.no')}-${t(
                        'components.desktop.yes'
                      )}`}
                    />
                  </div>
                </span>
              </>
            )}
            <SubTitle>{t('components.desktop.teamsHeader')}</SubTitle>

            <div className={style.formRow}>
              <FormInput
                label={t('components.desktop.topTeamName')}
                onChange={(e) =>
                  setTeamsConfig({
                    ...teamsConfig,
                    topTeam: {
                      ...teamsConfig.topTeam,
                      name: e.target.value,
                    },
                  })
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
              {team.length === 1 || team.length === 2 ? (
                <FormInput
                  label={t('components.desktop.player2')}
                  afterIconText={teamsConfig.topTeam.member2.kills + ''}
                  onChange={() => {}}
                  value={teamsConfig.topTeam.member2.name.split('#')[0]}
                  type="text"
                />
              ) : (
                <>
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
                  {playersAmount === '2v2' && (
                    <FormInput
                      label={t('components.desktop.prevMatchPoints')}
                      onChange={(e) => {
                        const { value } = e.target;
                        setTeamsConfig({
                          ...teamsConfig,
                          topTeam: {
                            ...teamsConfig.topTeam,
                            previousMatchPoints:
                              value === '' ? 0 : parseInt(value),
                          },
                        });
                      }}
                      value={teamsConfig.topTeam.previousMatchPoints}
                      type="text"
                    />
                  )}
                </>
              )}
            </div>
            {/* BOTTOM FORM */}
            {team.length >= 2 && (
              <div className={style.formRow}>
                {team.length === 3 && (
                  <FormInput
                    label={t('components.desktop.bottomTeamName')}
                    onChange={(e) =>
                      setTeamsConfig({
                        ...teamsConfig,
                        bottomTeam: {
                          ...teamsConfig.bottomTeam,
                          name: e.target.value,
                        },
                      })
                    }
                    value={teamsConfig.bottomTeam.name}
                    type="text"
                    disabled={playersAmount === 'all'}
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
                      team.length === 3
                        ? t('components.desktop.player1')
                        : t('components.desktop.player3')
                    }
                    afterIconText={teamsConfig.bottomTeam.member1.kills + ''}
                    onChange={() => {}}
                    value={teamsConfig.bottomTeam.member1.name.split('#')[0]}
                    type="text"
                  />
                  {team.length === 3 && teamsConfig.topTeam.member2.name && (
                    <button
                      className={style.switchBtn}
                      onClick={(e) => switchMembers(e)}
                    >
                      <img src={switchBtn} alt="switch" />
                    </button>
                  )}
                  {team.length >= 3 && (
                    <>
                      <FormInput
                        label={t('components.desktop.player2')}
                        afterIconText={
                          teamsConfig.bottomTeam.member2.kills + ''
                        }
                        onChange={() => {}}
                        value={
                          teamsConfig.bottomTeam.member2.name.split('#')[0]
                        }
                        type="text"
                      />
                      {playersAmount === '2v2' && (
                        <FormInput
                          label={t('components.desktop.prevMatchPoints')}
                          onChange={(e) => {
                            const { value } = e.target;
                            setTeamsConfig({
                              ...teamsConfig,
                              bottomTeam: {
                                ...teamsConfig.bottomTeam,
                                previousMatchPoints:
                                  value === '' ? 0 : parseInt(value),
                              },
                            });
                          }}
                          value={teamsConfig.bottomTeam.previousMatchPoints}
                          type="text"
                        />
                      )}
                    </>
                  )}
                </span>
              </div>
            )}
          </form>
        </main>
        <aside className={style.aside}>
          <SubTitle>{t('components.desktop.preview')}</SubTitle>
          <Board
            localName={localPlayer?.player}
            hasSecond={playersAmount === '2v2' && team.length === 3}
            teamsConfig={teamsConfig}
            showDifference={showDifference === '1'}
          />
        </aside>
        {/* <footer className={style.footer}>
          <Title color="white">{t("components.desktop.footer")}</Title>
        </footer> */}
      </div>
    </>
  );
};

export default DesktopWindow;
