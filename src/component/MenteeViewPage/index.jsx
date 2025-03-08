import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import CustomAccordian from "../../shared/CustomAccordian/CustomAccordian";
import { EquipmentFormFields } from "../formFields/formFields";
import {
  Box,
  Stack,
  CircularProgress,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Backdrop,
} from "@mui/material";
import moment from "moment";
import { formFieldData } from "../MenteeQuestions/HelpFunction";
import { useGetMenteeDetailsQuery } from "../../features/mentees/menteesapi.service";
import MoreIcon from "../../assets/images/more1x.png";
import RejectCloseIcon from "../../assets/icons/rejectCloseIcon.svg";
import TickCircle from "../../assets/icons/tickCircle.svg";
import ReviewIcon from "../../assets/icons/Reports.svg";
import CloseIcon from "@mui/icons-material/Close";
import CancelIcon from "../../assets/images/cancel1x.png";
import TickColorIcon from "../../assets/icons/tickColorLatest.svg";
import CancelColorIcon from "../../assets/icons/cancelCircle.svg";
import { Button } from "../../shared";
import { useMenteeRequestActions } from "../../features/request/requestActions";
import { toast } from "react-toastify";

export const MenteeViewForm = () => {
  const [searchParams] = useSearchParams();
    const [requestType, setRequestType] = useState("");
  const params = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  // Get mentee ID from URL parameters (priority: URL path, then query param, then fallback)
  const menteeId = params.id || searchParams.get("id");

  // State for dialogs
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [reviewNote, setReviewNote] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const [fieldData, setFieldData] = useState(formFieldData);
  const [formData, setFormData] = useState({
    // Initial empty state matching the structure in MenteeSubmitForm
    youth_first_name: "",
    youth_last_name: "",
    youth_dob: "",
    youth_gender: "",
    youth_street_address: "",
    youth_state: "",
    youth_city: "",
    youth_zip_code: "",
    youth_phone_number: "",
    youth_school: "",
    youth_grade: "",
    youth_preferred_language: [],
    youth_other_language: [],
    youth_ethnicity: "",
    referrer_first_name: "",
    referrer_last_name: "",
    referrer_phone: "",
    referrer_email: "",
    referrer_relationship: "",
    referrer_benefit_reason: "",
    youth_living_with: "",
    parent_first_name: "",
    parent_last_name: "",
    parent_street_address: "",
    parent_state: "",
    parent_city: "",
    parent_zip_code: "",
    parent_phone: "",
    parent_marital_status: "",
  });

  // Use RTK Query hook to fetch mentee details
  const {
    data: menteeData,
    refetch,
    isLoading,
    isError,
    error,
  } = useGetMenteeDetailsQuery(menteeId, {
    skip: !menteeId, // Skip the query if we don't have a mentee ID
  });
  const {
    handleApproveMentee,
    handleRejectMentee,
    handleReviewMentee,
    handleMenteeFinalReject,
    handleMenteeFinalApprove,
    handleMenteeNotSubmit,
    handleMenteeSubmit,
  } = useMenteeRequestActions();
  // Map API response to form data structure when data is received
  useEffect(() => {
    if (menteeData) {
      mapResponseToFormData(menteeData);
    }
  }, [menteeData]);

  // Map API response to form data structure
  const mapResponseToFormData = (data) => {
    // Extract referrer and guardian data
    const referrer =
      data.mentee_referrers && data.mentee_referrers.length > 0
        ? data.mentee_referrers[0]
        : {};

    const guardian =
      data.mentee_guardian && data.mentee_guardian.length > 0
        ? data.mentee_guardian[0]
        : {};

    // Get location details
    const menteeLocation = data.mentee_location_details || {};
    const guardianLocation = guardian.guardian_location_details || {};

    // Handle preferred languages
    const preferredLanguages = data.preferred_languages || [];
    const standardLanguages = ["english", "spanish"];

    // Separate languages into standard and other
    const standardSelected = [];
    const otherLanguages = [];

    preferredLanguages.forEach((lang) => {
      const normalizedLang = lang.toLowerCase();
      if (standardLanguages.includes(normalizedLang)) {
        standardSelected.push(normalizedLang);
      } else {
        otherLanguages.push(lang);
      }
    });

    // Add "other" to standard languages if there are other languages
    if (otherLanguages.length > 0) {
      standardSelected.push("other");
    }

    // Map the response data to our form structure
    setFormData({
      // Youth Information
      youth_first_name: data.first_name || "",
      youth_last_name: data.last_name || "",
      youth_dob: data.dob ? moment(data.dob).format("YYYY-MM-DD") : "",
      youth_gender: data.gender || "",
      youth_street_address: data.street_address || "",
      youth_state: menteeLocation.state_name || "",
      youth_city: menteeLocation.city || "",
      youth_zip_code: menteeLocation.zip_code || "",
      youth_phone_number: data.phone_number || "",
      youth_school: data.school || "",
      youth_grade: data.grade || "",
      youth_preferred_language: standardSelected,
      youth_other_language: otherLanguages,
      youth_ethnicity:
        data.ethncity && data.ethncity.length > 0 ? data.ethncity[0] : "",

      // Referrer Information
      referrer_first_name: referrer.first_name || "",
      referrer_last_name: referrer.last_name || "",
      referrer_phone: referrer.phone_number || "",
      referrer_email: referrer.email || "",
      referrer_relationship: referrer.relationship || "",
      referrer_benefit_reason: referrer.referral_reason || "",
      youth_living_with: referrer.living_with || "",

      // Parent/Guardian Information
      parent_first_name: guardian.first_name || "",
      parent_last_name: guardian.last_name || "",
      parent_street_address: guardian.street_address || "",
      parent_state: guardianLocation.state_name || "",
      parent_city: guardianLocation.city || "",
      parent_zip_code: guardianLocation.zip_code || "",
      parent_phone: guardian.phone_number || "",
      parent_marital_status: guardian.marital_status || "",
    });
  };

  // Update field data based on whether there are other languages
  useEffect(() => {
    if (menteeData && formData) {
      // Create copy of field data structure for modification
      const updatedFieldData = formFieldData.map((section) => {
        if (section.title === "Youth Information") {
          // Get the fields for this section
          const updatedFields = [...section.fields];

          // Find the index of the language field
          const languageFieldIndex = updatedFields.findIndex(
            (field) => field.key === "youth_preferred_language"
          );

          // Check if we need to add the other language field
          const hasOtherLanguage =
            Array.isArray(formData.youth_preferred_language) &&
            formData.youth_preferred_language.includes("other");

          // If there's already an "other language" field, remove it first to avoid duplicates
          const otherLanguageIndex = updatedFields.findIndex(
            (field) => field.key === "youth_other_language"
          );

          if (otherLanguageIndex !== -1) {
            updatedFields.splice(otherLanguageIndex, 1);
          }

          // Add the other language field after the preferred language field if needed
          if (hasOtherLanguage && languageFieldIndex !== -1) {
            updatedFields.splice(languageFieldIndex + 1, 0, {
              type: "multiSelect",
              label: "Other Languages",
              isRequired: false,
              col: 6,
              isMultiSelect: true,
              isDisable: true,
              key: "youth_other_language",
              options: formData.youth_other_language.map((lang) => ({
                label: lang.charAt(0).toUpperCase() + lang.slice(1),
                value: lang,
              })),
            });
          }

          return {
            ...section,
            fields: updatedFields.map((field) => ({
              ...field,
              isDisable: true, // Ensure all fields are disabled
            })),
          };
        }

        return {
          ...section,
          fields: section.fields.map((field) => ({
            ...field,
            isDisable: true,
          })),
        };
      });

      setFieldData(updatedFieldData);
    }
  }, [formData.youth_preferred_language, menteeData]);

  // Handle missing ID
  if (!menteeId) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        <p>Error: No mentee ID provided in URL</p>
      </div>
    );
  }

  // Show loading state
  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <CircularProgress />
  //       <span className="ml-2">Loading mentee details...</span>
  //     </div>
  //   );
  // }

  // Show error state
  // if (isError) {
  //   return (
  //     <div className="flex justify-center items-center h-screen text-red-600">
  //       <p>
  //         Error loading mentee details:{" "}
  //         {error?.data?.message || "Something went wrong"}
  //       </p>
  //     </div>
  //   );
  // }

  // Menu state
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Dialog handlers
  const handleVerifyOpen = () => {
    setVerifyDialogOpen(true);
  };

  const handleVerifyClose = () => {
    setVerifyDialogOpen(false);
  };

  const handleVerifyConfirm = async () => {
    // Add your API call here to update the status to Verified
    const result = await handleApproveMentee(menteeData?.id);
    if (result.success) {
      console.log("Application verified");
      refetch()
      setVerifyDialogOpen(false);
    }
  };

  const handleReviewOpen = () => {
    setReviewDialogOpen(true);
  };

  const handleReviewClose = () => {
    setReviewDialogOpen(false);
  };

  const handleReviewSubmit = async () => {
    // Add your API call here to update the status to Review with the note
    if (reviewNote.trim()) {
      const result = await handleReviewMentee(menteeData?.id, {
        in_review_reason: reviewNote,
      });
      if (result.success) {
        console.log("Application set to review with note:", reviewNote);
        refetch()
        setReviewNote("");
        setReviewDialogOpen(false);
      }
    } else {
      toast.error("Reason Required");
    }
  };
  const onMenteeSubmitRejectClick = async (id) => {
    if (rejectReason.trim()) {
      const result = await handleMenteeFinalReject(menteeData?.id, {
        rejected_reason: rejectReason,
      });
      if (result.success) {
        refetch()
        setRejectReason("");
        setRejectDialogOpen(false);
      } else {
        // Show error notification
      }
    } else {
      toast.error("Reason Required");
    }
  };
  const onMenteeAubmitApproveClick = async () => {
    const result = await handleMenteeFinalApprove(menteeData?.id);
    if (result.success) {
      refetch()
      setVerifyDialogOpen(false);
    } else {
      // Show error notification
    }
  };
  const handleRejectOpen = () => {
    setRejectDialogOpen(true);
  };

  const handleRejectClose = () => {
    setRejectDialogOpen(false);
  };

  const handleRejectSubmit = async () => {
    // Add your API call here to update the status to Rejected with the reason
    if (rejectReason.trim()) {
      const result = await handleRejectMentee(menteeData?.id, {
        rejected_reason: rejectReason,
      });
      if (result.success) {
        refetch()
        setRejectReason("");
        setRejectDialogOpen(false);
      } else {
        // Show error notification
      }
    } else {
      toast.error("Reason Required");
    }
  };

  return (
    <div>
      <Box
        className="bg-[#fff] rounded-[10px]"
        sx={{
          boxShadow: "4px 4px 25px 0px rgba(0, 0, 0, 0.15)",
          padding: "10px 20px",
          margin: "30px 30px 30px 30px",
        }}
      >
        <div className="flex justify-between">
          <div className="mt-6 pl-6 flex items-center gap-3">
            <p className="font-bold">Mentee Details</p>
            {/* {menteeData?.approve_status && (
              <p className="text-sm text-gray-600">
                <span className="font-medium capitalize">
                  {menteeData.approve_status}
                </span>
              </p>
            )} */}
          </div>
          <div>
            <div
              className="cursor-pointer w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-all duration-300"
              onClick={handleClick}
            >
              <img src={MoreIcon} alt="MoreIcon" />
            </div>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {menteeData && (menteeData?.application_status === "waiting_for_verification" || 
    menteeData?.application_status === "in_review") && (
    <MenuItem
      onClick={() => {
        handleClose();
        handleVerifyOpen();
      }}
      className="!text-[12px]"
    >
      <img
        src={TickCircle}
        alt="TickCircle"
        className="w-[20px] h-[15px] mr-2"
      />
      <p>Verify</p>
    </MenuItem>
  )}
  
  {/* Review option - only show for waiting_for_verification status */}
  {menteeData && menteeData?.application_status === "waiting_for_verification" && (
    <MenuItem
      onClick={() => {
        handleClose();
        handleReviewOpen();
      }}
      className="!text-[12px]"
    >
      <img
        src={ReviewIcon}
        alt="ReviewIcon"
        className="w-[20px] h-[15px] mr-2"
      />
      <p>Review</p>
    </MenuItem>
  )}
  
  {/* Approve option - only show for verified status with submitted assessment */}
  {menteeData && menteeData?.application_status === "verified" && 
   menteeData?.assessment_status === "submitted" && 
   (menteeData?.approve_status === "pending" || menteeData?.approve_status === "new") && (
    <MenuItem
      onClick={() => {
        handleClose();
        setRequestType("final_approve");
        handleVerifyOpen();
      }}
      className="!text-[12px]"
    >
      <img
        src={TickCircle}
        alt="TickCircle"
        className="w-[20px] h-[15px] mr-2"
      />
      <p>Approve</p>
    </MenuItem>
  )}
  
  {/* Reject option - don't show if already rejected */}
  {menteeData && menteeData?.application_status !== "rejected" && 
   menteeData?.approve_status !== "rejected" && (
    <MenuItem
      onClick={() => {
        handleClose();
        if (menteeData?.application_status === "verified" && menteeData?.assessment_status === "submitted") {
          setRequestType("final_reject");
        }
        handleRejectOpen();
      }}
      className="!text-[12px]"
    >
      <img
        src={RejectCloseIcon}
        alt="RejectCloseIcon"
        className="w-[20px] h-[15px] mr-2"
      />
      <p>Reject</p>
    </MenuItem>
  )}
            </Menu>
          </div>
        </div>
        <div className="pt-2">
          {menteeData?.application_status === "in_review" &&
            menteeData?.in_review_reason && (
              <div className="action-set action_rescheduled">
                <div className="reason-title flex gap-4">
                  Marked as in review
                  <div className="flex gap-2 text-[12px] text-black pt-1">
                    <div className="font-bold">Updated by:</div>
                    <div className="text-[11px] text-blue-600 underline">
                      {menteeData?.approved_by}
                    </div>
                  </div>
                  <div className="flex gap-2 text-[12px] text-black pt-1">
                    <div className="font-bold">Updated Date | Time:</div>
                    <div className="text-[11px] text-blue-600 underline">
                      {moment(menteeData?.updated_at).format('DD/MM/YYYY | hh:mm a')}
                    </div>
                  </div>
                </div>

                <div className="reason-content">
                  {menteeData?.in_review_reason}
                </div>
              </div>
            )}
          {(menteeData?.application_status === "rejected" ||
            menteeData?.approve_status === "rejected") &&
            menteeData?.rejected_reason && (
              <div className="action-set action_cancelled mb-4">
                <div className="reason-title">{"Request Reason"}</div>
                <div className="reason-content">
                  {menteeData?.rejected_reason}
                </div>
              </div>
            )}
          {menteeData?.application_status === "verified" &&
            menteeData?.application_status === "rejected" &&
            menteeData.approve_status !== "rejected" && (
          <div className="bg-gray-200">
            <div className="p-4 flex justify-between items-center ">
              <div className="text-black">{"Application"}</div>
              <div className="text-[#16B681] font-bold flex items-center">
                <img
                  src={TickColorIcon}
                  alt="TickColorIcon"
                  className="w-[45px] h-[35px]"
                />{" "}
                {"Application Verified"}
              </div>
            </div>
          </div>
           )} 
        </div>
        <Stack spacing={2}>
          {fieldData?.map((data, i) => {
            return (
              <CustomAccordian
                key={i}
                title={data?.title}
                children={
                  <EquipmentFormFields
                    fields={data?.fields}
                    formData={formData}
                    // No handlers needed as everything is disabled
                    handleChange={() => {}}
                    handleDeleteFile={() => {}}
                  />
                }
                defaultValue={true}
              />
            );
          })}
        </Stack>

        <Box className="flex justify-center gap-3">
  {/* Only show Reject button if not already rejected */}
  {menteeData?.application_status !== "rejected" && menteeData?.approve_status !== "rejected" && (
    <Button
      btnName="Reject"
      btnCls="w-[130px]"
      btnStyle={{
        border: "1px solid #ff0004",
        color: "#ff0004",
      }}
      btnCategory="secondary"
      onClick={() => {
        if (menteeData?.application_status === "verified" && menteeData?.assessment_status === "submitted") {
          setRequestType("final_reject");
          handleRejectOpen();
        } else {
          handleRejectOpen();
        }
      }}
    />
  )}
  
  {/* Only show Review button for waiting_for_verification status */}
  {menteeData?.application_status === "waiting_for_verification" && (
    <Button
      btnName="Review"
      btnCls="w-[130px]"
      btnStyle={{
        border: "1px solid #e56031",
        color: "white",
        backgroundColor: "#e56031",
      }}
      btnCategory="secondary"
      onClick={handleReviewOpen}
    />
  )}
  
  {/* Only show Verify button for waiting_for_verification or in_review status */}
  {(menteeData?.application_status === "waiting_for_verification" || menteeData?.application_status === "in_review") && (
    <Button
      btnName="Verify"
      btnCls="w-[130px]"
      btnStyle={{
        border: "1px solid #16b681",
        color: "white",
        backgroundColor: "#16b681",
      }}
      btnCategory="secondary"
      onClick={handleVerifyOpen}
    />
  )}
  
  {/* Show Approve button only for verified status with submitted assessment and pending/new approve status */}
  {menteeData?.application_status === "verified" && 
   menteeData?.assessment_status === "submitted" && 
   (menteeData?.approve_status === "pending" || menteeData?.approve_status === "new") && (
    <Button
      btnName="Approve"
      btnCls="w-[130px]"
      btnStyle={{
        border: "1px solid #16b681",
        color: "white",
        backgroundColor: "#16b681",
      }}
      btnCategory="secondary"
      onClick={() => {
        setRequestType("final_approve");
        handleVerifyOpen();
      }}
    />
  )}
</Box>
      </Box>

      {/* Verification Dialog with Backdrop */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={verifyDialogOpen}
      >
        <div className="popup-content w-2/6 md:w-2/4 sm:w-2/4 bg-white flex flex-col gap-2 h-[330px] justify-center items-center">
          <img src={TickColorIcon} alt="TickColorIcon" />
          <span style={{ color: "#232323", fontWeight: 600, fontSize: "24px" }}>
          {requestType==="final_approve"?"Please review the details before final approval":"Verify"} 
          </span>
          <div className="py-5">
            <p
              style={{
                color: "rgba(24, 40, 61, 1)",
                fontWeight: 600,
                fontSize: "18px",
              }}
            >
              {requestType==="final_approve"?"":"Are you sure you want to Verify this application?"}  
            </p>
          </div>
          <div className="flex justify-center">
            <div className="flex gap-6 justify-center align-middle">
              <Button
                btnCls="w-[110px]"
                btnName="Cancel"
                btnCategory="secondary"
                onClick={handleVerifyClose}
              />
              <Button
                btnType="button"
                btnCls="w-[110px]"
                btnName="Verify"
                style={{
                  background: "#16B681",
                }}
                btnCategory="primary"
                onClick={()=>{
                  if(requestType==="final_approve"){
                    onMenteeAubmitApproveClick()
                  }else{
                    handleVerifyConfirm()
                  }
                }}
                // onClick={handleVerifyConfirm}
              />
            </div>
          </div>
        </div>
      </Backdrop>

      {/* Review Dialog */}
      <Dialog
        open={reviewDialogOpen}
        onClose={handleReviewClose}
        maxWidth="sm"
        fullWidth
      >
        <div className="py-1">
          <div
            className="flex justify-center flex-col gap-5 mt-1 mb-2"
            style={{
              // border: "1px solid rgba(29, 91, 191, 1)",
              borderRadius: "10px",
            }}
          >
            <div
              className="flex justify-between px-3 py-2 items-center"
              style={{ borderBottom: "1px solid rgba(229, 96, 49, 1)" }}
            >
              <p className="text-[18px]" style={{ color: "rgba(0, 0, 0, 1)" }}>
                Review
              </p>
              <img
                className="cursor-pointer"
                onClick={handleReviewClose}
                src={CancelIcon}
                alt="CancelIcon"
              />
            </div>

            <div className="px-5">
              <div className="relative pb-8">
                <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Description
                </label>

                <div className="relative">
                  <textarea
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    id="message"
                    rows="4"
                    className={`block p-2.5 input-bg w-full text-sm text-gray-900 border
                        focus-visible:outline-none focus-visible:border-none`}
                    style={{
                      border: "1px solid rgba(229, 96, 49, 1)",
                      borderRadius: "5px",
                    }}
                    placeholder={""}
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-center gap-5 items-center pt-5 pb-10">
                <Button
                  btnName="Cancel"
                  btnCls="w-[20%]"
                  btnCategory="secondary"
                  btnStyle={{
                    background: "white",
                    color: "black",
                    border: "1px solid black",
                    borderRadius: "3px",
                  }}
                  onClick={handleReviewClose}
                />
                <Button
                  btnName="Submit"
                  btnCls="text-white w-[20%]"
                  btnCategory="secondary"
                  onClick={handleReviewSubmit}
                  btnStyle={{
                    background: "#e56031",
                    border: "1px solid #e56031",
                    color: "white",
                    borderRadius: "3px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={handleRejectClose}
        maxWidth="sm"
        fullWidth
      >
        <div className="py-1">
          <div
            className="flex justify-center flex-col gap-5 mb-2"
            style={{
              // border: "1px solid rgba(29, 91, 191, 1)",
              borderRadius: "10px",
            }}
          >
            <div
              className="flex justify-between px-3 py-4 items-center"
              style={{ borderBottom: "2px solid #eb405d" }}
            >
              <p
                className="text-[15px] font-bold"
                style={{ color: "rgba(0, 0, 0, 1)" }}
              >
                Reject Reason
              </p>
              <img
                className="cursor-pointer"
                onClick={handleRejectClose}
                src={CancelIcon}
                alt="CancelIcon"
              />
            </div>

            <div className="px-5">
              <div className="relative pb-8">
                <label className="block tracking-wide text-gray-700 text-xs mb-2">
                  Kindly provide rejected reason
                </label>

                <div className="relative">
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    id="message"
                    rows="4"
                    className={`block p-2.5 input-bg w-full text-sm text-gray-900 border
                        focus-visible:outline-none focus-visible:border-none`}
                    style={{
                      border: "1px solid #eb405d",
                      borderRadius: "5px",
                    }}
                    placeholder={""}
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-center gap-5 items-center pt-5 pb-10">
                <Button
                  btnName="Cancel"
                  btnCls="w-[20%]"
                  btnCategory="secondary"
                  btnStyle={{
                    background: "white",
                    color: "black",
                    border: "1px solid black",
                    borderRadius: "3px",
                  }}
                  onClick={handleRejectClose}
                />
                <Button
                  btnName="Submit"
                  btnCls="text-white w-[20%]"
                  btnCategory="secondary"
                  onClick={()=>{
                    if(requestType==="final_reject"){
                      onMenteeSubmitRejectClick()
                    }else{
                      handleRejectSubmit()
                    }
                  }}
                  btnStyle={{
                    background: "#eb405d",
                    border: "1px solid #eb405d",
                    color: "white",
                    borderRadius: "3px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
