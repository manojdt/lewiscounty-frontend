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
import { useDispatch, useSelector } from "react-redux";
import { activateUser, deactivateUser, getMembersList } from "../../services/members";
import { useNavigate, useSearchParams } from "react-router-dom";
import { memberStatusColor } from "../../utils/constant";
import MuiModal from "../../shared/Modal";
import { useForm } from "react-hook-form";
import { Button } from "../../shared";
import AssignMentorProgram from "./AssignMentorProgram";
import { useDebounce } from "../../utils";

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
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [seletedItem, setSelectedItem] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [actionColumnInfo, setActionColumnInfo] = useState({
    cancelPopup: false,
    menteecancel: false,
  });
  const [assignProgramInfo, setAssignProgramInfo] = useState({
    assignPopup: false,
    message: "",
  });
  const [filterInfo, setFilterInfo] = useState({ search: "", status: "" });
  const dispatch = useDispatch();
  const { mentor, mentee, loading, error } = useSelector(
    (state) => state.members
  );
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
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
    const isOpenDeactivePopup =   ['mentor','mentee'].includes(actionTab);
    setActionColumnInfo({
      cancelPopup:isOpenDeactivePopup,
      menteecancel: actionTab === "mentee",
    });
  };

  const handleCloseCancelReasonPopup = () => {
    reset();
    setActionColumnInfo({ cancelPopup: false, menteecancel: false });
  };

  //Mentor/Mentee deactive ---> active

  const handleActivate = () =>{
    handleClose();
    dispatch(
      activateUser({
        user_id: seletedItem.id,
      })
    ).then(() => {
      handleCloseCancelReasonPopup();
      dispatch(
        getMembersList({
          role_name: actionTab,
          page: paginationModel?.page + 1,
          limit: paginationModel?.pageSize,
        })
      );
    });
  }

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
            role_name: actionTab,
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
          role_name: actionTab,
          page: paginationModel?.page + 1,
          limit: paginationModel?.pageSize,
        })
      );
    });
  };

  let membersTab = [
    {
      name: "Mentors",
      key: "mentor",
    },
    {
      name: "Mentees",
      key: "mentee",
    },
  ];

  const handleTab = (key) => {
    setActionTab(key);
    setPaginationModel({
      page: 0,
      pageSize: 10,
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
    // setFilterInfo({ ...filterInfo, search: value });
    setSearchTerm(value);
    // if (value !== '') {
    //   setPaginationModel({
    //     page: 0,
    //     pageSize: 10
    //   });
    // }
  };
  useEffect(() => {
    setFilterInfo({ ...filterInfo, search: debouncedSearchTerm });
  }, [debouncedSearchTerm]);
  const handleAssignProgramOrTask = () => {
    handleClose();
    setAssignProgramInfo({ assignPopup: true, message: "" });
  };

  const handleAssignProgramClose = (type = "") => {
    let payload = { assignPopup: false };

    if (type === "taskassigned") {
      payload = {
        ...payload,
        message: "Program Assigned to Mentor Successfully",
      };
      dispatch(
        getMembersList({
          role_name: actionTab,
          page: paginationModel?.page,
          limit: paginationModel?.pageSize,
        })
      );
    }

    setAssignProgramInfo({ ...assignProgramInfo, ...payload });
  };

  // Mentor Auto Approval
  const handleChange = (row) => {
    console.log("Approval", row);
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
      tableData = mentor;
    }

    if (actionTab === "mentee") {
      tableData = mentee;
    }

    let columns = allMembersColumns.filter((col) =>
      col.for.includes(actionTab)
    );

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

    const updatedColumns = [
      ...columns,
      {
        field: "status",
        headerName: "Status",
        flex: 1,
        id: 2,
        renderCell: (params) => {
          return (
            <>
              <div className="cursor-pointer flex items-center h-full relative">
                <span
                  className="w-[80px] flex justify-center h-[30px] px-7"
                  style={{
                    background: params.row.member_active
                      ? memberStatusColor.accept.bgColor
                      : memberStatusColor.cancel.bgColor,
                    lineHeight: "30px",
                    borderRadius: "3px",
                    width: params.row.member_active ? "110px" : "92px",
                    height: "34px",
                    color: params.row.member_active
                      ? memberStatusColor.accept?.color
                      : memberStatusColor.cancel.color,
                    fontSize: "12px",
                  }}
                >
                  {params.row.member_active ? "Active" : "Deactive"}
                </span>
              </div>
            </>
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

          const onViewClick = () =>{
            handleClose();
                    const adminview = `&breadcrumbsType=${actionTab}`;
                    const memberStatus = seletedItem.member_active?'Active':'Deactive';
                    navigate(`/mentor-details/${seletedItem.id}?member_status=${memberStatus}${adminview}`);
          }
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
                  onClick={onViewClick}
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

                <MenuItem className="!text-[12px]"
                onClick={()=>navigate("/discussions")}>
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
                    Deactive
                  </MenuItem>
                )}

                {/* <MenuItem className="!text-[12px]">
                  <img
                    src={ShareIcon}
                    alt="ShareIcon"
                    className="pr-3 w-[27px]"
                  />
                  Share
                </MenuItem> */}

                {/* {seletedItem.member_active && (
                  <MenuItem
                    className="!text-[12px]"
                    onClick={handleAssignProgramOrTask}
                  >
                    <img
                      src={PlusCircle}
                      alt="ShareIcon"
                      className="pr-3 w-[27px]"
                    />
                    Assign{" "}
                    {actionTab === "mentor" ? "Mentor Program" : "to Task"}
                  </MenuItem>
                )} */}
              </Menu>
            </>
          );
        },
      },
    ];

    setActiveTableDetails({ data: tableData, column: updatedColumns });
  }, [mentor, mentee, anchorEl]);
  useEffect(() => {
    let payload = {
      role_name: actionTab,
      page: paginationModel?.page + 1,
      limit: paginationModel?.pageSize,
    };

    if (filterInfo.status !== "" && filterInfo.status !== "all") {
      payload = { ...payload, status: filterInfo.status };
    }

    if (filterInfo.search !== "") {
      payload = { ...payload, search: filterInfo.search };
    }

    dispatch(getMembersList(payload));
  }, [actionTab, paginationModel, filterInfo.status, filterInfo.search]);
  useEffect(() => {
    if (selectedRequestedTab) {
      setActionTab(selectedRequestedTab);
    }
  }, [selectedRequestedTab]);
  return (
    <div className="program-request px:2 sm:px-2 md:px-4 lg:px-8 mt-10">
      <div className="program-info px-4 sm:px-6 ">
        {membersTab.length ? (
          <div className="flex flex-col sm:flex-row justify-between mb-4 border-b-2 pb-2">
            <ul className="tab-list flex overflow-x-auto hide-scrollbar">
              {membersTab.map((discussion, index) => (
                <li
                  className={`${
                    actionTab === discussion.key ? "active" : ""
                  } relative text-sm sm:text-base cursor-pointer`}
                  key={index}
                  onClick={() => handleTab(discussion.key)}
                >
                  <div className="flex justify-center pb-1">
                    {/* <div
                      className={`total-proram-count ${
                        actionTab === discussion.key ? "active" : ""
                      } relative text-xs sm:text-sm`}
                    >
                      10
                      <p className="notify-icon1"></p>
                    </div> */}
                  </div>
                  <div>{discussion.name}</div>
                  {actionTab === discussion.key && <span></span>}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {/* Search and Filters */}
      <div className="title flex flex-row sm:flex-row justify-between py-3 px-4 items-center gap-4">
        <div className="relative w-3/6 sm:w-3/6 md:w-[35%] lg:w-[35%] xl:w-[25%] ">
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
            <option value="inactive">Inactive</option>
          </select>
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
          rows={activeTableDetails?.data?.results || []}
          columns={activeTableDetails.column}
          rowCount={activeTableDetails?.data?.count}
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
    </div>
  );
};

export default Members;
