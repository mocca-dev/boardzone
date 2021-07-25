import React, { FC } from "react";

// interface ITitle {
//   color: "red" | "blue" | "green" | "white";
// } : FC<ITitle>
export const Title: FC = ({ children }) => {
  return <h1>{children}</h1>;
};
