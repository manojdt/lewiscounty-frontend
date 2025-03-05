import {
  Backdrop,
  CircularProgress,
  Menu,
  MenuItem,
  Switch,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import DataTable from "../../shared/DataGrid";
import SearchIcon from "../../assets/icons/search.svg";
import CancelIcon from "../../assets/images/cancel1x.png";
import { allMembersColumns } from "../../mock";
import MoreIcon from "../../assets/icons/moreIcon.svg";
import TickCircle from "../../assets/icons/tickCircle.svg";
import CloseCircle from "../../assets/icons/closeCircle.svg";
import PowerIcon from "../../assets/icons/PowerIcon.svg";
import PlusCircle from "../../assets/icons/PlusBorder.svg";
import TickColorIcon from "../../assets/icons/tickColorLatest.svg";
import SuccessTik from "../../assets/images/blue_tik1x.png";
import ViewIcon from "../../assets/images/view1x.png";
import ShareIcon from "../../assets/icons/Share.svg";
import FilterIcon from "../../assets/icons/filterIcon.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  activateUser,
  deactivateUser,
  deleteUser,
  getMembersList,
} from "../../services/members";
import { useNavigate, useSearchParams } from "react-router-dom";
import { memberStatusColor } from "../../utils/constant";
import MuiModal from "../../shared/Modal";
import { useForm } from "react-hook-form";
import { Button } from "../../shared";
import AssignMentorProgram from "./AssignMentorProgram";
import {
  capitalizeFirstLetter,
  formatTableNullValues,
  useDebounce,
} from "../../utils";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import {
  memberMentorDashBoard,
  memberMenteeDashBoard,
  requestPageBreadcrumbs,
} from "../Breadcrumbs/BreadcrumbsCommonData";
import { MemberMain } from "../Breadcrumbs/BreadcrumbsCommonData";
import DeleteIcon from "../../assets/icons/Delete.svg";
import OverDeleteIcon from "../../assets/images/delete_1x.png";
import Bg_verificatin_icon from "../../assets/icons/bg-verification-icon.svg";
import DocuSign_icon from "../../assets/icons/docu-sign-icon.svg";
import { docuSign } from "../../services/activities";
import StatusIndicator from "../../shared/StatusIndicator/StatusIndicator";
import AddTicketIcon from "../../assets/icons/add-ticket-icon.svg";

