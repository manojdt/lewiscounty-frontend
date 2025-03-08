import React from "react";
import { Box, Stack } from "@mui/material";
import {
  menteeNotJoinCondition,
  menteeProgramStatus,
  programActionStatus,
  programApprovalStage,
  programCancelled,
  programCompleted,
} from "../../../utils/constant";
import DoubleArrowIcon from "../../../assets/images/double_arrow 1x.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../../shared";
import { Button as MuiButton } from "@mui/material";
import { useJoinAllProgramMutation } from "../../../features/program/programApi.services";
import { useSelector } from "react-redux";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import VerifiedIcon from "@mui/icons-material/Verified";
import CancelIcon from "@mui/icons-material/Cancel";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import { ExitToApp, ThumbUpOffAlt } from "@mui/icons-material";

export const ApprovedTag = () => {
  return (
    <div className="flex flex-row gap-1 text-[#16B681] text-[15px] font-semibold">
      <VerifiedIcon />
      <p>Approved</p>
    </div>
  );
};

export const RejectedTag = () => {
  return (
    <div className="flex flex-row gap-1 text-[#E0382D] text-[15px] font-semibold">
      <CancelIcon />
      <p>Rejected</p>
    </div>
  );
};

export const CancelledTag = () => {
  return (
    <div className="flex flex-row gap-1 text-[#E0382D] text-[15px] font-semibold">
      <CancelIcon />
      <p>Cancelled</p>
    </div>
  );
};

