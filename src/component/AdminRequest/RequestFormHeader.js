import React, { useState } from "react";
import { MoreVertical, CheckCircle, XCircle } from "lucide-react";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Chip } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import {
  statusColors,
  statusText,
} from "../../shared/StatusIndicator/StatusIndicator";

const StatusItem = ({
  title,
  date,
  time,
  status,
  children,
  isOpen,
  onToggle,
}) => {
  const statusConfig = {
    verified: {
      color: "text-green-600",
      bgColor: "bg-green-100",
      icon: <CheckCircle size={20} className="text-green-600" />,
      text: "Application Verified",
    },
    selected: {
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      icon: <CheckCircle size={20} className="text-blue-600" />,
      text: "Selected",
    },
    accept: {
      color: "text-green-600",
      bgColor: "bg-green-100",
      icon: <CheckCircle size={20} className="text-green-600" />,
      text: "Accepted",
    },
    none: {
      color: "text-gray-600",
      bgColor: "bg-gray-100",
      icon: <XCircle size={20} className="text-gray-600" />,
      text: "Not Started",
    },
    inreview: {
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      icon: (
        <FiberManualRecordIcon fontSize="small" className="text-orange-600" />
      ),
      text: "In Review",
    },
  };

  const config = statusConfig[status] || statusConfig.none;

  return (
    <div className="bg-blue-50 rounded-md mb-4">
      <div className="flex justify-between items-center p-4">
        <div className="font-medium">{title}</div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            {date && time
              ? `Date & time: ${date} | ${time}`
              : "No date available"}
          </div>
          <div
            className={`flex items-center gap-1 ${config.color} rounded-md px-2 py-1 ${config.bgColor}`}
          >
            {config.icon}
            <span>{config.text}</span>
          </div>
          {onToggle && (
            <button onClick={onToggle}>
              {isOpen ? (
                <ExpandLessIcon className="text-blue-600" fontSize="small" />
              ) : (
                <ExpandMoreIcon className="text-blue-600" fontSize="small" />
              )}
            </button>
          )}
        </div>
      </div>
      {children && isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
};

const InterviewDetail = ({ label, value }) => {
  return (
    <div className="py-2">
      <div className="text-gray-600 mb-1">{label} :</div>
      <div className="text-gray-800">{value || "Not provided"}</div>
    </div>
  );
};

const RequestFormHeader = ({ userData }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [openSections, setOpenSections] = useState({
    applicationStatus: false,
    interviewResult: true,
    interviewDetails: false,
    personalInfo: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Status mapping for visual elements
  const statusConfig = {
    inreview: {
      label: "In-Review",
      bgColor: "bg-orange-100",
      textColor: "text-orange-600",
      borderColor: "border-orange-300",
    },
    not_started: {
      label: "Background verification not started",
      bgColor: "bg-gray-100",
      textColor: "text-gray-600",
      borderColor: "border-gray-300",
    },
    verified: {
      label: "Verified",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      borderColor: "border-green-300",
    },
    none: {
      label: "Not Started",
      bgColor: "bg-gray-100",
      textColor: "text-gray-600",
      borderColor: "border-gray-300",
    },
    accept: {
      label: "Accepted",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      borderColor: "border-green-300",
    },
  };

  // Get current application status from userData or default to "none"
  const currentStatus = userData?.application_status || "none";
  const interviewStatus = userData?.interview_status || "none";
  const bgStatus = userData?.bg_status || "none";

  // Format dates from API response if available
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format application date and time
  const applicationDate = formatDate(userData?.application_approval_date);
  const applicationTime = formatTime(userData?.application_approval_date);

  // Format interview date and time
  const interviewDate = formatDate(userData?.interview_date);
  const interviewTime = formatTime(userData?.interview_date);

  // Format background check date and time
  const bgDate = formatDate(userData?.bg_approval_date);
  const bgTime = formatTime(userData?.bg_approval_date);

  const config = statusConfig[currentStatus] || statusConfig.none;

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  // Check if user has been approved
  const isApproved = userData?.approve_status === "accept";
  const approvalDate = formatDate(userData?.approve_date);
  const approvalTime = formatTime(userData?.approve_date);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center p-4">
        <div className="flex gap-x-3">
          <div className="text-lg font-medium text-gray-800">
            View ({userData?.mentor_name || "User"})
          </div>
          <Chip
            size="small"
            variant="outlined"
            sx={{ color: statusColors[userData?.application_status] }}
            icon={
              <FiberManualRecordIcon
                sx={{ color: statusColors[userData?.application_status] }}
              />
            }
            label={
              userData?.application_status
                ? statusText[userData?.application_status] || config.label
                : config.label
            }
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={togglePopup}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Options"
          >
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Popup menu */}
      {showPopup && (
        <div className="absolute right-4 mt-1 bg-white shadow-lg rounded-md border border-gray-200 z-10">
          <div className="p-2 w-40">
            <button className="w-full text-left p-2 flex items-center gap-2 hover:bg-gray-100 rounded">
              <CheckCircle size={18} className="text-green-600" />
              <span>Verify</span>
            </button>
            <button className="w-full text-left p-2 flex items-center gap-2 hover:bg-gray-100 rounded">
              <XCircle size={18} className="text-red-600" />
              <span>Reject</span>
            </button>
          </div>
        </div>
      )}

      {/* In-review content area */}
      {userData?.application_status === "rejected" && (
        <div
          className={`mx-4 mb-4 p-4 rounded-md ${config.bgColor} border ${config.borderColor}`}
        >
          <div className="font-medium text-red-700 mb-2">
            Marked as In review
          </div>
          <div className="text-sm text-gray-700">
            Update by: {userData?.last_updated_by?.name || "Admin"} | Update
            Date| Time : {formatDate(userData?.updated_at) || "N/A"} |{" "}
            {formatTime(userData?.updated_at) || "N/A"}
          </div>
          <div className="mt-3 text-sm text-gray-700">
            {userData?.in_review || "No review notes available."}
          </div>
        </div>
      )}

      {/* Caution content area */}
      {userData?.application_status === "inreview" && (
        <div
          className={`mx-4 mb-4 p-4 rounded-md ${config.bgColor} border ${config.borderColor}`}
        >
          <div className="font-medium text-orange-700 mb-2">
            Marked as In review
          </div>
          <div className="text-sm text-gray-700">
            Update by: {userData?.last_updated_by?.name || "Admin"} | Update
            Date| Time : {formatDate(userData?.updated_at) || "N/A"} |{" "}
            {formatTime(userData?.updated_at) || "N/A"}
          </div>
          <div className="mt-3 text-sm text-gray-700">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop.
          </div>
        </div>
      )}

      {/* Application Status */}
      {currentStatus === "verified" && (
        <StatusItem
          title="Application status"
          date={applicationDate || approvalDate}
          time={applicationTime || approvalTime}
          status={currentStatus}
        />
      )}

      {/* Interview Result */}
      {userData?.bg_status === "not_started" && (
        <StatusItem
          title="Interview result"
          date={interviewDate || approvalDate}
          time={interviewTime || approvalTime}
          status={
            interviewStatus !== "none"
              ? interviewStatus
              : isApproved
              ? "accept"
              : "none"
          }
          isOpen={openSections.interviewResult}
          onToggle={() => toggleSection("interviewResult")}
        >
          <div className="bg-white p-4 rounded">
            <div className="text-gray-600 mb-2">Remarks:</div>
            <div className="text-gray-800">
              {userData?.interview_status_description ||
                "No interview remarks available."}
            </div>
          </div>
        </StatusItem>
      )}

      {/* Interview Details */}
      {userData?.interview_status === "mail_sent" && (
        <StatusItem
          title="Interview details"
          date={interviewDate}
          time={interviewTime}
          status={
            interviewStatus !== "none"
              ? interviewStatus
              : isApproved
              ? "accept"
              : "none"
          }
          isOpen={openSections.interviewDetails}
          onToggle={() => toggleSection("interviewDetails")}
        >
          <InterviewDetail
            label="Interview Location"
            value={`${userData?.location_details?.city}, ${userData?.location_details?.state_code} - ${userData?.location_details?.zip_code}`}
          />
          <InterviewDetail
            label="Interview date | time"
            value={
              interviewDate && interviewTime
                ? `${interviewDate} | ${interviewTime}`
                : null
            }
          />
          <InterviewDetail
            label="Description"
            value={userData?.interview_description}
          />
        </StatusItem>
      )}

      {/* Background Check Status */}
      {bgStatus !== "none" && (
        <StatusItem
          title="Background verification"
          date={bgDate}
          time={bgTime}
          status={bgStatus}
          isOpen={openSections.bgVerification}
          onToggle={() => toggleSection("bgVerification")}
        />
      )}
    </div>
  );
};

export default RequestFormHeader;
