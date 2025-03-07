import React from "react";
import { Stack, Box, Typography } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

// Consolidated status colors and text mapping based on constants.js and ProfileView
export const statusColors = {
  // Request status colors
  new: "#1D5BBF",
  pending: "#FFD500",
  waiting_mentor: "#1D5BBF",
  completed: "#16B681",
  cancelled: "#E0382D",
  rejected: "#E0382D",
  approved: "#16B681",
  accept: "#16B681",
  in_progress: "#FF7600",
  inreview: "#FF7600",

  // Program statuses
  yettojoin: "#1D5BBF",
  yettostart: "#FFD500",
  yettoapprove: "#FFD500",
  inprogress: "#FF7600",
  started: "#FF7600",
  paused: "#E0382D",
  draft: "#6E6E6E",
  assign_program_accepted: "#16B681",
  new_program_request_rejected: "#E0382D",

  // Task status colors
  waiting_for_approval: "#1D5BBF",
  reassigned: "#1D5BBF",
  newtask: "#1D5BBF",
  submitted: "#FFD500",

  // Step statuses
  "In-Progress": "#FF7600",
  Waiting: "#FFD500",

  // Goal statuses
  active: "#FFD500",
  ongoing: "#FF7600",
  aborted: "#E0382D",
  inactive: "#FF7600",
  decline: "#E0382D",
  cancel: "#E0382D",

  // Member statuses
  Active: "#1D5BBF", // Same color as "new"
  Deactive: "#E0382D", // Same color as "cancelled"

  // Other statuses
  Wating_for_response: "#1D5BBF",
  launched: "#16B681",
  deactivated: "#6E6E6E",
  review: "#1D5BBF",
  deleted: "#E0382D",

  // ProfileView specific statuses
  Approved: "#16B681",
  Rejected: "#E0382D",

  // For not submitted status
  "Not Submitted": "#6E6E6E",
};

// Comprehensive text mapping based on constants.js and ProfileView
export const statusText = {
  // Request status texts
  new: "New",
  pending: "Pending",
  waiting_mentor: "Waiting Mentor",
  completed: "Completed",
  cancelled: "Cancelled",
  rejected: "Rejected",
  approved: "Accepted",
  accept: "Approved", // goal
  in_progress: "In Progress",
  inreview: "In Review",

  // Program status texts
  yettojoin: "Yet to Launch",
  yettostart: "Yet to Start",
  yettoapprove: "Waiting for Approval",
  inprogress: "Ongoing",
  started: "Ongoing",
  paused: "Paused",
  draft: "Draft",
  assign_program_accepted: "Approved",
  new_program_request_rejected: "Rejected",

  // Task status texts
  waiting_for_approval: "Waiting for Approval",
  reassigned: "Re-assigned",
  newtask: "New",
  submitted: "Submitted",

  // Step statuses
  "In-Progress": "In Progress",
  Waiting: "Waiting",

  // Goal statuses
  active: "Active",
  ongoing: "Ongoing",
  aborted: "Aborted",
  inactive: "Inactive",
  decline: "Declined",
  cancel: "Cancelled",

  // Member statuses
  Active: "Active",
  Deactive: "Deactive",

  // Other statuses
  Wating_for_response: "Waiting for Response",
  launched: "Launched",
  deactivated: "Deactivated",
  review: "Review",
  deleted: "Deleted",

  // ProfileView specific statuses
  Approved: "Approved",
  Rejected: "Rejected",

  // For not submitted status
  "Not Submitted": "Not Submitted",
};

// Map of statuses that should show icons instead of dots
export const statusWithIcons = {
  Approved: VerifiedIcon,
  Rejected: CancelIcon,
  approved: VerifiedIcon,
  rejected: CancelIcon,
};

/**
 * StatusIndicator component for displaying status with colored dot or icon
 *
 * @param {Object} props - Component props
 * @param {string} props.status - Status value (e.g. 'new', 'pending', etc.)
 * @param {boolean} props.useIcon - Whether to use icons instead of dots for certain statuses
 * @param {Object} props.sx - Optional MUI sx props for additional styling
 * @returns {JSX.Element} Status indicator with dot/icon and text
 */
const StatusIndicator = ({ status, useIcon = false, sx = {} }) => {
  const statusColor = statusColors[status] || "#6E6E6E"; // Default gray if status not found
  const displayText = statusText[status] || status; // Use mapping or the status itself
  const showDot = status !== "Not Submitted"; // Don't show dot for "Not Submitted"
  const IconComponent = useIcon && statusWithIcons[status];

  return status ? (
    <Stack direction="row" alignItems="center" spacing={1} sx={sx}>
      {showDot && !IconComponent && (
        <Box
          className="h-[10px] w-[10px] rounded-full"
          sx={{
            background: statusColor,
          }}
        />
      )}

      {showDot && IconComponent && (
        <IconComponent
          sx={{
            color: statusColor,
            fontSize: "1.2rem",
          }}
        />
      )}

      <Typography
        className={`!text-[14px] ${useIcon ? "font-medium" : "font-medium"}`}
        sx={{
          color: statusColor,
        }}
      >
        {displayText}
      </Typography>
    </Stack>
  ) : (
    "-"
  );
};

/**
 * StatusIndicatorWithAction component extends StatusIndicator to include optional action elements
 *
 * @param {Object} props - Component props
 * @param {string} props.status - Status value (e.g. 'new', 'pending', etc.)
 * @param {boolean} props.useIcon - Whether to use icons instead of dots
 * @param {React.ReactNode} props.action - Optional action element to show alongside status
 * @param {Object} props.sx - Optional MUI sx props for additional styling
 * @returns {JSX.Element} Status indicator with action
 */
export const StatusIndicatorWithAction = ({
  status,
  useIcon = false,
  action,
  sx = {},
}) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={sx}
    >
      <StatusIndicator status={status} useIcon={useIcon} />
      {action}
    </Stack>
  );
};

export default StatusIndicator;
