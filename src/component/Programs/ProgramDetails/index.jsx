import React, { useEffect, useRef, useState } from "react";
import {
  useNavigate,
  useSearchParams,
  useParams,
  useLocation,
  Link,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Backdrop,
  Box,
  CircularProgress,
  Grid,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import {
  pipeUrls,
  programActionStatus,
  programCompleted,
  requestStatus,
  user,
} from "../../../utils/constant";
import { getMenteeJoinedInProgram } from "../../../services/userprograms";
import {
  programCancelRequest,
  programRescheduleRequest,
  updateLocalRequest,
  updateProgramMenteeRequest,
  updateProgramRequest,
} from "../../../services/request";
import PlusCircle from "../../../assets/icons/Pluscircle.svg";
import UserImage from "../../../assets/icons/user-icon.svg";
import ShareIcon from "../../../assets/images/share1x.png";
import ReOpenIcon from "../../../assets/icons/Reopen_icon.svg";
import MoreIcon from "../../../assets/images/more1x.png";
import AbortIcon from "../../../assets/images/abort1x.png";
import LocationIcon from "../../../assets/images/Location1x.png";
import CalendarIcon from "../../../assets/images/calender_1x.png";
import CertificateIcon from "../../../assets/images/certficate1x.png";
import FeedbackIcon from "../../../assets/icons/FeedbackMenu.svg";
import QuoteIcon from "../../../assets/images/quotes1x.png";
import MuiModal from "../../../shared/Modal";
import SuccessTik from "../../../assets/images/blue_tik1x.png";
import LinkIcon from "../../../assets/images/link1x.png";
import TickColorIcon from "../../../assets/icons/tickColorLatest.svg";
import TimeHistoryIcon from "../../../assets/icons/time-history-icon.svg";
import CancelIcon from "../../../assets/images/cancel1x.png";
import CompleteIcon from "../../../assets/images/completed1x.png";
import { Button } from "../../../shared";
import { Button as MuiButton } from "@mui/material";
import {
  capitalizeFirstLetter,
  convertDateFormat,
  formatDateTimeISO,
  formatTableNullValues,
} from "../../../utils";
import "./program-details.css";
import Ratings from "../Ratings";
import { getUserProfile } from "../../../services/profile";
import DataTable from "../../../shared/DataGrid";
import {
  JoinedProgramMenteeColumn,
  RecurringListMenuItems,
  RecurringTableColumns,
} from "../../../mock";
import ToastNotification from "../../../shared/Toast";
import { Calendar } from "primereact/calendar";
import {
  getProgramMentees,
  insertProgramNotes,
} from "../../../services/programInfo";
import ConfirmIcon from "../../../assets/icons/tickColorCircle.svg";
import CloseIcon from "../../../assets/icons/close_x.svg";
import {
  useAcceptProgramMutation,
  useGetSpecificProgramDetailsQuery,
  useLaunchProgramMutation,
  useMarkProgramInterestMutation,
  useUpdateAdminProgramStatusMutation,
  useUpdateProgramStatusMutation,
} from "../../../features/program/programApi.services";
import SubprogramsDataGrid from "./SubProgramTable";
import ProgramActions from "./ProgramActions";
import { toast } from "react-toastify";
import SkillsSet from "../../SkillsSet";
import { CancelPopup } from "../../Mentor/Task/cancelPopup";
import SuccessGradientMessage from "../../success-gradient-message";
import ProgramReasons from "./ProgramReasons";
import { CustomFormFields } from "../../../shared/CustomFormFields/CustomFormFields";
import ColorLocation from "../../../assets/icons/colorLocation.svg";
import Accordian from "../../../shared/Accordian";
import moment from "moment";
import ProgramHistoryIcon from "../../../assets/icons/historyIcon.svg";
import RescheduleIcon from "../../../assets/images/reschedule1x.png";
import Breadcrumbs from "../../Breadcrumbs/Breadcrumbs";
import {
  dashboard_program_details_main,
  program_details,
  program_details_main,
  programStatusBreadcrumbs,
  request_join,
  request_newProgramRequest,
  request_programCancel,
  request_programMenteeCancel,
  request_programReschedule,
  requestPageBreadcrumbs,
  request_mentor_dashboardprogram,
} from "../../Breadcrumbs/BreadcrumbsCommonData";
import EditSVGIcon from "../../../assets/icons/editIcon.svg";
import PaidTickIcon from "../../../assets/icons/paidTickIcon.svg";
import CustomAccordian from "../../../shared/CustomAccordian/CustomAccordian";
import { SubjectProgramCard } from "./subjectProgramCard";
import { MuiCustomModal } from "../../../shared/Modal/MuiCustomModal";
import modal_tick_icon from "../../../assets/icons/modal_tick_icon.svg";
import ProgramCard from "../../../shared/Card/ProgramCard";
import SubDetailCardWrapper from "../../../shared/Card/SubDetailCardWrapper";
import { CustomModal } from "../../../shared/CustomModal/CustomModal";
import { DataGrid } from "@mui/x-data-grid";
import { ThumbDownOffAlt } from "@mui/icons-material";
import { postComment } from "../../../services/feeds";
import CloseCircleIcon from "../../../assets/icons/closeCircle.svg"
import FilterIcon from "../../../assets/icons/filterIcon.svg";
import LanguageIcon from '@mui/icons-material/Language';


export default function ProgramDetails({ setProgramDetailsId }) {
  const [showBackdrop, setShowBackdrop] = React.useState(false);
  const [cancelPopup, setCancelPopup] = useState(false);
  const [feedbackPopup, setFeedbackPopup] = useState(false);
  const [cancelPopupConfirmation, setCancelPopupConfirmation] = useState(false);
  const params = useParams();
  const [searchParams] = useSearchParams();
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const navigate = useNavigate();
  const [
    acceptProgram,
    {
      isSuccess: isAccepted,
      isError: isErrorAccepting,
      reset: resetProgramAccept,
      error,
    },
  ] = useAcceptProgramMutation();

  const [
    markProgramInterest,
    {
      isLoading: markingInterest,
      isSuccess: isInsterestMarked,
      reset: resetMarkInterestState,
      data: markInterestResponseData,
    },
  ] = useMarkProgramInterestMutation();

  const requestId = searchParams.get("request_id") || "";
  const requestStatusParams = searchParams.get("status") || "";
  const program_create_type = searchParams.get("program_create_type") || "";
  const breadcrumbsType = searchParams.get("breadcrumbsType") || "";
  const typeParams = searchParams.get("type");
  const from = searchParams.get("from");
  const topProgram = searchParams.get("topProgram");
  const userdetails = useSelector((state) => state.userInfo);
  const role = userdetails.data.role || "";
  const reqRole = requestId && userdetails.data.role === "admin";
  const [loading, setLoading] = useState({ initial: true, join: false });
  const calendarRef = useRef([]);
  const [acceptingProgramID, setAcceptingProgramID] = useState();
  const [openPopup, setOpenPopup] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [recAnchorEl, setRecAnchorEl] = useState(null);
  const [message, setMessage] = useState(false);
  const [dateFormatted, setDateFormat] = useState({});
  const [taskJoinedRequest, setTaskJoinedRequest] = useState(false);
  const [breadcrumbsArray, setBreadcrumbsArray] = useState([]);
  const [moreMenuModal, setMoreMenuModal] = useState({
    share: false,
    reschedule: false,
    not_interested: false,
    feedback: false
  });
  const [openRecurringModal, setOpenRecurringModal] = useState(false);
  const [gridCellParams, setgridCellParams] = React.useState();
  const [adminProgramCancel, setAdminProgramCancel] = React.useState(false);
  const [cancelProgramActivity, setCancelProgramActivity] =
    React.useState(false);
  const [completeProgram, setCompleteProgram] = React.useState({
    bool: false,
    activity: false,
  });
  const openRecMenu = Boolean(recAnchorEl);
  const dispatch = useDispatch();
  const [
    launchProgram,
    { isLoading: isLaunchingProgram, isError, error: actionError },
  ] = useLaunchProgramMutation();
  const [
    updateProgramStatus,
    {
      isLoading: isProgramUpdating,
      isSuccess: isProgramUpdated,
      isError: IsErrorProgramUpdating,
      error: errorUpdateProgramMessage,
    },
  ] = useUpdateProgramStatusMutation();
  const [
    updateAdminProgramStatus,
    {
      isLoading: isAdminProgramUpdating,
      isSuccess: isAdminProgramUpdated,
      isError: IsErrorAdminProgramUpdating,
      error: errorUpdateAdminProgramMessage,
      reset: resetAdminProgramStatus,
    },
  ] = useUpdateAdminProgramStatusMutation();
  const {
    data: programdetails,
    isLoading: programLoading,
    refetch,
  } = useGetSpecificProgramDetailsQuery(
    {
      id: params?.id,
      requestId: requestId,
      ...(program_create_type && { program_create_type }),
    },
    {
      skip: !params?.id,
      refetchOnMountOrArgChange: true,
    }
  );

  const [activeTab, setActiveTab] = useState("about_program");
  const [ratingModal, setRatingModal] = useState({
    modal: false,
    success: false,
  });
  const [selectedLM, setSelectedLM] = React.useState({
    bool: false,
    data: "",
  });

  const [certificateActiveTab, setCertificateActiveTab] =
    useState("participated");

  const [viewMenteeModal, setViewMenteeModal] = useState(false);
  const [confirmPopup, setConfirmPopup] = useState({
    accept: false,
    cancel: false,
    programId: "",
  });
  const [acceptPopup, setAcceptPopup] = React.useState({
    bool: false,
    activity: false,
    reject: false
  })

  const handleOpenAcceptProgram = () => {
    setAcceptPopup({
      ...acceptPopup,
      bool: true
    })
  }

  const handleCloseAcceptProgram = () => {
    setAcceptPopup({
      bool: false,
      activity: false,
      reject: false
    })
  }

  React.useEffect(() => {
    if (!moreMenuModal.not_interested) {
      setAnchorEl(null);
    }
  }, [moreMenuModal.not_interested]);
  const { profile, loading: profileLoading } = useSelector(
    (state) => state.profileInfo
  );
  const { programMentees } = useSelector((state) => state.programInfo);
  const [formattedProgramMentees, setFormattedProgramMentees] = React.useState(
    []
  );
  React.useMemo(() => {
    if (programMentees) {
      const formattedRowData = formatTableNullValues(programMentees);
      setFormattedProgramMentees(formattedRowData);
    }
  }, [programMentees]);
  const { menteeJoined, status } = useSelector((state) => state.userPrograms);
  const {
    loading: requestLoading,
    status: requestProgramStatus,
    error: requestError,
  } = useSelector((state) => state.requestList);
  const url = `${process.env.REACT_APP_SITE_URL}/program-details/${params.id}`;
  const state = useLocation()?.state;

  const tabs = [
    {
      name: "About Program",
      key: "about_program",
    },
    !programdetails?.sub_programs && {
      name: "Program Testimonials",
      key: "program_testimonials",
    },
  ].filter(Boolean);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const participatedTabs = [
    {
      name: "Participated",
      key: "participated",
    },
    {
      name: "Completed",
      key: "completed",
    },
  ];

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setRecAnchorEl(null);
  };

  const handleTab = (key) => {
    setActiveTab(key);
  };

  const handleRecurringModalClose = () => {
    setOpenRecurringModal(false);
  };

  const handleRecurringListActionClick = (params, event) => {
    if (params.field === "actions") {
      setRecAnchorEl(event.currentTarget);
    }
    setgridCellParams(params.row);
  };

  const handleMenuClick = (action) => {
    switch (action) {
      case "view":
        navigate(`/program-details/${gridCellParams.id}`);
        break;
      case "edit":
        navigate(`/update-program/${gridCellParams.id}`);
        break;

      default:
        break;
    }
    handleClose();
    handleRecurringModalClose();
  };

  const handleCerificateTab = (key) => {
    setCertificateActiveTab(key);
  };
  const handleOpenConfirmPopup = () => {
    handleClose();
    setCompleteProgram({
      ...completeProgram,
      bool: true,
    });
  };

  const handleCloseConfirmPopup = () => {
    setCompleteProgram({
      bool: false,
      activity: false,
    });
    setCancelPopup(false);
  };

  const handleComplete = async () => {
    if (programdetails.admin_assign_program && role === "admin") {
      await updateAdminProgramStatus({
        admin_program: programdetails?.id,
        status: "completed",
        request_type: "admin_program_complete",
      });
    } else {
      await updateProgramStatus({
        id: programdetails?.id,
        status: programActionStatus.completed,
        ...(programdetails.hasOwnProperty("admin_assign_program") && {
          is_admin_program: true,
        }),
      });
    }
  };

  const handleOpenFeedbackPopup = () => {
    handleClose();
    setFeedbackPopup(true);
  };

  useEffect(() => {
    if (isProgramUpdated || (isAdminProgramUpdated && !adminProgramCancel)) {
      setCompleteProgram({
        bool: false,
        activity: true,
      });
      setTimeout(() => {
        setCompleteProgram({
          bool: false,
          activity: false,
        });

        navigate(
          `/program-completion/${programdetails?.id}${"admin_assign_program" in programdetails
            ? `?program_create_type=admin_program`
            : ""
          }`
        );
      }, 2000);
      handleClose();
    }
    if (isAdminProgramUpdated && adminProgramCancel) {
      setMoreMenuModal({ ...moreMenuModal, cancel: false });
      setCancelProgramActivity(true);
      setTimeout(() => {
        setCancelProgramActivity(false);
      }, 3000);
    }
    if (IsErrorProgramUpdating || IsErrorAdminProgramUpdating) {
      toast.error(
        role === "admin" && programdetails?.admin_assign_program
          ? errorUpdateAdminProgramMessage?.data?.errors?.[0]
          : errorUpdateProgramMessage?.data?.error
      );
      handleClose();
      if (IsErrorAdminProgramUpdating) {
        resetAdminProgramStatus();
      }
    }
  }, [
    isProgramUpdated,
    programdetails?.id,
    IsErrorProgramUpdating,
    errorUpdateProgramMessage?.data?.error,
    isAdminProgramUpdated,
    IsErrorAdminProgramUpdating,
    errorUpdateAdminProgramMessage?.data?.error,
  ]);

  const handleJoinProgram = async (request_type) => {
    if (role === "mentee" && !userdetails?.data?.is_registered) {
      navigate(
        `/questions?program_id=${programdetails.id}&breadcrumbsType=${requestPageBreadcrumbs.newMenteeQuestions}`
      );
    } else if (role === "mentee" && !userdetails?.data?.document_upload) {
      navigate(`/mentee-doc-upload/${programdetails.id}`);
    } else {
      await launchProgram({ program: programdetails?.id, request_type });
    }
  };

  const handleAcceptProgram = async (program) => {
    setAcceptingProgramID(program?.id);
    await acceptProgram({
      id: requestId || program?.admin_program_request_id,
      program: program?.id,
      request_type: "program_assign",
      status: "approved",
    });
    setOpenPopup(false);
  };
  // Handle Accept Program Popup
  const handleConfirmPopup = () => {
    if (role === "admin") {
      dispatch(
        updateProgramRequest({
          id: parseInt(requestId),
          status: "approved",
        })
      ).then((res) => {
        if (res?.meta?.requestStatus === "fulfilled") {
          setConfirmPopup({
            ...confirmPopup,
            accept: false,
          });
          refetch();
        }
      });
    }
    if (role === "mentor") {
      dispatch(
        updateProgramMenteeRequest({
          id: parseInt(requestId),
          status: "approved",
        })
      ).then((res) => {
        if (res?.meta?.requestStatus === "fulfilled") {
          setConfirmPopup({
            ...confirmPopup,
            accept: false,
          });
          refetch();
        }
      });
    }
  };

  // Handle Submit Cancel Program Popup
  const handleCancelReasonPopupSubmit = (data) => {
    if (data.cancel_reason !== "") {
      if (confirmPopup.cancel) {
        if (role === "admin") {
          dispatch(
            updateProgramRequest({
              id: parseInt(requestId),
              status: "rejected",
              reason: data.cancel_reason,
            })
          ).then((res) => {
            if (res?.meta?.requestStatus === "fulfilled") {
              setConfirmPopup({
                ...confirmPopup,
                cancel: false,
              });
              refetch();
            }
          });
        }

        if (role === "mentor") {
          dispatch(
            updateProgramMenteeRequest({
              id: parseInt(requestId),
              status: "rejected",
              rejection_reason: data.cancel_reason,
            })
          ).then((res) => {
            if (res?.meta?.requestStatus === "fulfilled") {
              setConfirmPopup({
                ...confirmPopup,
                cancel: false,
              });
              refetch();
            }
          });
        }
      }
    }
  };

  // Accept / Cancel Program Request
  const handleAcceptCancelProgramRequest = (action, programid) => {
    let popup = { ...confirmPopup, programId: programid };
    if (action === "accept") {
      setConfirmPopup({ ...popup, accept: true });
    }
    if (action === "cancel") {
      setConfirmPopup({ ...popup, cancel: true });
    }
  };

  // Handle Close Accept / Cancel Popup
  const resetAcceptCancelPopup = () => {
    setConfirmPopup({ accept: false, cancel: false, programId: "" });
  };

  const handleInstructor = (programdetails) => {
    const mentorId = programdetails?.mentor_info?.id
      ? programdetails?.mentor_info?.id
      : programdetails?.created_by
        ? programdetails?.created_by
        : "";

    // if (mentorId !== '' && mentorId !== userdetails?.data?.user_id) {
    navigate(
      `/mentor-profile/${mentorId}?type=view&breadcrumbsType=${requestPageBreadcrumbs.ProgramsDetails}`
    );
    // }
  };

  const ratingModalSuccess = () => {
    setRatingModal({ modal: false, success: true });
  };

  const ratingModalClose = () => {
    setRatingModal({ modal: false, success: false });
  };

  const handleViewJoinedMentees = (programInfo) => {
    dispatch(getProgramMentees(programInfo?.id));
    setViewMenteeModal(true);
  };

  const JoinMenteeColumn = [
    ...JoinedProgramMenteeColumn,
    {
      field: "action",
      headerName: "View",
      width: 150,
      id: 3,
      renderCell: (params) => {
        return (
          <button
            style={{
              background: "rgb(29, 91, 191)",
              color: "rgb(255, 255, 255)",
              padding: "2px 20px",
              height: "32px",
              margin: "9px 0px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "3px",
            }}
            onClick={() =>
              navigate(
                `/mentee-details/${params.row?.id}?breadcrumbsType=${requestPageBreadcrumbs.menteesProfileCounts}`
              )
            }
          >
            {" "}
            View Profile{" "}
          </button>
        );
      },
    },
  ];

  const handleMenu = (key) => {
    switch (key) {
      case "create-task":
        navigate("/assign-mentees/1");
        handleClose();
        break;
      case "share":
        setMoreMenuModal({ ...moreMenuModal, share: true });
        handleClose();
        break;
      case "reschedule":
        setMoreMenuModal({ ...moreMenuModal, reschedule: true });
        handleClose();
        break;

      case "cancel":
        setMoreMenuModal({ ...moreMenuModal, reschedule: false, cancel: true });
        handleClose();
        break;
      case "feedback":
        setMoreMenuModal({ ...moreMenuModal, feedback: true });
        handleClose();
        break;
      case "discussion":
        break;
      case "edit":
        navigate(`/update-program/${params?.id}`);
        break;
      case "editadmin":
        navigate(
          `/update-program/${params?.id}?program_create_type=admin_program`
        );
        break;
      case "not_interested":
        setMoreMenuModal({ ...moreMenuModal, not_interested: true });
        break;
      default:
        break;
    }
  };
  const handleBreadcrumbs = (key) => {
    const decodedKey = decodeURIComponent(key);
    // Get 'type' from URL search params
    const searchParams = new URLSearchParams(window.location.search);
    const type = searchParams.get("statustype");

    // Define labels based on 'type'
    const typeLabels = {
      yettojoin: "Active Programs",
      yettostart: "Recently Joined Programs",
      inprogress: "Ongoing Programs",
    };
    // Get the correct label for the current type
    const typeLabel = typeLabels[type] || "All Programs";
    const program_detailsData = program_details(
      state?.from,
      programdetails?.program_name
    );
    const program_New = request_newProgramRequest(programdetails?.program_name);
    const program_re = request_programReschedule(programdetails?.program_name);
    const program_cancel = request_programCancel(programdetails?.program_name);
    const mentor_dashboard_program = request_mentor_dashboardprogram(
      programdetails?.program_name,
      type,
      typeLabel
    );
    const dashBoardProgram = dashboard_program_details_main(
      programdetails?.program_name
    );
    const program_mentee_cancel = request_programMenteeCancel(
      programdetails?.program_name
    );
    const admin_approvedreport = request_join(programdetails?.program_name);
    if (programStatusBreadcrumbs.includes(decodedKey)) {
      setBreadcrumbsArray(
        program_details_main(programdetails?.program_name, decodedKey)
      );
      return;
    }
    switch (key) {
      case "program":
        setBreadcrumbsArray(program_detailsData);
        break;
      case requestPageBreadcrumbs.program_new:
        setBreadcrumbsArray(program_New);
        break;
      case requestPageBreadcrumbs.program_reschedule:
        setBreadcrumbsArray(program_re);
        break;
      case requestPageBreadcrumbs.program_cancel:
        setBreadcrumbsArray(program_cancel);
        break;
      case requestPageBreadcrumbs.program_mentee_cancel:
        setBreadcrumbsArray(program_mentee_cancel);
        break;
      case requestPageBreadcrumbs.program_join_request_admin:
        setBreadcrumbsArray(admin_approvedreport);
        break;
      case requestPageBreadcrumbs.dashboardPrograms:
        setBreadcrumbsArray(dashBoardProgram);
        break;
      case requestPageBreadcrumbs.mentorDashboardProgram:
        setBreadcrumbsArray(mentor_dashboard_program);
        break;
      case "discussion":
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    if (breadcrumbsType && programdetails?.program_name) {
      handleBreadcrumbs(breadcrumbsType);
    } else {
      handleBreadcrumbs("program");
    }
  }, [breadcrumbsType, programdetails]);

  const handleMoreMenuClosePopup = () => {
    setMoreMenuModal({ share: false, reschedule: false, cancel: false, feedback: false });
    reset();
  };

  const handleDateClick = () => {
    setTimeout(() => {
      document
        .querySelector(".p-datepicker")
        ?.classList.add("program-date-picker");
    }, 200);
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setMessage(true);
      })
      .catch(() => {
        setMessage(false);
      });
  };

  const handleCloseNotify = () => {
    setMessage(false);
  };

  const onSubmit = (data) => {
    if (moreMenuModal.reschedule) {
      const formattedStartDate = convertDateFormat(data.reschedule_start_date);
      const formattedEndDate = convertDateFormat(data.reschedule_end_date);

      const payload = {
        // reschedule_start_date: formattedStartDate,
        // reschedule_end_date: formattedEndDate,
        // program_id: params.id,
        // reason: data.reason,

        request_type: "program_reschedule",
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        program: params.id,
        comments: data?.reason,
      };
      dispatch(programRescheduleRequest(payload));
    }

    if (moreMenuModal.cancel) {
      if (
        programdetails.hasOwnProperty("admin_assign_program") &&
        role === "admin"
      ) {
        setAdminProgramCancel(true);
        updateAdminProgramStatus({
          admin_program: programdetails?.id,
          status: "cancelled",
          request_type: "admin_program_cancel",
          rejection_reason: data.cancel_reason,
        });
      } else {
        dispatch(
          programCancelRequest({
            program: params.id,
            comments: data.cancel_reason,
            request_type: "program_cancel",
          })
        ).then((res) => {
          refetch();
        });
      }
    }
    if (moreMenuModal.feedback) {
      dispatch(
        postComment({
          program_id: params.id,
          content: data.feedback,
        })
      ).then(() => {
        setMoreMenuModal({ ...moreMenuModal, feedback: false });
        setFeedbackSuccess(true);
        setTimeout(() => {
          setFeedbackSuccess(false);
        }, 1000);
      });
    }
  };

  const handleMarkInterestClick = async (isIntersted) =>
    await markProgramInterest({
      program_id: programdetails?.id,
      interest: isIntersted,
    });

  const handleCancel = () => {
    setMoreMenuModal({ ...moreMenuModal, not_interested: false });
  };

  useEffect(() => {
    if (isInsterestMarked) {
      setShowBackdrop(true);

      // Set timeout to handle cleanup after 3 seconds
      const timer = setTimeout(() => {
        // Reset all states
        setShowBackdrop(false);

        // Only navigate on success cases
        if (isInsterestMarked) {
          handleCancel();
          resetMarkInterestState();
        }
      }, 2000);
      return () => {
        clearTimeout(timer);
        resetMarkInterestState();
      };
    }
  }, [isInsterestMarked]);

  useEffect(() => {
    if (ratingModal.success) {
      setTimeout(() => {
        setRatingModal({ modal: false, success: false });
      }, 3000);
    }
  }, [ratingModal.success]);

  useEffect(() => {
    if (
      programdetails &&
      Object.keys(programdetails)?.length &&
      !programLoading
    ) {
      if (
        role === "mentee" &&
        programdetails.status === "completed" &&
        !programdetails.mentee_program_rating &&
        !topProgram
      ) {
        setRatingModal({ modal: true, success: false });
      }

      setLoading({ ...loading, initial: false });
    }
  }, [programdetails, menteeJoined]);

  const handleCancelSubmit = (reason) => {
    if (role === "mentor") {
      dispatch(
        updateProgramMenteeRequest({
          id: programdetails?.request_data?.id,
          status: "rejected",
          rejection_reason: reason,
        })
      ).then((res) => {
        if (res?.meta?.requestStatus === "fulfilled") {
          // handleCloseCancelReasonPopup();
          setCancelPopup(false);
          setCancelPopupConfirmation(true);
          setTimeout(() => {
            setCancelPopupConfirmation(false);
            refetch();
          }, 2000);
        }
      });
    }

    if (role === "mentee") {
      dispatch(
        updateProgramRequest({
          id: programdetails?.request_data?.id,
          status: "rejected",
          reason: reason,
        })
      ).then((res) => {
        if (res?.meta?.requestStatus === "fulfilled") {
          setCancelPopup(false);
          setCancelPopupConfirmation(true);
          setTimeout(() => {
            setCancelPopupConfirmation(false);
            refetch();
          }, 2000);
        }
      });
    }
  };

  useEffect(() => {
    const programId = params.id;
    if (programId && programId !== "") {
      if (role === "mentee") {
        dispatch(getMenteeJoinedInProgram({ id: programId }));
      }
    }

    if (!Object.keys(profile)?.length) {
      dispatch(getUserProfile());
    }
  }, [params.id, role]);

  useEffect(() => {
    if (status === programActionStatus.yettostart) {
      setLoading({ initial: false, join: true });
    }
  }, [status]);

  useEffect(() => {
    if (requestProgramStatus === requestStatus.programupdate) {
      setTimeout(() => {
        setConfirmPopup({ accept: false, cancel: false, programId: "" });
        dispatch(updateLocalRequest({ status: "" }));
      }, [2000]);
    }

    if (
      requestProgramStatus === requestStatus.reschedule ||
      requestProgramStatus === requestStatus.cancel
    ) {
      setMoreMenuModal({ share: false, reschedule: false });
      reset();
      setDateFormat({});
      setTimeout(() => {
        dispatch(updateLocalRequest({ status: "" }));
      }, 3000);
    }
  }, [requestProgramStatus]);

  useEffect(() => {
    if (loading.join) {
      if (role === "mentee") setTaskJoinedRequest(true);
      setTimeout(() => {
        setLoading({ ...loading, join: false });

        // if (role === 'mentor') navigate(`${pipeUrls.programtask}/${programdetails.id}`)
        if (role === "mentee") setTaskJoinedRequest(false);
      }, [3000]);
    }
  }, [loading.join]);

  const dateStartField = moreMenuModal.reschedule
    ? register("reschedule_start_date", { required: "This field is required" })
    : undefined;
  const dateEndField = moreMenuModal.reschedule
    ? register("reschedule_end_date", { required: "This field is required" })
    : undefined;

  useEffect(() => {
    if (isError) {
      toast.error(actionError?.data?.errors?.[0]);
    }
  }, [actionError, isError]);

  useEffect(() => {
    if (isAccepted) {
      const timer = setTimeout(() => {
        resetProgramAccept();
        navigate(`/update-program/${acceptingProgramID}`);
      }, 3000);
      return () => clearTimeout(timer);
    }
    if (isErrorAccepting) {
      toast.error(error?.data?.error);
    }
  }, [error?.data, isAccepted, isErrorAccepting, acceptingProgramID]);

  const handleNewTaskFromAdmin = (data) => {
    const constructedData = {
      ...data,

      program_category_name: programdetails?.category_name,
      program_name: programdetails?.program_name,
      program_startdate: programdetails?.start_date,
      program_enddate: programdetails?.end_date,
      task_name: programdetails?.task_name ?? "",
      reference_link: programdetails?.reference_links ?? "",
      task_details: programdetails?.task_details ?? "",
      due_date: programdetails?.due_date,
      // "assign_task_id": null,
      list_mentees: programdetails?.participated_mentees,
      program_id: programdetails?.id,
      program_duration: programdetails?.duration,
      category_id: programdetails?.categories?.[0]?.id,
      // "mentor_id": programdetails?.created_by,
      mentor_name: programdetails?.mentor_name,
      // "task_id": null,
      state_date: programdetails?.start_date,
    };

    navigate(`/assign-mentees/?type=edit&from=program`, {
      state: {
        data: constructedData,
      },
    });
  };

  const notesFields = [
    {
      type: "date",
      label: "Date",
      isRequired: true,
      col: 4,
      key: "date",
      minDate: programdetails?.start_date,
      maxDate: programdetails?.end_date,
      isDisable: true,
    },
    {
      type: "time",
      label: "Time",
      isRequired: true,
      col: 4,
      key: "time",
      isDisable: true,
    },
    {
      type: "textbox",
      label: "Address",
      isRequired: true,
      col: 4,
      key: "location",
      endAdornment: <img src={ColorLocation} alt="color_location" />,
      background: "#FFF8F2",
    },
    {
      type: "textarea",
      label: "Comment",
      isRequired: true,
      col: 12,
      key: "comment",
      background: "#FFF8F2",
    },
  ];
  const [notesActivity, setNotesActivity] = React.useState(false);
  const [notesForm, setNotesForm] = React.useState({
    date: new Date(),
    time: new Date(),
    location: "",
    comment: "",
    error: {
      date: "",
      time: "",
      location: "",
      comment: "",
    },
  });

  const updateState = (key, value) => {
    setNotesForm({
      ...notesForm,
      [key]: value,
      error: {
        ...notesForm?.error,
        [key]: "",
      },
    });
  };

  const handleValidate = () => {
    let error = notesForm.error;
    let isValid = true;
    if (notesForm?.date === "") {
      isValid = false;
      error.date = "Date is Required";
    }
    if (notesForm?.time === "") {
      isValid = false;
      error.time = "Time is Required";
    }
    if (notesForm?.location === "") {
      isValid = false;
      error.location = "Location is Required";
    }
    if (notesForm?.comment === "") {
      isValid = false;
      error.comment = "Comment is Required";
    }
    setNotesForm({
      ...notesForm,
      error: error,
    });
    return isValid;
  };

  const handleSubmitNotes = () => {
    if (handleValidate()) {
      const payload = {
        post_date: moment(notesForm?.date).format("yyyy-MM-DD"),
        post_time: moment(notesForm?.time).format("hh:mm"),
        address: notesForm?.location,
        description: notesForm?.comment,
        program: params.id,
      };
      dispatch(insertProgramNotes(payload)).then((res) => {
        if (res?.meta?.requestStatus === "fulfilled") {
          setNotesForm({
            date: new Date(),
            time: new Date(),
            location: "",
            comment: "",
          });
          setNotesActivity(true);
          setTimeout(() => {
            setNotesActivity(false);
          }, 2000);
        }
      });
    }
  };

  // payment status start
  const start_date = moment(programdetails?.start_date);
  const current_date = moment();
  const daysDifference = start_date.diff(current_date, "days");

  let statusMessage;

  if (daysDifference > 3) {
    statusMessage = `${daysDifference} more days left`;
  } else if (daysDifference === 0) {
    statusMessage = "Program is started today!";
  } else if (daysDifference < 0) {
    const absDifference = Math.abs(daysDifference);
    statusMessage = `Program started ${absDifference} day${absDifference > 1 ? "s" : ""
      } ago`;
  } else {
    statusMessage = `${daysDifference} day${daysDifference > 1 ? "s" : ""
      } left for the program to start`;
  }

  const handleNavigation = (programdetails) => {
    let baseUrl = pipeUrls.programdetails;
    if (Object.keys(programdetails).length) {
      navigate(
        `${baseUrl}/${programdetails.program || programdetails?.id}${programdetails?.admin_program_request_id
          ? `?request_id=${programdetails?.admin_program_request_id}&type=admin_assign_program`
          : "admin_assign_program" in programdetails
            ? `?program_create_type=admin_program`
            : ""
        }${programdetails?.admin_program_request_id ||
          "admin_assign_program" in programdetails
          ? "&"
          : "?"
        }`
      );
    }
  };

  const userStatusColumns = [
    {
      field: "full_name",
      headerName: "Name",
      flex: 1,
      id: 0,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      id: 5,
      sortable: false, // Remove default sorting
      renderHeader: (params) => (
        <div className="flex items-center gap-1">
          <span className="font-semibold">{params.colDef.headerName}</span>
          <img
            src={FilterIcon}
            alt="Filter"
            className="w-4 h-4 cursor-pointer pt-1"
            onClick={(e) => {
              e.stopPropagation();
              // Call your filter function here
              // handleFilterIconClick(e);
            }}
          />
        </div>
      ),
      renderCell: (params) => {
        return (
          <div className="flex gap-2 items-center">
            {" "}
            {capitalizeFirstLetter(params?.row?.role)}
          </div>
        );
      },
    },
    {
      field: "full_name",
      headerName: "Name",
      flex: 1,
      id: 0,
    },
    {
      field: "full_name",
      headerName: "Name",
      flex: 1,
      id: 0,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      id: 5,
      sortable: false, // Remove default sorting
      renderHeader: (params) => (
        <div className="flex items-center gap-1">
          <span className="font-semibold">{params.colDef.headerName}</span>
          <img
            src={FilterIcon}
            alt="Filter"
            className="w-4 h-4 cursor-pointer pt-1"
            onClick={(e) => {
              e.stopPropagation();
              // Call your filter function here
              // handleFilterIconClick(e);
            }}
          />
        </div>
      ),
      renderCell: (params) => {
        return (
          <div className="flex gap-2 items-center">
            {" "}
            {capitalizeFirstLetter(params?.row?.role)}
          </div>
        );
      },
    },
  ]

  return (
    <div className="px-4 sm:px-4 md:px-6 lg:px-9 xl:px-9 my-6 md:grid lg:grid xl:grid">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={
          loading.initial || loading.join || programLoading || requestLoading
        }
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={ratingModal.success}
      >
        <div className="px-5 py-1 flex justify-center items-center">
          <div
            className="flex justify-center items-center flex-col gap-[2.25rem] py-[4rem] px-[3rem] mt-20 mb-20"
            style={{ background: "#fff", borderRadius: "10px" }}
          >
            <img src={SuccessTik} alt="SuccessTik" />
            <p
              className="text-[16px] font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#1D5BBF] to-[#00AEBD]"
              style={{
                fontWeight: 600,
                color: "#232323",
              }}
            >
              Thank you for providing the rating for this program
            </p>
          </div>
        </div>
      </Backdrop>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={completeProgram.bool}
      >
        <div className="popup-content w-2/6 md:w-2/4 sm:w-2/4 bg-white flex flex-col gap-2 h-[330px] justify-center items-center">
          <img src={TickColorIcon} alt="TickColorIcon" />
          <span
            style={{
              color: "#232323",
              fontWeight: 600,
              fontSize: "24px",
            }}
          >
            Complete
          </span>
          <div className="py-5">
            <p
              style={{
                color: "rgba(24, 40, 61, 1)",
                fontWeight: 600,
                fontSize: "18px",
              }}
            >
              Are you sure want to complete the program?
            </p>
          </div>
          <div className="flex justify-center">
            <div className="flex gap-6 justify-center align-middle">
              <Button
                btnCls="w-[110px]"
                btnName={"No"}
                btnCategory="secondary"
                onClick={handleCloseConfirmPopup}
              />
              <Button
                btnType="button"
                btnCls="w-[110px]"
                btnName={"Yes"}
                style={{ background: "#16B681" }}
                btnCategory="primary"
                onClick={handleComplete}
              />
            </div>
          </div>
        </div>
      </Backdrop>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={completeProgram.activity}
      >
        <div className="px-5 py-1 flex justify-center items-center">
          <div
            className="flex justify-center items-center flex-col gap-[2.25rem] py-[4rem] px-[3rem] mt-20 mb-20"
            style={{ background: "#fff", borderRadius: "10px" }}
          >
            <img src={SuccessTik} alt="SuccessTik" />
            <p
              className="text-[16px] font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#1D5BBF] to-[#00AEBD]"
              style={{
                fontWeight: 600,
              }}
            >
              Program Completed successfully
            </p>
          </div>
        </div>
      </Backdrop>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={feedbackSuccess}
      >
        <div className="px-5 py-1 flex justify-center items-center">
          <div
            className="flex justify-center items-center flex-col gap-[2.25rem] py-[4rem] px-[3rem] mt-20 mb-20"
            style={{ background: "#fff", borderRadius: "10px" }}
          >
            <img src={SuccessTik} alt="SuccessTik" />
            <p
              className="text-[16px] font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#1D5BBF] to-[#00AEBD]"
              style={{
                fontWeight: 600,
              }}
            >
              Feedback Submitted Successfully
            </p>
          </div>
        </div>
      </Backdrop>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isAccepted}
      >
        <div className="px-5 py-1 flex justify-center items-center">
          <div
            className="flex justify-center items-center flex-col gap-[2.25rem] py-[4rem] px-[3rem] mt-20 mb-20"
            style={{ background: "#fff", borderRadius: "10px" }}
          >
            <img src={SuccessTik} alt="SuccessTik" />
            <p
              className="text-[16px] font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#1D5BBF] to-[#00AEBD]"
              style={{
                fontWeight: 600,
              }}
            >
              Program accepted successfully
            </p>
          </div>
        </div>
      </Backdrop>

      <Ratings
        open={ratingModal.modal}
        modalSuccess={ratingModalSuccess}
        modalClose={ratingModalClose}
      />

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={
          requestProgramStatus === requestStatus.reschedule ||
          requestProgramStatus === requestStatus.cancel ||
          cancelProgramActivity
        }
      >
        <div className="px-5 py-1 flex justify-center items-center">
          <div
            className="flex justify-center items-center flex-col gap-[2.25rem] py-[4rem] px-[3rem] mt-20 mb-20"
            style={{ background: "#fff", borderRadius: "10px" }}
          >
            <img src={SuccessTik} alt="SuccessTik" />
            <p
              className="text-[16px] font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#1D5BBF] to-[#00AEBD]"
              style={{
                fontWeight: 600,
              }}
            >
              Program{" "}
              {requestProgramStatus === requestStatus.reschedule
                ? "Rescheduled "
                : requestProgramStatus === requestStatus.cancel ||
                  cancelProgramActivity
                  ? "Cancelled "
                  : ""}{" "}
              Successfully
            </p>
          </div>
        </div>
      </Backdrop>

      {/* Program Request Updated Popup */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={requestProgramStatus === requestStatus.programupdate}
      >
        <div className="px-5 py-1 flex justify-center items-center">
          <div
            className="flex justify-center items-center flex-col gap-[2.25rem] py-[4rem] px-[3rem] mt-20 mb-20"
            style={{ background: "#fff", borderRadius: "10px" }}
          >
            <img src={SuccessTik} alt="SuccessTik" />
            <p
              className="text-[16px] font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#1D5BBF] to-[#00AEBD]"
              style={{
                fontWeight: 600,
              }}
            >
              {programdetails?.program_name} Request is Successfully updated
            </p>
          </div>
        </div>
      </Backdrop>

      <MuiModal
        modalSize="md"
        modalOpen={viewMenteeModal}
        modalClose={undefined}
        noheader
      >
        <div className="px-0 sm:px-0 md:px-5 lg:px-5 xl:px-5 py-5">
          <div
            className="flex justify-center flex-col gap-5  mt-4 mb-4"
            style={{
              border: "1px solid rgba(29, 91, 191, 1)",
              borderRadius: "10px",
            }}
          >
            <div
              className="flex justify-between px-3 py-4 items-center"
              style={{ borderBottom: "1px solid rgba(29, 91, 191, 1)" }}
            >
              <p className="text-[18px]" style={{ color: "rgba(0, 0, 0, 1)" }}>
                Joining Mentees{" "}
              </p>
              <img
                className="cursor-pointer"
                onClick={() => setViewMenteeModal(false)}
                src={CancelIcon}
                alt="CancelIcon"
              />
            </div>
            <div className="px-5">
              <DataTable
                rows={formattedProgramMentees ?? []}
                columns={JoinMenteeColumn}
                hideCheckbox
              />
            </div>
          </div>
        </div>
      </MuiModal>

      {/* Program Accept Popup */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={confirmPopup.accept}
      >
        <div className="popup-content w-2/6 md:w-2/4 sm:w-2/4 bg-white flex flex-col gap-2 h-[330px] justify-center items-center">
          <img src={TickColorIcon} alt="TickColorIcon" />
          <span style={{ color: "#232323", fontWeight: 600, fontSize: "24px" }}>
            Approve
          </span>
          <div className="py-5">
            <p
              style={{
                color: "rgba(24, 40, 61, 1)",
                fontWeight: 600,
                fontSize: "18px",
              }}
            >
              Are you sure want to approve Program Request?
            </p>
          </div>
          <div className="flex justify-center">
            <div className="flex gap-6 justify-center align-middle">
              <Button
                btnCls="w-[110px]"
                btnName={"Cancel"}
                btnCategory="secondary"
                onClick={resetAcceptCancelPopup}
              />
              <Button
                btnType="button"
                btnCls="w-[110px]"
                btnName={"Approve"}
                style={{ background: "#16B681" }}
                btnCategory="primary"
                onClick={handleConfirmPopup}
              />
            </div>
          </div>
        </div>
      </Backdrop>

      {/* Program Cancel Popup */}
      {confirmPopup.cancel && (
        <MuiModal
          modalSize="md"
          modalOpen={confirmPopup.cancel}
          modalClose={resetAcceptCancelPopup}
          noheader
        >
          <div className="px-0 sm:px-0 md:px-5 lg:px-5 xl:px-5 py-5">
            <div
              className="flex justify-center flex-col gap-5  mt-4 mb-4"
              style={{
                border: "1px solid rgba(29, 91, 191, 1)",
                borderRadius: "10px",
              }}
            >
              <div
                className="flex justify-between px-3 py-4 items-center"
                style={{ borderBottom: "1px solid rgba(29, 91, 191, 1)" }}
              >
                <p
                  className="text-[18px]"
                  style={{ color: "rgba(0, 0, 0, 1)" }}
                >
                  Reject Reason{" "}
                </p>
                <img
                  className="cursor-pointer"
                  onClick={resetAcceptCancelPopup}
                  src={CancelIcon}
                  alt="CancelIcon"
                />
              </div>

              <div className="px-5">
                {requestError !== "" ? (
                  <p className="error" role="alert">
                    {requestError}
                  </p>
                ) : null}

                <form onSubmit={handleSubmit(handleCancelReasonPopupSubmit)}>
                  <div className="relative pb-8">
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Reject Reason
                    </label>

                    <div className="relative">
                      <textarea
                        {...register("cancel_reason", {
                          required: "This field is required",
                        })}
                        id="message"
                        rows="4"
                        className={`block p-2.5 input-bg w-full text-sm text-gray-900  border
                                    focus-visible:outline-none focus-visible:border-none`}
                        style={{ border: "2px solid rgba(229, 0, 39, 1)" }}
                        placeholder={""}
                      ></textarea>
                      {errors["cancel_reason"] && (
                        <p className="error" role="alert">
                          {errors["cancel_reason"].message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center gap-5 items-center pt-5 pb-10">
                    <Button
                      btnName="Cancel"
                      btnCls="w-[40%] sm:w-[40%] md:w-[20%] lg:w-[15%] xl:w-[15%]"
                      btnCategory="secondary"
                      onClick={resetAcceptCancelPopup}
                    />
                    <button
                      type="submit"
                      className="text-white py-3 px-7 w-[40%] sm:w-[40%] md:w-[20%] lg:w-[15%] xl:w-[15%]"
                      style={{
                        background:
                          "linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)",
                        borderRadius: "3px",
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </MuiModal>
      )}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading.join && role === "mentor"}
      >
        <div className="px-5 py-1 flex justify-center items-center">
          <div
            className="flex justify-center items-center flex-col gap-[2.25rem] py-[4rem] px-[3rem] mt-20 mb-20"
            style={{ background: "#fff", borderRadius: "10px" }}
          >
            <img src={SuccessTik} alt="SuccessTik" />
            <p
              className="text-[16px] font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#1D5BBF] to-[#00AEBD]"
              style={{
                fontWeight: 600,
              }}
            >
              Successfully Launched a program
            </p>
          </div>
        </div>
      </Backdrop>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={taskJoinedRequest}
      >
        <div className="px-5 py-1 flex justify-center items-center">
          <div
            className="flex justify-center items-center flex-col gap-[2.25rem] py-[4rem] px-[3rem] mt-20 mb-20"
            style={{ background: "#fff", borderRadius: "10px" }}
          >
            <img src={SuccessTik} alt="SuccessTik" />
            <p
              className="text-[16px] font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#1D5BBF] to-[#00AEBD]"
              style={{
                fontWeight: 600,
              }}
            >
              Program join request submitted successfully to Mentor
            </p>
          </div>
        </div>
      </Backdrop>

      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={openPopup}
      >
        <div className="popup-content w-2/6 md:w-2/4 sm:w-2/4 bg-white flex flex-col gap-2 h-[330px] p-[12px] justify-center items-center">
          <div className="h-[100%] w-[100%] justify-center items-center flex flex-col relative">
            <div
              className="absolute top-[12px] right-[12px] cursor-pointer"
              onClick={() => setOpenPopup(false)}
            >
              <img src={CloseIcon} alt="ConfirmIcon" />
            </div>
            <img src={ConfirmIcon} alt="ConfirmIcon" />

            <div className="py-5">
              <p
                style={{
                  color: "rgba(24, 40, 61, 1)",
                  fontWeight: 600,
                  fontSize: "18px",
                }}
              >
                Are you sure you want to Accept this Program?
              </p>
            </div>
            <div className="flex justify-center">
              <div className="flex gap-6 justify-center align-middle">
                <Button
                  btnName="No"
                  btnCategory="secondary"
                  btnCls="border !border-[#1D5BBF] !text-[#1D5BBF] w-[120px]"
                  onClick={() => setOpenPopup(false)}
                />
                <Button
                  btnType="button"
                  btnCls="w-[120px]"
                  btnName={"Yes"}
                  btnCategory="primary"
                  onClick={() => {
                    handleAcceptProgram(programdetails);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </Backdrop>

      {message && (
        <ToastNotification
          openToaster={message}
          message={"URL copied!"}
          handleClose={handleCloseNotify}
          toastType={"success"}
        />
      )}

      <MuiModal
        modalOpen={moreMenuModal.share}
        modalClose={handleMoreMenuClosePopup}
        noheader
      >
        <div
          className="px-5 py-1 flex justify-center items-center"
          style={{ border: "1px solid rgba(29, 91, 191, 1)" }}
        >
          <div className="flex justify-center items-center flex-col gap-8 py-10 px-20 mt-5">
            <div>{programdetails?.program_name}</div>
            <input
              className="input-bg text-xs 
          h-12 sm:h-14 md:h-[60px]
          w-full sm:w-80 md:w-96
          px-4 sm:px-5
          rounded-3xl
          text-center sm:text-left
          whitespace-normal sm:whitespace-nowrap
          overflow-hidden
          disabled:bg-gray-100
          disabled:text-gray-700"
              disabled
              value={url}
              style={{
                textOverflow: "ellipsis",
              }}
            />
            <div className="flex gap-7">
              <img
                className="cursor-pointer"
                src={LinkIcon}
                alt="LinkIcon"
                onClick={handleCopy}
              />
            </div>

            <div className="flex  justify-center align-middle pt-4">
              <Button
                btnType="button"
                onClick={handleMoreMenuClosePopup}
                btnName="Close"
                btnCategory="primary"
              />
            </div>
          </div>
        </div>
      </MuiModal>

      {moreMenuModal.reschedule && (
        <MuiModal
          modalOpen={moreMenuModal.reschedule}
          modalClose={handleMoreMenuClosePopup}
          noheader
        >
          <div style={{ border: "1px solid rgba(29, 91, 191, 1)" }}>
            <div
              className="flex justify-between items-center px-3 py-4 mx-1"
              style={{ borderBottom: "1px solid rgba(29, 91, 191, 1)" }}
            >
              <div>Reschedule {programdetails.name}</div>
              <img
                className="cursor-pointer"
                onClick={() =>
                  setMoreMenuModal({ share: false, reschedule: false })
                }
                src={CancelIcon}
                alt="CancelIcon"
              />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="px-4 py-7">
                <div className="flex flex-wrap gap-4">
                  <div
                    className={`relative mb-6 w-full sm:w-full md:w-[48%] lg:w-[48%] xl:w-[48%]`}
                  >
                    <label
                      className="block tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor={"Reschedule Date"}
                    >
                      Reschedule Start Date
                    </label>

                    <div className="relative input-bg">
                      <Calendar
                        className="calendar-control w-full"
                        {...dateStartField}
                        value={dateFormatted["reschedule_start_date"]}
                        onChange={(e) => {
                          dateStartField.onChange(e);
                          setDateFormat({
                            reschedule_end_date: "",
                            reschedule_start_date: e.value,
                          });
                          calendarRef?.current[0]?.hide();
                        }}
                        onClick={handleDateClick}
                        disabled={false}
                        minDate={new Date()}
                        maxDate={
                          ["yettostart", "yettojoin"].includes(
                            programdetails?.status
                          )
                            ? ""
                            : new Date(programdetails?.end_date)
                        }
                        showTime={false}
                        hourFormat="12"
                        dateFormat="dd/mm/yy"
                        style={{ width: "60%" }}
                        ref={(el) => (calendarRef.current[0] = el)}
                        viewDate={
                          ["yettostart", "yettojoin"].includes(
                            programdetails?.status
                          )
                            ? new Date()
                            : new Date(programdetails?.start_date)
                        }
                      />

                      <img
                        className="absolute top-5 right-2 cursor-pointer"
                        src={CalendarIcon}
                        alt="CalendarIcon"
                        onClick={() => {
                          handleDateClick();
                          calendarRef?.current[0]?.show();
                        }}
                      />
                    </div>
                    {errors["reschedule_start_date"] && (
                      <p className="error" role="alert">
                        {errors["reschedule_start_date"].message}
                      </p>
                    )}
                  </div>

                  <div
                    className={`relative mb-6 w-full sm:w-full md:w-[48%] lg:w-[48%] xl:w-[48%]`}
                  >
                    <label
                      className="block tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor={"Reschedule Date"}
                    >
                      Reschedule End Date
                    </label>

                    <div className="relative input-bg">
                      <Calendar
                        className="calendar-control w-full"
                        {...dateEndField}
                        value={dateFormatted["reschedule_end_date"]}
                        onChange={(e) => {
                          dateEndField.onChange(e);
                          setDateFormat({
                            ...dateFormatted,
                            reschedule_end_date: e.value,
                          });
                          calendarRef?.current[1]?.hide();
                        }}
                        onClick={handleDateClick}
                        disabled={false}
                        minDate={
                          dateFormatted.reschedule_start_date
                            ? new Date(dateFormatted.reschedule_start_date)
                            : new Date()
                        }
                        maxDate={
                          ["yettojoin", "yettostart"].includes(
                            programdetails?.status
                          )
                            ? ""
                            : new Date(programdetails?.end_date)
                        }
                        showTime={false}
                        hourFormat="12"
                        dateFormat="dd/mm/yy"
                        style={{ width: "60%" }}
                        ref={(el) => (calendarRef.current[1] = el)}
                        viewDate={
                          new Date(
                            dateFormatted.reschedule_start_date ??
                            programdetails?.start_date
                          )
                        }
                      />

                      <img
                        className="absolute top-5 right-2 cursor-pointer"
                        src={CalendarIcon}
                        alt="CalendarIcon"
                        onClick={() => {
                          handleDateClick();
                          calendarRef?.current[1]?.show();
                        }}
                      />
                    </div>
                    {errors["reschedule_end_date"] && (
                      <p className="error" role="alert">
                        {errors["reschedule_end_date"].message}
                      </p>
                    )}
                  </div>

                  <div className={`relative mb-6 w-full`}>
                    <label
                      className="block tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor={"Comments"}
                    >
                      Comments
                    </label>
                    <textarea
                      id="message"
                      rows="4"
                      className={`block p-2.5 input-bg w-full text-sm text-gray-900  rounded-lg border
                                                                   focus:visible:outline-none focus:visible:border-none}`}
                      placeholder={""}
                      {...register("reason", {
                        required: "This field is required",
                      })}
                    ></textarea>

                    {errors["reason"] && (
                      <p className="error" role="alert">
                        {errors["reason"].message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-6 justify-center align-middle py-5">
                <Button
                  btnName="Cancel"
                  btnCategory="secondary"
                  onClick={() =>
                    setMoreMenuModal({ share: false, reschedule: false })
                  }
                />
                <Button
                  btnType="submit"
                  btnName="Submit"
                  btnCategory="primary"
                />
              </div>
            </form>
          </div>
        </MuiModal>
      )}
      <MuiCustomModal
        open={moreMenuModal.not_interested}
        actionButtons={[
          {
            color: "inherit",
            variant: "outlined",
            children: "Cancel",

            onClick: handleCancel,
          },
          {
            color: "primary",
            variant: "contained",
            children: "Yes",
            onClick: () => handleMarkInterestClick(false),
          },
        ]}
      >
        <p
          className={`
             
          pb-4 text-center font-normal text-md`}
          role="alert"
        >
          {"Are you sure want to mark this program as 'Not interested' ?"}
        </p>
      </MuiCustomModal>
      <MuiCustomModal
        PaperProps={{
          sx: {
            background: isInsterestMarked
              ? "linear-gradient(97.86deg, #005DC6 -15.07%, #00B1C0 112.47%)"
              : "rgba(249, 249, 249, 1)",
          },
        }}
        open={showBackdrop}
        maxWidth="sm"
        onClose={() => setShowBackdrop(false)}
      >
        <div className="flex justify-center items-center flex-col gap-y-4">
          {isInsterestMarked && <Avatar src={modal_tick_icon} />}
          <p
            className={`
            ${isInsterestMarked ? "text-white" : "text-red-500"} 
          pb-4 text-center font-normal text-md`}
            role="alert"
          >
            {markInterestResponseData?.message}
          </p>
        </div>
      </MuiCustomModal>
      {moreMenuModal.feedback && (
        <MuiModal
          modalSize="md"
          modalOpen={moreMenuModal.feedback}
          modalClose={() => setMoreMenuModal({ ...moreMenuModal, feedback: false })}
          noheader
        >
          <div className="px-0 sm:px-0 md:px-5 lg:px-5 xl:px-5 py-5">
            <div
              className="flex justify-center flex-col gap-5 mt-4 mb-4"
              style={{
                border: "1px solid rgba(29, 91, 191, 1)",
                borderRadius: "10px",
              }}
            >
              <div
                className="flex justify-between px-3 py-4 items-center"
                style={{ borderBottom: "1px solid rgba(29, 91, 191, 1)" }}
              >
                <p
                  className="text-[18px]"
                  style={{ color: "rgba(0, 0, 0, 1)" }}
                >
                  Program Feedback
                </p>
                <img
                  className="cursor-pointer"
                  onClick={() => setMoreMenuModal({ ...moreMenuModal, feedback: false })}
                  src={CancelIcon}
                  alt="CancelIcon"
                />
              </div>

              <div className="px-5">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="relative pb-8">
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Your Feedback
                    </label>

                    <div className="relative">
                      <textarea
                        {...register("feedback", {
                          required: "This field is required",
                        })}
                        id="feedback"
                        rows="4"
                        className={`block p-2.5 input-bg w-full text-sm text-gray-900 border
                                  focus-visible:outline-none focus-visible:border-none`}
                        style={{ border: "2px solid rgba(29, 91, 191, 1)" }}
                        placeholder={""}
                      ></textarea>
                      {errors["feedback"] && (
                        <p className="error" role="alert">
                          {errors["feedback"].message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center gap-5 items-center pt-5 pb-10">
                    <Button
                      btnName="Cancel"
                      btnCls="w-[40%] sm:w-[40%] md:w-[20%] lg:w-[15%] xl:w-[15%]"
                      btnCategory="secondary"
                      onClick={() => setMoreMenuModal({ ...moreMenuModal, feedback: false })}
                    />
                    <button
                      type="submit"
                      className="text-white py-3 px-7 w-[40%] sm:w-[40%] md:w-[20%] lg:w-[15%] xl:w-[15%]"
                      style={{
                        background:
                          "linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)",
                        borderRadius: "3px",
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </MuiModal>
      )}
      {moreMenuModal.cancel && (
        <MuiModal
          modalSize="md"
          modalOpen={moreMenuModal.cancel}
          modalClose={handleMoreMenuClosePopup}
          noheader
        >
          <div className="px-0 sm:px-0 md:px-5 lg:px-5 xl:px-5 py-5">
            <div
              className="flex justify-center flex-col gap-5  mt-4 mb-4"
              style={{
                border: "1px solid rgba(29, 91, 191, 1)",
                borderRadius: "10px",
              }}
            >
              <div
                className="flex justify-between px-3 py-4 items-center"
                style={{ borderBottom: "1px solid rgba(29, 91, 191, 1)" }}
              >
                <p
                  className="text-[18px]"
                  style={{ color: "rgba(0, 0, 0, 1)" }}
                >
                  Cancel Reason{" "}
                </p>
                <img
                  className="cursor-pointer"
                  onClick={handleMoreMenuClosePopup}
                  src={CancelIcon}
                  alt="CancelIcon"
                />
              </div>

              <div className="px-5">
                {requestError !== "" ? (
                  <p className="error" role="alert">
                    {requestError}
                  </p>
                ) : null}

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="relative pb-8">
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Cancel Reason
                    </label>

                    <div className="relative">
                      <textarea
                        {...register("cancel_reason", {
                          required: "This field is required",
                        })}
                        id="message"
                        rows="4"
                        className={`block p-2.5 input-bg w-full text-sm text-gray-900  border
                                                                focus-visible:outline-none focus-visible:border-none`}
                        style={{ border: "2px solid rgba(229, 0, 39, 1)" }}
                        placeholder={""}
                      ></textarea>
                      {errors["cancel_reason"] && (
                        <p className="error" role="alert">
                          {errors["cancel_reason"].message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center gap-5 items-center pt-5 pb-10">
                    <Button
                      btnName="Cancel"
                      btnCls="w-[40%] sm:w-[40%] md:w-[20%] lg:w-[15%] xl:w-[15%]"
                      btnCategory="secondary"
                      onClick={handleMoreMenuClosePopup}
                    />
                    <button
                      type="submit"
                      className="text-white py-3 px-7 w-[40%] sm:w-[40%] md:w-[20%] lg:w-[15%] xl:w-[15%]"
                      style={{
                        background:
                          "linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)",
                        borderRadius: "3px",
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </MuiModal>
      )}

      {!programLoading &&
        programdetails &&
        Object.keys(programdetails)?.length ? (
        <div
          className=" mb-10 md:grid lg:grid xl:grid"
          style={{
            boxShadow: "4px 4px 25px 0px rgba(0, 0, 0, 0.15)",
            borderRadius: "5px",
          }}
        >
          <div className="breadcrum">
            <nav
              className="flex justify-between px-7 pt-6 pb-5 mx-2 border-b-2"
              aria-label="Breadcrumb"
            >
              <Breadcrumbs items={breadcrumbsArray} />
              <>
                {(role === "mentor" ||
                  (role === "admin" &&
                    ![
                      "program_new",
                      "program_join",
                      "program_reschedule",
                      "program_cancel",
                    ].includes(typeParams)) ||
                  (role === "mentee" &&
                    (programdetails.mentee_join_status ===
                      programActionStatus.program_join_request_accepted ||
                      ["yettoapprove", "yettojoin"].includes(
                        programdetails?.status
                      )) &&
                    !["program_join", "program_cancel"].includes(
                      typeParams
                    ))) && (
                    <>
                      <div
                        className="cursor-pointer w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-all duration-300"
                        onClick={handleClick}
                      >
                        <img src={MoreIcon} alt="MoreIcon" />
                      </div>
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}
                      >
                        {
                          (role === "mentor" || role === "mentee") && (
                            <MenuItem
                              onClick={() => {
                                handleClose();
                                setAcceptPopup({
                                  bool: false,
                                  activity: false,
                                  reject: true
                                })
                              }}
                              className="!text-[12px]"
                            >
                              <img src={CloseCircleIcon} alt="CloseCircleIcon" className="h-[20px] w-[20px] mr-1" />
                              <p>Reject</p>
                            </MenuItem>
                          )
                        }
                        {(role === "mentor" || role === "admin") && (
                          <>
                            <MenuItem
                              onClick={() => handleMenu("share")}
                              className="!text-[12px]"
                            >
                              <img
                                src={ShareIcon}
                                alt="ShareIcon"
                                className="pr-3 w-[25px]"
                              />
                              Share
                            </MenuItem>
                            {role === "admin" &&
                              programdetails?.created_by ===
                              userdetails?.data?.user_id &&
                              programdetails?.admin_assign_program &&
                              programdetails?.sub_programs.every(
                                (val) => val.status === "yettoapprove"
                              ) && (
                                <MenuItem
                                  onClick={() => handleMenu("editadmin")}
                                  className="!text-[12px]"
                                >
                                  <img
                                    src={EditSVGIcon}
                                    alt="EditSVGIcon"
                                    className="pr-3 w-[25px]"
                                  />
                                  Edit
                                </MenuItem>
                              )}
                            {!("admin_assign_program" in programdetails) &&
                              (programdetails.status === "cancelled" ||
                                programdetails.status ===
                                "new_program_request_rejected" ||
                                programdetails.status === "completed") &&
                              programdetails?.created_by ===
                              userdetails?.data?.user_id && (
                                <MenuItem
                                  onClick={() =>
                                    navigate(
                                      `/update-program/${programdetails.id}?type=re_open`
                                    )
                                  }
                                  className="!text-[12px]"
                                >
                                  <img
                                    src={ReOpenIcon}
                                    alt="ReOpenIcon"
                                    className="pr-3 w-[25px]"
                                  />
                                  Re-Open
                                </MenuItem>
                              )}
                            {/* {role === "mentor" &&
                            programdetails.participated_mentees_count === 0 &&
                            programdetails?.created_by ===
                              userdetails?.data?.user_id &&
                            programdetails?.admin_program === null &&
                            ![
                              "cancelled",
                              "yettoapprove",
                              "new_program_request_rejected",
                            ].includes(programdetails?.status) && (
                              <MenuItem
                                onClick={() => handleMenu("edit")}
                                className="!text-[12px]"
                              >
                                <img
                                  src={EditSVGIcon}
                                  alt="EditSVGIcon"
                                  className="pr-3 w-[25px]"
                                />
                                Edit
                              </MenuItem>
                            )} */}

                            {!requestStatusParams &&
                              ![
                                "yettoapprove",
                                "cancelled",
                                "new_program_request_rejected",
                                "completed",
                              ].includes(programdetails?.status) &&
                              !reqRole &&
                              !programdetails.hasOwnProperty(
                                "admin_assign_program"
                              ) &&
                              programdetails?.created_by ===
                              userdetails?.data?.user_id && (
                                // role !== 'admin' && (
                                <MenuItem
                                  onClick={() => handleMenu("reschedule")}
                                  className="!text-[12px]"
                                >
                                  <img
                                    src={RescheduleIcon}
                                    alt="RescheduleIcon"
                                    className="pr-3 w-[25px]"
                                  />
                                  Reschedule
                                </MenuItem>
                              )}

                            {
                              !requestStatusParams &&
                              ![
                                "yettoapprove",
                                "cancelled",
                                "new_program_request_rejected",
                                "completed",
                              ].includes(programdetails?.status) &&
                              !reqRole &&
                              programdetails?.created_by ===
                              userdetails?.data?.user_id &&
                              !programdetails?.cancel_request_raise && (
                                // role !== 'admin' && (
                                <MenuItem
                                  onClick={() => handleMenu("cancel")}
                                  className="!text-[12px]"
                                >
                                  <img
                                    src={AbortIcon}
                                    alt="Cancel"
                                    className="pr-3 w-[25px]"
                                  />
                                  Cancel
                                </MenuItem>
                              )
                              // )
                            }

                            {[
                              programActionStatus.inprogress,
                              programActionStatus.assigned,
                              programActionStatus.started,
                            ].includes(programdetails.status) && (
                                <>
                                  {programdetails?.created_by ===
                                    userdetails?.data?.user_id && (
                                      <MenuItem
                                        onClick={() => handleOpenConfirmPopup()}
                                        className="!text-[12px]"
                                      >
                                        <img
                                          src={CompleteIcon}
                                          alt="AbortIcon"
                                          className="pr-3 w-[25px]"
                                        />
                                        Complete
                                      </MenuItem>
                                    )}
                                  {programdetails?.created_by === userdetails?.data?.user_id && (
                                    <MenuItem
                                      onClick={() => handleMenu("feedback")}
                                      className="!text-[12px]"
                                    >
                                      <img
                                        src={FeedbackIcon}
                                        alt="FeedbackIcon"
                                        className="pr-3 w-[25px]"
                                      />
                                      Feedback
                                    </MenuItem>
                                  )}
                                  {!("admin_assign_program" in programdetails) &&
                                    programdetails?.created_by ===
                                    userdetails?.data?.user_id && (
                                      <MenuItem
                                        onClick={() => handleNewTaskFromAdmin()}
                                        className="!text-[12px]"
                                      >
                                        <img
                                          src={PlusCircle}
                                          alt="PlusCircle"
                                          className="pr-3 w-[25px]"
                                        />
                                        Assign Interaction Point/Task to Mentees
                                      </MenuItem>
                                    )}
                                </>
                              )}

                            {["cancelled", "inprogress", "completed"].includes(
                              programdetails?.status
                            ) && (
                                <MenuItem
                                  onClick={() =>
                                    navigate(`/historyNotes/${params.id}`)
                                  }
                                  className="!text-[12px]"
                                >
                                  <img
                                    src={ProgramHistoryIcon}
                                    alt="ProgramHistoryIcon"
                                    className="pr-3 w-[25px]"
                                  />
                                  Program Notes History
                                </MenuItem>
                              )}
                          </>
                        )}
                        {role === "mentee" && (
                          <>
                            {programdetails?.status ===
                              programActionStatus.yettojoin &&
                              programdetails?.program_interest && (
                                <MenuItem
                                  onClick={() => {
                                    handleClose();
                                    handleMenu("not_interested");
                                  }}
                                  className="!text-[12px]"
                                >
                                  <ThumbDownOffAlt
                                    className="pr-3"
                                    sx={{ fontSize: "1.6rem" }}
                                  />
                                  Not Interested
                                </MenuItem>
                              )}
                            {programdetails.mentee_join_status ===
                              programActionStatus.program_join_request_accepted && (
                                <MenuItem
                                  onClick={() => handleMenu("cancel")}
                                  className="!text-[12px]"
                                >
                                  <img
                                    src={AbortIcon}
                                    alt="AbortIcon"
                                    className="pr-3 w-[25px]"
                                  />
                                  Cancel
                                </MenuItem>
                              )}
                            {["cancelled", "inprogress", "completed"].includes(
                              programdetails?.status
                            ) &&
                              programdetails.mentee_join_status ===
                              programActionStatus.program_join_request_accepted && (
                                <MenuItem
                                  onClick={() =>
                                    navigate(`/historyNotes/${params.id}`)
                                  }
                                  className="!text-[12px]"
                                >
                                  <img
                                    src={ProgramHistoryIcon}
                                    alt="ProgramHistoryIcon"
                                    className="pr-3 w-[25px]"
                                  />
                                  Program Notes History
                                </MenuItem>
                              )}
                            {["cancelled", "inprogress", "completed"].includes(
                              programdetails?.status
                            ) &&
                              programdetails.mentee_join_status ===
                              programActionStatus.program_join_request_accepted && (
                                <MenuItem
                                  onClick={() => handleMenu("feedback")}
                                  className="!text-[12px]"
                                >
                                  <img
                                    src={FeedbackIcon}
                                    alt="FeedbackIcon"
                                    className="pr-3 w-[25px]"
                                  />
                                  Feedback
                                </MenuItem>
                              )}
                          </>
                        )}
                      </Menu>
                    </>
                  )}
              </>
            </nav>

            <div className="content px-4 sm:px-4 md:px-6 lg:px-8 xl:px-8">
              <div className="grid grid-cols-3 gap-4 py-6">
                {/* Left Side Content */}
                <div className="left-side-content col-span-3 sm:col-span-3 md:col-span-3 lg:col-span-2 xl:col-span-2">
                  <div className="flex items-center gap-6 pb-6">
                    <h3
                      className="font-semibold text-[18px]"
                      style={{ color: "rgba(29, 91, 191, 1)" }}
                    >
                      {programdetails.program_name}
                    </h3>
                    {programdetails?.categories?.length ? (
                      <div
                        className="text-[10px] px-3 py-2"
                        style={{
                          background: "rgba(238, 240, 244, 1)",
                          color: "rgba(253, 0, 58, 1)",
                          borderRadius: "5px",
                        }}
                      >
                        {programdetails.categories[0].name}
                      </div>
                    ) : null}

                    {programdetails.reschedule_info?.length > 0 && (
                      <div className="flex gap-3 items-center">
                        <span
                          style={{
                            background: "rgba(255, 213, 0, 1)",
                            borderRadius: "3px",
                            padding: "10px",
                          }}
                        >
                          <img src={TimeHistoryIcon} alt="TimeHistoryIcon" />
                        </span>
                        <p
                          style={{
                            background: "rgba(255, 249, 216, 1)",
                            color: "rgba(255, 213, 0, 1)",
                            padding: "10px",
                            borderRadius: "10px",
                            fontSize: "12px",
                            fontWeight: 500,
                          }}
                        >
                          {programdetails.reschedule_info}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="text-[12px]">
                    {programdetails.description}
                  </div>
                  {!Array.isArray(programdetails?.prerequisites) &&
                    programdetails?.prerequisites && (
                      <div className="text-[12px] my-3">
                        <span className="font-semibold text-background-primary-main">
                          Prerequisites:{" "}
                        </span>
                        {programdetails.prerequisites}
                      </div>
                    )}
                  {programdetails?.session_details && (
                    <div className="text-[12px] my-3">
                      <span className="font-semibold text-background-primary-main">
                        Session Details:{" "}
                      </span>
                      {programdetails.session_details}
                    </div>
                  )}

                  <div className="flex flex-col gap-2 sm:gap-2 md:gap-6 lg:gap-6 xl:gap-6 py-6 sm:flex-col md:flex-row lg:flex-row xl:flex-row">
                    <div className="flex gap-2 items-center">
                      {
                      programdetails?.program_mode === "virtual_meeting" ? 
                      <LanguageIcon className="!text-font-primary-main" /> :
                      <img src={ LocationIcon } alt="LocationIcon" />
                      }
                      <span className="text-[12px]">
                        {/* {programdetails.venue} */}
                        {programdetails?.program_mode === "virtual_meeting"
                          ? "Online"
                          : (programdetails.location_details && Object.keys(programdetails.location_details)?.length) ? `${programdetails.location_details?.city}, ${programdetails.location_details?.state_name}` : "No Location"}
                      </span>
                    </div>

                    <div
                      style={{ borderRight: "1px solid rgba(24, 40, 61, 1)" }}
                    ></div>
                    {/* {programdetails?.admin_assign_program&&role===user.admin?  <div className="flex items-center gap-3 text-[12px]">
                      {!profileLoading && (
                        <img
                          src={
                            programdetails?.mentor_profile_image || UserImage
                          }
                          style={{
                            borderRadius: "50%",
                            width: "35px",
                            height: "35px",
                          }}
                          alt="UserImage"
                        />
                      )}
                      <span>{"Created By"}</span>
                     
                          <span
                            style={{
                              color: "rgba(29, 91, 191, 1)",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                            onClick={() => handleInstructor(programdetails)}
                          >
                            {programdetails?.mentor_name}
                          </span>
                    </div>:
                    <div className="flex gap-3 items-center">
                      <img src={CalendarIcon} alt="CalendarIcon" />
                      <span className="text-[12px]">
                        {formatDateTimeISO(programdetails?.start_date)}
                      </span>
                    </div>} */}
                    <div className="flex gap-3 items-center">
                      <img src={CalendarIcon} alt="CalendarIcon" />
                      <span className="text-[12px]">
                        {moment(programdetails?.start_date).format('[Begins] MMM D [at] h:mm A')}
                      </span>
                    </div>
                    <div
                      style={{ borderRight: "1px solid rgba(24, 40, 61, 1)" }}
                    ></div>
                    <div className="flex items-center gap-3 text-[12px]">
                      {!profileLoading && (
                        <img
                          src={
                            programdetails?.mentor_profile_image || UserImage
                          }
                          style={{
                            borderRadius: "50%",
                            width: "35px",
                            height: "35px",
                          }}
                          alt="UserImage"
                        />
                      )}

                      <span>
                        {programdetails?.admin_assign_program &&
                          role === user.admin
                          ? "Program Admin"
                          : "Instructor :"}
                      </span>
                      {role !== "mentor" ? (
                        // <Link
                        //   to={`/mentor-details/${programdetails?.created_by}?type=view&breadcrumbsType=${requestPageBreadcrumbs.ProgramsDetails}`}
                        // >
                        <span
                          style={{
                            color: "rgba(29, 91, 191, 1)",
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                          onClick={() => handleInstructor(programdetails)}
                        >
                          {programdetails?.mentor_name}
                        </span>
                      ) : (
                        // </Link>
                        <Link
                          to={`/mentor-details/${programdetails?.created_by}?breadcrumbsType=${requestPageBreadcrumbs.ProgramsDetails}`}
                        >
                          <span style={{ color: "rgba(29, 91, 191, 1)" }}>
                            {programdetails?.mentor_name}
                          </span>
                        </Link>
                      )}
                    </div>
                  </div>

                  {Array.isArray(programdetails?.learning_materials) &&
                    programdetails?.learning_materials?.length > 0 && (
                      <div className="pt-3 pb-8">
                        <p className="text-[14px] font-normal mb-2">
                          Our Learning Materials
                        </p>
                        <div className="flex items-center gap-x-3">
                          {programdetails?.learning_materials.map(
                            (material) => (
                              <button
                                key={material.id}
                                className={`px-6 py-3 text-[12px] bg-gray-200 text-black rounded-full`}
                                onClick={() =>
                                  setSelectedLM({
                                    bool: true,
                                    data: material,
                                  })
                                }
                              >
                                {material.name}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  {(programdetails?.group_chat_requirement ||
                    programdetails?.individual_chat_requirement) && (
                      <div className="flex gap-2 pb-[26px]">
                        {programdetails?.group_chat_requirement && (
                          <p
                            onClick={() => navigate("/discussions")}
                            className="text-[14px] font-semibold text-font-primary-main px-4 py-2 border border-dashed border-background-primary-main rounded-[3px] bg-background-primary-light cursor-pointer"
                          >
                            Group Discussions
                          </p>
                        )}
                        {programdetails?.individual_chat_requirement && (
                          <p
                            onClick={() => navigate("/discussions/32")}
                            className="text-[14px] font-semibold text-font-primary-main px-4 py-2 border border-dashed border-background-primary-main rounded-[3px] bg-background-primary-light cursor-pointer"
                          >
                            Individual Discussions
                          </p>
                        )}
                      </div>
                    )}

                  {/* payment button section */}

                  {role === "mentee" &&
                    !programdetails?.is_sponsored &&
                    (programdetails?.mentee_join_status ===
                      "program_join_payment_initiate" ||
                      programdetails?.mentee_join_status ===
                      "program_join_payment_pending") && (
                      <div className="mt-3">
                        {programdetails?.mentee_join_status ===
                          "program_join_payment_initiate" && (
                            <p className="text-font-error-main text-[14px] font-semibold mb-2">
                              {statusMessage}
                            </p>
                          )}
                        <Button
                          btnType="button"
                          btnCls={
                            programdetails?.mentee_join_status ===
                              "program_join_payment_pending"
                              ? "w-[200px] !bg-[#FFE3C2] !text-[#FF8A00] !border-none"
                              : "w-auto"
                          }
                          btnName={
                            programdetails?.mentee_join_status ===
                              "program_join_payment_pending"
                              ? "Pending Payment"
                              : `Pay Now $ ${programdetails?.enrollment_fees}`
                          }
                          btnCategory={
                            programdetails?.mentee_join_status ===
                              "program_join_payment_pending"
                              ? "secondary"
                              : "primary"
                          }
                          onClick={() => {
                            if (programdetails?.id) {
                              setProgramDetailsId(programdetails?.id);
                              navigate("/payment-checkout");
                              localStorage.setItem(
                                "program_id",
                                programdetails?.id
                              );
                            }
                          }}
                          disabled={
                            programdetails?.mentee_join_status ===
                            "program_join_payment_pending"
                          }
                        />
                        {programdetails?.mentee_join_status ===
                          "program_join_payment_pending" && (
                            <p className="text-font-error-main text-[14px] font-semibold mt-2">
                              Please Contact Administrator
                            </p>
                          )}
                      </div>
                    )}

                  <ProgramActions
                    role={role}
                    programdetails={programdetails}
                    programCompleted={programCompleted}
                    handleJoinProgram={handleJoinProgram}
                    isLaunchingProgram={isLaunchingProgram}
                    requestId={requestId}
                    handleAcceptCancelProgramRequest={
                      handleAcceptCancelProgramRequest
                    }
                    type={typeParams}
                    setCancelPopup={setCancelPopup}
                    requestStatusParams={requestStatusParams}
                    setOpenPopup={setOpenPopup}
                    handleMarkInterestClick={handleMarkInterestClick}
                    markingInterest={markingInterest}
                    from={from}
                    handleOpenAcceptProgram={handleOpenAcceptProgram}
                  />
                </div>

                {/* Right Side Content */}
                <div className="right-side-content col-span-3 sm:col-span-3 md:col-span-3 lg:col-span-1 xl:col-span-1">
                  <div
                    style={{
                      border: "1px solid rgba(223, 237, 255, 1)",
                      borderRadius: "10px",
                    }}
                    className="px-6 pt-6 pb-3"
                  >
                    <ul className="flex flex-col gap-3">
                      {!programdetails?.admin_assign_program && (
                        <li
                          className="flex justify-between text-[12px]"
                          style={{
                            borderBottom: "1px solid rgba(217, 217, 217, 1)",
                            paddingBottom: "10px",
                            paddingTop: "14px",
                          }}
                        >
                          <span>No of sessions</span>
                          <span>{programdetails.session_count}</span>
                        </li>
                      )}
                      <li
                        className="flex justify-between text-[12px]"
                        style={{
                          borderBottom: "1px solid rgba(217, 217, 217, 1)",
                          paddingBottom: "10px",
                          paddingTop: "14px",
                        }}
                      >
                        <span>Course Level</span>
                        <span style={{ textTransform: "capitalize" }}>
                          {programdetails.course_level}
                        </span>
                      </li>
                      {programdetails.sub_programs?.length > 0 ? (
                        <li
                          className="flex justify-between text-[12px]"
                          style={{
                            borderBottom: "1px solid rgba(217, 217, 217, 1)",
                            paddingBottom: "10px",
                            paddingTop: "14px",
                          }}
                        >
                          <span>Subjects</span>
                          <span style={{ textTransform: "capitalize" }}>
                            {programdetails.sub_programs?.length}
                          </span>
                        </li>
                      ) : (
                        <>
                          <li
                            className="flex justify-between text-[12px]"
                            style={{
                              borderBottom: "1px solid rgba(217, 217, 217, 1)",
                              paddingBottom: "10px",
                              paddingTop: "14px",
                            }}
                          >
                            <span>Start Date</span>
                            <span>
                              {programdetails?.start_date
                                ? moment(programdetails?.start_date).format(
                                  "MM-DD-YYYY"
                                )
                                : "-"}
                            </span>
                          </li>
                          <li
                            className="flex justify-between text-[12px]"
                            style={{
                              borderBottom: "1px solid rgba(217, 217, 217, 1)",
                              paddingBottom: "10px",
                              paddingTop: "14px",
                            }}
                          >
                            <span>End Date</span>
                            <span>
                              {programdetails?.end_date
                                ? moment(programdetails?.end_date).format(
                                  "MM-DD-YYYY"
                                )
                                : "-"}
                            </span>
                          </li>

                          {/* time */}

                          <li
                            className="flex justify-between text-[12px]"
                            style={{
                              borderBottom: "1px solid rgba(217, 217, 217, 1)",
                              paddingBottom: "10px",
                              paddingTop: "14px",
                            }}
                          >
                            <span>Start Time</span>
                            <span>
                              {programdetails?.start_date
                                ? moment(programdetails?.start_date).format(
                                  "hh:mm A"
                                )
                                : "-"}
                            </span>
                          </li>
                          <li
                            className="flex justify-between text-[12px]"
                            style={{
                              borderBottom: "1px solid rgba(217, 217, 217, 1)",
                              paddingBottom: "10px",
                              paddingTop: "14px",
                            }}
                          >
                            <span>End Time</span>
                            <span>
                              {programdetails?.end_date
                                ? moment(programdetails?.end_date).format(
                                  "hh:mm A"
                                )
                                : "-"}
                            </span>
                          </li>

                          <li
                            className="flex justify-between text-[12px]"
                            style={{
                              borderBottom: "1px solid rgba(217, 217, 217, 1)",
                              paddingBottom: "10px",
                              paddingTop: "14px",
                            }}
                          >
                            {" "}
                            <span>Duration</span>
                            <span>
                              {programdetails.duration} {" days"}
                            </span>
                          </li>
                          {programdetails?.recurring_programs_details?.length >
                            0 && (
                              <li
                                className="flex justify-between text-[12px] py-1"
                                style={{
                                  borderBottom:
                                    "1px solid rgba(217, 217, 217, 1)",
                                }}
                              >
                                <span>Recurring cycle</span>
                                <MuiButton
                                  size={"small"}
                                  variant={"text"}
                                  onClick={() => setOpenRecurringModal(true)}
                                >
                                  View
                                </MuiButton>
                              </li>
                            )}
                          {!programdetails.is_sponsored &&
                            programdetails?.mentee_join_status !==
                            "program_join_request_accepted" && (
                              <li
                                className="flex justify-between text-[12px]"
                                style={{
                                  borderBottom:
                                    "1px solid rgba(217, 217, 217, 1)",
                                  paddingBottom: "10px",
                                  paddingTop: "14px",
                                }}
                              >
                                <span>Fees</span>
                                <span className="text-[#1D5BBF]">
                                  $ {programdetails?.enrollment_fees}
                                </span>
                              </li>
                            )}
                          {(role === "mentor" || role === "admin") && (
                            <li
                              className="flex justify-between text-[12px]"
                              style={{ paddingTop: "14px" }}
                            >
                              {" "}
                              <span>Joined Mentees</span>
                              <span
                                className="underline cursor-pointer"
                                onClick={() =>
                                  handleViewJoinedMentees(programdetails)
                                }
                              >
                                {programdetails.participated_mentees_count}
                              </span>
                            </li>
                          )}
                          {programdetails?.mentee_join_status ===
                            "program_join_request_accepted" &&
                            !programdetails?.is_sponsored && (
                              <li
                                className="flex justify-between text-[12px]"
                                style={{
                                  paddingBottom: "10px",
                                  paddingTop: "14px",
                                }}
                              >
                                <span className="flex gap-2">
                                  Paid{" "}
                                  <span>
                                    <img src={PaidTickIcon} alt="" />
                                  </span>
                                </span>
                                <span className="text-[#1D5BBF]">
                                  $ {programdetails?.enrollment_fees}
                                </span>
                              </li>
                            )}
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              <MuiCustomModal
                open={openRecurringModal}
                onClose={handleRecurringModalClose}
              >
                <DataGrid
                  hideFooter={true}
                  loading={programLoading}
                  columns={RecurringTableColumns}
                  rows={programdetails?.recurring_programs_details}
                  onCellClick={handleRecurringListActionClick}
                />
                <Menu
                  open={openRecMenu}
                  anchorEl={recAnchorEl}
                  onClose={handleClose}
                >
                  {RecurringListMenuItems.map((menu) => {
                    if (role === "admin" && menu.action === "view") {
                      menu.visible = true;
                    } else if (role === "mentor" && menu.action === "edit") {
                      menu.visible = true;
                    } else {
                      menu.visible = false;
                    }
                    return (
                      menu.visible && (
                        <MenuItem
                          key={menu.value}
                          onClick={() => handleMenuClick(menu.action)}
                        >
                          {menu.icon}
                          {menu.label}
                        </MenuItem>
                      )
                    );
                  })}
                </Menu>
              </MuiCustomModal>
              {/* Subject Program List */}
              {role === "mentee" && (
                <Grid container spacing={2}>
                  {programdetails?.active_sub_program?.map((e) => {
                    return (
                      <Grid item xs={4}>
                        <SubjectProgramCard data={e} />
                      </Grid>
                    );
                  })}
                </Grid>
              )}
              <ProgramReasons
                programdetails={programdetails}
                role={role}
                requestId={requestId}
                programActionStatus={programActionStatus}
              />

              <DataTable
                rows={[]}
                columns={userStatusColumns}
                hideFooter
                hideCheckbox
              />

              {/* Notes Section */}
              {["inprogress"].includes(programdetails?.status) &&
                ((role === "mentee" &&
                  programdetails.mentee_join_status ===
                  programActionStatus.program_join_request_accepted) ||
                  programdetails?.created_by === userdetails?.data?.user_id) &&
                !programdetails?.mentee_program_exit && (
                  <Box>
                    <Accordian
                      title={"Program Notes:"}
                      titleColor={"#FE634E"}
                      children={
                        <>
                          <CustomFormFields
                            fields={notesFields}
                            formData={notesForm}
                            handleChange={updateState}
                          />
                          <Stack
                            justifyContent={"end"}
                            direction={"row"}
                            alignItems={"end"}
                            width={"100%"}
                            mt={"12px"}
                          >
                            <Button
                              btnCategory="primary"
                              btnName="Save"
                              btnCls=" w-[150px]"
                              onClick={() => handleSubmitNotes()}
                            />
                          </Stack>
                        </>
                      }
                      defaultValue={true}
                    />

                    <Backdrop
                      sx={{
                        color: "#fff",
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                      }}
                      open={notesActivity}
                    >
                      <div className="px-5 py-1 flex justify-center items-center">
                        <div
                          className="flex justify-center items-center flex-col gap-[2.25rem] py-[4rem] px-[3rem] mt-20 mb-20"
                          style={{ background: "#fff", borderRadius: "10px" }}
                        >
                          <img src={SuccessTik} alt="SuccessTik" />
                          <p
                            className="text-[16px] font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#1D5BBF] to-[#00AEBD]"
                            style={{
                              fontWeight: 600,
                            }}
                          >
                            Program Notes added successfully
                          </p>
                        </div>
                      </div>
                    </Backdrop>
                  </Box>
                )}
              {/* Notes Section End */}

              {"sub_programs" in programdetails &&
                programdetails?.sub_programs?.length > 0 && (
                  <SubprogramsDataGrid
                    data={programdetails?.sub_programs}
                    handleAcceptProgram={handleAcceptProgram}
                  />
                )}
              {(programdetails.status === programActionStatus.inprogress ||
                programdetails.status === programActionStatus.paused) &&
                !programdetails?.mentee_program_exit &&
                programdetails.task.length > 0 && (
                  <CustomAccordian
                    title={"Program Task"}
                    defaultValue
                    children={
                      <div>
                        <div className="w-full flex justify-end mb-4">
                          <Button
                            btnName="View All"
                            btnCls="w-[140px]"
                            onClick={() =>
                              navigate(
                                role === user.mentee
                                  ? "/mentee-tasks"
                                  : "/mentor-tasks?type=menteetask"
                              )
                            }
                          />
                        </div>
                        <SkillsSet
                          programdetails={programdetails}
                          role={role}
                        />
                      </div>
                    }
                  />
                )}
              {/* Detail Section */}
              <div
                className="details-section px-0 sm:px-0 md:px-3 lg:px-6 xl:px-6 py-11 mb-10"
                style={{
                  background: "rgba(249, 249, 249, 1)",
                  borderRadius: "10px",
                }}
              >
                <div className="tabs flex gap-4">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      className={`px-4 sm:px-4 md:px-6 lg:px-12 xl:px-12 py-3 text-[12px] ${activeTab === tab.key ? "tab-active" : "tab"
                        } `}
                      onClick={() => handleTab(tab.key)}
                    >
                      {tab.name}
                    </button>
                  ))}
                </div>

                <div className="tab-content px-0 sm:px-0 md:px-3 lg:px-6 xl:px-6 pt-10 text-[12px]">
                  <div
                    className={`about-programs ${activeTab === "about_program" ? "block" : "hidden"
                      }`}
                  >
                    {Array.isArray(programdetails?.goals) &&
                      programdetails?.goals?.length > 0 && (
                        <div className="py-5">
                          <p className="text-[12px] mb-2">Goals:</p>
                          <div className="flex items-center gap-x-3">
                            {programdetails?.goals.map((goal) => (
                              <button
                                key={goal.id}
                                className={`px-6 py-3 text-[12px] bg-gray-200 text-black rounded-full`}
                                onClick={() =>
                                  navigate(
                                    `/view-goal/${goal.id}?breadcrumbsType=program_goal_view`
                                  )
                                }
                              >
                                {`${goal.description?.substring(0, 10)}...`}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                    {Array.isArray(programdetails?.admin_goals) &&
                      programdetails?.admin_goals?.length > 0 && (
                        <div className="py-5">
                          <p className="text-[12px] mb-2">Admin Goals:</p>
                          <div className="flex items-center gap-x-3">
                            {programdetails?.admin_goals.map((goal) => (
                              <button
                                key={goal.id}
                                className={`px-6 py-3 text-[12px] bg-gray-200 text-black rounded-full`}
                                onClick={() =>
                                  navigate(`/view-goal/${goal.id}`)
                                }
                              >
                                {`${goal.description?.substring(0, 10)}...`}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    {programdetails?.skill_details?.length ? (
                      <div className="skills pt-8">
                        <div className="font-semibold pb-5">
                          Skills you'll gain
                        </div>
                        {programdetails?.skill_details}
                      </div>
                    ) : null}

                    {programdetails?.sponsor_logos?.length > 0 && (
                      <div className="sponsor pt-8">
                        <div className="font-semibold pb-5">Sponsored by </div>
                        <div>
                          {programdetails?.sponsor_logos?.map((e) => {
                            return (
                              <div>
                                <img
                                  style={{ width: "100px", height: "100px" }}
                                  src={e}
                                  alt="SponsorIcon"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {!("admin_assign_program" in programdetails) && (
                      <div className="benefits py-3">
                        <div className="font-semibold pb-3">Benefits</div>
                        {programdetails.benefits}
                      </div>
                    )}
                    <div className="program-certificate pt-8">
                      <div className="font-semibold pb-3">
                        Types of Certificates
                      </div>
                      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 mb-10">
                        <ul className="flex flex-wrap -mb-px">
                          {participatedTabs.map((participatedTab) => (
                            <li className="me-2" key={participatedTab.key}>
                              <p
                                className={`inline-block p-4 border-b-2 cursor-pointer border-transparent rounded-t-lg ${certificateActiveTab === participatedTab.key
                                  ? "active  text-blue-600 border-blue-500"
                                  : ""
                                  } `}
                                onClick={() =>
                                  handleCerificateTab(participatedTab.key)
                                }
                              >
                                {participatedTab.name}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {participatedTabs.map((participatedTab) => (
                        <div
                          className={`certificate-tab-content relative 
                          ${participatedTab.key === certificateActiveTab
                              ? "block"
                              : "hidden"
                            }
                          flex flex-col md:flex-row items-center justify-between
                          p-4 sm:p-6 md:p-8`}
                          key={participatedTab.key}
                        >
                          {/* Text Content */}
                          <div
                            className="w-full md:w-4/6 space-y-4 
                          px-4 sm:px-6 md:px-9 
                          py-8 sm:py-12 md:py-16 
                          text-sm sm:text-base 
                          leading-5 sm:leading-6"
                          >
                            {participatedTab.key === "participated" &&
                              "The ability for members to earn badges and receive certifications is another essential feature of our Mentoring Management program. It helps in creating engaging and impactful relationships between mentors and mentees."}

                            {participatedTab.key === "completed" &&
                              "All the badges and certifications are secured through a blockchain system to ensure authenticity and traceability. This innovative approach not only enhances motivation but also provides tangible recognition of achievements, encouraging continuous growth and engagement."}
                          </div>

                          {/* Certificate Image */}
                          <div className="relative w-full md:w-2/6 flex justify-center md:justify-end">
                            <img
                              className="w-48 sm:w-56 md:w-auto 
                              mt-4 md:mt-0
                              static md:relative md:right-0"
                              src={CertificateIcon}
                              alt="CertificateIcon"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    className={`program-outcomes ${activeTab === "program_testimonials" ? "block" : "hidden"
                      }`}
                  >
                    {programdetails?.testimonial_content?.length > 0 && (
                      <div className="testimonials bg-white px-5 py-7">
                        <div className="grid grid-cols-3 gap-8">
                          {programdetails?.testimonial_content?.map((e) => {
                            return (
                              <div
                                className="pt-16 pb-2 px-7 leading-5 relative"
                                style={{
                                  background: "rgba(248, 249, 250, 1)",
                                }}
                              >
                                <img
                                  src={QuoteIcon}
                                  className="absolute top-[-16px]"
                                  alt="QuoteIcon"
                                />
                                <div className="relative">
                                  <p className="pb-7">{e?.comments ?? "-"}</p>
                                  <hr
                                    className="absolute"
                                    style={{ width: "100%" }}
                                  />
                                </div>

                                <div className="flex gap-3 py-5">
                                  <img
                                    src={e?.profile_image ?? UserImage}
                                    alt="user"
                                    style={{
                                      borderRadius: "50%",
                                      width: "38px",
                                      height: "35px",
                                    }}
                                  />
                                  <div className="flex flex-col">
                                    <span
                                      style={{
                                        color: "rgba(0, 174, 189, 1)",
                                      }}
                                    >
                                      {e?.name}
                                    </span>
                                    <span className="capitalize">
                                      {e?.role}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {programdetails?.recurring_programs_details?.length > 0 && (
                <div className="my-4">
                  <SubDetailCardWrapper
                    title={"Upcoming program"}
                  // onViewAll={() =>
                  //   navigate("/programs?type=upcoming&filter_by=month")
                  // }
                  >
                    <ProgramCard
                      title="Active Programs"
                      handleNavigateDetails={handleNavigation}
                      // handleBookmark={handleBookmark}
                      programs={programdetails?.recurring_programs_details}
                      noTitle
                    />
                  </SubDetailCardWrapper>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
      <CancelPopup
        open={cancelPopup}
        header={"Cancel Reason"}
        handleClosePopup={() => handleCloseConfirmPopup("cancel")}
        handleSubmit={(reason) => {
          handleCancelSubmit(reason);
        }}
      />
      <SuccessGradientMessage
        message={"Program Cancelled successfully"}
        cancelPopupConfirmation={cancelPopupConfirmation}
        setCancelPopupConfirmation={setCancelPopupConfirmation}
      />

      <CustomModal
        open={selectedLM?.bool}
        handleClose={() =>
          setSelectedLM({
            bool: false,
            data: "",
          })
        }
        width="lg"
        content={
          <Box
            className={"!border !border-background-primary-main rounded-[10px]"}
          >
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
              className="!bg-background-primary-light px-4 py-4"
            >
              <Typography className="!text-font-secondary-black !font-bold !text-[20px]">
                {selectedLM?.data?.name}
              </Typography>
              <div
                onClick={() =>
                  setSelectedLM({
                    bool: false,
                    data: "",
                  })
                }
                className="cursor-pointer"
              >
                <img src={CancelIcon} alt="CancelIcon" />
              </div>
            </Stack>
            <Box className="px-4 py-4">
              <a
                className="!text-font-secondary-black"
                href={selectedLM?.data?.file_url}
                target="_blank"
                rel="noreferrer"
              >
                {selectedLM?.data?.file_name ??
                  (
                    selectedLM?.data?.file ?? selectedLM?.data?.file_url
                  )?.substring(
                    (
                      selectedLM?.data?.file ?? selectedLM?.data?.file_url
                    )?.lastIndexOf("/") + 1
                  )}
              </a>
            </Box>
          </Box>
        }
      />

      {/* Accept program popups */}

      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={acceptPopup?.bool}
      >
        <div className="popup-content w-2/6 md:w-2/4 sm:w-2/4 bg-white flex flex-col gap-2 h-[330px] p-[12px] justify-center items-center">
          <div className="h-[100%] w-[100%] justify-center items-center flex flex-col relative">
            {/* <div
              className="absolute top-[12px] right-[12px] cursor-pointer"
              onClick={() => setOpenPopup(false)}
            >
              <img src={CloseIcon} alt="ConfirmIcon" />
            </div> */}
            <img src={ConfirmIcon} alt="ConfirmIcon" />

            <div className="py-5">
              <p
                style={{
                  color: "rgba(24, 40, 61, 1)",
                  fontWeight: 600,
                  fontSize: "18px",
                }}
              >
                Are you sure you want to Accept this Program?
              </p>
            </div>
            <div className="flex justify-center">
              <div className="flex gap-6 justify-center align-middle">
                <Button
                  btnName="No"
                  btnCategory="secondary"
                  btnCls="border !border-[#1D5BBF] !text-[#1D5BBF] w-[120px]"
                  onClick={() => handleCloseAcceptProgram()}
                />
                <Button
                  btnType="button"
                  btnCls="w-[120px]"
                  btnName={"Yes"}
                  btnCategory="primary"
                  onClick={() => {
                    handleAcceptProgram(programdetails);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </Backdrop>

      <CancelPopup header="Reject Program Reason" open={acceptPopup?.reject}
        handleSubmit={() => false} handleClosePopup={() => handleCloseAcceptProgram()} />

    </div>
  );
}
