import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PeopleIcon from "@mui/icons-material/People";
import ChatIcon from "@mui/icons-material/Chat";
import ShareIcon from "@mui/icons-material/Share";
import { pipeUrls, ProgramStatusInCard } from "../../../utils/constant";
import { useNavigate } from "react-router-dom";

const ActionMenu = ({ params }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedItem, setSelectedItem] = React.useState({});

  const open = Boolean(anchorEl);

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (action) => {
    switch (action) {
      case "view":
        navigate(`${pipeUrls.programdetails}/${selectedItem.id}`);
        break;
      case "changeMentor":
        // Handle change mentor action
        break;
      case "discussions":
        // Handle discussions action
        break;
      case "share":
        // Handle share action
        break;
      default:
        break;
    }
    handleClose();
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls={open ? "action-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={(e) => handleClick(e, params.row)}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="action-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={() => handleMenuClick("view")}>
          <VisibilityIcon sx={{ mr: 1 }} fontSize="small" />
          View
        </MenuItem>
        <MenuItem onClick={() => handleMenuClick("changeMentor")}>
          <PeopleIcon sx={{ mr: 1 }} fontSize="small" />
          Change Mentor
        </MenuItem>
        <MenuItem onClick={() => handleMenuClick("discussions")}>
          <ChatIcon sx={{ mr: 1 }} fontSize="small" />
          Discussions
        </MenuItem>
        <MenuItem onClick={() => handleMenuClick("share")}>
          <ShareIcon sx={{ mr: 1 }} fontSize="small" />
          Share
        </MenuItem>
      </Menu>
    </div>
  );
};

const SubprogramsDataGrid = ({ data }) => {
  const programPending = ["yettoapprove"];

  const columns = [
    { field: "mentor_name", headerName: "Mentor Name", flex: 1 },
    { field: "subprogram", headerName: "Sub program", flex: 1 },
    { field: "program_name", headerName: "Title Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1.5 },
    { field: "start_date", headerName: "Start date", flex: 1 },
    { field: "end_date", headerName: "End date", flex: 1 },
    { field: "acceptedDate", headerName: "Accepted date", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        const isProgramPending = programPending.includes(params.row?.status);
        return (
          <span
            style={{
              backgroundColor: isProgramPending ? "#ffead1" : "rgba(235, 255, 243, 1)",
              color: isProgramPending ? "#ffb155" : "#33bc93",
              padding: "6px 12px",
              fontSize: "0.875rem",
              borderRadius: 4,
            }}
          >
            {isProgramPending ? "Pending" : "Accepted"}
          </span>
        );
      },
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 1,
      sortable: false,
      renderCell: (params) => <ActionMenu params={params} />,
    },
  ];

  return (
    <div>
      <DataGrid
        rows={data || []}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
        sx={{
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#F9FAFB",
          },
        }}
        hideFooter={true}
      />
    </div>
  );
};

export default SubprogramsDataGrid;
