import { useEffect, useState } from 'react';

var onErrorListener: any, onInfoUpdates2Listener: any, onNewEventsListener: any;

export const useGameEventProvider = <GameInfo, GameEvent>() => {
  const [info, setInfo] = useState<GameInfo>();
  const [event, setEvent] = useState<GameEvent[]>();

  var g_interestedInFeatures = [
    'game_info',
    'match_info',
    'kill',
    'death',
    'gep_internal',
  ];

  function registerEvents() {
    onErrorListener = function (info: any) {
      // console.log('Error: ' + JSON.stringify(info));
    };

    onInfoUpdates2Listener = function (info: any) {
      // console.log('Info UPDATE: ' + JSON.stringify(info));
      setInfo(info);
    };

    onNewEventsListener = function (info: any) {
      // console.log('EVENT FIRED: ' + JSON.stringify(info));
      setEvent(info);
    };

    // general events errors
    overwolf.games.events.onError.addListener(onErrorListener);

    // "static" data changed (total kills, username, steam-id)
    // This will also be triggered the first time we register
    // for events and will contain all the current information
    overwolf.games.events.onInfoUpdates2.addListener(onInfoUpdates2Listener);
    // an event triggerd
    overwolf.games.events.onNewEvents.addListener(onNewEventsListener);
  }

  function unregisterEvents() {
    overwolf.games.events.onError.removeListener(onErrorListener);
    overwolf.games.events.onInfoUpdates2.removeListener(onInfoUpdates2Listener);
    overwolf.games.events.onNewEvents.removeListener(onNewEventsListener);
  }

  function gameLaunched(gameInfoResult: any) {
    if (!gameInfoResult) {
      return false;
    }

    if (!gameInfoResult.gameInfo) {
      return false;
    }

    if (!gameInfoResult.runningChanged && !gameInfoResult.gameChanged) {
      return false;
    }

    if (!gameInfoResult.gameInfo.isRunning) {
      return false;
    }

    // NOTE: we divide by 10 to get the game class id without it's sequence number
    if (Math.floor(gameInfoResult.gameInfo.id / 10) !== 21626) {
      return false;
    }

    // console.log('Call of Duty: Launched');
    return true;
  }

  function gameRunning(gameInfo: any) {
    if (!gameInfo) {
      return false;
    }

    if (!gameInfo.isRunning) {
      return false;
    }

    // NOTE: we divide by 10 to get the game class id without it's sequence number
    if (Math.floor(gameInfo.id / 10) !== 21626) {
      return false;
    }

    // console.log('Call of Duty: Warzone running');
    return true;
  }

  function setFeatures() {
    overwolf.games.events.setRequiredFeatures(
      g_interestedInFeatures,
      function (info) {
        if (info.status === 'error') {
          //console.log("Could not set required features: " + info.reason);
          //console.log("Trying in 2 seconds");
          window.setTimeout(setFeatures, 2000);
          return;
        }

        // console.log('Set required features:');
        // console.log(JSON.stringify(info));
      }
    );
  }

  useEffect(() => {
    overwolf.games.onGameInfoUpdated.addListener(function (res) {
      if (gameLaunched(res)) {
        unregisterEvents();
        registerEvents();
        setTimeout(setFeatures, 1000);
      }
      // console.log('onGameInfoUpdated: ' + JSON.stringify(res));
    });
    return unregisterEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    overwolf.games.getRunningGameInfo(function (res) {
      if (gameRunning(res)) {
        registerEvents();
        setTimeout(setFeatures, 1000);
      }
      // console.log('getRunningGameInfo: ' + JSON.stringify(res));
    });
    return unregisterEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [{ info, event }] as const;
};
