import React, { useEffect, useState } from "react";
import { Button } from "../../shared";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import ProfileImageIcon from "../../assets/icons/profile-image-icon.svg";
import CancelIcon from "../../assets/images/cancel1x.png";
import TickColorIcon from "../../assets/icons/tickColorLatest.svg";
import CancelColorIcon from "../../assets/icons/cancelCircle.svg";

import SuccessTik from "../../assets/images/blue_tik1x.png";
import SearchIcon from "../../assets/icons/search.svg";
import { useDispatch, useSelector } from "react-redux";
import { docuSign } from "../../services/activities";
import MoreIcon from "../../assets/icons/moreIcon.svg";

import {
  Backdrop,
  Checkbox,
  CircularProgress,
  Link,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import { ProfileFields } from "../../utils/formFields";
import {
  getFollowList,
  getProfileInfo,
  getRequestView,
  userFollow,
  userUnFollow,
} from "../../services/userList";
import ConnectIcon from "../../assets/images/Connectpop1x.png";
import {
  cancelMemberRequest,
  getCategoryList,
  getprogramRequest,
  updateLocalRequest,
  updateMemberRequest,
  updateProgramMenteeRequest,
  updateProgramRequest,
} from "../../services/request";
import MuiModal from "../../shared/Modal";
import DataTable from "../../shared/DataGrid";
import { categoryColumns } from "../../mock";
import { pipeUrls, requestStatus } from "../../utils/constant";
import { useForm } from "react-hook-form";
import { CancelPopup } from "../Mentor/Task/cancelPopup";
import { updateProfile } from "../../services/profile";
import {
  admin_menteeMember,
  admin_mentorMember,
  myMentorPage,
  myMneteePage,
  request_join,
  request_memberJoin,
  requestPageBreadcrumbs,
  topMentorPage,
} from "../Breadcrumbs/BreadcrumbsCommonData";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import { allProfileSections } from "./tabs/ProfileTab";
import { roleBasedSections } from "./MyProfile";
import Accordian from "../../shared/Accordian";
import FormContextProvider from "./form-context-provider";
import api from "../../services/api";
import ProgramCard from "../../shared/Card/ProgramCard";

export default function ProfileView() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useLocation()?.state;
  console.log("state ===>", state);

  const { programRequest } = useSelector((state) => state.requestList);
  const [confirmPopup, setConfirmPopup] = useState({
    show: false,
    category: false,
    selectedItem: [],
  });
  const [categoryOptions, setCategoryOptions] = useState({
    search: "",
    list: [],
  });
  const [menteeRequestOption, setMenteeRequestOption] = useState({
    modal: false,
    cancel: false,
  });
  const [cancelPopup, setCancelPopup] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [activity, setActivity] = useState({
    modal: false,
    following: false,
    complete: false,
  });
  const {
    userDetails,
    loading: userInfoLoading,
    followInfo,
  } = useSelector((state) => state.userList);
  const pathe = state?.reqType ? -1 : "/all-request";
  const [noteData, setNoteData] = React.useState({
    text: "",
    error: "",
  });
  const [notesActivity, setNotesActivity] = React.useState(false);
  const [bookmarkLoading, setBookmarkLoading] = React.useState(false);

  const { profile, loading } = useSelector((state) => state.profileInfo);
  const userInfo = useSelector((state) => state.userInfo);
  const role = userInfo.data.role;
  const {
    categoryList,
    status: requeststatus,
    loading: reportLoading,
    error,
  } = useSelector((state) => state.requestList);
  const params = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const from = searchParams.get("from");
  const fromType = searchParams.get("fromType");
  const pageType = window.location.href.includes("mentor-details")
    ? "Mentor"
    : "Mentee";
  const breadcrumbsType = searchParams.get("breadcrumbsType") || "";
  const [breadcrumbsArray, setBreadcrumbsArray] = useState([]);
  const { requestData } = useSelector((state) => state.userList);
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const loadUserProfile = () => {
    dispatch(getProfileInfo({ id: params.id, program_limit: 3 }));
    dispatch(getFollowList(params.id));
  };

  const followResponseHandle = () => {
    setActivity({
      modal: false,
      complete: true,
      following: !activity.following,
    });
    dispatch(getFollowList(params.id)).then(() => {
      setTimeout(() => {
        setActivity({ ...activity, modal: false, complete: false });
      }, 3000);
    });
  };

  const handleFollow = () => {
    if (followInfo.is_following) {
      dispatch(userUnFollow({ user_id: params.id })).then(() => {
        followResponseHandle();
      });
    }
    if (!followInfo.is_following) {
      dispatch(userFollow({ user_id: params.id })).then(() => {
        followResponseHandle();
      });
    }
  };

  const handleRedirectDocuSign = () => {
    dispatch(docuSign()).then((res) => {
      if (res?.meta?.requestStatus === "fulfilled") {
        const url = res?.payload?.url ?? "#";
        window.open(url, "_blank");
      }
    });
  };

  const handleShowPopup = () => {
    setActivity({ ...activity, modal: true });
  };

  // Reset Confirm Popup
  const resetConfirmPopup = () => {
    setConfirmPopup({ show: false, category: false, selectedItem: [] });
  };

  const resetMenteeRequest = () => {
    setMenteeRequestOption({ modal: false, cancel: false });
  };

  // Admin Action
  const handleMemberAcceptRequest = () => {
    if (role === "admin") {
      dispatch(getCategoryList());
    }

    if (role === "mentor") {
      setMenteeRequestOption({ modal: true, cancel: false });
    }
  };

  // Member Cancel opup
  const handleMemberCancelRequest = () => {
    if (role === "admin") {
      setConfirmPopup({ show: true, category: false, selectedItem: [] });
    }

    if (role === "mentor") {
      setMenteeRequestOption({ modal: false, cancel: true });
    }
  };

  // Handle Selected Items for Category
  const handleSelectedItems = (selectedInfo) => {
    let data = { ...confirmPopup };
    if (selectedInfo.length) {
      data = { ...data, selectedItem: selectedInfo };
    }

    const categoryId = [];
    data.selectedItem.forEach((selected) =>
      categoryId.push(selected.categories_id)
    );
    const payload = {
      member_id: params.id,
      categories_id: confirmPopup?.selectedItem,
    };
    dispatch(updateMemberRequest(payload)).then((res) => {
      if (res?.meta?.requestStatus === "fulfilled") {
        navigate(pathe);
      }
    });
  };

  // Confirm Accept Popup
  const handleConfirmPopup = () => {
    if (role === "admin") {
      dispatch(cancelMemberRequest({ member_id: params.id })).then((res) => {
        if (res?.meta?.requestStatus === "fulfilled") {
          navigate(pathe);
        }
      });
    }

    if (role === "mentor") {
      if (state?.data?.id) {
        dispatch(
          updateProgramRequest({
            id: state?.data?.id,
            status: "approved",
          })
        ).then(() => {
          setTimeout(() => {
            navigate(pathe);
          }, 100);
        });
      } else {
        dispatch(
          updateProgramMenteeRequest({
            id: parseInt(searchParams.get("request_id")),
            status: "approved",
          })
        ).then(() => {
          setTimeout(() => {
            console.log("MMMM");
            dispatch(updateLocalRequest({ status: "" }));
            resetMenteeRequest();
            navigate(pathe);
          }, 100);
        });
      }
    }
  };
  const reqStatus = {
    approved: "Approved",
    rejected: "Rejected",
    new: "New",
    cancel: "Rejected",
    accept: "Approved",
  };
  const reqStatusColor = {
    approved: {
      background: "#16B681",
      borderRadius: "5px",
      // width: "300px",
      cursor: "not-allowed",
    },
    rejected: {
      border: "1px solid #E0382D",
      borderRadius: "5px",
      color: "#E0382D",
      // width: "300px",
      cursor: "not-allowed",
    },
    cancel: {
      border: "1px solid #E0382D",
      borderRadius: "5px",
      color: "#E0382D",
      // width: "300px",
      cursor: "not-allowed",
    },
    accept: {
      background: "#16B681",
      borderRadius: "5px",
      // width: "300px",
      cursor: "not-allowed",
    },
  };
  const footerComponent = (props) => {
    return (
      <div className="flex gap-6 justify-center items-center py-4">
        <button
          onClick={() => resetConfirmPopup()}
          className="py-3 px-6 w-[16%]"
          style={{
            border: "1px solid rgba(29, 91, 191, 1)",
            borderRadius: "3px",
            color: "rgba(29, 91, 191, 1)",
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => {
            handleSelectedItems(props.selectedRows);
          }}
          className="text-white py-3 px-6 w-[16%]"
          style={{
            background:
              "linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)",
            borderRadius: "3px",
          }}
        >
          Submit
        </button>
      </div>
    );
  };

  const handleSearchCategory = (e) => {
    let catList = categoryOptions.list.filter((list) =>
      list.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    if (e.target.value === "") catList = categoryList;
    setCategoryOptions({ search: e.target.value, list: catList });
  };

  const handleCancelReasonPopupSubmit = (data) => {
    if (state?.data?.id) {
      dispatch(
        updateProgramRequest({
          id: state?.data?.id,
          status: "rejected",
          reason: data.cancel_reason,
        })
      ).then(() => {
        setTimeout(() => {
          navigate(pathe);
        }, 100);
      });
    } else {
      if (data.cancel_reason !== "") {
        dispatch(
          updateProgramMenteeRequest({
            id: parseInt(searchParams.get("request_id")),
            status: "rejected",
            rejection_reason: data.cancel_reason,
          })
        ).then(() => {
          setTimeout(() => {
            console.log("MMMM");
            dispatch(updateLocalRequest({ status: "" }));
            resetMenteeRequest();
            navigate(pathe);
          }, 100);
        });
      }
    }
  };
  const handleCloseConfirmPopup = () => {
    setCancelPopup(false);
  };
  const handleCancelSubmit = (reas) => {
    if (role === "admin") {
      dispatch(
        cancelMemberRequest({
          member_id: params.id,
          reason: reas,
        })
      ).then((res) => {
        if (res?.meta?.requestStatus === "fulfilled") {
          navigate(pathe);
        }
      });
    }
  };
  useEffect(() => {
    // Category load action
    if (requeststatus === requestStatus.categoryload) {
      setCategoryOptions({ search: "", list: categoryList });
      setConfirmPopup({ show: false, category: true, selectedItem: [] });
      setTimeout(() => {
        dispatch(updateLocalRequest({ status: "" }));
      }, 2000);
    }

    if (
      requeststatus === requestStatus.memberupdate ||
      requeststatus === requestStatus.membercancel
    ) {
      resetConfirmPopup();
      setTimeout(() => {
        resetMenteeRequest();
        dispatch(updateLocalRequest({ status: "" }));
        dispatch(getProfileInfo({ id: params.id }));
        navigate(pathe);
      }, 3000);
    }

    // if (requestStatus === requestStatus.programupdate) {
    //     setTimeout(() => {
    //         console.log('MMMM');
    //         // dispatch(updateLocalRequest({ status: '' }));
    //         // resetMenteeRequest()
    //         navigate(pathe)
    //     }, 3000);
    // }
  }, [requeststatus]);

  useEffect(() => {
    if (params.id) {
      loadUserProfile();
    }
  }, [params]);
  useEffect(() => {
    if (searchParams.get("request_id")) {
      if (role === "admin") {
        dispatch(getRequestView(parseInt(searchParams.get("request_id"))));
      }
      if (role === "mentor") {
        dispatch(getRequestView(parseInt(searchParams.get("request_id"))));
      }
    }
  }, [role]);

  const handleSelectCategory = (value) => {
    setConfirmPopup({
      ...confirmPopup,
      selectedItem: !confirmPopup?.selectedItem?.includes(value)
        ? [...confirmPopup?.selectedItem, value]
        : confirmPopup?.selectedItem?.filter((e) => e !== value),
    });
  };

  const categoryColumn = [
    {
      field: "checkbox",
      headerName: "",
      id: 0,
      for: ["admin", "mentor"],
      width: 100,
      renderCell: (params) => {
        return (
          <div>
            <Checkbox
              checked={confirmPopup?.selectedItem?.includes(
                params?.row?.categories_id
              )}
              onChange={() => handleSelectCategory(params?.row?.categories_id)}
            />
          </div>
        );
      },
    },
    ...categoryColumns,
  ];

  const [adminPopup, setAdminPopup] = React.useState({
    bool: false,
    activity: false,
    type: "",
  });

  const handleOpenAdminApprove = (type = "") => {
    setAdminPopup({
      ...adminPopup,
      bool: true,
      type: type,
    });
  };

  const handleCloseAdminApprove = (type = "") => {
    setAdminPopup({
      ...adminPopup,
      bool: false,
      activity: false,
      close: false,
      type: "",
    });
  };

  const handleAdminProgram = (type, reason) => {
    let payload = {
      id: requestData?.id,
      status: type,
    };
    if (type === "rejected") {
      payload = {
        ...payload,
        rejection_reason: reason,
      };
    }
    dispatch(updateProgramMenteeRequest(payload)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        navigate(-1);
      }
    });
  };

  const handleSaveNotes = () => {
    if (noteData?.text !== "") {
      const notesForm = new FormData();
      notesForm.append("id", userDetails?.id);
      notesForm.append("profile_notes", noteData?.text);
      dispatch(updateProfile(notesForm)).then((res) => {
        if (res?.meta?.requestStatus === "fulfilled") {
          setNotesActivity(true);
          setTimeout(() => {
            setNotesActivity(false);
            loadUserProfile();
            setNoteData({
              text: "",
              error: "",
            });
          }, 2000);
        }
      });
    } else {
      setNoteData({
        ...noteData,
        error: "Notes is required",
      });
    }
  };
  const handleBreadcrumbs = (key) => {
    const admin_membermentor = admin_mentorMember();
    const admin_memberMnetee = admin_menteeMember();
    const admin_approvedreport = request_join();
    const admin_request = request_memberJoin();
    const myMentee = myMneteePage();
    const TopMentor = topMentorPage();
    const myMentor = myMentorPage();
    switch (key) {
      case requestPageBreadcrumbs.member_join_request:
        setBreadcrumbsArray(admin_request);
        break;
      case requestPageBreadcrumbs.myMentee:
        setBreadcrumbsArray(myMentee);
        break;
      case requestPageBreadcrumbs.program_join_request_admin:
        setBreadcrumbsArray(admin_approvedreport);
        break;
      case requestPageBreadcrumbs.adminMemberMenteeTab:
        setBreadcrumbsArray(admin_memberMnetee);
        break;
      case requestPageBreadcrumbs.adminMemberMentorTab:
        setBreadcrumbsArray(admin_membermentor);
        break;
      case requestPageBreadcrumbs.myMentor:
        setBreadcrumbsArray(myMentor);
        break;
      case requestPageBreadcrumbs.topMentor:
        setBreadcrumbsArray(TopMentor);
        break;
      case "discussion":
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    if (breadcrumbsType) {
      handleBreadcrumbs(breadcrumbsType);
    }
  }, [breadcrumbsType]);

  const profileSection = allProfileSections.filter((section) =>
    ["Personal Information"]?.includes(section.title)
  );

  const getApprovalStatus = () => {
    const member_status = searchParams.get("member_status");
    let status = "";
    const approvalStatus = userDetails?.approve_status;
    if (member_status) {
      status = member_status;
    } else {
      if (approvalStatus === "approved") {
        status = "approved";
      } else if (approvalStatus === "rejected") {
        status = "rejected";
      } else {
        status = reqStatus[userDetails?.approve_status];
      }
    }
    return status;
  };

  const approvalLabel = getApprovalStatus();

  const handleBookmark = async (program) => {
    const is_admin_assign_program = program.hasOwnProperty(
      "admin_assign_program"
    );
    const payload = {
      [is_admin_assign_program ? "admin_program_id" : "program_id"]: program.id,
      marked: !program.is_bookmark,
    };
    setBookmarkLoading(true);
    const bookmark = await api.post("bookmark", payload);
    if (bookmark.status === 201 && bookmark.data) {
      setBookmarkLoading(false);
      if (params.id) {
        loadUserProfile();
      }
    }
  };

  const handleNavigateDetails = (program) => {
    let baseUrl = pipeUrls.programdetails;
    if (Object.keys(program).length) {
      if (program?.admin_assign_program) {
        navigate(
          `${baseUrl}/${program.id}?breadcrumbsType=${requestPageBreadcrumbs.dashboardPrograms}&program_create_type=admin_program`
        );
      } else {
        navigate(
          `${baseUrl}/${program.id}?breadcrumbsType=${requestPageBreadcrumbs.dashboardPrograms}`
        );
      }
    }
  };

  return (
    <div className="profile-container">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => 999999 }}
        open={loading || userInfoLoading || reportLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Admin Popup start*/}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={adminPopup?.bool && adminPopup?.type === "approved"}
      >
        <div className="popup-content w-2/6 md:w-2/4 sm:w-2/4 bg-white flex flex-col gap-2 h-[330px] justify-center items-center">
          <img src={ConnectIcon} alt="ConnectIcon" />
          {/* <span style={{ color: '#232323', fontWeight: 600, fontSize: '24px' }}>
            {followInfo.is_following ? 'Unfollow' : 'Follow'}
          </span> */}

          <div className="py-5">
            <p
              style={{
                color: "rgba(24, 40, 61, 1)",
                fontWeight: 600,
                fontSize: "18px",
              }}
            >
              Are you sure you want to approve request?
            </p>
          </div>
          <div className="flex justify-center">
            <div className="flex gap-6 justify-center align-middle">
              <Button
                btnName="Cancel"
                btnCategory="secondary"
                onClick={() => handleCloseAdminApprove()}
              />
              <Button
                btnType="button"
                btnCls="w-[110px]"
                btnName={"Yes"}
                btnCategory="primary"
                onClick={() => handleAdminProgram("approved")}
              />
            </div>
          </div>
        </div>
      </Backdrop>

      <CancelPopup
        open={adminPopup?.bool && adminPopup?.type === "rejected"}
        header="Rejection Reason"
        handleClosePopup={() => handleCloseAdminApprove()}
        handleSubmit={(reason) => handleAdminProgram("rejected", reason)}
      />

      {/* Admin Popup end */}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={activity.modal}
      >
        <div className="popup-content w-2/6 md:w-2/4 sm:w-2/4 bg-white flex flex-col gap-2 h-[330px] justify-center items-center">
          <img src={ConnectIcon} alt="ConnectIcon" />
          <span style={{ color: "#232323", fontWeight: 600, fontSize: "24px" }}>
            {followInfo.is_following ? "Unfollow" : "Follow"}
          </span>

          <div className="py-5">
            <p
              style={{
                color: "rgba(24, 40, 61, 1)",
                fontWeight: 600,
                fontSize: "18px",
              }}
            >
              Are you sure you want to{" "}
              {followInfo.is_following ? "Unfollow" : "Follow"} {pageType}?
            </p>
          </div>
          <div className="flex justify-center">
            <div className="flex gap-6 justify-center align-middle">
              <Button
                btnName="Cancel"
                btnCategory="secondary"
                onClick={() => setActivity({ modal: false, following: false })}
              />
              <Button
                btnType="button"
                btnCls="w-[110px]"
                btnName={followInfo.is_following ? "Unfollow" : "Follow"}
                btnCategory="primary"
                onClick={handleFollow}
              />
            </div>
          </div>
        </div>
      </Backdrop>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={
          requeststatus === requestStatus.memberupdate ||
          requeststatus === requestStatus.membercancel
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
              Request updated successfully
            </p>
          </div>
        </div>
      </Backdrop>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={activity.complete}
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
              {" "}
              Successfully{" "}
              {followInfo.is_following ? "followed " : "unfollowed "}{" "}
              {pageType.toLowerCase()}
            </p>
          </div>
        </div>
      </Backdrop>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => 1 }}
        open={menteeRequestOption.modal}
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
              Are you sure want to accept program request?
            </p>
          </div>
          <div className="flex justify-center">
            <div className="flex gap-6 justify-center align-middle">
              <Button
                btnCls="w-[110px]"
                btnName={"Cancel"}
                btnCategory="secondary"
                onClick={resetMenteeRequest}
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

      <MuiModal
        modalSize="md"
        modalOpen={menteeRequestOption.cancel}
        modalClose={undefined}
        noheader
      >
        <div className="px-5 py-5">
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
                Reject Request Reason{" "}
              </p>
              <img
                className="cursor-pointer"
                onClick={resetMenteeRequest}
                src={CancelIcon}
                alt="CancelIcon"
              />
            </div>

            <div className="px-5">
              {error !== "" ? (
                <p className="error" role="alert">
                  {error}
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
                    btnCls="w-[18%]"
                    btnCategory="secondary"
                    onClick={resetConfirmPopup}
                  />
                  <button
                    type="submit"
                    className="text-white py-3 px-7 w-[18%]"
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

      {/* Select Categort Popup */}
      <MuiModal
        modalSize="md"
        modalOpen={confirmPopup.category}
        modalClose={resetConfirmPopup}
        noheader
      >
        <div className="px-5 py-5">
          <div
            className="flex justify-center flex-col gap-5 px-5 pb-5 mt-4 mb-4"
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
                Select Category
              </p>
              <img
                className="cursor-pointer"
                onClick={resetConfirmPopup}
                src={CancelIcon}
                alt="CancelIcon"
              />
            </div>
            <div className="flex justify-between px-3 mb-4">
              <div className="relative w-full">
                <input
                  type="text"
                  id="search-navbar"
                  className="block w-full p-2 text-sm text-gray-900 border-none"
                  placeholder="Search here..."
                  style={{
                    border: "1px solid rgba(29, 91, 191, 1)",
                    borderRadius: "50px",
                    height: "60px",
                    width: "100%",
                  }}
                  onChange={handleSearchCategory}
                  value={categoryOptions.search}
                />
                <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
                  <img src={SearchIcon} alt="SearchIcon" />
                </div>
              </div>
            </div>

            <DataTable
              rows={categoryOptions.list}
              columns={categoryColumn}
              height={"460px"}
              footerComponent={footerComponent}
              selectedAllRows={confirmPopup.selectedItem}
              hideCheckbox
            />
          </div>
        </div>
      </MuiModal>

      {/* <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => 1 }}
        open={confirmPopup.show}
      >
        <div className='popup-content w-2/6 md:w-2/4 sm:w-2/4 bg-white flex flex-col gap-2 h-[330px] justify-center items-center'>
          <img src={CancelColorIcon} alt='CancelColorIcon' />
          <span style={{ color: '#232323', fontWeight: 600, fontSize: '24px' }}>
            Reject
          </span>
          <div className='py-5'>
            <p
              style={{
                color: 'rgba(24, 40, 61, 1)',
                fontWeight: 600,
                fontSize: '18px',
              }}
            >
              Are you sure want to reject the member request?
            </p>
          </div>
          <div className='flex justify-center'>
            <div className='flex gap-6 justify-center align-middle'>
              <Button
                btnCls='w-[110px]'
                btnName={'No'}
                btnCategory='secondary'
                onClick={resetConfirmPopup}
              />
              <Button
                btnType='button'
                btnCls='w-[110px]'
                btnName={'Yes'}
                style={{ background: '#E0382D' }}
                btnCategory='primary'
                onClick={handleConfirmPopup}
              />
            </div>
          </div>
        </div>
      </Backdrop> */}
      <div className="pb-3">
        {breadcrumbsType && <Breadcrumbs items={breadcrumbsArray} />}
      </div>

      <div
        className="profile-content py-8 px-4 sm:px-4 md:px-8 lg:px-14 xl:px-14 "
        style={{
          border: "1px solid rgba(219, 224, 229, 1)",
          background: "rgba(255, 255, 255, 1)",
        }}
      >
        {/* <div className='flex justify-between items-center mb-8'>
          <div className='text-color font-medium'>Profile Picture</div>
        </div> */}
        <div className="mb-4">
          {/* <div className='text-color font-medium'>My {pageType} Profile</div> */}
          <div className="text-color font-medium !text-[20px]">Profile</div>
        </div>
        <div className="flex justify-between items-center">
          <div className="py-4 relative w-[50%] sm:w-[50%] md:w-[17%] lg:w-[14%] xl:w-[12%]">
            <div className="upload-profile">
              <label
                className="w-[40%] pb-3 rounded-lg text-white text-[14px] cursor-pointer"
                style={{
                  border: "none",
                }}
              >
                <img
                  src={userDetails?.profile_image || ProfileImageIcon}
                  style={{ borderRadius: "50%", height: "143px" }}
                  alt="ProfileImageIcon"
                />
              </label>
            </div>
          </div>
          <div className="flex gap-5 flex-col sm:flex-col md:flex-row lg:flex-row xl:flex-row">
            {/* {role !== "admin" ? (
              <>
                {(state?.data?.status === "new" ||
                  requestData?.status === "new") &&
                ["new", "pending"].includes(requestData?.status) ? (
                  <>
                    <div className="flex gap-4 pt-10">
                      <button
                        className="py-3 px-16 text-white text-[14px] flex items-center"
                        style={{
                          border: "1px solid #E0382D",
                          borderRadius: "5px",
                          color: "#E0382D",
                        }}
                        onClick={() => handleMemberCancelRequest()}
                      >
                        Reject
                      </button>
                      <Button
                        btnType="button"
                        btnName="Approve"
                        btnCls={"w-[150px]"}
                        onClick={() => handleMemberAcceptRequest()}
                      />
                    </div>
                  </>
                ) : state?.data?.status === "approved" ||
                  state?.data?.status === "rejected" ||
                  requestData?.status === "approved" ||
                  requestData?.status === "rejected" ? (
                  <>
                    <div className="py-9">
                      <div
                        className="py-3 px-16 text-white text-[14px] flex justify-center items-center"
                        style={{
                          ...reqStatusColor[
                            requestData?.status === "approved"
                              ? "approved"
                              : requestData?.status === "rejected"
                              ? "rejected"
                              : state?.data?.status
                          ],
                        }}
                      >
                        {requestData?.status === "approved"
                          ? "Approved"
                          : requestData?.status === "rejected"
                          ? "Rejected"
                          : reqStatus[state?.data?.status]}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {role === "mentor" &&
                    searchParams.has("type") &&
                    searchParams.get("type") === "mentee_request" &&
                    searchParams.has("request_id") &&
                    searchParams.get("request_id") !== "" &&
                    ["new", "pending"].includes(userDetails?.approve_status) ? (
                      <div className="flex gap-4 pt-10">
                        <button
                          className="py-3 px-16 text-white text-[14px] flex items-center"
                          style={{
                            border: "1px solid #E0382D",
                            borderRadius: "5px",
                            color: "#E0382D",
                          }}
                          onClick={() => handleMemberCancelRequest()}
                        >
                          Reject
                        </button>
                        <button
                          className="py-3 px-16 text-white text-[14px] flex items-center"
                          style={{
                            background: "#16B681",
                            borderRadius: "5px",
                          }}
                          onClick={() => handleMemberAcceptRequest()}
                        >
                          Approve
                        </button>
                      </div>
                    ) : (
                      <>
                        {role !== "mentor" && (
                          <>
                            <Button
                              onClick={handleShowPopup}
                              btnType="button"
                              btnCategory="secondary"
                              disabled={followInfo.is_follow === "waiting"}
                              btnName={
                                followInfo.is_follow === "waiting"
                                  ? "Requested"
                                  : followInfo.is_following
                                  ? "Unfollow"
                                  : "Follow"
                              }
                              btnCls={"w-[150px]"}
                            />
                            <Button
                              btnType="button"
                              btnName="Chat"
                              btnCls={"w-[150px]"}
                            />
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            ) : role === "admin" ? (
              <>
                {userDetails?.approve_status === "new" ||
                userDetails?.approve_status === "pending" ? (
                  <div className="flex gap-4">
                    <div
                      className="w-8 h-8 rounded-md flex items-center justify-center bg-gray-200"
                      onClick={handleClick}
                    >
                      <img src={MoreIcon} alt="" />
                    </div>

                    <Menu
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                    >
                      <MenuItem onClick={handleMemberAcceptRequest}>
                        Approve
                      </MenuItem>
                      <MenuItem onClick={() => setCancelPopup(true)}>
                        Reject
                      </MenuItem>
                      <MenuItem onClick={handleRedirectDocuSign}>
                        DocuSign
                      </MenuItem>
                      <MenuItem onClick={() => navigate("/bgVerify")}>
                        Bg-verification
                      </MenuItem>
                    </Menu>
                  </div>
                ) : // <div className='flex gap-4 pt-10'>
                //   <button
                //     className='py-3 px-16 text-white text-[14px] flex items-center'
                //     style={{
                //       border: '1px solid #E0382D',
                //       borderRadius: '5px',
                //       color: '#E0382D',
                //     }}
                //     onClick={() => {
                //       setCancelPopup(true);
                //       // handleMemberCancelRequest()
                //     }}
                //   >
                //     Reject
                //   </button>
                //   <button
                //     className='py-3 px-16 text-white text-[14px] flex items-center'
                //     style={{
                //       background: '#16B681',
                //       borderRadius: '5px',
                //     }}
                //     onClick={() => handleMemberAcceptRequest()}
                //   >
                //     Approve
                //   </button>
                // </div>
                // userDetails?.approve_status === 'accept' ?

                //     <button className='py-3 px-16 mt-7 text-white text-[14px] flex items-center' style={{
                //         background: "#16B681",
                //         borderRadius: '5px'
                //     }}
                //         onClick={() => undefined}
                //     >Approved
                //     </button>
                //     :

                //     userDetails?.approve_status === 'cancel' ?
                //         <div className='flex gap-4 pt-10' >
                //             <button className='py-3 px-16 text-white text-[14px] flex items-center' style={{
                //                 border: "1px solid #E0382D",
                //                 borderRadius: '5px',
                //                 color: '#E0382D',
                //                 cursor: 'not-allowed'
                //             }}
                //                 onClick={() => undefined}
                //             >Rejected
                //             </button>
                //         </div>

                // :

                null}
              </>
            ) : null}

            {requestData?.request_type === "program_join" &&
              ["new", "pening"].includes(requestData?.status) &&
              role === "admin" && (
                <div className="flex gap-4 pt-10">
                  <button
                    className="py-3 px-16 text-white text-[14px] flex items-center"
                    style={{
                      border: "1px solid #E0382D",
                      borderRadius: "5px",
                      color: "#E0382D",
                    }}
                    onClick={() => handleOpenAdminApprove("rejected")}
                  >
                    Reject
                  </button>
                  <button
                    className="py-3 px-16 text-white text-[14px] flex items-center"
                    style={{
                      background: "#16B681",
                      borderRadius: "5px",
                    }}
                    onClick={() => handleOpenAdminApprove("approved")}
                  >
                    Approve
                  </button>
                </div>
              )} */}

            {role !== "admin" && (
              <>
                {(state?.data?.status === "new" ||
                  requestData?.status === "new") &&
                  ["new", "pending"].includes(requestData?.status) && (
                    <>
                      <div className="flex gap-4 pt-10">
                        <button
                          className="py-3 px-16 text-white text-[14px] flex items-center"
                          style={{
                            border: "1px solid #E0382D",
                            borderRadius: "5px",
                            color: "#E0382D",
                          }}
                          onClick={() => handleMemberCancelRequest()}
                        >
                          Reject
                        </button>
                        <Button
                          btnType="button"
                          btnName="Approve"
                          btnCls={"w-[150px]"}
                          onClick={() => handleMemberAcceptRequest()}
                        />
                      </div>
                    </>
                  )}
                {(state?.data?.status === "approved" ||
                  state?.data?.status === "rejected" ||
                  requestData?.status === "approved" ||
                  requestData?.status === "rejected") && (
                  <div className="py-9">
                    <div
                      className="py-3 px-16 text-white text-[14px] flex justify-center items-center"
                      style={{
                        ...reqStatusColor[
                          requestData?.status === "approved"
                            ? "approved"
                            : requestData?.status === "rejected"
                            ? "rejected"
                            : state?.data?.status
                        ],
                      }}
                    >
                      {requestData?.status === "approved"
                        ? "Approved"
                        : requestData?.status === "rejected"
                        ? "Rejected"
                        : reqStatus[state?.data?.status]}
                    </div>
                  </div>
                )}

                {role === "mentor" &&
                  searchParams.has("type") &&
                  searchParams.get("type") === "mentee_request" &&
                  searchParams.has("request_id") &&
                  searchParams.get("request_id") !== "" &&
                  ["new", "pending"].includes(userDetails?.approve_status) && (
                    <div className="flex gap-4 pt-10">
                      <button
                        className="py-3 px-16 text-white text-[14px] flex items-center"
                        style={{
                          border: "1px solid #E0382D",
                          borderRadius: "5px",
                          color: "#E0382D",
                        }}
                        onClick={() => handleMemberCancelRequest()}
                      >
                        Reject
                      </button>
                      <button
                        className="py-3 px-16 text-white text-[14px] flex items-center"
                        style={{
                          background: "#16B681",
                          borderRadius: "5px",
                        }}
                        onClick={() => handleMemberAcceptRequest()}
                      >
                        Approve
                      </button>
                    </div>
                  )}

                {role !== "mentor" && (
                  <>
                    <Button
                      onClick={handleShowPopup}
                      btnType="button"
                      btnCategory="secondary"
                      disabled={followInfo.is_follow === "waiting"}
                      btnName={
                        followInfo.is_follow === "waiting"
                          ? "Requested"
                          : followInfo.is_following
                          ? "Unfollow"
                          : "Follow"
                      }
                      btnCls={"w-[150px]"}
                    />
                    <Button
                      btnType="button"
                      btnName="Chat"
                      btnCls={"w-[150px]"}
                      onClick={()=>navigate("/discussions")}
                    />
                  </>
                )}
              </>
            )}

            {role === "admin" && (
              <div className="flex gap-4 items-center">
                {/* This is Approved and Rejected status shows when not came from program Join */}
                {from !== "program_join" &&
                  !["new", "pending"].includes(userDetails?.approve_status) && (
                    <div
                      className="py-3 px-16 text-white text-[14px] flex justify-center items-center"
                      style={{
                        ...reqStatusColor[
                          approvalLabel === "Active" ||
                          userDetails?.approve_status === "approved"
                            ? "approved"
                            : approvalLabel === "Deactive" ||
                              userDetails?.approve_status === "rejected"
                            ? "rejected"
                            : userDetails?.approve_status
                        ],
                      }}
                    >
                      {approvalLabel}
                    </div>
                  )}

                {/* This is Approved and Rejected status shows when come from program Join */}
                {from === "program_join" &&
                  !["new", "pending"].includes(requestData?.status) && (
                    <div
                      className="py-3 px-16 text-white text-[14px] flex justify-center items-center"
                      style={{
                        ...reqStatusColor[
                          requestData?.status === "approved"
                            ? "approved"
                            : requestData?.status === "rejected"
                            ? "rejected"
                            : requestData?.status
                        ],
                      }}
                    >
                      {requestData?.status === "approved"
                        ? "Approved"
                        : requestData?.status === "rejected"
                        ? "Rejected"
                        : reqStatus[requestData?.status]}
                    </div>
                  )}

                {from !== "program_join" && type !== "view" && (
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center bg-gray-200"
                    onClick={handleClick}
                  >
                    <img src={MoreIcon} alt="" />
                  </div>
                )}

                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  {["new", "pending"].includes(userDetails?.approve_status) && (
                    <MenuItem className="!text-[12px]" onClick={handleMemberAcceptRequest}>
                      Approve
                    </MenuItem>
                  )}
                  {["new", "pending"].includes(userDetails?.approve_status) && (
                    <MenuItem className="!text-[12px]" onClick={() => setCancelPopup(true)}>
                      Reject
                    </MenuItem>
                  )}
                  <MenuItem className="!text-[12px]" onClick={handleRedirectDocuSign}>DocuSign</MenuItem>
                  <MenuItem className="!text-[12px]" onClick={() => navigate("/bgVerify")}>
                    Bg-verification
                  </MenuItem>
                </Menu>
              </div>
            )}

{requestData?.request_type === "program_join" &&
              ["new", "pening"].includes(requestData?.status) &&
              role === "admin" && (
                <div className="flex gap-4 pt-10">
                  <button
                    className="py-3 px-16 text-white text-[14px] flex items-center"
                    style={{
                      border: "1px solid #E0382D",
                      borderRadius: "5px",
                      color: "#E0382D",
                    }}
                    onClick={() => handleOpenAdminApprove("rejected")}
                  >
                    Reject
                  </button>
                  <button
                    className="py-3 px-16 text-white text-[14px] flex items-center"
                    style={{
                      background: "#16B681",
                      borderRadius: "5px",
                    }}
                    onClick={() => handleOpenAdminApprove("approved")}
                  >
                    Approve
                  </button>
                </div>
              )}
              
          </div>
        </div>

        {/* <div className="grid grid-cols-6 gap-3 mt-12">
          {ProfileFields.map((profilefield, index) => (
            <div className="col-span-2" key={index}>
              <div className="mb-5">
                <label
                  className="block tracking-wide  text-xs mb-2"
                  style={{ color: "rgba(116, 116, 116, 1)" }}
                >
                  {profilefield.label}
                </label>
                <p className="text-[14px]">{userDetails[profilefield?.name]}</p>
              </div>
            </div>
          ))}
        </div> */}

        <FormContextProvider initialValues={userDetails}>
          {profileSection.map((section, index) => (
            <Accordian key={index} title={section.title} defaultValue={true}>
              {section.component}
            </Accordian>
          ))}
        </FormContextProvider>

        <div className="col-span-2">
          {/* {userDetails?.documents?.length > 0 && (
            <Stack>
              <label
                className="block tracking-wide  text-xs mb-2"
                style={{ color: "rgba(116, 116, 116, 1)" }}
              >
                Documents
              </label>

              <Stack direction={"row"} alignItems={"center"} spacing={2}>
                {userDetails?.documents?.map((doc) => {
                  return (
                    <Link
                      target="_blank"
                      href={doc?.file}
                      variant="body2"
                      className={"text-[18px]"}
                    >
                      {doc?.file_display_name}
                    </Link>
                  );
                })}
              </Stack>
            </Stack>
          )} */}

          {role === "admin" && (
            <>
              <p className="mt-6">Notes:</p>
              <div className="flex flex-col gap-2 mt-4">
                <textarea
                  className={`!bg-[#1D5BBF0D] min-h-[100px] p-2`}
                  placeholder={"Enter text"}
                  value={noteData?.text}
                  onChange={(e) =>
                    setNoteData({
                      ...noteData,
                      text: e.target.value,
                      error: "",
                    })
                  }
                ></textarea>
                {noteData?.error?.length > 0 && (
                  <p className="!text-[#FF0000] !text-[12px] mt-1">
                    {noteData?.error}
                  </p>
                )}
                <div className="flex justify-center ">
                  <Button btnName="Submit" onClick={() => handleSaveNotes()} />
                </div>
              </div>
            </>
          )}
        </div>

        {fromType === "topmentor" && (
          <div className="bg-[#F9F9F9]">
            <div className="flex justify-between items-center border-b border-border-main px-5 py-3">
              <p className="text-[18px] font-semibold">Upcoming Programs</p>
              <p
                className="bg-background-primary-light rounded-[3px] text-[#6B6B6B] text-[12px] cursor-pointer px-2 py-1"
                onClick={() =>
                  navigate("/programs?type=upcoming&filter_by=month")
                }
              >
                View All
              </p>
            </div>
            <div>
              <ProgramCard
                title="Upcoming Programs"
                viewpage="/programs?type=yettojoin"
                handleNavigateDetails={handleNavigateDetails}
                handleBookmark={handleBookmark}
                programs={userDetails?.upcoming_programs ?? []}
                //   loadProgram={getPrograms}
                noTitle
              />
            </div>
          </div>
        )}
        <CancelPopup
          open={cancelPopup}
          header={"Reject Reason"}
          handleClosePopup={() => handleCloseConfirmPopup("cancel")}
          handleSubmit={(reason) => {
            handleCancelSubmit(reason);
          }}
        />
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
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
              Profile Notes added successfully
            </p>
          </div>
        </div>
      </Backdrop>
    </div>
  );
}
