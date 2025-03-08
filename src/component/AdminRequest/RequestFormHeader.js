import React, { useState } from "react";
import { MoreVertical, CheckCircle, XCircle } from "lucide-react";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const AccordionItem = ({ title, isOpen, onToggle, children }) => {
  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full flex justify-between items-center py-4 px-4 text-left"
        onClick={onToggle}
      >
        <span className="text-lg font-medium text-gray-800">{title}</span>
        {isOpen ? (
          <ExpandLessIcon className="text-gray-500" size={20} />
        ) : (
          <ExpandMoreIcon className="text-gray-500" size={20} />
        )}
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
};

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
  };

  const config = statusConfig[status] || statusConfig.verified;

  return (
    <div className="bg-blue-50 rounded-md mb-4">
      <div className="flex justify-between items-center p-4">
        <div className="font-medium">{title}</div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Date & time: {date} | {time}
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
                <ExpandLessIcon className="text-blue-600" size={20} />
              ) : (
                <ExpandMoreIcon className="text-blue-600" size={20} />
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
      <div className="text-gray-800">{value}</div>
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
    "in-review": {
      label: "In-Review",
      bgColor: "bg-orange-100",
      textColor: "text-orange-600",
      borderColor: "border-orange-300",
    },
    "not-started": {
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
  };

  const config =
    statusConfig[userData?.application_status] || statusConfig["in-review"];

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className="w-full border-b border-gray-300">
      <div className="flex justify-between items-center p-4">
        <div className="text-lg font-medium text-gray-800">
          View ({userData?.mentor_name})
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`px-3 py-1 rounded-full ${config.bgColor} ${config.textColor} text-sm`}
          >
            {config.label}
          </div>

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

      {/* Caution content area */}
      {userData?.application_status === "in-review" && (
        <div
          className={`mx-4 mb-4 p-4 rounded-md ${config.bgColor} border ${config.borderColor}`}
        >
          <div className="font-medium text-orange-700 mb-2">
            Marked as In review
          </div>
          <div className="text-sm text-gray-700">
            Update by: John Doe | Update Date| Time : 02/02/2025 | 05:50 PM
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
      <StatusItem
        title="Application status"
        date="12/2/2024"
        time="12:35 PM"
        status="verified"
      />

      {/* Interview Result */}
      <StatusItem
        title="Interview result"
        date="12/2/2024"
        time="12:35 PM"
        status="selected"
        isOpen={openSections.interviewResult}
        onToggle={() => toggleSection("interviewResult")}
      >
        <div className="bg-white p-4 rounded">
          <div className="text-gray-600 mb-2">Remarks:</div>
          <div className="text-gray-800">
            John deo performed well with excellent communication skill.
          </div>
        </div>
      </StatusItem>

      {/* Interview Details */}
      <div className="bg-blue-50 rounded-md mb-4 p-4">
        <div className="font-medium mb-4">Interview details</div>
        <div className="bg-white p-4 rounded">
          <InterviewDetail
            label="Interview Location"
            value="132 My Street, Kingston, New York 12401."
          />
          <InterviewDetail
            label="Interview date | time"
            value="12/2/2024 | 12:35 PM"
          />
          <InterviewDetail
            label="Description"
            value="Your interview is scheduled at [Location] on [Date]. Please arrive 10 minutes early and bring any required documents. Let us know if you have any questions"
          />
        </div>
      </div>

      {/* Personal Information */}
      <AccordionItem
        title="Personal Information"
        isOpen={openSections.personalInfo}
        onToggle={() => toggleSection("personalInfo")}
      >
        <div className="text-gray-700">
          This section would contain personal information content.
        </div>
      </AccordionItem>
    </div>
  );
};

export default RequestFormHeader;
