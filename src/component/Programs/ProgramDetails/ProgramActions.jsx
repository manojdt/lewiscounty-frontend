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

const ProgramActions = ({
  role,
  programdetails,
  handleJoinProgram,
  isLaunchingProgram,
  requestId,
  requestStatusParams,
  reqStatusColor,
  reqStatus,
  type,
  handleAcceptCancelProgramRequest,
  setOpenPopup,
  setCancelPopup,
}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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
      <div className="py-9">
        <button
          className="py-3 px-10 text-white text-[14px] flex justify-center items-center"
          style={{
            ...buttonStyles.base,
            ...buttonStyles.gradient,
            ...buttonStyles.width30,
          }}
        >
          Program Completed
        </button>
      </div>
    );
  };

  // Render mentor specific actions
  const renderMentorActions = () => {
    if (role !== "mentor") return null;

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
        programdetails?.request_data?.status === "approved")&&programdetails.status === "assign_program_accepted"
      ) {
        return (
          <div className="flex item-center gap-x-3">

          <button
            className="py-3 px-16 mt-7 text-white text-[14px] flex items-center"
            style={{ ...buttonStyles.base, ...buttonStyles.success }}
            onClick={() => undefined}
          >
            Approved
          </button>
          <button
            className="py-3 px-16 mt-7 text-white text-[14px] flex items-center"
            style={{ ...buttonStyles.base, ...buttonStyles.danger }}
            onClick={() =>  navigate(`/update-program/${programdetails?.id}`)}
          >
            Edit
          </button>
          </div>
        );
      }

      if (programdetails.status === "cancel") {
        return (
          <button
            className="py-3 mt-7 px-16 text-white text-[14px] flex items-center"
            style={{ ...buttonStyles.base, ...buttonStyles.danger }}
            onClick={() => undefined}
          >
            Rejected
          </button>
        );
      }
    }
    const showRequestButtons =
      programdetails?.status === "inprogress" ||// Explicit check for "inprogress"
      (programdetails?.request_data?.request_type === "program_cancel" &&
        programdetails?.request_data?.status === "new");

  if (showRequestButtons) {
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
    // Program approval stage
    if (
      programApprovalStage[programdetails.status] &&
      !programdetails?.admin_program
    ) {
      return (
        <div className="space-y-4 pt-10">
          <button
            className="py-3 px-16 text-white text-[14px] flex items-center"
            style={{
              ...buttonStyles.base,
              ...buttonStyles.danger,
              cursor: "not-allowed",
            }}
            onClick={() => undefined}
          >
            {programApprovalStage[programdetails.status].type === "waiting" && (
              <i className="pi pi-clock" style={{ color: "red" }}></i>
            )}
            {programApprovalStage[programdetails.status].type === "reject" && (
              <i className="pi pi-ban" style={{ color: "red" }}></i>
            )}
            <span className="pl-3">
              {programApprovalStage[programdetails.status]?.text}
            </span>
          </button>

          {["new", "pending"].includes(
            programdetails?.request_data?.status
          ) && (
            <button
              onClick={() => setCancelPopup(true)}
              className="py-3 px-16 text-white text-[14px] flex items-center"
              style={{
                ...buttonStyles.base,
                ...buttonStyles.danger,
              }}
            >
              Cancel Request
            </button>
          )}
        </div>
      );
    }

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

    // Launch program button
    if (programdetails.status === "yettojoin") {
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

    return (
      <div className="py-9">
        {menteeProgramStatus[programdetails.mentee_join_status] ? (
          <>
            {programdetails.mentee_join_status !==
              menteeProgramStatus.program_join_request_accepted.status && (
              <div className="space-y-4">
                <button
                  className="py-3 px-16 text-white text-[14px] flex items-center"
                  style={{
                    ...buttonStyles.base,
                    ...buttonStyles.danger,
                    cursor: "not-allowed",
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
                {["new", "pending"].includes(
                  programdetails?.request_data?.status
                ) && (
                  <button
                    onClick={() => setCancelPopup(true)}
                    className="py-3 px-16 text-white text-[14px] flex items-center"
                    style={{
                      ...buttonStyles.base,
                      ...buttonStyles.danger,
                    }}
                  >
                    Cancel Request
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          !menteeNotJoinCondition.includes(programdetails.status) && (
            <button
              className="py-3 px-16 text-white text-[14px] flex items-center"
              style={{ ...buttonStyles.base, ...buttonStyles.gradient }}
              onClick={() =>
                !isLaunchingProgram && handleJoinProgram("program_join")
              }
            >
              {isLaunchingProgram ? "Loading..." : "Join Program"}
              <span className="pl-8 pt-1">
                <img
                  style={{ width: "15px", height: "13px" }}
                  src={DoubleArrowIcon}
                  alt="DoubleArrowIcon"
                />
              </span>
            </button>
          )
        )}
      </div>
    );
  };

  // Render admin specific actions
  const renderAdminActions = () => {
    if (role !== "admin") return null;

    const showRequestButtons =
      programdetails?.status !== "started" && // Exclude "started" status
      (programdetails?.status === "yettoapprove" ||
        programdetails?.status === "inprogress" || // Explicit check for "inprogress"
        (programdetails?.request_data?.request_type === "program_reschedule" &&
          programdetails?.request_data?.status === "new") ||
        (programdetails?.request_data?.request_type === "program_cancel" &&
          programdetails?.request_data?.status === "new"));

    if (showRequestButtons) {
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
    if (programdetails?.request_data?.status === 'approved') {
      return (
        <Box mt={2}>
          <button
            className='py-3 px-16 text-white text-[14px] flex items-center'
            style={{
              ...buttonStyles.base,
              ...buttonStyles.success,
              cursor: 'not-allowed',
            }}
            onClick={() => undefined}
          >
            Approved
          </button>
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
          <button
            className="py-3 px-16 text-white text-[14px] flex items-center"
            style={{
              ...buttonStyles.base,
              ...buttonStyles.danger,
              cursor: "not-allowed",
            }}
            onClick={() => undefined}
          >
            Rejected
          </button>
        </Box>
      );
    }

    if (
      programdetails.status === "yettojoin" &&
      !programdetails?.admin_program
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
      programdetails?.request_data?.request_type === "program_new"
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
    // Start Program button
    if (
     (programdetails.status === programActionStatus.yettostart && !requestId &&
      (role === 'mentor' || role === 'admin'))|| (type === 'admin_assign_program' && requestId && 
        programdetails.status === programActionStatus.yettostart && 
        (role === 'mentor' || role === 'admin'))
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
    // Cancelled status
    if (programdetails.status === "cancelled") {
      return (
        <div className="flex gap-4 pt-10">
          <button
            className="py-3 px-16 text-white text-[14px] flex items-center"
            style={{
              ...buttonStyles.base,
              ...buttonStyles.danger,
              cursor: "not-allowed",
            }}
            onClick={() => undefined}
          >
          {requestId ? "Program Cancelled":"Cancelled"}
          </button>
        </div>
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