const ProgramActions = ({
  role,
  programdetails,
  handleJoinProgram,
  isLaunchingProgram,
  requestId,
  requestStatusParams,
  handleMarkInterestClick,
  markingInterest,
  type,
  handleAcceptCancelProgramRequest,
  setOpenPopup,
  setCancelPopup,
  from = "",
  handleOpenAcceptProgram = () => false,
  requestData = ""
}) => {
  const userInfo = useSelector((state) => state.userInfo);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [joinAllProgram, { isLoading, isSuccess, isError }] =
    useJoinAllProgramMutation();
  // Common status button styles
  const buttonStyles = {
    base: {
      borderRadius: "5px",
      padding: "12px 64px",
      fontSize: "14px",
      display: "flex",
      alignItems: "center",
    },
    gradient: {
      background: "linear-gradient(94.18deg, #00AEBD -38.75%, #1D5BBF 195.51%)",
    },
    success: {
      background: "#16B681",
    },
    danger: {
      border: "1px solid #E0382D",
      color: "#E0382D",
    },
  };

  const acceptType = [
    "program_reschedule",
    "program_new",
    "program_cancel",
  ].includes(type);

  // const renderRequestStatus = () => {
  //   // if (!requestStatusParams || role !== "mentor") return null;
  //   // return (
  //   //   <div className="py-9">
  //   //     <div
  //   //       className="py-3 px-16 text-white text-[14px] flex justify-center items-center"
  //   //       style={{
  //   //         ...buttonStyles.base,
  //   //         background: reqStatusColor[programdetails?.request_data?.status],
  //   //         width: "30%",
  //   //       }}
  //   //     >
  //   //       {reqStatus[programdetails?.request_data?.status]}
  //   //     </div>
  //   //   </div>
  //   // );
  // };

  // Helper to render completed status
  const renderCompletedStatus = () => {
    if (!programCompleted.includes(programdetails.status)) return null;

    return (
      <>{
        !type && <div className="py-9">
          {/* <button
          className="py-3 px-10 text-white text-[14px] flex justify-center items-center"
          style={{
            ...buttonStyles.base,
            ...buttonStyles.gradient,
            ...buttonStyles.width30,
          }}
        >
          Program Completed
        </button> */}

          <div className="flex flex-row gap-1 text-[#16B681] text-[15px] font-semibold">
            <VerifiedIcon />
            <p>Program Completed</p>
          </div>
        </div>}
      </>
    );
  };

  // Render mentor specific actions
  const renderMentorActions = () => {
    if (role !== "mentor") return null;

    if (programdetails?.request_data?.status === "approved" && programdetails?.request_data?.request_type !== "program_assign") {
      return (
        <ApprovedTag />
      )
    }

    // Accept Program button for admin programs
    if (
      programdetails.status === "yettoapprove" &&
      programdetails?.admin_program
    ) {
      return (
        <button
          className="py-3 px-16 text-white mt-4"
          style={{
            ...buttonStyles.base,
            ...buttonStyles.gradient,
            ...buttonStyles.width30,
          }}
          onClick={() => setOpenPopup(true)}
        >
          Accept this program
        </button>
      );
    }

    if (
      programCompleted.includes(programdetails.status) ||
      programCancelled.includes(programdetails.status)
    )
      return null;

    // Handle request based actions
    if (requestId !== "") {
      if (
        (programdetails.status === "accept" ||
          programdetails?.request_data?.status === "approved") &&
        programdetails.status === "assign_program_accepted"
      ) {
        return (
          <div className="flex item-center gap-x-3">
            {/* <button
              className="py-3 px-16 mt-7 text-white text-[14px] flex items-center"
              style={{ ...buttonStyles.base, ...buttonStyles.success }}
              onClick={() => undefined}
            >
              Approved
            </button> */}
            <ApprovedTag />
            <button
              className="py-3 px-16 mt-7 text-white text-[14px] flex items-center"
              style={{ ...buttonStyles.base, ...buttonStyles.danger }}
              onClick={() => navigate(`/update-program/${programdetails?.id}`)}
            >
              Edit
            </button>
          </div>
        );
      }

      if (
        programdetails.status === "cancel" ||
        programdetails?.request_data?.status === "rejected"
      ) {
        return (
          // <button
          //   className="py-3 mt-7 px-16 text-white text-[14px] flex items-center"
          //   style={{ ...buttonStyles.base, ...buttonStyles.danger }}
          //   onClick={() => undefined}
          // >
          //   Rejected
          // </button>
          <RejectedTag />
        );
      }


    }

    // const showRequestButtons =
    //   (programdetails?.status === "inprogress" ||
    //     programdetails?.status === "yettostart") &&
    //   programdetails?.request_data?.request_type === "program_cancel" &&
    //   ["new", "pending"].includes(programdetails?.request_data?.status);

    // if (showRequestButtons) {
    //   return (
    //     <Box mt={2}>
    //       <Stack direction="row" alignItems="center" spacing="20px">
    //         <button
    //           className="py-3 px-16 text-white text-[14px] flex items-center"
    //           style={{ ...buttonStyles.base, ...buttonStyles.danger }}
    //           onClick={() =>
    //             handleAcceptCancelProgramRequest("cancel", programdetails.id)
    //           }
    //         >
    //           {searchParams.has("type") &&
    //           searchParams.get("type") === "program_cancel"
    //             ? "Continue"
    //             : "Reject Request"}
    //         </button>
    //         <button
    //           className="py-3 px-16 text-white text-[14px] flex items-center"
    //           style={{ ...buttonStyles.base, ...buttonStyles.success }}
    //           onClick={() =>
    //             handleAcceptCancelProgramRequest("accept", programdetails.id)
    //           }
    //         >
    //           Approve Request
    //         </button>
    //       </Stack>
    //     </Box>
    //   );
    // }

    // Admin Approve Reject Button

    const showApproveRejectButtons =
      (programdetails?.status === "inprogress" ||
        programdetails?.status === "yettostart") &&
      (programdetails?.request_data?.request_type === "program_new" ||
        programdetails?.request_data?.request_type === "program_cancel") &&
      ["new", "pending"].includes(programdetails?.request_data?.status) &&
      acceptType &&
      programdetails?.request_data?.created_by !== userInfo?.data?.user_id;
    if (showApproveRejectButtons) {
      return (
        <Box mt={2}>
          <Stack direction="row" alignItems="center" spacing="20px">
            <button
              className="py-3 px-16 text-white text-[14px] flex items-center"
              style={{ ...buttonStyles.base, ...buttonStyles.danger }}
              onClick={() =>
                handleAcceptCancelProgramRequest("cancel", programdetails.id)
              }
            >
              {searchParams.has("type") &&
                searchParams.get("type") === "program_cancel"
                ? "Continue"
                : "Reject Request"}
            </button>
            <button
              className="py-3 px-16 text-white text-[14px] flex items-center"
              style={{ ...buttonStyles.base, ...buttonStyles.success }}
              onClick={() =>
                handleAcceptCancelProgramRequest("accept", programdetails.id)
              }
            >
              Approve Request
            </button>
          </Stack>
        </Box>
      );
    }

    // Launch program button
    if (
      // programdetails.status === "yettojoin" &&
      // type !== "program_reschedule"
      programdetails.status === "yettojoin" &&
      !["new", "pending"].includes(programdetails?.request_data?.status) &&
      programdetails?.created_by === userInfo?.data?.user_id
    ) {
      return (
        <div className="py-9">
          <button
            className="py-3 px-16 text-white text-[14px] flex items-center"
            style={{ ...buttonStyles.base, ...buttonStyles.gradient }}
            onClick={() =>
              !isLaunchingProgram && handleJoinProgram("program_join")
            }
          >
            {isLaunchingProgram ? "loading..." : "Launch Program"}
            <span className="pl-8 pt-1">
              <img
                style={{ width: "15px", height: "13px" }}
                src={DoubleArrowIcon}
                alt="DoubleArrowIcon"
              />
            </span>
          </button>
        </div>
      );
    }

    // Program approval stage
    // if (
    //   programApprovalStage[programdetails.status] &&
    //   !programdetails?.admin_program &&
    //   !type
    // ) {
    //   return (
    //     <div className="space-y-4 pt-10">
    //       {searchParams.get("type") !== "program_new" && (
    //         <button
    //           className="py-3 px-[0px] text-[15px] flex items-center font-semibold"
    //           style={{
    //             ...buttonStyles.base,
    //             ...buttonStyles.danger,
    //             border: "none !important",
    //             cursor: "text",
    //             padding: "12px 0px !important"
    //           }}
    //           onClick={() => undefined}
    //         >
    //           {programApprovalStage[programdetails.status].type ===
    //             "waiting" && (
    //               <i className="pi pi-clock" style={{ color: "red" }}></i>
    //             )}
    //           {programApprovalStage[programdetails.status].type ===
    //             "reject" && (
    //               <i className="pi pi-ban" style={{ color: "red" }}></i>
    //             )}
    //           <span className="pl-3">
    //             {programApprovalStage[programdetails.status]?.text}
    //           </span>
    //         </button>
    //       )}

    //       {["new", "pending"].includes(programdetails?.request_data?.status) &&
    //         type !== "program_reschedule" && (
    //           <div className="flex items-center justify-start gap-6">
    //             <button
    //               onClick={() => setCancelPopup(true)}
    //               className="!border-none bg-red-500 rounded-[3px] text-[#fff] px-6 py-3 font-regular text-sm flex items-center"
    //             >
    //               Cancel Request
    //             </button>
    //             <Button
    //               btnType="button"
    //               btnCls="w-[110px] h-11"
    //               btnName={"Edit"}
    //               btnCategory="primary"
    //               onClick={() =>
    //                 navigate(`/update-program/${programdetails?.id}`)
    //               }
    //             />
    //           </div>
    //         )}
    //     </div>
    //   );
    // }

    // Draft status
    if (programdetails.status === "draft") {
      return (
        <div className="py-9">
          <div
            className="py-3 px-16 text-white text-[14px] flex justify-center items-center"
            style={{
              ...buttonStyles.base,
              ...buttonStyles.gradient,
              ...buttonStyles.width30,
            }}
          >
            Drafted
          </div>
        </div>
      );
    }

    return null;
  };

  // Render mentee specific actions
  const renderMenteeActions = () => {
    if (
      role !== "mentee" ||
      programCompleted.includes(programdetails.status) ||
      programCancelled.includes(programdetails.status)
    )
      return null;

    if (type === "program_cancel" && programdetails?.request_data?.status === "approved") {
      return (
        <ApprovedTag />
      )
    }
    if (programdetails?.mentee_program_exit && !requestId) {
      return (
        <div className="flex gap-4 pt-10">
          <div className="flex flex-row gap-1 text-[#E0382D] text-[15px] font-semibold">
            <ExitToApp />
            <p>{"Program Exited by Mentee"}</p>
          </div>
        </div>
      );
    }
    if (programdetails?.status === programActionStatus.yettojoin) {
      // if (!programdetails?.program_interest) {
      //   return (
      //     <MuiButton
      //       className="!my-4"
      //       onClick={() => !markingInterest && handleMarkInterestClick(true)}
      //     >
      //       {markingInterest ? (
      //         "Loading..."
      //       ) : (
      //         <>
      //           <ThumbUpOffAlt />
      //           <span className="pl-2">
      //             I'm Interested
      //           </span>
      //         </>
      //       )}
      //     </MuiButton>
      //   );
      // }
      if (programdetails?.program_interest) {
        return (
          <div className="mt-6">
            <span
              className="py-3 text-[15px]"
              style={{
                // ...buttonStyles.success,
                cursor: "not-allowed",
              }}
            >
              <span>
                <TaskAltIcon className="text-[#16B681]" />
              </span>
              &nbsp;&nbsp; <span className="text-[#16B681] font-semibold">Interested</span>
            </span>
          </div>
        );
      }
    }
    const isSubProgramAccepted = programdetails?.sub_programs?.every(
      (program) =>
        ["inprogress", "yettostart"].includes(program?.status)
    );

    if (
      programdetails?.admin_assign_program &&
      isSubProgramAccepted &&
      ![
        "program_join_payment_initiate",
        "program_join_payment_pending",
        "program_join_request_submitted",
        "program_join_request_rejected",
      ].includes(programdetails?.mentee_join_status)
    ) {
      return (
        <MuiButton
          className="!my-5"
          onClick={() => !isLoading && joinAllProgram(programdetails?.id)}
        >
          {isLoading ? "Joining...." : "Join All Program"}
        </MuiButton>
      );
    }

    if (programdetails?.request_data?.status === "rejected") {
      return (
        // <button
        //   className="py-3 mt-7 mb-4 px-16 text-white text-[14px] flex items-center cursor-default"
        //   style={{ ...buttonStyles.base, ...buttonStyles.danger }}
        //   onClick={() => undefined}
        // >
        //   Rejected
        // </button>
        <RejectedTag />
      );
    }

    return (
      <div className="py-9">
        {menteeProgramStatus[programdetails.mentee_join_status] ? (
          <>
            {["new", "pending"].includes(
              programdetails?.request_data?.status
            ) && (
                <button
                  onClick={() => setCancelPopup(true)}
                  className="!border-none bg-red-500 rounded-[3px] text-[#fff] px-6 py-3 font-regular text-sm flex items-center"
                >
                  Cancel Request
                </button>
              )}
            {programdetails.mentee_join_status !==
              menteeProgramStatus.program_join_request_accepted.status && (
                <div className="space-y-4">
                  {searchParams.get("type") !== "program_join" &&
                    !programdetails?.admin_assign_program && (
                      <button
                        className="py-3 px-[0px] text-[15px] flex items-center font-semibold mt-3"
                        style={{
                          ...buttonStyles.base,
                          ...buttonStyles.danger,
                          border: "none !important",
                          cursor: "text",
                          padding: "12px 0px !important"
                        }}
                        onClick={() => undefined}
                      >
                        {menteeProgramStatus[programdetails.mentee_join_status]
                          .type === "waiting" && (
                            <i className="pi pi-clock" style={{ color: "red" }}></i>
                          )}
                        {menteeProgramStatus[programdetails.mentee_join_status]
                          .type === "reject" && (
                            <i className="pi pi-ban" style={{ color: "red" }}></i>
                          )}
                        <span className="pl-3">
                          {
                            menteeProgramStatus[programdetails.mentee_join_status]
                              ?.text
                          }
                        </span>
                      </button>
                    )}
                </div>
              )}
          </>
        ) : null
        // (
        //   !menteeNotJoinCondition.includes(programdetails.status) &&
        //   ![
        //     "program_join_payment_initiate",
        //     "program_join_payment_pending",
        //     "program_join_request_submitted",
        //     "program_join_request_rejected",
        //   ].includes(programdetails?.mentee_join_status) &&
        //   !programdetails?.admin_assign_program && (
        //     <MuiButton
        //       endIcon={
        //         <img
        //           style={{ width: "15px", height: "13px" }}
        //           src={DoubleArrowIcon}
        //           alt="DoubleArrowIcon"
        //         />
        //       }
        //       onClick={() =>
        //         !isLaunchingProgram && handleJoinProgram("program_join")
        //       }
        //     >
        //       {isLaunchingProgram ? "Loading..." : "Join Program"}
        //     </MuiButton>
        //   )
        // )
        
        }
      </div>
    );
  };

  // Render admin specific actions
  const renderAdminActions = () => {
    if (role !== "admin") return null;

    const showRequestButtons =
      programdetails?.status !== "started" && // Exclude "started" status
      (programdetails?.status === "yettoapprove" ||
        (programdetails?.status === "inprogress" &&
          programdetails?.request_data?.status &&
          programdetails?.request_data?.status !== "approved" &&
          programdetails?.request_data?.status !== "rejected") || // Explicit check for "inprogress"
        (programdetails?.request_data?.request_type === "program_reschedule" &&
          programdetails?.request_data?.status === "new") ||
        (programdetails?.request_data?.request_type === "program_cancel" &&
          programdetails?.request_data?.status === "new"));
    // (programdetails?.request_data?.request_type === "program_new" &&
    //   programdetails?.request_data?.status === "new")
    const acceptType = [
      "program_reschedule",
      "program_new",
      "program_cancel",
    ].includes(type);
    if (showRequestButtons && from !== "subprogram" && acceptType) {
      return (
        <Box mt={2}>
          <Stack direction="row" alignItems="center" spacing="20px">
            <button
              className="py-3 px-16 text-white text-[14px] flex items-center"
              style={{ ...buttonStyles.base, ...buttonStyles.danger }}
              onClick={() =>
                handleAcceptCancelProgramRequest("cancel", programdetails.id)
              }
            >
              {searchParams.has("type") &&
                searchParams.get("type") === "program_cancel"
                ? "Continue"
                : "Reject Request"}
            </button>
            <button
              className="py-3 px-16 text-white text-[14px] flex items-center"
              style={{ ...buttonStyles.base, ...buttonStyles.success }}
              onClick={() =>
                handleAcceptCancelProgramRequest("accept", programdetails.id)
              }
            >
              Approve Request
            </button>
          </Stack>
        </Box>
      );
    }
    if (programdetails?.request_data?.status === "approved") {
      return (
        <Box mt={2}>
          {/* <button
            className="py-3 px-16 text-white text-[14px] flex items-center"
            style={{
              ...buttonStyles.base,
              ...buttonStyles.success,
              cursor: "not-allowed",
            }}
            onClick={() => undefined}
          >
            Approved
          </button> */}
          <ApprovedTag />
        </Box>
      );
    }
    if (
      programdetails?.request_data?.status === "rejected" ||
      (!requestStatusParams &&
        programdetails?.status === "new_program_request_rejected")
    ) {
      return (
        <Box mt={2}>
          {/* <button
            className="py-3 px-16 text-white text-[14px] flex items-center"
            style={{
              ...buttonStyles.base,
              ...buttonStyles.danger,
              cursor: "not-allowed",
            }}
            onClick={() => undefined}
          >
            Rejected
          </button> */}
          <RejectedTag />
        </Box>
      );
    }

    if (
      programdetails.status === "yettojoin" &&
      !["new", "pending"].includes(programdetails?.request_data?.status) &&
      programdetails?.created_by === userInfo?.data?.user_id
    ) {
      return (
        <div className="py-9">
          <button
            className="py-3 px-16 text-white text-[14px] flex items-center"
            style={{ ...buttonStyles.base, ...buttonStyles.gradient }}
            onClick={() =>
              !isLaunchingProgram && handleJoinProgram("program_join")
            }
          >
            {isLaunchingProgram ? "loading..." : "Launch Program"}
            <span className="pl-8 pt-1">
              <img
                style={{ width: "15px", height: "13px" }}
                src={DoubleArrowIcon}
                alt="DoubleArrowIcon"
              />
            </span>
          </button>
        </div>
      );
    }

    if (
      programdetails?.status === "yettojoin" &&
      // programdetails?.request_data?.request_type === "program_new"
      programdetails?.request_data?.status === "approved"
    ) {
      return (
        <button
          className="py-3 px-16 text-white text-[14px] flex items-center"
          style={{
            ...buttonStyles.base,
            ...buttonStyles.success,
            cursor: "not-allowed",
          }}
          onClick={() => undefined}
        >
          Mentor yet to launch
        </button>
      );
    }

    return null;
  };

  // Render common status buttons
  const renderCommonStatus = () => {
    if (requestData?.status === "new" && ["mentor", "mentee"].includes(role)) {
      return (
        <>
          {role === "mentee" ? <br /> : ""}
          <div className="!ml-[-12px]">
            <Button btnName="Join this program"
              btnCls="w-[200px]"
              onClick={() => handleOpenAcceptProgram()}
            />
          </div>
        </>
      )
    }
    if (
      ((programdetails.status === programActionStatus.yettostart &&
        !requestId &&
        (role === "mentor" || role === "admin")) ||
        (type === "admin_assign_program" &&
          requestId &&
          programdetails.status === programActionStatus.yettostart &&
          (role === "mentor" || role === "admin"))) &&
      programdetails?.created_by === userInfo?.data?.user_id
    ) {
      return (
        <div className="my-8">
          <button
            className="py-3 px-16 text-white text-[14px] flex items-center"
            style={{ ...buttonStyles.base, ...buttonStyles.gradient }}
            onClick={() =>
              !isLaunchingProgram && handleJoinProgram("program_start")
            }
          >
            {isLaunchingProgram ? "Loading..." : "Start Program"}
          </button>
        </div>
      );
    }

    if (programdetails?.status === "inprogress" && !acceptType) {
      if (
        programdetails?.program_mode === "virtual_meeting" &&
        (role !== "mentee" ||
          (role === "mentee" && programdetails?.program_joined_status)) &&
        ((role === "admin" &&
          programdetails?.created_by === userInfo?.data?.user_id) ||
          role === "mentee" ||
          role === "mentor")
      ) {
        return (
          <div className="my-8">
            <a
              href={programdetails?.meeting_link}
              target="_blank"
              className="py-3 px-16 text-white text-[14px] rounded-sm cursor-pointer"
              style={{ ...buttonStyles.gradient }}
              rel="noreferrer"
            >
              {"Join Meeting"}
            </a>
          </div>
        );
      }
    }

    // Cancelled status
    if ((programdetails.status === "cancelled" && !type && (role === "mentee" || type !== "program_cancel"))) {
      return (
        <div className="flex gap-4 pt-5">
          {/* <button
            className="py-3 px-16 text-white text-[14px] flex items-center"
            style={{
              ...buttonStyles.base,
              ...buttonStyles.danger,
              cursor: "not-allowed",
            }}
            onClick={() => undefined}
          >
            {requestId ? "Program Cancelled" : "Cancelled"}
          </button> */}
          <div className="flex flex-row gap-1 text-[#E0382D] text-[15px] font-semibold">
            {requestId ? <EventBusyIcon /> : <EventBusyIcon />}
            <p>{requestId ? "Program Cancelled" : "Program Cancelled"}</p>
          </div>
        </div>
      );
    }

    if (
      ["new", "pending"].includes(programdetails?.request_data?.status) &&
      role === "mentor" &&
      (type === "program_reschedule" ||
        type === "program_cancel" ||
        type === "program_new") &&
      programdetails?.request_data?.created_by === userInfo?.data?.user_id
    ) {
      return (
        <button
          onClick={() => setCancelPopup(true)}
          className="!border-none bg-red-500 rounded-[3px] text-[#fff] px-6 py-3 font-regular text-sm flex items-center mt-4"
        >
          Cancel Request
        </button>
      );
    }

    if (
      role === "mentor" &&
      programdetails.status === "assign_program_accepted" &&
      from === "subprogram"
    ) {
      return (
        <Button
          btnType="button"
          btnCls="w-[110px] h-11"
          btnName={"Edit"}
          btnCategory="primary"
          onClick={() => navigate(`/update-program/${programdetails?.id}?type=admin_assign_edit`)}
        />
      );
    }

    return null;
  };

  return (
    <div>
      {renderCompletedStatus()}
      {renderMentorActions()}
      {renderMenteeActions()}
      {renderAdminActions()}
      {renderCommonStatus()}
      {/* {renderRequestStatus()} */}
    </div>
  );
};

export default ProgramActions;
