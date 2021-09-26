import { ITeamsConfig } from 'features/desktop-window/DesktopWindow';
import { useEffect, useState } from 'react';

export const useTotals = ({
  teamsConfig,
  teamType,
  mode,
}: {
  teamsConfig: ITeamsConfig;
  teamType: number;
  mode: boolean;
}) => {
  const [topTotal, setTopTotal] = useState(0);
  const [bottomTotal, setBottomTotal] = useState(0);

  useEffect(() => {
    if (mode && teamType === 4) {
      setTopTotal(
        teamsConfig.topTeam.member1.kills + teamsConfig.topTeam.member2.kills
      );
      setBottomTotal(
        teamsConfig.bottomTeam.member1.kills +
          teamsConfig.bottomTeam.member2.kills
      );
    } else {
      if (teamType === 2) {
        setTopTotal(
          teamsConfig.topTeam.member1.kills + teamsConfig.topTeam.member2.kills
        );
      } else if (teamType === 3) {
        setTopTotal(
          teamsConfig.topTeam.member1.kills +
            teamsConfig.topTeam.member2.kills +
            teamsConfig.bottomTeam.member1.kills
        );
      }
    }
  }, [teamsConfig, mode, teamType]);

  return { topTotal, bottomTotal };
};
