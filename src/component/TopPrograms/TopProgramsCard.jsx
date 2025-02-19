import React from "react";
import { useNavigate } from "react-router-dom";
import UserIcon from "../../assets/icons/user-icon.svg";
export const TopProgramsCard = ({ topProgramsList,view=true }) => {
  const navigate = useNavigate();
  return (
    <div
      className="recent-request"
      style={{
        boxShadow: "4px 4px 25px 0px rgba(0, 0, 0, 0.05)",
        borderRadius: "10px",
      }}
    >
      <div className="title flex justify-between py-3 px-4 border-b-2 items-center">
        <div className="flex gap-4">
          <div
            className="card-dash"
            style={{
              background: "linear-gradient(180deg, #00B1C0 0%, #005DC6 100%)",
            }}
          ></div>
          <h4>Top Programs</h4>
        </div>
        {view&&
        <div className="flex justify-center mt-2 mb-2">
          <p
            className="text-[12px] py-2 px-2 cursor-pointer"
            style={{
              background: "rgba(217, 228, 242, 1)",
              color: "rgba(29, 91, 191, 1)",
              borderRadius: "3px",
            }}
            onClick={() => navigate("/mentors?req=top_programs")}
          >
            View All
          </p>
        </div>}
      </div>

      <div className="content flex flex-col gap-2 py-2 px-2 overflow-x-auto">
        {topProgramsList.map((recentReq, index) => {
          return (
            <div
              key={index}
              className="py-3 px-2 sm:px-2 md:px-2 lg:px-3 xl:px-3 cursor-pointer"
              style={{
                border: "1px solid rgba(29, 91, 191, 1)",
                borderRadius: "10px",
              }}
              onClick={() =>
                navigate(
                  `/program-details/${recentReq.program}?breadcrumbsType=dashboardProgramDetails`
                )
              }
            >
              <div
                className="flex gap-2 pb-3"
                style={{
                  borderBottom: "1px solid rgba(29, 91, 191, 1)",
                }}
              >
                <div className="w-12 h-12 flex items-center justify-center">
                  {" "}
                  <img
                    src={recentReq?.program_image || UserIcon}
                    alt="male-icon"
                    className="w-full h-full object-cover rounded-full"
                  />{" "}
                </div>
                <div className="flex flex-col gap-2">
                  <p
                    className="text-[12px]"
                    style={{
                      width: "120px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                    title={recentReq?.program_name}
                  >
                    {recentReq?.program_name}
                  </p>
                  <p
                    className="text-[10px]"
                    style={{
                      width: "120px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                    title={recentReq?.created_by}
                  >
                    {recentReq?.created_by}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 pt-3">
                <div className="flex items-center gap-1">
                  <span
                    className="lg:w-2 lg:h-2  rounded-full"
                    style={{ background: "rgba(29, 91, 191, 1)" }}
                  ></span>
                  <span className="text-[8px]">
                    Attended({recentReq.participated_mentees || 0})
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className="lg:w-2 lg:h-2  rounded-full"
                    style={{ background: "rgba(0, 174, 189, 1)" }}
                  ></span>
                  <span className="text-[8px]">
                    Rating({recentReq.average_rating || 0})
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
