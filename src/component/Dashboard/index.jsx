import React from "react";
import { useSelector } from "react-redux";
import { Mentor } from "./Mentor";
import { Mentee } from "./Mentee";

import './dashboard.css';

export const Dashboard = () => {
  const userInfo = useSelector(state => state.userInfo)

  const role = userInfo.data.role

  if (role === '') return <></>

  return (
    <div>
      {
        role === 'mentee' && <Mentee />
      }

      {
        role === 'mentor' && <Mentor />
      }
    </div>
  );
};
