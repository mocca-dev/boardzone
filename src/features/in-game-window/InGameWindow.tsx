import React, { FC, useEffect } from "react";
import { SubTitle } from "components/SubTitle";
import { RootReducer } from "app/rootReducer";
import { useSelector } from "react-redux";

const InGameWindow: FC = () => {
  const { event, info } = useSelector((state: RootReducer) => state.background);

  useEffect(() => {
    console.info("event", event); // or use https://github.com/AlbericoD/overwolf-modern-react-boilerplate#-remote-redux-debug
  }, [event]);

  useEffect(() => {
    console.info("info", info); // or use https://github.com/AlbericoD/overwolf-modern-react-boilerplate#-remote-redux-debug
  }, [info]);

  return (
    <div>
      <SubTitle>In Game Window</SubTitle>
    </div>
  );
};

export default InGameWindow;
