import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
  Button,
  Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import { useGetJoinRequestDataQuery } from "../../features/request/requestAPI.service";
import { requestTableColumns } from "./AdminRequestTableData";
import { useRequestActions } from "../../features/request/requestActions";

const AdminRequest = () => {
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
  // Track total number of rows for pagination
  const [rowCount, setRowCount] = useState(0);

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

    // Default actions available for all rows
    items.push({
      label: "View Details",
      action: () =>
        handleModalOpen(
          "View Details",
          <Box>
            <Typography variant="body1">Name: {row.name}</Typography>
            <Typography variant="body1">
              Submitted Date: {row.submittedDate}
            </Typography>
            <Typography variant="body1">
              Status: {row.applicationStatus}
            </Typography>
            {/* Add more details as needed */}
          </Box>,
          () => console.log("Viewed details for", row.name)
        ),
    });

    // Conditional actions based on status
    if (row.applicationStatus === "Waiting for Verification") {
      items.push({
        label: "Verify Application",
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
            () => console.log("Verified", row.name)
          ),
      });
    }

    if (
      row.interviewStatus === "Selected" &&
      row.backgroundVerification === "..."
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

    if (row.trainingVideo === "Yet to watch") {
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

    if (row.finalDecision === "Pending") {
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
    items.push({
      label: "Delete",
      action: () =>
        handleModalOpen(
          "Delete Application",
          <Box>
            <Typography variant="body1" color="error">
              Are you sure you want to delete {row.name}'s application?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              This action cannot be undone. All data related to this application
              will be permanently deleted.
            </Typography>
          </Box>,
          () => console.log("Deleted", row.name)
        ),
      color: "error",
    });

    return items;
  };

  const handleClick = (params, event) => {
    if (params.field === "actions") {
      handleMenuOpen(event, params.row);
    }
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
          paginationMode="server"
          rowCount={rowCount}
          pageSizeOptions={[5, 10, 25, 50]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          keepNonExistentRowsSelected
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
        {selectedRow &&
          getMenuItems(selectedRow).map((item, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                item.action();
              }}
              sx={{ color: item.color || "inherit" }}
            >
              {item.label}
            </MenuItem>
          ))}
      </Menu>

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
            width: 400,
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
    </Box>
  );
};

export default AdminRequest;
