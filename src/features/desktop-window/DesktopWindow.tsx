import React, { FC, useEffect, useState } from 'react';
import { DesktopHeader } from './DesktopHeader';
import style from './DesktopWindow.module.css';
// import { useTranslation } from 'react-i18next';
import { SubTitle } from 'components/SubTitle';
import { FormInput } from 'components/FormInput';
import { Board } from 'components/Board/Board';
import eventsData from './events-mock.json';

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
}
export interface ITeamsConfig {
  topTeam: ITeamConfig;
  bottomTeam: ITeamConfig;
}

const getKeyValue = (key: string) => (obj: Record<string, any>) => obj[key];

const DesktopWindow: FC = () => {
  // const { t } = useTranslation();
  const [teamsConfig, setTeamsConfig] = useState<ITeamsConfig>({
    topTeam: {
      name: 'TopTeam',
      member1: { name: '', kills: 0 },
      member2: { name: '', kills: 0 },
    },
    bottomTeam: {
      name: 'BottomTeam',
      member1: { name: 'Selecciona a tu compañero', kills: 0 },
      member2: { name: 'Selecciona a tu compañero', kills: 0 },
    },
  });
  const [playersAmount, setPlayersAmount] = useState('two');
  const [localPlayer, setLocalPlayer] = useState<IRoster>();
  const [team, setTeam] = useState<IRoster[]>([]);

  // Process de raw data and setting the local player
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
        team.length <= 4
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

  const fillRemainingMemebers = (partner?: IRoster): void => {
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
        member1: { name: player1.player, kills: player1.kills },
        member2: { name: player2.player, kills: player2.kills },
      },
    };
    setTeamsConfig(updatedTeamsConfig);
  };

  return (
    <>
      <DesktopHeader />
      <div className={style.container}>
        {/* <header className={style.header}>
        </header> */}
        <main className={style.main}>
          <form action="">
            <SubTitle>Mode</SubTitle>
            <div className={style.formRow}>
              <FormInput
                onChange={(e) => setPlayersAmount(e.target.value)}
                value=""
                type="radio"
                label="one-two"
              />
            </div>
            <SubTitle>Teams</SubTitle>

            <div className={style.formRow}>
              <FormInput
                label="Top name"
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
                label={'You'}
                afterIconText={teamsConfig.topTeam.member1.kills + ''}
                isYou={true}
                onChange={() => {}}
                value={localPlayer ? localPlayer?.player.split('#')[0] : ''}
                type="text"
              />
              <FormInput
                label={'Member#2'}
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
            </div>
            {/* BOTTOM FORM */}
            {playersAmount === 'two' && (
              <div className={style.formRow}>
                <FormInput
                  label="Bottom name"
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
                />
                <FormInput
                  label={'Member#1'}
                  afterIconText={teamsConfig.bottomTeam.member1.kills + ''}
                  onChange={() => {}}
                  value={teamsConfig.bottomTeam.member1.name.split('#')[0]}
                  type="text"
                />
                <FormInput
                  label={'Member#2'}
                  afterIconText={teamsConfig.bottomTeam.member2.kills + ''}
                  onChange={() => {}}
                  value={teamsConfig.bottomTeam.member2.name.split('#')[0]}
                  type="text"
                />
              </div>
            )}
          </form>
        </main>
        <aside className={style.aside}>
          <SubTitle>Preview</SubTitle>
          <Board
            localName={localPlayer?.player}
            hasSecond={playersAmount === 'two'}
            teamsConfig={teamsConfig}
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
