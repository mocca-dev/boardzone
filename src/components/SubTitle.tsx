import React, { FC } from 'react';

// interface ITitle {
//   color: "red" | "blue" | "green" | "white";
// } : FC<ITitle>
export const SubTitle: FC = ({ children }) => {
  return <h3>{children}</h3>;
};
