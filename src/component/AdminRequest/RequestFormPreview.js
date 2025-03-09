import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Backdrop,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import SignatureCanvas from "react-signature-canvas";
import CustomAccordian from "../../shared/CustomAccordian/CustomAccordian";
import { EquipmentFormFields } from "../formFields/formFields";
import { MuiCustomModal } from "../../shared/Modal/MuiCustomModal";
import { useNavigate, useParams } from "react-router-dom";
import email_notify_icon from "../../assets/icons/email_notify_icon.svg";
import { useGetLanguageListQuery } from "../../features/questions/questionsapi.service";
import { useDispatch } from "react-redux";
import { getProgramAddressDetails } from "../../services/programInfo";
import moment from "moment";
import { useGetProfileInfoQuery } from "../../features/user/userApi.services";
import {
  MentorFormData,
  MentorFormSection,
  ReferenceFields,
} from "../Mentor/MentorFormFields";
import RequestFormHeader from "./RequestFormHeader";

// Function to add isDisable: true to all fields
const addIsDisableProperty = (sections) => {
  return sections.map((section) => {
    // Create a copy of the section
    const newSection = { ...section };

    // If the section has fields, map through them and add isDisable: true
    if (newSection.fields && newSection.fields.length > 0) {
      newSection.fields = newSection.fields.map((field) => ({
        ...field,
        isDisable: true,
      }));
    }

    return newSection;
  });
};

