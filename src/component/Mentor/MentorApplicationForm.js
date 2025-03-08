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
import {
  MentorFormData,
  MentorFormSection,
  ReferenceFields,
} from "./MentorFormFields";
import { MuiCustomModal } from "../../shared/Modal/MuiCustomModal";
import { useNavigate } from "react-router-dom";
import email_notify_icon from "../../assets/icons/email_notify_icon.svg";
import {
  useGetLanguageListQuery,
  useUpdateUserInfoPostMutation,
} from "../../features/questions/questionsapi.service";
import { useDispatch, useSelector } from "react-redux";
import { getProgramAddressDetails } from "../../services/programInfo";
import moment from "moment";
import { updateUserInfo } from "../../services/loginInfo";

export function MentorApplicationForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userInfo);
  const userData = userInfo?.data || {};
  const containerRef = useRef();
  const [updateUserInfoPost] = useUpdateUserInfoPostMutation();
  const { data: languagesData, isLoading: isLanguagesLoading } =
    useGetLanguageListQuery();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isTCOpen, setIsTCOpen] = useState(false);
  const [searchedOption, setSearchedOption] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [addressFieldData, setAddressFieldData] = useState([]);
  const [checked, setChecked] = React.useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  const [loading, setLoading] = useState(false);
  const signatureRef = useRef(null);
  const searchBar = useRef(null);

  // State for main form data
  const [formData, setFormData] = useState(MentorFormData);
  console.log("formData", formData);
  // Form field definitions
  const [formSections, setFormSections] = useState(MentorFormSection);

  useEffect(() => {
    if (userInfo && userInfo.data && Object.keys(userInfo.data).length) {
      setFormData((prevData) => ({
        ...prevData,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        phone_number: userData?.userinfo?.phone_number,
        gender: userData?.userinfo?.gender,
      }));
    }
  }, [userInfo]);

  useEffect(() => {
    const updateLanguageFields = async () => {
      // Check if "other" is one of the selected languages
      const hasOtherLanguage = Array.isArray(formData.languages_known)
        ? formData.languages_known.includes("other")
        : formData.languages_known === "other";

      // Get the latest field data with dynamic language options
      const currentFieldData = [...formSections];

      if (hasOtherLanguage) {
        try {
          // Create other language options - you can use the same language list or a different one
          const otherLanguagesList = languagesData.map((lang) => ({
            label: lang.name,
            value: lang.name,
          }));

          // Create the updated field data
          const updatedFieldData = currentFieldData.map((section) => {
            if (section.title === "Personal Information") {
              const languageFieldIndex = section.fields.findIndex(
                (field) => field.key === "languages_known"
              );

              // Only add the other language field if it doesn't already exist
              if (
                !section.fields.some((field) => field.key === "other_language")
              ) {
                const newFields = [
                  ...section.fields.slice(0, languageFieldIndex + 1),
                  {
                    type: "multiSelect",
                    label: "Specify Other Language",
                    isRequired: true,
                    col: 2,
                    isMultiSelect: true,
                    key: "other_language",
                    options: otherLanguagesList,
                  },
                  ...section.fields.slice(languageFieldIndex + 1),
                ];

                return {
                  ...section,
                  fields: newFields,
                };
              }
            }
            return section;
          });

          setFormSections(updatedFieldData);
        } catch (error) {
          console.error("Failed to update other language options", error);
        }
      } else {
        // If "other" is not selected, remove the other language field
        const revertedFieldData = currentFieldData.map((section) => {
          if (section.title === "Personal Information") {
            // Filter out the other language field if it exists
            const newFields = section.fields.filter(
              (field) => field.key !== "other_language"
            );

            return { ...section, fields: newFields };
          }
          return section;
        });

        setFormSections(revertedFieldData);

        // Clear other language value when not selected
        setFormData((prev) => ({
          ...prev,
          languages_known: "",
        }));
      }
    };

    updateLanguageFields();
  }, [formData.languages_known, languagesData]);

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

  // Handle form field changes
  const handleFieldChange = (key, value, event) => {
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
    setFormData((prevData) => {
      const updatedReferences = [...prevData.references];

      // Extract the base field name from the reference field key
      // The key will be in format "ref_fieldname" like "ref_name" or "ref_email"
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

  // Handle validation
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Validate personal information
    if (!formData.first_name) {
      newErrors.first_name = "First name is required";
      isValid = false;
    }

    if (!formData.last_name) {
      newErrors.last_name = "Last name is required";
      isValid = false;
    }
    if (!formData.dob) {
      newErrors.dob = "Date of Birth is required";
      isValid = false;
    }
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    // Validate signature
    if (!formData.documents) {
      newErrors.documents = "Signature is required";
      isValid = false;
    }

    setFormData((prevData) => ({
      ...prevData,
      error: newErrors,
    }));

    return isValid;
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

  // Handle form submission
  const handleSubmit = async () => {
    const isValid = validateForm();
    if (isValid) {
      setLoading(true);
      const { state, city, zip_code, ...data } = formData;
      try {
        // Format data for submission
        // Format data for submission
        const payload = new FormData();
        // Append personal information
        Object.keys(data).forEach((key) => {
          // Skip special keys and empty values
          if (
            key !== "references" &&
            key !== "error" &&
            key !== "documents" &&
            key !== "other_language" && // Skip other_language as we'll handle it with languages_known
            data[key] !== undefined &&
            data[key] !== null &&
            data[key] !== "" &&
            // Add check for empty arrays
            !(Array.isArray(data[key]) && data[key].length === 0)
          ) {
            if (key === "dob") {
              payload.append(key, moment(data[key]).format("YYYY-MM-DD"));
            } else if (key === "languages_known") {
              // Handle languages specially
              const preferred_languages = [
                ...(Array.isArray(data.languages_known)
                  ? data.languages_known
                  : [data.languages_known]),
                ...(Array.isArray(data.other_language)
                  ? data.other_language
                  : [data.other_language]),
              ].filter((lang) => lang && lang !== "other");
              // Only append if the filtered list has items
              if (preferred_languages.length > 0) {
                payload.append(key, JSON.stringify(preferred_languages));
              }
            } else {
              // Handle all other fields normally
              payload.append(key, data[key]);
            }
          }
        });

        // Filter out empty values from each reference object
        const filteredReferences = data.references
          .map((reference) => {
            const filteredReference = {};
            Object.keys(reference).forEach((key) => {
              if (
                reference[key] !== undefined &&
                reference[key] !== null &&
                reference[key] !== ""
              ) {
                filteredReference[key] = reference[key];
              }
            });
            return filteredReference;
          })
          .filter((reference) => Object.keys(reference).length > 0); // Remove empty objects

        // Stringify the entire array and append it to the payload
        if (filteredReferences.length > 0) {
          payload.append("references", JSON.stringify(filteredReferences));
        }

        // If there's a documents, convert it to blob and append
        if (signatureRef.current) {
          const signatureDataURL = signatureRef.current.toDataURL();
          const signatureBlob = await fetch(signatureDataURL).then((r) =>
            r.blob()
          );
          payload.append("documents", signatureBlob, "signature.png");
        }
        // for (let [key, value] of payload.entries()) {
        //   console.log(`formData: ${key}: ${value}`);
        // }
        // Make the API call and wait for it to complete
        const response = await updateUserInfoPost(payload).unwrap();

        // Update the Redux store with the new data
        await dispatch(updateUserInfo({ data: response }));

        // Show success popup
        setIsPopupOpen(true);
        toast.success("Application submitted successfully!");

        // Use setTimeout to allow Redux to complete its update
        setTimeout(() => {
          setLoading(false);
          setIsPopupOpen(false); // Close popup

          // Get the latest user data from userData selector
          // This will have the updated values after the dispatch
          const isCompleted = userData?.userinfo?.is_questions_completed;
          const hasFileUpload = userData?.userinfo?.mentor_file_upload;

          // Navigate if both conditions are met
          if (isCompleted && hasFileUpload) {
            navigate("/dashboard");
          } else {
            toast.info(
              "Application submitted. Additional steps may be required."
            );
          }
        }, 2000);
      } catch (error) {
        toast.error("Error submitting application. Please try again.");
        setLoading(false);
      }
    } else {
      toast.error("Please complete all required fields.");
      // Auto-expand sections with errors
      const newSections = [...formSections];

      // Check personal information errors
      if (newSections[0]) {
        const personalInfoFields =
          formSections[0].fields?.map((field) => field.key) || [];
        const hasPersonalInfoErrors = Object.keys(formData.error).some((key) =>
          personalInfoFields.includes(key)
        );
        if (hasPersonalInfoErrors) {
          newSections[0].expanded = true;
        }
      }

      // Check reference errors
      if (newSections[3]) {
        const hasReferenceErrors = Object.keys(formData.error).some((key) =>
          key.startsWith("references_")
        );
        if (hasReferenceErrors) {
          newSections[3].expanded = true;
        }
      }

      // Check signature error
      if (newSections[4] && formData.error.signature) {
        newSections[4].expanded = true;
      }
      setFormSections(newSections);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    // Navigate back or reset form
    if (
      window.confirm(
        "Are you sure you want to cancel? All your data will be lost."
      )
    ) {
      navigate("/login-type");
    }
  };

  // Handle documents save
  const handleSignatureEnd = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      setFormData((prevData) => ({
        ...prevData,
        documents: signatureRef.current.toDataURL(),
        error: {
          ...prevData.error,
          documents: "",
        },
      }));
    }
  };

  // Handle documents clear
  const handleClearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setFormData((prevData) => ({
        ...prevData,
        documents: null,
      }));
    }
  };

  // Toggle section expand/collapse
  const handleSectionToggle = (index) => {
    const newSections = [...formSections];
    newSections[index].expanded = !newSections[index].expanded;
    setFormSections(newSections);
  };

  // Add another reference
  const handleAddReference = () => {
    if (formData.references.length < 5) {
      setFormData((prevData) => ({
        ...prevData,
        references: [
          ...prevData.references,
          {
            first_name: "",
            last_name: "",
            email: "",
            phone_number: "",
            relationship: "",
          },
        ],
      }));
    } else {
      toast.warning("Maximum 5 references allowed.");
    }
  };

  // Remove a reference
  const handleRemoveReference = (index) => {
    if (formData.references.length > 1) {
      setFormData((prevData) => {
        const newReferences = [...prevData.references];
        newReferences.splice(index, 1);
        return {
          ...prevData,
          references: newReferences,
        };
      });
    } else {
      toast.warning("At least one reference is required.");
    }
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading || isLanguagesLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div className="p-3 m-3">
        <Typography
          variant="h6"
          sx={{ mb: 3, ml: 2.5, fontWeight: 600, color: "rgba(24, 40, 61, 1)" }}
        >
          Mentor application
        </Typography>

        <Grid2
          container
          spacing={3}
          className={"bg-white drop-shadow-xl rounded-xl !m-4"}
        >
          {formSections &&
            formSections?.length &&
            formSections?.map((section, sectionIndex) => (
              <Grid2 item xs={12} key={`section-${sectionIndex}`}>
                <CustomAccordian
                isRequired={section?.isRequired}
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
                            {formData.references.length > 1 && (
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                sx={{ position: "absolute", right: 0, top: 0 }}
                                onClick={() => handleRemoveReference(refIndex)}
                              >
                                Remove
                              </Button>
                            )}

                            <EquipmentFormFields
                              fields={ReferenceFields}
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
                        <div className="flex justify-end">
                          <Button
                            variant="text"
                            startIcon={<AddIcon />}
                            onClick={handleAddReference}
                            sx={{ mt: 2, ml: "auto" }}
                          >
                            Add
                          </Button>
                        </div>
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
              <Button
                variant="outlined"
                sx={{
                  color: "grey.700",
                  borderColor: "grey.300",
                  "&:hover": {
                    borderColor: "grey.400",
                    backgroundColor: "grey.50",
                  },
                }}
                onClick={handleCancel}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                disabled={!checked}
                sx={{
                  backgroundColor: "#2185d0",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#1678c2",
                  },
                }}
                onClick={handleSubmit}
              >
                Submit Application
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

export default MentorApplicationForm;
