import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Tab,
  Tabs,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Modal,
  Typography,
  Paper,
  Backdrop,
  Button,
  Stack,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import { useGetJoinRequestDataQuery } from "../../features/request/requestAPI.service";
import { requestTableColumns } from "./AdminRequestTableData";
import { useRequestActions } from "../../features/request/requestActions";
import TickCircle from './../../assets/icons/tickCircle.svg'
import ViewIcon from "./../../assets/images/view1x.png";
import CloseCircle from "./../../assets/icons/closeCircle.svg";
import ReviewIcon from './../../assets/icons/reviewIcon.svg';
import CancelIcon from "./../../assets/images/cancel1x.png";
import TickColorIcon from "./../../assets/icons/tickColorLatest.svg";
import CancelColorIcon from "./../../assets/icons/cancelCircle.svg";
import SuccessTik from "./../../assets/images/blue_tik1x.png";
import InterviewPersonIcon from './../../assets/icons/interviewPersonIcon.svg';
import VerifiedIcon from "@mui/icons-material/Verified";

import { Close } from "@mui/icons-material";
import { EquipmentFormFields } from "../formFields/formFields";
import InterviewDetails from "./InterviewDetails";



const AdminRequest = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const request_type = searchParams.get("request_type") || "discharge";
  const role = searchParams.get("role") || "mentor";
  // Pagination state
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [searchText, setSearchText] = useState("");
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    content: "",
    action: null,
  });
  const [isInterviewModalOpen, setInterViewModalOpen] = useState(false);
  // Track total number of rows for pagination
  const [rowCount, setRowCount] = useState(0);
  const [gridCellParams, setGridCellParams] = useState();

  // Fetch data using RTK Query
  const { data, isLoading, isFetching, isError } = useGetJoinRequestDataQuery({
    limit: paginationModel.pageSize,
    page: paginationModel.page + 1, // API usually uses 1-indexed pages
    user: role,
    search: searchText.trim() !== "" ? searchText : undefined,
  });

  const { handleApprove, handleReject, handleDelete, isActionLoading } =
    useRequestActions();

  const onApproveClick = async (id) => {
    const result = await handleApprove(id);
    if (result.success) {
      // Show success notification
    } else {
      // Show error notification
    }
  };
  // Update row count when data changes
  useEffect(() => {
    if (data?.count !== undefined) {
      setRowCount(data.count);
    }
  }, [data]);


  // Update URL when role changes
  const updateUrlParams = (newRole) => {
    searchParams.set("role", newRole);
    searchParams.set("request_type", request_type);
    setSearchParams(searchParams);
  };

  const handleRoleChange = (event, newValue) => {
    updateUrlParams(newValue);
    // Reset pagination when changing role
    setPaginationModel({
      page: 0,
      pageSize: paginationModel.pageSize,
    });
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleMenuOpen = (event, row) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedRow(null);
  };

  const handleModalOpen = (title, content, action) => {
    setModalContent({
      title,
      content,
      action,
    });
    setModalOpen(true);
    handleMenuClose();
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  // Execute action and close modal
  const handleActionConfirm = () => {
    if (modalContent.action) {
      modalContent.action();
    }
    handleModalClose();
  };

  // Generate menu items based on row status
  const getMenuItems = (row) => {
    const items = [];

    // Conditional actions based on status
    if (row.application_status === "waiting_for_verification") {
      items.push({
        label: "Verify Application",
        icon: TickCircle,
        action: () =>
          handleModalOpen(
            "Verify Application",
            <Box>
              <Typography variant="body1">
                Are you sure you want to verify the application for {row.name}?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                This will move the application to the next stage in the process.
              </Typography>
            </Box>,
            () => setInterViewModalOpen(true)
          ),
      }
        , {
          label: "Review",
          icon: ReviewIcon,
          action: () =>
            handleModalOpen(
              "Review",
              <Box>

              </Box>,
              () => console.log("Rejected", row.name)
            ),


        }, {
        label: "Reject",
        icon: CloseCircle,
        action: () =>
          handleModalOpen(
            "Reject Application",
            <Box>
              <Typography variant="body1" color="error">
                Reject {row.name} as a {role}?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                This action cannot be undone. A rejection notification will be
                sent to the applicant.
              </Typography>
            </Box>,
            () => console.log("Rejected", row.name)
          ),
        color: "error",
      });
    }

    if (
      row.interview_status === "selected" &&
      row.bg_status === "not_started"
    ) {
      items.push({
        label: "Start Background Check",
        action: () =>
          handleModalOpen(
            "Start Background Check",
            <Box>
              <Typography variant="body1">
                Initiate background verification for {row.name}?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                This will send an email to the applicant with instructions to
                complete their background check.
              </Typography>
            </Box>,
            () => console.log("Started check for", row.name)
          ),
      });
    }

    if (row.video_status === "yet_to_watch") {
      items.push({
        label: "Send Reminder",
        action: () =>
          handleModalOpen(
            "Send Training Video Reminder",
            <Box>
              <Typography variant="body1">
                Send a reminder to {row.name} to watch the training video?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                An email notification will be sent to remind the applicant to
                complete this step.
              </Typography>
            </Box>,
            () => console.log("Sent reminder to", row.name)
          ),
      });
    }

    if (row.approve_status === "pending") {
      items.push({
        label: "Approve",
        action: () =>
          handleModalOpen(
            "Approve Application",
            <Box>
              <Typography variant="body1">
                Approve {row.name} as a {role}?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                This action will finalize their application and send them an
                acceptance notification.
              </Typography>
            </Box>,
            () => onApproveClick(row.id)
          ),
      });

      items.push({
        label: "Reject",
        icon: CloseCircle,
        action: () =>
          handleModalOpen(
            "Reject Application",
            <Box>
              <Typography variant="body1" color="error">
                Reject {row.name} as a {role}?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                This action cannot be undone. A rejection notification will be
                sent to the applicant.
              </Typography>
            </Box>,
            () => console.log("Rejected", row.name)
          ),
        color: "error",
      });
    }

    // Add delete option for all rows
    // items.push({
    //   label: "Delete",

    //   action: () =>
    //     handleModalOpen(
    //       "Delete Application",
    //       <Box>
    //         <Typography variant="body1" color="error">
    //           Are you sure you want to delete {row.name}'s application?
    //         </Typography>
    //         <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
    //           This action cannot be undone. All data related to this application
    //           will be permanently deleted.
    //         </Typography>
    //       </Box>,
    //       () => console.log("Deleted", row.name)
    //     ),
    //   color: "error",
    // });

    return items;
  };

  const handleClick = (params, event) => {
    if (params.field === "actions") {
      handleMenuOpen(event, params.row);
    }
    setGridCellParams(params.row);
  };
  return (
    <Box
      className={"drop-shadow-lg mx-6 mt-20 rounded-md bg-white"}
      sx={{ p: 3 }}
    >
      {/* Tabs for Mentor/Mentee toggle */}
      <div className="flex">
        {request_type === "onboarding" && (
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs
              value={role}
              onChange={handleRoleChange}
              aria-label="mentorship roles"
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Badge badgeContent="58" color="primary" sx={{ mr: 1 }}>
                      <span>Mentor</span>
                    </Badge>
                  </Box>
                }
                value="mentor"
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Badge badgeContent="58" color="primary" sx={{ mr: 1 }}>
                      <span>Mentee</span>
                    </Badge>
                  </Box>
                }
                value="mentee"
              />
            </Tabs>
          </Box>
        )}

        {/* Search and actions bar */}
        <Box
          sx={{
            display: "flex",
            mb: 2,
            justifyContent: "space-between",
            justifySelf: "flex-end",
            ml: "auto",
          }}
        >
          <TextField
            placeholder="Search Here"
            variant="outlined"
            size="small"
            value={searchText}
            onChange={handleSearchChange}
            sx={{
              width: 300,
              ".MuiOutlinedInput-root": {
                borderRadius: 1,
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <IconButton>
            <DownloadIcon />
          </IconButton>
        </Box>
      </div>

      {/* Loading state */}
      {/* {(isLoading || isFetching) && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )} */}

      {/* Error state */}
      {isError && (
        <Box sx={{ mt: 4, p: 2, bgcolor: "#FDEEEC", borderRadius: 1 }}>
          <Typography color="error">
            There was an error loading the data. Please try again later.
          </Typography>
        </Box>
      )}

      {/* DataGrid */}
      {!isError && (
        <DataGrid
          loading={isLoading || isFetching}
          rows={data?.results || []}
          columns={requestTableColumns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          onCellClick={handleClick}
          // paginationMode="server"
          rowCount={rowCount}
          pageSizeOptions={[5, 10, 25, 50]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        //keepNonExistentRowsSelected
        // sx={{
        //   "& .MuiDataGrid-columnHeaders": {
        //     backgroundColor: "#F5F7FA",
        //   },
        //   "& .MuiDataGrid-cell": {
        //     borderBottom: "1px solid #EEF0F7",
        //   },
        //   // "& .MuiDataGrid-row:hover": {
        //   //   backgroundColor: "#F8FAFD",
        //   // },
        //   border: "none",
        //   borderRadius: 2,
        //   boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)",
        //   "& .MuiDataGrid-columnSeparator": {
        //     display: "none",
        //   },
        // }}
        />
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            navigate(`/request-form-preview/${gridCellParams?.id}`);
          }}
          className="!text-[12px]"
        >
          <img
            src={ViewIcon}
            alt="AcceptIcon"
            className="pr-3 w-[27px]"
          />
          {"View"}
        </MenuItem>




        {selectedRow &&
          getMenuItems(selectedRow).map((item, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                item.action();
              }}
              className="!text-[12px]"
              sx={{ color: item.color || "inherit" }}
            >
              <img
                src={item.icon}
                alt="AcceptIcon"
                className="pr-3 w-[27px]"
              />
              {item.label}
            </MenuItem>
          ))}
      </Menu>

      {/* <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => 1 }}
          open={true}
        >
          <div className="popup-content w-2/6 md:w-2/4 sm:w-2/4 bg-white flex flex-col gap-2 h-[330px] justify-center items-center">
            <img
              src={
                confirmPopup.type === "approve"
                  ? TickColorIcon
                  : confirmPopup.type === "reject"
                  ? CancelColorIcon
                  : ""
              }
              alt="TickColorIcon"
            />
            <span
              style={{ color: "#232323", fontWeight: 600, fontSize: "24px" }}
            >
              {confirmPopup.type === "approve"
                ? "Approve"
                : confirmPopup.type === "reject"
                ? "Reject"
                : ""}
            </span>
            <div className="py-5">
              <p
                style={{
                  color: "rgba(24, 40, 61, 1)",
                  fontWeight: 600,
                  fontSize: "18px",
                }}
              >
                Are you sure want to {confirmPopup.type} {confirmPopup.title}?
              </p>
            </div>
            <div className="flex justify-center">
              <div className="flex gap-6 justify-center align-middle">
                <Button
                  btnCls="w-[110px]"
                  btnName={
                    confirmPopup.type === "approve"
                      ? "Cancel"
                      : confirmPopup.type === "reject"
                      ? "No"
                      : ""
                  }
                  btnCategory="secondary"
                  //onClick={handleCancelConfirmPopup}
                />
                <Button
                  btnType="button"
                  btnCls="w-[110px]"
                  btnName={
                    confirmPopup.type === "approve"
                      ? "Approve"
                      : confirmPopup.type === "reject"
                      ? "Yes"
                      : ""
                  }
                  style={{
                    background:
                      confirmPopup.type === "approve" ? "#16B681" : "#E0382D",
                  }}
                  btnCategory="primary"
                  //onClick={handleConfirmPopup}
                />
              </div>
            </div>
          </div>
        </Backdrop> */}


      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="action-modal-title"
        aria-describedby="action-modal-description"
      >
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography id="action-modal-title" variant="h6" component="h2">
              {modalContent.title}
            </Typography>
            <IconButton size="small" onClick={handleModalClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box id="action-modal-description" sx={{ mt: 2 }}>
            {modalContent.content}
          </Box>

          <Box
            sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button variant="outlined" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleActionConfirm}
              color={
                modalContent.title.toLowerCase().includes("delete") ||
                  modalContent.title.toLowerCase().includes("reject")
                  ? "error"
                  : "primary"
              }
            >
              Confirm
            </Button>
          </Box>
        </Paper>
      </Modal>

      <Backdrop
        sx={{ zIndex: (theme) => 1 }}
        open={true}
      >
        <div className="popup-content w-2/6 md:w-2/4 sm:w-2/4 bg-white flex flex-col gap-2 h-[740px]">
          <div className="flex mt-4 mx-6 py-2 border-b border-gray-200 text-[15px] font-normal">Select Interview Details</div>
          <Stack
            spacing={1}
            className="bg-background-primary-secondary p-6 rounded-[6px]"
          >
            <div className="flex justify-between bg-[#F1F6FF] h-[100px] p-4" style={{ borderRadius: '5px' }}>
              <div className="flex items-center">
                <div className="bg-white rounded-[6px] flex items-center !justify-center w-[50px] h-[50px]" style={{ boxShadow: "4px 4px 25px 0px rgba(0, 0, 0, 0.05)" }}>
                  <img src={InterviewPersonIcon}>
                  </img>
                </div>

                <div className="flex flex-col pl-2 gap-1">
                  <span className="text-[18px] font-semibold">Olivia Smith</span>
                  <div className="flex text-[12px] ">
                    <span> Email ID:</span>
                    <span className="text-[#2260D9] px-1">olivia@gmail.com</span>
                  </div>

                </div>

              </div>
              <div className="flex items-center flex-row gap-1 text-[#16B681] text-[15px] font-semibold">
                <VerifiedIcon />
                Application verified</div>

            </div>
            <div className="text-[16px] font-semibold py-5">
              Schedule Interview
            </div>
            <InterviewDetails />

          </Stack>
        </div>

      </Backdrop >
    </Box >
  );
};

export default AdminRequest;
