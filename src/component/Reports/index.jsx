import React, { useEffect, useState } from "react";
import Menu from "@mui/material/Menu";
import { Backdrop, CircularProgress } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

import DataTable from "../../shared/DataGrid";
import MoreIcon from "../../assets/icons/moreIcon.svg";
import ViewIcon from "../../assets/images/view1x.png";
import SearchIcon from "../../assets/images/search1x.png";
import CalenderIcon from "../../assets/icons/CalenderIcon.svg";
import EditIcon from "../../assets/images/Edit1x.png";
import DownloadIcon from "../../assets/images/download1x.png";
import DeleteIcon from "../../assets/images/delete1x.png";
import OverDeleteIcon from "../../assets/images/delete_1x.png";
import CancelIcon from "../../assets/images/cancel1x.png";
import { Button } from "../../shared";
import { deleteReports, getAllReports } from "../../services/reportsInfo";
import { useDispatch, useSelector } from "react-redux";
import {
  feedStatus,
  pipeUrls,
  reportAllStatus,
  reportsStatus,
  reportStatus,
  reportStatusColor,
} from "../../utils/constant";
import { reportAdminColumns, reportColumns } from "../../utils/formFields";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import { createPost, updateFeedRequest } from "../../services/feeds";
import CreatePostModal from "../Feeds/CreatePostModal";
import SettingsModal from "../Feeds/SettingsModal";
import SuccessTik from "../../assets/images/blue_tik1x.png";
import { tabQuertyData } from "../Breadcrumbs/BreadcrumbsCommonData";
import { formatTableNullValues, useDebounce } from "../../utils";
import StatusIndicator from "../../shared/StatusIndicator/StatusIndicator";

