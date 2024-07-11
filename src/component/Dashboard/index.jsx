import React from "react";
import { useSelector } from "react-redux";
import { Mentor } from "./Mentor";
import { Mentee } from "./Mentee";

import './dashboard.css';

export const Dashboard = () => {
  const userInfo = useSelector(state => state.userInfo)

  const role = userInfo.data.role

  return (
    <div>
      {
        role === 'mentee' ? <Mentee /> : <Mentor />
      }
   </div>
  );
};
