import { IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import StatusIndicator from "../../shared/StatusIndicator/StatusIndicator";
import moment from "moment";
import { formatRenderCellDateValues } from "../../utils";

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
    renderCell: ({ row }) => moment(row?.created_at).format("MM-DD-YYYY"),
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
      const status =params.row?.approve_status==='cancel'?'Rejected':params.row?.approve_status;
      return (
        <div>
          <StatusIndicator status={status} />
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
export const requestTableMenteeColumns = [
  {
    field: "full_name",
    headerName: "Mentee Name",
    flex: 1.5,
  },
  {
    field: "created_at",
    headerName: "Submitted Date",
    flex: 1,
    renderCell: (params) => {
         return formatRenderCellDateValues(params?.row?.created_at);
       },
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
    field: "assessment_status",
    headerName: "Assessment Status",
    flex: 1.2,
    renderCell: (params) => {
      return (
        <div>
          <StatusIndicator status={params.row?.assessment_status} />
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
