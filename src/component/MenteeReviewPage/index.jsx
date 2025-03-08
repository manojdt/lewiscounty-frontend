import { Box } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import wait from "../../assets/icons/waiting-for-approvals.svg";
import next from "../../assets/icons/next-stage.svg";

export const MenteeReviewPage = () => {
  const navegate = useNavigate();
  const userInfo = useSelector((state) => state.userInfo);
  const user = userInfo?.data?.userinfo;

  return (
    <div
      className="flex items-center justify-center h-screen w-full"
      onClick={() => {
        if (user?.application_status === "verified") {
          navegate("/mentee-assisment");
        }
      }}
    >
      <div className="border border-blue-500 rounded-lg p-8 flex flex-col items-center justify-center max-w-md px-10">
        <div className="mb-6">
          <img
            src={user?.application_status === "verified" ? next : wait}
            alt="Waiting for approval illustration"
            className="w-32 h-32"
          />
        </div>
        <div className="text-blue-600 font-medium text-lg">
          {user?.application_status === "verified"
            ? "You have been moved to the next stage"
            : "Waiting for Review"}
        </div>
      </div>
    </div>
  );
};