const Members = () => {
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const [actionTab, setActionTab] = useState("mentor");
  const [activeTableDetails, setActiveTableDetails] = useState({
    column: [],
    data: [],
  });
  const [allData, setAllData] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [search] = useSearchParams();
  const breadcrumbsType = search.get("breadcrumbsType") || "";
  const [breadcrumbsArray, setBreadcrumbsArray] = useState([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [seletedItem, setSelectedItem] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDeleteModal, setDeleteModal] = useState(false);
  const [actionColumnInfo, setActionColumnInfo] = useState({
    cancelPopup: false,
    menteecancel: false,
  });
  const [assignProgramInfo, setAssignProgramInfo] = useState({
    assignPopup: false,
    message: "",
  });
  const [filterInfo, setFilterInfo] = useState({
    search: "",
    status: "",
    role: "",
  });
  const dispatch = useDispatch();
  const { mentor, mentee, admin, loading, error } = useSelector(
    (state) => state.members
  );
  console.log(mentor, mentee, admin);
  const [formattedMentor, setFormattedMentor] = React.useState([]);
  const [formattedMentee, setFormattedMentee] = React.useState([]);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });
  const [filterPopup, setFilterPopup] = useState({
    show: false,
    selectedItem: "", // Change from array to string
    options: [
      { id: "mentor", name: "Mentor" },
      { id: "mentee", name: "Mentee" },
    ],
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedRequestedTab = searchParams.get("tabType");
  const open = Boolean(anchorEl);

  const handleMoreClick = (event, data) => {
    setSelectedItem(data);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeactive = () => {
    handleClose();
    const isOpenDeactivePopup = ["mentor", "mentee"].includes(actionTab);
    setActionColumnInfo({
      cancelPopup: isOpenDeactivePopup,
      menteecancel: actionTab === "mentee",
    });
  };

  const handleCloseCancelReasonPopup = () => {
    reset();
    setActionColumnInfo({ cancelPopup: false, menteecancel: false });
  };
  // Handle filter icon click
  const handleFilterIconClick = (e) => {
    // e.stopPropagation();
    setFilterPopup({
      ...filterPopup,
      show: true,
      selectedItem: filterInfo.role || "",
    });
  };

  // Handle option selection (now only stores one value)
  const handleSelectOption = (id) => {
    // If same item is clicked again, deselect it
    if (filterPopup.selectedItem === id) {
      setFilterPopup({
        ...filterPopup,
        selectedItem: "",
      });
    } else {
      // Otherwise, select the new item
      setFilterPopup({
        ...filterPopup,
        selectedItem: id,
      });
    }
  };

  // Handle filter submission for single selection
  const handleFilterSubmit = () => {
    // Update filterInfo with selected role
    const newFilterInfo = { ...filterInfo };

    if (filterPopup.selectedItem) {
      newFilterInfo.role = filterPopup.selectedItem;
    } else {
      delete newFilterInfo.role;
    }

    setFilterInfo(newFilterInfo);
    setPaginationModel({
      page: 0,
      pageSize: 10,
    });

    // Close the popup
    setFilterPopup({
      ...filterPopup,
      show: false,
    });
  };
  //Mentor/Mentee deactive ---> active
  const handleActivate = () => {
    handleClose();
    dispatch(
      activateUser({
        user_id: seletedItem.id,
      })
    ).then(() => {
      handleCloseCancelReasonPopup();
      dispatch(
        getMembersList({
          // role_name: actionTab,
          page: paginationModel?.page + 1,
          limit: paginationModel?.pageSize,
        })
      );
    });
  };

  // Mentor Deactivate
  const handleCancelReasonPopupSubmit = (data) => {
    const { reason } = data;
    if (reason !== "") {
      reset();
      dispatch(
        deactivateUser({
          reason: reason,
          deactivate_user: seletedItem.id,
        })
      ).then(() => {
        handleCloseCancelReasonPopup();
        dispatch(
          getMembersList({
            // role_name: actionTab,
            page: paginationModel?.page + 1,
            limit: paginationModel?.pageSize,
          })
        );
      });
    }
  };

  // Mentee Deactivate
  const handleMenteeConfirmPopup = () => {
    dispatch(
      deactivateUser({
        deactivate_user: seletedItem.id,
      })
    ).then(() => {
      handleCloseCancelReasonPopup();
      dispatch(
        getMembersList({
          // role_name: actionTab,
          page: paginationModel?.page + 1,
          limit: paginationModel?.pageSize,
        })
      );
    });
  };

  // DocuSign redirection
  const handleRedirectDocuSign = () => {
    handleClose();
    dispatch(docuSign()).then((res) => {
      if (res?.meta?.requestStatus === "fulfilled") {
        const url = res?.payload?.url ?? "#";
        window.open(url, "_blank");
      }
    });
  };

  const handleStatus = (e) => {
    setFilterInfo({ ...filterInfo, status: e.target.value });
    setPaginationModel({
      page: 0,
      pageSize: 10,
    });
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  useEffect(() => {
    setFilterInfo({ ...filterInfo, search: debouncedSearchTerm });
  }, [debouncedSearchTerm]);

  // Mentor Auto Approval
  const handleChange = (row) => {
    console.log("Approval", row);
  };

  const mentroDeleteHandler = () => {
    if (seletedItem?.id) {
      dispatch(
        deleteUser({
          user_id: seletedItem.id,
        })
      ).then(() => {
        setDeleteModal(false);
        handleClose();
        dispatch(
          getMembersList({
            // role_name: actionTab,
            page: paginationModel?.page + 1,
            limit: paginationModel?.pageSize,
          })
        );
      });
    }
  };

  useEffect(() => {
    if (assignProgramInfo.message !== "") {
      setTimeout(() => {
        setAssignProgramInfo({ assignPopup: false, message: "" });
      }, 2000);
    }
  }, [assignProgramInfo]);

  useEffect(() => {
    let tableData = [];
    if (actionTab === "mentor") {
      tableData = admin;
    }

    if (actionTab === "mentee") {
      tableData = admin;
    }

    let columns = allMembersColumns;

    if (actionTab === "mentor") {
      columns = columns.map((column) => {
        if (column.field === "auto_approval") {
          return {
            ...column,
            renderCell: (params) => {
              return (
                <div>
                  <Switch
                    checked={false}
                    onChange={() => handleChange(params.row)}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </div>
              );
            },
          };
        }
        return column;
      });
    }

    const onViewClick = () => {
      handleClose();
      const adminview = `&breadcrumbsType=${actionTab}`;
      const memberStatus = seletedItem.member_active ? "Active" : "Deactive";
      navigate(
        `/mentor-details/${seletedItem.id}?member_status=${memberStatus}${adminview}`
      );
    };

    const updatedColumns = [
      // ...columns,
      {
        field: "full_name",
        headerName: "Name",
        flex: 1,
        id: 0,
        for: ["admin"],
      },
      {
        field: "average_rating",
        headerName: "User Type",
        flex: 1,
        id: 5,
        for: ["admin"],
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
                handleFilterIconClick(e);
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
        field: "phone_number",
        headerName: "Phone Number",
        flex: 1,
        id: 4,
        for: ["admin"],
      },
      {
        field: "email",
        headerName: "Email",
        flex: 2,
        id: 5,
        for: ["admin"],
      },
      // {
      //   field: "status",
      //   headerName: "Activity",
      //   flex: 1,
      //   id: 2,
        // renderCell: (params) => {
        //   return (
        //     <>
        //       <div className="cursor-pointer flex items-center h-full relative">
        //         <span
        //           className="w-[80px] flex justify-center h-[30px] px-7"
        //           style={{
        //             background: params.row.member_active
        //               ? memberStatusColor.accept.bgColor
        //               : memberStatusColor.cancel.bgColor,
        //             lineHeight: "30px",
        //             borderRadius: "3px",
        //             width: params.row.member_active ? "110px" : "110px",
        //             height: "34px",
        //             color: params.row.member_active
        //               ? memberStatusColor.accept?.color
        //               : memberStatusColor.cancel.color,
        //             fontSize: "12px",
        //           }}
        //         >
        //           {params.row.member_active ? "Active" : "Deactive"}
        //         </span>
        //       </div>
        //     </>
        //   );
        // },
        {
          field: "status",
          headerName: "Status",
          flex: 1,
          id: 2,
          renderCell: (params) => {
            // Derive the status code based on member_active property
            const statusCode = params.row.member_active ? "Active" : "Deactive";
            
            return (
              <div className="flex items-center h-full w-full">
                <StatusIndicator status={statusCode} />
              </div>
            );
          },
        },
        
      
      {
        field: "action",
        headerName: "Action",
        flex: 1,
        id: 4,
        align: "center",
        renderCell: (params) => {
          return (
            <>
              <div
                className="cursor-pointer flex items-center h-full"
                onClick={(e) => handleMoreClick(e, params.row)}
              >
                <img src={MoreIcon} className="pl-4" alt="MoreIcon" />
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
                <MenuItem
                  onClick={() => onViewClick()}
                  className="!text-[12px]"
                >
                  <img
                    src={ViewIcon}
                    alt="ViewIcon"
                    field={params.id}
                    className="pr-3 w-[30px]"
                  />
                  View
                </MenuItem>

                <MenuItem
                  className="!text-[12px]"
                  onClick={() => navigate("/discussions")}
                >
                  <img
                    src={TickCircle}
                    alt="AcceptIcon"
                    className="pr-3 w-[27px]"
                  />
                  Chat
                </MenuItem>

                {!seletedItem.member_active && (
                  <MenuItem className="!text-[12px]" onClick={handleActivate}>
                    <img
                      src={PowerIcon}
                      alt="CancelIcon"
                      className="pr-3 w-[27px]"
                    />
                    Activate
                  </MenuItem>
                )}
                {seletedItem.member_active && (
                  <MenuItem className="!text-[12px]" onClick={handleDeactive}>
                    <img
                      src={CloseCircle}
                      alt="CancelIcon"
                      className="pr-3 w-[27px]"
                    />
                    Deactivate
                  </MenuItem>
                )}
                <MenuItem
                  onClick={() => navigate("/bgVerify")}
                  className="!text-[12px]"
                >
                  <img
                    src={Bg_verificatin_icon}
                    alt="AcceptIcon"
                    className="pr-3 w-[27px]"
                  />
                  BG verification
                </MenuItem>
                <MenuItem
                  onClick={handleRedirectDocuSign}
                  className="!text-[12px]"
                >
                  <img
                    src={DocuSign_icon}
                    alt="AcceptIcon"
                    className="pr-3 w-[27px]"
                  />
                  DocuSign
                </MenuItem>
                <MenuItem
                  className="!text-[12px]"
                  onClick={() => {
                    setDeleteModal(true);
                    setAnchorEl(null);
                  }}
                >
                  <img
                    src={DeleteIcon}
                    alt="CancelIcon"
                    className="pr-3 w-[27px]"
                  />
                  Delete
                </MenuItem>
              </Menu>
            </>
          );
        },
      },
    ];
    const formattedRowData = formatTableNullValues(tableData?.results);
    setAllData(tableData);
    setActiveTableDetails({ data: formattedRowData, column: updatedColumns });
  }, [mentor, mentee, admin, anchorEl]);

  useEffect(() => {
    let payload = {
      // role_name: actionTab,
      page: paginationModel?.page + 1,
      limit: paginationModel?.pageSize,
    };

    if (filterInfo.status !== "" && filterInfo.status !== "all") {
      payload = { ...payload, status: filterInfo.status };
    }
    
    if (filterInfo.search !== "") {
      payload = { ...payload, search: filterInfo.search };
    }
    if (filterInfo.role) {
      payload = { ...payload, role: filterInfo.role };
    }
    if(breadcrumbsType==='dashboardMemberMentor' && filterInfo?.role!=='mentor'){
      payload ={...payload, role:'mentor'}
    }
    dispatch(getMembersList(payload));
  }, [actionTab, paginationModel, filterInfo.status, filterInfo.search]);

  useEffect(() => {
    if (selectedRequestedTab) {
      setActionTab(selectedRequestedTab);
    }
  }, [selectedRequestedTab]);

  const handleBreadcrumbs = (key) => {
    const dashboardMemberMentor = memberMentorDashBoard();
    const dashboardMemberMentee = memberMenteeDashBoard();

    switch (key) {
      case requestPageBreadcrumbs.dashboardMemberMentor:
        setBreadcrumbsArray(dashboardMemberMentor);
        break;
      case requestPageBreadcrumbs.dashboardMemberMentee:
        setBreadcrumbsArray(dashboardMemberMentee);
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

  return (
    <div className="program-request px:2 sm:px-2 md:px-4 lg:px-8 mt-10">
      <div className="pb-3">
        {breadcrumbsType && <Breadcrumbs items={breadcrumbsArray} />}
      </div>

      {/* Search and Filters */}
      <div className="flex justify-between">
        <div className="pl-6 flex items-center font-medium text-[18px]">
          <p>Users</p>
        </div>
        <div className="title flex flex-row sm:flex-row justify-end py-3 px-4 items-center gap-4 mr-4">
          <div className="relative w-3/4 sm:w-3/6 md:w-[35%] lg:w-[35%] xl:w-[25%] flex-1">
            <input
              type="text"
              id="search-navbar"
              className="block w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search here..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <div className="absolute inset-y-0 end-0 flex items-center pe-3">
              <img src={SearchIcon} alt="SearchIcon" />
            </div>
          </div>
          <div className="relative flex gap-3 items-center">
            <select
              className="focus:outline-none p-2 text-sm rounded-md border"
              onChange={handleStatus}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Deactive</option>
            </select>
          </div>
          <div className="flex items-center relative">
            <img className="absolute ml-8" src={AddTicketIcon} alt="" />
            <Button
              btnType="button"
              btnCls="w-[180px] h-12 flex items-center justify-center gap-2 whitespace-nowrap px-4 pl-[3.5rem]"
              btnName={"Create New User"}
              btnCategory="primary"
              onClick={() => navigate(`/members/add?breadcrumbsType=${requestPageBreadcrumbs.createNewusers}`)}
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="px-4 sm:px-6 py-7">
        <Backdrop
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        <DataTable
          rows={activeTableDetails?.data || []}
          columns={activeTableDetails.column}
          rowCount={allData?.count}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
        />
      </div>

      {/* Responsive Modal */}
      <MuiModal
        modalSize="md"
        modalOpen={actionColumnInfo.cancelPopup}
        modalClose={handleCloseCancelReasonPopup}
        noheader
      >
        <div className="p-5">
          <div
            className="flex flex-col gap-5 border rounded-lg"
            style={{ borderColor: "rgba(29, 91, 191, 1)" }}
          >
            <div className="flex justify-between px-3 py-4 border-b">
              <p className="text-base font-medium">Deactivate Reason</p>
              <img
                className="cursor-pointer"
                onClick={handleCloseCancelReasonPopup}
                src={CancelIcon}
                alt="CancelIcon"
              />
            </div>
            <form
              onSubmit={handleSubmit(handleCancelReasonPopupSubmit)}
              className="p-4"
            >
              <label className="block text-xs font-bold mb-2">Reason</label>
              <textarea
                {...register("reason", { required: "This field is required" })}
                rows="4"
                className="block p-2.5 w-full text-sm border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder=""
              ></textarea>
              {errors["reason"] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors["reason"].message}
                </p>
              )}
              <div className="flex justify-center gap-4 mt-5">
                <Button
                  btnName="Cancel"
                  btnCategory="secondary"
                  onClick={handleCloseCancelReasonPopup}
                />
                <button
                  type="submit"
                  className="py-2 px-6 text-white bg-gradient-to-r from-[#00AEBD] to-[#1D5BBF] rounded-md"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </MuiModal>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={filterPopup.show}
      >
        <div className="py-3 px-4 bg-white" style={{ borderRadius: "3px" }}>
          <div
            style={{
              border: "1px solid rgba(29, 91, 191, 1)",
              borderRadius: "3px",
            }}
            className="py-5 px-5"
          >
            <div className="flex justify-between mb-4">
              <h3 className="text-base text-black font-medium">
                User Type {filterPopup.column}
              </h3>
              <img
                className="cursor-pointer"
                onClick={() => setFilterPopup({ ...filterPopup, show: false })}
                src={CancelIcon}
                alt="CancelIcon"
              />
            </div>

            <div className="text-black">
              <ul
                className="py-3 leading-10"
                style={{
                  margin: "10px 0px 20px 0",
                }}
              >
                {filterPopup.options.map((option, index) => (
                  <li key={index} className="flex gap-7 items-center">
                    <input
                      type="checkbox"
                      className="w-[20px]"
                      checked={filterPopup.selectedItem === option.id}
                      onChange={() => handleSelectOption(option.id)}
                      value={option.id}
                    />
                    <span className="text-[16px]">{option.name}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-6 justify-center align-middle">
                <Button
                  btnName="Cancel"
                  btnCategory="secondary"
                  onClick={() =>
                    setFilterPopup({
                      ...filterPopup,
                      show: false,
                      selectedItem: filterInfo.role || [],
                    })
                  }
                />
                <Button
                  btnType="button"
                  btnCls="w-[100px]"
                  btnStyle={{ background: "rgba(29, 91, 191, 1)" }}
                  onClick={handleFilterSubmit}
                  btnName={"Ok"}
                  btnCategory="primary"
                />
              </div>
            </div>
          </div>
        </div>
      </Backdrop>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => 1 }}
        open={isDeleteModal}
      >
        <div className="popup-content w-2/6 bg-white flex flex-col gap-2 h-[330px] justify-center items-center">
          <img src={OverDeleteIcon} alt="TickColorIcon" />

          <div className="py-5">
            <p
              style={{
                color: "rgba(24, 40, 61, 1)",
                fontWeight: 600,
                fontSize: "18px",
              }}
            >
              Are you sure want to Delete ?
            </p>
          </div>
          <div className="flex justify-center">
            <div className="flex gap-6 justify-center align-middle">
              <Button
                btnCls="w-[150px]"
                btnName={"Cancel"}
                btnCategory="secondary"
                onClick={() => setDeleteModal(false)}
              />
              <Button
                btnType="button"
                btnCls="w-[150px]"
                btnName={"Delete"}
                style={{ background: "rgba(229, 0, 39, 1)" }}
                btnCategory="primary"
                onClick={mentroDeleteHandler}
              />
            </div>
          </div>
        </div>
      </Backdrop>
    </div>
  );
};

export default Members;
