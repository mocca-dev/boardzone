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
const getKeyValue = (key: string) => (obj: Record<string, any>) => obj[key];

const DesktopWindow: FC = () => {
  // const { t } = useTranslation();
  const [teamsConfig, setTeamsConfig] = useState({
    topTeam: { name: 'TopTeam', member1: '', member2: '', points: '10' },
    bottomTeam: { name: 'BottomTeam', member1: '', member2: '', points: '8' },
  });
  const [playersAmount, setPlayersAmount] = useState('one');
  const [localPlayer, setLocalPlayer] = useState<IRoster>();
  const [team, setTeam] = useState<IRoster[]>([]);

  // Process de raw data
  useEffect(() => {
    eventsData.some((event) => {
      const rosterKey = Object.keys(event.info.match_info)[0];
      const roster: IRoster = getKeyValue(rosterKey)(event.info.match_info);
      if (roster.is_local) {
        setLocalPlayer(roster);
        return true;
      }
      return false;
    });
  }, []);

  // Fill the team
  useEffect(() => {
    eventsData.some((event) => {
      const rosterKey = Object.keys(event.info.match_info)[0];
      const roster: IRoster = getKeyValue(rosterKey)(event.info.match_info);
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
          setTeam([...team, roster]);
        }
      }
      return false;
    });
    console.log(team);
  }, [localPlayer, team]);

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
                label="You"
                isYou={true}
                options={team}
                onChange={(e) =>
                  setTeamsConfig({
                    ...teamsConfig,
                    topTeam: {
                      ...teamsConfig.topTeam,
                      member1: e.target.value,
                    },
                  })
                }
                value={teamsConfig.topTeam.member1}
                type="select"
              />
              <FormInput
                label="Member#2"
                options={team}
                onChange={(e) =>
                  setTeamsConfig({
                    ...teamsConfig,
                    topTeam: {
                      ...teamsConfig.topTeam,
                      member2: e.target.value,
                    },
                  })
                }
                value={teamsConfig.topTeam.member2}
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
                  label="Member#1"
                  options={team}
                  onChange={(e) =>
                    setTeamsConfig({
                      ...teamsConfig,
                      bottomTeam: {
                        ...teamsConfig.bottomTeam,
                        member1: e.target.value,
                      },
                    })
                  }
                  value={teamsConfig.bottomTeam.member1}
                  type="select"
                />
                <FormInput
                  label="Member#2"
                  options={team}
                  onChange={(e) =>
                    setTeamsConfig({
                      ...teamsConfig,
                      bottomTeam: {
                        ...teamsConfig.bottomTeam,
                        member2: e.target.value,
                      },
                    })
                  }
                  value={teamsConfig.bottomTeam.member2}
                  type="select"
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
            topData={teamsConfig.topTeam}
            bottomData={teamsConfig.bottomTeam}
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
