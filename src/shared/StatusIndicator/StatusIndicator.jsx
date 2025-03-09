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
  
in_review: "#FF7600",

// Mentee Assessment status

not_submitted:"#E0382D",
submitted: "#1D5BBF",

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
  
  // Gender choices from backend
  male: "#1D5BBF",
  female: "#1D5BBF",
  others: "#1D5BBF",
  none: "#6E6E6E",
  nonbinary: "#1D5BBF",
  "prefer not to answer": "#6E6E6E",
    
  // MaritalStatus choices from backend
  single: "#1D5BBF",
  married: "#1D5BBF",
  domestic_partnership: "#1D5BBF",
  widowed: "#1D5BBF",
  divorced: "#1D5BBF",
  separated: "#1D5BBF",
  
  // InterviewStatus choices from backend
  mail_sent: "#16B681",
  selected: "#1D5BBF",
  not_selected: "#E0382D",
  
  // BackgroundCheckStatus choices from backend
  not_started: "#1D5BBF",
  passed: "#16B681",
  failed: "#E0382D",
  
  // TrainingVideoStatus choices from backend
  yet_to_watch: "#FFD500",
  watched: "#16B681",
  
  // ApplicationStatus choices from backend
  waiting_for_verification: "#FFD500",
  verified: "#16B681",  
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
  
in_review: "In-review",

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
  // Mentee Assessment status
"not_submitted":"Not Submitted",

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
  
  // Gender choices from backend
  male: "Male",
  female: "Female",
  others: "Others",
  none: "None",
  nonbinary: "Non Binary",
  "prefer not to answer": "Prefer Not To Answer",  
  
  // MaritalStatus choices from backend
  single: "Single",
  married: "Married",
  domestic_partnership: "Domestic Partnership",
  widowed: "Widowed",
  divorced: "Divorced",
  separated: "Separated",
  
  // InterviewStatus choices from backend
  mail_sent: "Mail Sent",
  selected: "Selected",
  not_selected: "Not Selected",
  
  // BackgroundCheckStatus choices from backend
  not_started: "Not Started",
  passed: "Passed",
  failed: "Failed",
  
  // TrainingVideoStatus choices from backend
  yet_to_watch: "Yet to Watch",
  watched: "Watched",
  
  // ApplicationStatus choices from backend
  waiting_for_verification: "Waiting for Verification",
  verified: "Verified",
  // rejected: "Rejected", // Already exists above
  // inreview: "INREVIEW", // Already exists above
};

// Map of statuses that should show icons instead of dots
export const statusWithIcons = {
  Approved: VerifiedIcon,
  Rejected: CancelIcon,
  approved: VerifiedIcon,
  rejected: CancelIcon,
  accept: VerifiedIcon,
  cancel: CancelIcon,
  passed: VerifiedIcon,
  failed: CancelIcon,
  verified: VerifiedIcon,
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
  // Normalize status value to lowercase for case-insensitive matching
  const normalizedStatus = status?.toLowerCase?.() || status;
  
  const statusColor = statusColors[normalizedStatus] || "#6E6E6E"; // Default gray if status not found
  const displayText = statusText[normalizedStatus] || status; // Use mapping or the status itself
  const showDot = status !== "Not Submitted"; // Don't show dot for "Not Submitted"
  const IconComponent = useIcon && (statusWithIcons[normalizedStatus] || statusWithIcons[status]);

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