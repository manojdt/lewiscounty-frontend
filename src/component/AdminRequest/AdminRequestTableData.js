import { Box, IconButton } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import StatusIndicator from "../../shared/StatusIndicator/StatusIndicator";

export const requestTableColumns = [
  {
    field: "name",
    headerName: "Name",
    flex: 1.5,
  },
  {
    field: "created_at",
    headerName: "Submitted Date",
    flex: 1,
  },
  {
    field: "application_status",
    headerName: "Application status",
    flex: 1.5,
    renderCell: (params) => {
      return (
        <div>
          <StatusIndicator status={params.row?.application_status} />
        </div>
      );
    },
  },
  {
    field: "interview_status",
    headerName: "Interview Status",
    flex: 1.2,
    renderCell: (params) => {
      return (
        <div>
          <StatusIndicator status={params.row?.interview_status} />
        </div>
      );
    },
  },
  {
    field: "bg_status",
    headerName: "Background verification",
    flex: 1.5,
    renderCell: (params) => {
      return (
        <div>
          <StatusIndicator status={params.row?.bg_status} />
        </div>
      );
    },
  },
  {
    field: "video_status",
    headerName: "Training video",
    flex: 1.2,
    renderCell: (params) => {
      return (
        <div>
          <StatusIndicator status={params.row?.video_status} />
        </div>
      );
    },
  },
  {
    field: "approve_status",
    headerName: "Final Decision",
    flex: 1.2,
    renderCell: (params) => {
      return (
        <div>
          <StatusIndicator status={params.row?.approve_status} />
        </div>
      );
    },
  },
  {
    field: "actions",
    headerName: "Action",
    sortable: false,
    width: 80,
    renderCell: () => (
      <IconButton>
        <MoreVertIcon />
      </IconButton>
    ),
  },
];