export function RequestFormPreview() {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const containerRef = useRef();

  const { data: languagesData, isLoading: isLanguagesLoading } =
    useGetLanguageListQuery();
  const { data: profileInfo, isLoading: isProfileInfoLoading } =
    useGetProfileInfoQuery(params?.id);

  // Process the user data from API response
  const userData = profileInfo || {};

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isTCOpen, setIsTCOpen] = useState(false);
  const [searchedOption, setSearchedOption] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [addressFieldData, setAddressFieldData] = useState([]);
  const [checked, setChecked] = React.useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  const signatureRef = useRef(null);
  const searchBar = useRef(null);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  // Apply the function to add isDisable property to all fields
  const updatedMentorFormSection = addIsDisableProperty(MentorFormSection);

  // Apply the same for ReferenceFields
  const updatedReferenceFields = ReferenceFields.map((field) => ({
    ...field,
    isDisable: true,
  }));

  // State for main form data
  const [formData, setFormData] = useState(MentorFormData);
  // Form field definitions
  const [formSections, setFormSections] = useState(updatedMentorFormSection);

  // Populate form data from API response - only using fields defined in MentorFormData
  useEffect(() => {
    if (userData && Object.keys(userData).length) {
      // Extract and process languages from API data
      const preferredLanguages = userData.languages_known || [];
      const standardLanguages = ["english", "spanish"];

      // Separate languages into standard and other
      const standardSelected = [];
      const otherLanguages = [];

      if (Array.isArray(preferredLanguages)) {
        preferredLanguages.forEach((lang) => {
          if (lang) {
            // Check if lang is defined
            const normalizedLang = lang.toLowerCase();
            if (standardLanguages.includes(normalizedLang)) {
              standardSelected.push(normalizedLang);
            } else {
              otherLanguages.push(lang);
            }
          }
        });
      }

      // Add "other" to standard languages if there are other languages
      if (otherLanguages.length > 0) {
        standardSelected.push("other");
      }

      // Update form data with user information from API
      // Only using fields that are defined in MentorFormData
      setFormData((prevData) => ({
        ...prevData,
        // Personal Information
        first_name: userData.first_name || "",
        middle_name: userData.middle_name || "",
        last_name: userData.last_name || "",
        email: userData.email || "",
        phone_number: userData?.phone_number || "",
        gender: userData?.gender || "",
        dob: userData?.dob ? moment(userData.dob).toDate() : null,
        languages_known: standardSelected,
        other_language: otherLanguages,
        marital_status: userData?.marital_status || "",

        // Address information - these might come from location_details
        address: userData?.address || "",
        city: userData?.location_details?.city || "",
        state: userData?.location_details?.state_code || "",
        zip_code: userData?.location_details?.zip_code || "",

        // Background Questions
        known_about_program: userData?.known_about_program || "",
        motivation_description: userData?.motivation_description || "",
        offer_mentees: userData?.offer_mentees || "",
        mentorship_achievement: userData?.mentorship_achievement || "",
        mentor_exp_desc: userData?.mentor_exp_desc || "",
        program_commitment:
          typeof userData?.program_commitment === "boolean"
            ? userData?.program_commitment
            : undefined,
        is_convicted:
          typeof userData?.is_convicted === "boolean"
            ? userData?.is_convicted
            : undefined,
        convicted_reason: userData?.convicted_reason || "",

        // References - handle array of references
        references:
          Array.isArray(userData?.references) && userData.references.length > 0
            ? userData.references
            : [
                {
                  first_name: "",
                  last_name: "",
                  email: "",
                  phone_number: "",
                  relationship: "",
                },
              ],

        // Documents
        // documents:
        //   userData?.documents?.length > 0 ? userData.documents[0].file : null,
      }));
    }
  }, [userData]);

  useEffect(() => {
    if (userData?.documents?.length > 0 && isCanvasReady) {
      const canvas = signatureRef.current.getCanvas();
      const ctx = canvas.getContext("2d");

      // Load the image from the URL
      const img = new Image();
      img.crossOrigin = "anonymous"; // Enable cross-origin if needed
      img.src = userData.documents[0].file;

      img.onload = () => {
        // Clear the canvas and draw the image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };

      img.onerror = (error) => {
        console.error("Failed to load image:", error);
      };
    }
  }, [userData?.documents, isCanvasReady]);

  // Ensure the canvas is ready before drawing
  useEffect(() => {
    if (signatureRef.current) {
      setIsCanvasReady(true);
    }
  }, []);
  // Handle language data loading
  useEffect(() => {
    if (languagesData && languagesData.length > 0) {
      // Create a deep copy of the form sections
      const updatedFormSections = JSON.parse(JSON.stringify(MentorFormSection));

      // Find the Personal Information section
      const personalInfoSection = updatedFormSections.find(
        (section) => section.title === "Personal Information"
      );

      if (personalInfoSection) {
        // Find the language checkbox field
        const languageFieldIndex = personalInfoSection.fields.findIndex(
          (field) => field.key === "languages_known"
        );

        if (languageFieldIndex !== -1) {
          // Set common languages for the checkbox (keeping just a few common ones)
          // Typically you'd select a few common languages for the checkbox options
          const commonLanguages = [
            { label: "English", value: "english" },
            { label: "Spanish", value: "spanish" },
            { label: "Tamil", value: "tamil" },
            { label: "Other", value: "other" },
          ];

          // Update the checkbox options
          personalInfoSection.fields[languageFieldIndex].options =
            commonLanguages;

          // Create or update the dropdown field for "other" languages
          const otherLanguageOptions = languagesData.map((lang) => ({
            label: lang.name || lang.label, // Adjust based on your API response structure
            value: lang.code || lang.value, // Adjust based on your API response structure
          }));

          // Find if the "other_language" field already exists
          const otherLangFieldIndex = personalInfoSection.fields.findIndex(
            (field) => field.key === "other_language"
          );

          if (otherLangFieldIndex !== -1) {
            // Update existing field
            personalInfoSection.fields[otherLangFieldIndex].options =
              otherLanguageOptions;
          } else {
            // Add new field after the languages_known field
            const newOtherLangField = {
              type: "selectBox",
              label: "Select Other Language",
              placeholder: "Select Language",
              isRequired: false,
              col: 12,
              key: "other_language",
              options: otherLanguageOptions,
              conditionalDisplay: "languages_known",
              conditionalValue: "other",
              isDisable: true, // Make sure this is disabled for viewing
            };

            // Insert the new field after the checkbox field
            personalInfoSection.fields.splice(
              languageFieldIndex + 1,
              0,
              newOtherLangField
            );
          }
        }
      }

      // Update form sections with the modified data
      setFormSections(updatedFormSections);
    }
  }, [languagesData]);

  const handleAddressfieldApi = (value, fieldName) => {
    if (!!value) {
      dispatch(
        getProgramAddressDetails({ id: value, fieldName: fieldName })
      ).then((response) => {
        if (isLoading) {
          setIsLoading(false);
        }
        if (!!response?.payload?.data?.length) {
          setAddressFieldData(response?.payload?.data);
        }
      });
    }
  };

  // Handle form field changes - this is mostly disabled in preview mode
  const handleFieldChange = (key, value, event) => {
    // Since this is preview mode, we generally don't need to update the form data
    // But we'll keep this logic in case we need it for edge cases
    if (key === "languages_known") {
      // Handle language checkbox selection
      let updatedLanguages = Array.isArray(value) ? [...value] : [value];

      // If "other" is removed, also clear the other_language field
      if (!updatedLanguages.includes("other")) {
        setFormData((prevData) => ({
          ...prevData,
          languages_known: updatedLanguages,
          other_language: "", // Clear other language if "other" is not selected
          error: {
            ...prevData.error,
            [key]: "",
          },
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          languages_known: updatedLanguages,
          error: {
            ...prevData.error,
            [key]: "",
          },
        }));
      }
    } else if (["state", "city", "zip_code"].includes(key)) {
      // Existing logic for address fields
      if (!document.getElementById("fields_overlay") && value) {
        searchBar?.current?.toggle(event);
      }
      if (!isLoading) {
        setIsLoading(true);
      }
      handleAddressfieldApi(value, key);

      setFormData((prevData) => ({
        ...prevData,
        [key]: value,
        error: {
          ...prevData.error,
          [key]: "",
        },
      }));
    } else {
      // Default handling for other fields
      setFormData((prevData) => ({
        ...prevData,
        [key]: value,
        error: {
          ...prevData.error,
          [key]: "",
        },
      }));
    }
  };

  // Handle reference field changes
  const handleReferenceChange = (key, value, index) => {
    // Since this is preview mode, we generally don't need to update references
    // But we'll keep this logic in case we need it
    setFormData((prevData) => {
      const updatedReferences = [...prevData.references];

      // Extract the base field name from the reference field key
      const refKey = key;

      // Make sure the reference object at this index exists
      if (!updatedReferences[index]) {
        updatedReferences[index] = {};
      }

      // Update the specific field in this reference
      updatedReferences[index] = {
        ...updatedReferences[index],
        [refKey]: value,
      };

      return {
        ...prevData,
        references: updatedReferences,
        error: {
          ...prevData.error,
          [`references_${index}_${refKey}`]: "",
        },
      };
    });
  };

  useEffect(() => {
    if (searchedOption?.id) {
      setFormData({
        ...formData,
        city: searchedOption.city,
        state: searchedOption.state_name,
        zip_code: searchedOption.zip_code,
        location: searchedOption.id,
      });
    }
  }, [searchedOption.id]);

  // Handle form submission - mostly disabled in preview mode
  const handleSubmit = async () => {
    // In preview mode, we might want to navigate elsewhere or show a message
    toast.info("This is a preview mode. Form submission is disabled.");
  };

  // Handle cancel
  const handleCancel = () => {
    // In preview mode, just navigate back
    navigate(-1);
  };

  // Don't need to handle signature in preview mode
  const handleSignatureEnd = () => {
    // No-op in preview mode
  };

  const handleClearSignature = () => {
    // No-op in preview mode
  };

  // Toggle section expand/collapse
  const handleSectionToggle = (index) => {
    const newSections = [...formSections];
    newSections[index].expanded = !newSections[index].expanded;
    setFormSections(newSections);
  };

  // Add another reference - disabled in preview mode
  const handleAddReference = () => {
    toast.info("This is preview mode. Adding references is disabled.");
  };

  // Remove a reference - disabled in preview mode
  const handleRemoveReference = (index) => {
    toast.info("This is preview mode. Removing references is disabled.");
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLanguagesLoading || isProfileInfoLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div className="p-3 m-3 bg-white drop-shadow-xl rounded-xl">
        <RequestFormHeader userData={userData} />

        <Grid2 container spacing={3} className={" !m-4"}>
          {formSections.map((section, sectionIndex) => (
            <Grid2 item xs={12} key={`section-${sectionIndex}`}>
              <CustomAccordian
                title={section.title}
                defaultValue={section.expanded}
                handleToggle={() => handleSectionToggle(sectionIndex)}
                children={
                  section.isReference ? (
                    // References section
                    <div>
                      {formData.references.map((reference, refIndex) => (
                        <Box
                          key={`ref-${refIndex}`}
                          sx={{ my: 5, position: "relative" }}
                        >
                          <EquipmentFormFields
                            fields={updatedReferenceFields}
                            formData={{
                              first_name: reference.first_name,
                              last_name: reference.last_name,
                              email: reference.email,
                              phone_number: reference.phone_number,
                              relationship: reference.relationship,
                            }}
                            handleChange={(key, value) =>
                              handleReferenceChange(key, value, refIndex)
                            }
                          />
                        </Box>
                      ))}
                    </div>
                  ) : section.isSignature ? (
                    // Signature section
                    <div ref={containerRef}>
                      <SignatureCanvas
                        ref={signatureRef}
                        penColor="black"
                        canvasProps={{
                          width: containerRef.current?.offsetWidth,
                          height: 200,
                          className: "signature-canvas",
                          style: {
                            border: "1px dashed #eee",
                            backgroundColor: "#1D5BBF0D",
                          },
                        }}
                        onEnd={handleSignatureEnd}
                      />

                      {formData.error.documents && (
                        <Typography color="error" variant="caption">
                          {formData.error.documents}
                        </Typography>
                      )}

                      <Box sx={{ mt: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handleClearSignature}
                        >
                          Clear Signature
                        </Button>
                      </Box>
                    </div>
                  ) : (
                    // Regular sections
                    <EquipmentFormFields
                      fields={section.fields}
                      searchBar={searchBar}
                      setSearchedOption={setSearchedOption}
                      addressFieldData={addressFieldData}
                      isLoading={isLoading}
                      formData={{ ...formData, error: formData.error }}
                      handleChange={handleFieldChange}
                    />
                  )
                }
              />
            </Grid2>
          ))}
          <Grid2 Grid2 item xs={12}>
            <div className="mb-6 flex items-center ml-5">
              <FormControlLabel
                disabled
                checked={checked}
                onChange={handleChange}
                control={<Checkbox />}
                label={"I agree to the"}
                labelPlacement="right"
                sx={{ mr: 1 }}
              />

              <span
                className="cursor-pointer"
                onClick={() => setIsTCOpen(true)}
                style={{
                  color: "rgba(29, 91, 191, 1)",
                  textDecoration: "underline",
                  fontWeight: 600,
                }}
              >
                Terms & Conditions
              </span>
            </div>
          </Grid2>
          <Grid2 Grid2 item xs={12}>
            <Box
              sx={{
                my: 4,
                display: "flex",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <Button variant="outlined" color="error" onClick={handleCancel}>
                Reject
              </Button>

              <Button
                color="success"
                variant="contained"
                disabled={!checked}
                onClick={handleSubmit}
              >
                {userData?.interview_status === "mail_sent"
                  ? "Mark as Selected"
                  : userData?.bg_status === "not_started"
                  ? "Start BG Verification"
                  : userData?.approve_status === "pending"
                  ? "Approve"
                  : "Review"}
              </Button>
              <Button
                color="success"
                variant="contained"
                disabled={!checked}
                onClick={() => handleSubmit()}
              >
                Verify
              </Button>
            </Box>
          </Grid2>
        </Grid2>
        <MuiCustomModal open={isPopupOpen} maxWidth={"sm"}>
          <div className="flex justify-center">
            <img
              className="w-10 h-10 mt-6 mb-4"
              src={email_notify_icon}
              alt="email_notify_icon"
            />
          </div>

          <p className="text-center text-lg mb-10">
            {
              "Thank you for completing our Mentor application. A team member will be in contact with you soon."
            }
          </p>
        </MuiCustomModal>
        <MuiCustomModal
          open={isTCOpen}
          maxWidth={"sm"}
          dialogTitle={"Terms & Conditions"}
          actionButtons={[
            {
              color: "inherit",
              variant: "outlined",
              children: "Close",
              onClick: () => setIsTCOpen(false),
            },
          ]}
          handleClose={() => setIsTCOpen(false)}
        >
          <p className="text-lg mb-10">
            1.    The references I listed will be contacted. <br />
            2.    Other youth organizations where I have worked or volunteered
            may be contacted as references.
            <br /> 3.    The information I provided will be used to conduct a
            background check, to include criminal background, sexual offender,
            and child abuse registry checks and other records where required by
            local, state, or federal law for certain individuals who may
            interact with participating minors.
            <br /> 4.     The mentoring program is not obligated to provide a
            reason for its decision in accepting or rejecting my application to
            be a mentor.
            <br /> 5.    The completion of this volunteer application does not
            obligate me to perform any volunteer services.
            <br /> 6.    The mentoring program is not obligated to match me with
            a youth.
            <br /> 7.    I am required to follow all mentoring program
            guidelines and policies and understand that any violation will
            result in suspension and/or termination of the mentoring
            relationship.
            <br /> By signing this document, I am agreeing to all the statements
            above and certify that all elements of the personal data I have
            provided are true, accurate, and complete. I understand and agree
            that any omission, false statement, misleading statement, or answer
            made by me on my application or any supplements to it or in any
            interviews will be sufficient grounds for rejection for
            consideration as a volunteer.
          </p>
        </MuiCustomModal>
      </div>
    </>
  );
}

export default RequestFormPreview;