const Reports = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { allreports, loading, status } = useSelector((state) => state.reports);
  const [formattedAllReports, setFormattedAllReports] = React.useState([])
  React.useMemo(()=>{
    if(allreports?.results){
      const formattedRowData = formatTableNullValues(allreports?.results)
      setFormattedAllReports(formattedRowData)
    }
  },[allreports])
  const userInfo = useSelector((state) => state.userInfo);
  const role = userInfo.data.role;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [deleteModal, setDeleteModal] = useState(false);
  const [filter, setFilter] = useState({ search: "", filter_by: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [requestTab, setRequestTab] = useState("all");
  const [searchParams, setSearchParams] = useSearchParams();
  const [reportData, setReportData] = useState({
    action: "",
    selectedItem: [],
  });
  const selectedRequestedTab = searchParams.get("tabType") || "";
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });

  // feed State start

  const [postModal, setPostModal] = useState({
    create: false,
    settings: false,
    control: false,
    visibility: false,
    activity: false,
  });
  const [formData, setFormData] = useState({
    visibility: "anyone",
    comment_control: "anyone",
    brand_partnership: false,
    is_published: true,
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    getValues,
  } = useForm();

  const handleCreatePostPopup = () => {
    setPostModal({ ...postModal, create: true, visibility: false });
    handleClose();
  };

  const handleClosePostPopup = () => {
    setPostModal({ ...postModal, create: false });
  };

  const handleVisibilty = () => {
    setPostModal({ ...postModal, settings: true });
  };

  const handleSettingsBack = () => {
    setPostModal({ ...postModal, settings: false, create: true });
  };

  const handleSettingsData = (data) => {
    setFormData({ ...formData, ...data });
    setPostModal({ ...postModal, settings: false, create: true });
  };

  const onSubmit = (data) => {
    const formDatas = new FormData();

    if (data.image) {
      if (Array.isArray(data.image)) {
        data.image.forEach((file, index) => {
          formDatas.append("image", file);
        });
      } else {
        formDatas.append("image", data.image);
      }
    }

    formDatas.append("title", data.title);
    formDatas.append("content", data.content);
    formDatas.append("brand_partnership", formData.brand_partnership);
    formDatas.append("comment_control", formData.comment_control);
    formDatas.append("visibility", formData.visibility);
    formDatas.append("is_published", formData.is_published);
    formDatas.append("request", reportData?.selectedItem?.[0]?.id);

    // console.log(formDatas);
    dispatch(createPost(formDatas)).then((res) => {
      if (res?.meta?.requestStatus === "fulfilled") {
        setPostModal({
          ...postModal,
          create: false,
          activity: true,
        });
        setTimeout(() => {
          setPostModal({
            ...postModal,
            create: false,
            activity: false,
          });
          dispatch(updateFeedRequest({ status: "" }));
        }, 2000);
      }
    });
  };

  // feed State end

  const requestBtns = [
    {
      name: "All Reports",
      key: "all",
    },
    {
      name: "New Reports",
      key: "new",
    },
    {
      name: "Pending Reports",
      key: "pending",
    },
    {
      name: "Completed Reports",
      key: "approved",
    },
    {
      name: "Rejected Reports",
      key: "rejected",
    },
    {
      name: "Draft Reports",
      key: "draft",
    },
  ];

  const requestAdminBtn = [
    {
      name: "My Reports",
      key: "all",
    },
    {
      name: "Approved Reports",
      key: "approved",
    },
    {
      name: "Cancelled Reports",
      key: "rejected",
    },
  ];

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event, data) => {
    setReportData({ action: "single", selectedItem: data });
    setAnchorEl(event.currentTarget);
  };

  const handleDeleteReport = async () => {
    const ids = [];
    reportData.selectedItem.forEach((rows) => ids.push(rows.id));
    const reportId = { ids: ids };
    dispatch(deleteReports(reportId));
  };

  const reportColumn = [
    ...(role === "admin" ? reportAdminColumns : reportColumns).filter(
      (rColumn) => rColumn.status.includes(requestTab)
    ),
    {
      field: "report_link",
      headerName: "Report Link",
      flex: 1,
      id: 9,
      status: ["all", "new", "pending", "approved", "cancel", "draft"],
      renderCell: (params) => {
        return (
          <>
            <a
              href={params.row.html_content_link}
              target="_blank"
              className="text-font-primary-main" rel="noreferrer"
            >
              {params.row.html_content_link ?? "..."}
            </a>
          </>
        );
      },
    },
    {
      field: "report_status",
      headerName: "Status",
      flex: 1,
      id: 10,
      // renderCell: (params) => {
      //   return (
      //     <>
      //       <div className="cursor-pointer flex items-center h-full relative">
      //         <span
      //           className="w-[80px] flex justify-center h-[30px] px-7"
      //           style={{
      //             background: reportStatusColor[params.row.status]?.bg || "",
      //             lineHeight: "30px",
      //             borderRadius: "3px",
      //             height: "34px",
      //             color: reportStatusColor[params.row.status]?.color || "",
      //             fontSize: "12px",
      //           }}
      //         >
      //           {reportStatus[params.row.status]}
      //         </span>
      //       </div>
      //     </>
      //   );
      // },
      renderCell: (params) => {
        return (
          <div className="flex items-center  h-full w-full">
            <StatusIndicator status={params.row.status}>
            </StatusIndicator>
          </div>
        );
      },
      
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      id: 11,
      renderCell: (params) => {
        return (
          <>
            {
              <>
                <div
                  className="cursor-pointer flex items-center h-full"
                  onClick={(e) => handleClick(e, [params.row])}
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
                  {role === "mentor" &&
                    reportData.selectedItem[0]?.status === "rejected" && (
                      <MenuItem
                        onClick={() =>
                          navigate(
                            `/edit-report/${reportData.selectedItem[0].id}?type=re-open`
                          )
                        }
                        className="!text-[12px]"
                      >
                        <img
                          src={ViewIcon}
                          alt="ViewIcon"
                          className="pr-3 w-[30px]"
                        />
                        Re-Open
                      </MenuItem>
                    )}

                  {role === "mentor" &&
                    (reportData.selectedItem[0]?.status === "new" ||
                      reportData.selectedItem[0]?.status === "pending" ||
                      reportData.selectedItem[0]?.status === "draft") && (
                      <MenuItem
                        onClick={() =>
                          navigate(
                            `/edit-report/${reportData.selectedItem[0].id}?breadcrumbsType=${requestTab}`
                          )
                        }
                        className="!text-[12px]"
                      >
                        <img
                          src={EditIcon}
                          alt="EditIcon"
                          className="pr-3 w-[30px]"
                        />
                        Edit
                      </MenuItem>
                    )}

                  <MenuItem
                    onClick={() => {
                      const adminView =
                        role === "admin" || role === "mentor"
                          ? `?breadcrumbsType=${requestTab}`
                          : "";
                      navigate(
                        `/view-report/${reportData.selectedItem[0].id}${adminView}`
                      );
                    }}
                    className="!text-[12px]"
                  >
                    <img
                      src={ViewIcon}
                      alt="ViewIcon"
                      className="pr-3 w-[30px]"
                    />
                    View
                  </MenuItem>
                  {/* {
                                    params.row.report_status === reportAllStatus.accept
                                    &&

                                    <MenuItem onClick={() => console.log('download', params)} className='!text-[12px]'>
                                        <img src={DownloadIcon} alt="DownloadIcon" className='pr-3 w-[30px]' />
                                        Download
                                    </MenuItem>
                                } */}

                  {role === "mentor" &&
                    (reportData.selectedItem[0]?.status === "new" ||
                      reportData.selectedItem[0]?.status === "pending" ||
                      reportData.selectedItem[0]?.status === "draft") && (
                      <MenuItem
                        onClick={handleDeleteSelectedRows}
                        className="!text-[12px]"
                      >
                        <img
                          src={DeleteIcon}
                          alt="DeleteIcon"
                          className="pr-3 w-[27px]"
                        />
                        Delete
                      </MenuItem>
                    )}
                  {reportData?.selectedItem?.[0]?.status === "approved" && (
                    <MenuItem
                      onClick={handleCreatePostPopup}
                      className="!text-[12px]"
                    >
                      <img
                        src={ViewIcon}
                        alt="ViewIcon"
                        className="pr-3 w-[27px]"
                      />
                      Post to Feed
                    </MenuItem>
                  )}
                </Menu>
              </>
            }
          </>
        );
      },
    },
  ];

  const title =
    (role === "admin" ? requestAdminBtn : requestBtns).find(
      (option) => option.key === requestTab
    )?.name || "";

  const handleTab = (key) => {
    let typeString = `?type=${key}`;
    if (key === "all") {
      typeString = "";
    }
    navigate(`${pipeUrls.reports}${typeString}`);
    setFilter({ filter_by: "", search: "" });
    setRequestTab(key);
    setPaginationModel({
      page: 0,
      pageSize: 10,
    });
  };
 

    // Sync requestTab with URL on page load or URL change
    useEffect(() => {
      const queryParams = new URLSearchParams(location.search);
      const typeFromUrl = queryParams.get("type");
    
      // Ensure the requestTab state remains "all" if no valid type is present in the URL
      setRequestTab(typeFromUrl || "all");
    }, [location.search]);
    

  const handleSelectedRow = (row) => {
    setReportData({ action: "multiple", selectedItem: row });
  };

  const handleDeleteSelectedRows = () => {
    setDeleteModal(true);
    handleClose();
  };

  const getReports = () => {
    const filterType = searchParams.get("type") || selectedRequestedTab;
    const filterSearch = searchParams.get("search");
    const filterDate = searchParams.get("filter_by");
    let query = {};
    if (role === "admin") {
      if (requestTab === "all") {
        query.status = "approved";
        query.request_type = "report";
      } else {
        query.status = requestTab === "cancel" ? "rejected" : requestTab;
        query.request_type = "report";
        query.request_by = "mentor";
      }
    } else {
      if (filterType && filterType !== "") {
        query.status = filterType;
      }
      query.request_type = "report";
    }

    if (filterSearch && filterSearch !== "") {
      query.search = filterSearch;
    }

    if (filterDate && filterDate !== "") {
      query.filter_by = filterDate;
    }
    // if (role === "admin") {
    //     query.request_by = "mentor"
    // }
    if (role === "admin" && requestTab === "all") {
      delete query.request_by;
    }
    dispatch(
      getAllReports({
        ...query,
        page: paginationModel?.page + 1,
        limit: paginationModel?.pageSize,
      })
    );
  };

  const handleCancelDelete = () => {
    setDeleteModal(false);
    setReportData({ action: "", selectedItem: [] });
  };

  const getQueryString = () => {
    const filterType = searchParams.get("type");
    let query = {};
    if (filterType && filterType !== "") {
      query = { type: filterType };
    }
    if (filter.search !== "") query.search = filter.search;
    if (filter.filter_by !== "") query.filter_by = filter.filter_by;
    return query;
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  useEffect(() => {
    setFilter({ ...filter, search: debouncedSearchTerm });
  }, [debouncedSearchTerm]);
  useEffect(() => {
    let query = getQueryString();
    setSearchParams(query);
  }, [filter]);

  useEffect(() => {
    getReports();
  }, [searchParams, paginationModel, requestTab]);

  useEffect(() => {
    if (status === reportsStatus.delete) {
      setDeleteModal(false);
      getReports();
    }
  }, [status, role]);
  useEffect(() => {
    if (selectedRequestedTab && role === "admin") {
      setRequestTab(selectedRequestedTab);
    } else if (selectedRequestedTab && role === "mentor") {
      handleTab(selectedRequestedTab);
    }
  }, [selectedRequestedTab]);
  
  
  return (
    <div className="reports px-4 sm:px-4 md:px-6 lg:px-9 xl:px-9 py-9">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={deleteModal || loading}
      >
        {deleteModal && (
          <div className="popup-content w-2/6 md:w-2/4 sm:w-2/4 bg-white flex flex-col gap-2 h-[330px] justify-center items-center">
            <div
              style={{
                border: "1px solid rgba(229, 0, 39, 1)",
                borderRadius: "15px",
              }}
              className="relative flex flex-col gap-2 justify-center 
                        items-center py-14 px-16"
            >
              <img
                className="absolute top-2 right-3 cursor-pointer"
                onClick={() => setDeleteModal(false)}
                src={CancelIcon}
                alt="CancelIcon"
              />

              <img
                className="w-[50px]"
                src={OverDeleteIcon}
                alt="OverDeleteIcon"
              />

              <div className="py-5 mb-3">
                <p
                  style={{
                    color: "rgba(24, 40, 61, 1)",
                    fontWeight: 600,
                    fontSize: "18px",
                  }}
                >
                  Are you sure want to delete this?
                </p>
              </div>
              <div className="flex justify-center">
                <div className="flex gap-6 justify-center align-middle">
                  <button
                    style={{
                      background: "rgba(229, 0, 39, 1)",
                      color: "#fff",
                      borderRadius: "3px",
                      width: "130px",
                      padding: "13px",
                    }}
                    onClick={handleCancelDelete}
                  >
                    No
                  </button>
                  <button
                    style={{
                      border: "1px solid rgba(229, 0, 39, 1)",
                      color: "rgba(229, 0, 39, 1)",
                      borderRadius: "3px",
                      width: "130px",
                      padding: "13px",
                    }}
                    onClick={() => handleDeleteReport()}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading && <CircularProgress color="inherit" />}
      </Backdrop>

      <div
        className="px-3 py-5"
        style={{ boxShadow: "4px 4px 25px 0px rgba(0, 0, 0, 0.15)" }}
      >
        <div className="flex justify-between px-1 sm:px-1 md:px-3 lg:px-5 xl:px-5 pb-4 mb-8 items-center border-b-2">
          <div className="flex gap-5 items-center ">
            <p>Reports</p>
          </div>
          <div className="flex gap-8 items-center">
            {reportData.action === "multiple" &&
            reportData.selectedItem.length ? (
              <img
                className="cursor-pointer"
                onClick={handleDeleteSelectedRows}
                src={OverDeleteIcon}
                alt="OverDeleteIcon"
              />
            ) : null}

            <div
              className="relative flex gap-3 py-3 px-3"
              style={{ border: "1px solid rgba(24, 40, 61, 0.25)" }}
            >
              <img src={CalenderIcon} alt="CalenderIcon" />
              <select
                className="focus:outline-none"
                onChange={(e) =>
                  setFilter({ ...filter, filter_by: e.target.value })
                }
              >
                <option value="month" selected={filter.filter_by === "month"}>
                  Month
                </option>
                <option value="week" selected={filter.filter_by === "week"}>
                  Week
                </option>
                <option value="day" selected={filter.filter_by === "day"}>
                  Day
                </option>
              </select>
            </div>
            <Button
              btnName="Create Report"
              onClick={() =>
                navigate("/create-report", { state: { type: "new" } })
              }
              btnCls="!py-4"
            />
          </div>
        </div>

        <div className="mx-0 sm:mx-0 md:mx-2 lg:mx-5 xl:mx-5">
        <div className="flex flex-wrap sm:flex-nowrap gap-3 sm:gap-4 lg:gap-7 mb-6">
  {(role === "admin" ? requestAdminBtn : requestBtns).map(
    (actionBtn, index) => (
      <button
        key={index}
        className={`
          px-3 sm:px-4 lg:px-5 
          py-3 sm:py-3 lg:py-4 
          text-sm sm:text-sm lg:text-[14px]
          rounded
          transition-all duration-300
          w-full sm:w-[160px] lg:w-[180px]
          ${
            requestTab === actionBtn.key
              ? 'bg-gradient-to-r from-[#005DC6] to-[#00B1C0] text-white'
              : 'bg-white border border-[#88B2E8] text-black'
          }
        `}
        onClick={() => handleTab(actionBtn.key)}
      >
        {actionBtn.name}
      </button>
    )
  )}
</div>

          <div className="reports-table-container p-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0 px-1 sm:px-1 md:px-3 lg:px-3 xl:px-2 pb-4 mb-8 items-start sm:items-center">
  {/* Title Section */}
  <div className="flex gap-5 items-center">
    <p className="text-base sm:text-lg lg:text-[18px] font-semibold">
      {title}
    </p>
  </div>

  {/* Search Section */}
  <div className="w-full sm:w-auto">
    <div className="relative">
      <input
        type="text"
        id="search-navbar"
        className="w-full sm:w-[260px] md:w-[300px] lg:w-[345px] 
                 p-2 sm:p-3 lg:p-4
                 h-12 sm:h-14 lg:h-[60px]
                 text-sm text-gray-900 
                 border border-blue-600 rounded
                 focus:outline-none focus:ring-2 focus:ring-blue-200"
        placeholder="Search here..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
        <img 
          src={SearchIcon} 
          alt="SearchIcon"
          className="w-5 h-5" 
        />
      </div>
    </div>
  </div>
</div>
            <DataTable
              rows={formattedAllReports ?? []}
              columns={
                role === "admin" && requestTab === "all"
                  ? reportColumn?.filter((e) => e?.field !== "report_status")
                  : reportColumn
              }
              handleSelectedRow={handleSelectedRow}
              rowCount={allreports?.count}
              paginationModel={paginationModel}
              setPaginationModel={setPaginationModel}
              hideFooter={allreports?.results?.length === 0}
            />
          </div>
        </div>
      </div>

      {/* Create Feed */}
      {postModal.create && (
        <CreatePostModal
          register={register}
          handleSubmit={handleSubmit}
          formData={formData}
          errors={errors}
          reset={reset}
          setValue={setValue}
          getValues={getValues}
          open={postModal.create}
          handlePostData={onSubmit}
          handleClose={handleClosePostPopup}
          handleVisibilty={handleVisibilty}
          isReport={true}
          reportData={reportData?.selectedItem}
        />
      )}

      {postModal.settings && (
        <SettingsModal
          formData={formData}
          register={register}
          errors={errors}
          reset={reset}
          handleSubmit={handleSubmit}
          handleSettingsData={onSubmit}
          open={postModal.settings}
          handleClose={handleClose}
          handleSettingsBack={handleSettingsBack}
          handlePostData={handleSettingsData}
        />
      )}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={postModal?.activity}
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
              Your post is successfully uploaded
            </p>
          </div>
        </div>
      </Backdrop>
    </div>
  );
};

export default Reports;
