import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PeopleIcon from "@mui/icons-material/People";
import { pipeUrls } from "../../../utils/constant";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Star } from "lucide-react";

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
      const programPending = ["yettoapprove"];
      const isProgramPending = programPending.includes(params.row?.status);
      return (
        <span
          style={{
            backgroundColor: isProgramPending
              ? "#ffead1"
              : "rgba(235, 255, 243, 1)",
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
    renderCell: (params) => (
      <IconButton>
        <MoreVertIcon />
      </IconButton>
    ),
  },
];

const CourseCard = ({ data, handleMenuClick }) => {
  const handleViewDetails = () => {
    // Pass the full row data including id when calling handleMenuClick
    handleMenuClick("view", data);
  };
  return (
    <div className="max-w-xs p-5 bg-white rounded-lg shadow-md">
      {/* Category Badge */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-base font-semibold">
          {data?.admin_program_series}. Subject
        </h2>
        <span className="px-3 py-1 text-xs text-gray-600 border border-gray-100 rounded-full">
         {data?.category_name}
        </span>
      </div>

      {/* Description */}
      <p className="mb-3 text-sm text-gray-600 line-clamp-2">
        {data?.description}
      </p>

      {/* Instructor Info */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-medium">{data?.mentor_rating}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
            <img
              src={data?.mentor_profile_image}
              alt="Instructor"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-xs">
            <span className="text-gray-600">Instructor: </span>
            <span className="text-blue-600 hover:underline cursor-pointer">
              {data?.mentor_name}
            </span>
          </div>
        </div>
      </div>

      {/* View Details Button */}
      <div className="flex justify-center">
        <button
          className="p-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          onClick={handleViewDetails}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

const ActionMenu = ({ anchorEl, open, handleClose, handleMenuClick }) => {
  const role = useSelector((state) => state.userInfo?.data?.role);

  return (
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
      {role === "mentor" && (
        <MenuItem onClick={() => handleMenuClick("accept")}>
          <CheckCircleIcon sx={{ mr: 1 }} fontSize="small" />
          Accept
        </MenuItem>
      )}
      {/* <MenuItem onClick={() => handleMenuClick("discussions")}>
          <ChatIcon sx={{ mr: 1 }} fontSize="small" />
          Discussions
        </MenuItem>
        <MenuItem onClick={() => handleMenuClick("share")}>
          <ShareIcon sx={{ mr: 1 }} fontSize="small" />
          Share
        </MenuItem> */}
    </Menu>
  );
};

const SubprogramsDataGrid = ({ data, handleAcceptProgram }) => {
  const role = useSelector((state) => state.userInfo?.data?.role);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [gridCellParams, setgridCellParams] = React.useState();  

  const handleClick = (params, event) => {
    if (params.field === "actions") {
      setAnchorEl(event.currentTarget);
    }
    setgridCellParams(params.row);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (action, course) => {
    switch (action) {
      case "view":
        navigate(
          `${pipeUrls.programdetails}/${
            course ? course?.id : gridCellParams.id
          }`
        );
        break;
      case "accept":
        handleAcceptProgram(gridCellParams.id);
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
      {role === "mentee" ? (
        <div className="flex gap-x-3 items-center">
          {data?.map((item) => (
            <CourseCard data={item} handleMenuClick={handleMenuClick} />
          ))}
        </div>
      ) : (
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
          onCellClick={handleClick}
        />
      )}
      <ActionMenu
        open={open}
        anchorEl={anchorEl}
        handleClose={handleClose}
        handleMenuClick={handleMenuClick}
      />
    </div>
  );
};

export default SubprogramsDataGrid;
