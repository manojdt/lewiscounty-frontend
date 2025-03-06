import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Backdrop,
  Typography,
  FormControlLabel,
  Checkbox,
  Grid,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  TextField,
  Paper,
  IconButton,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import SignatureCanvas from "react-signature-canvas";
import CustomAccordian from "../../shared/CustomAccordian/CustomAccordian";
import { EquipmentFormFields } from "../formFields/formFields";
import { MuiCustomModal } from "../../shared/Modal/MuiCustomModal";
import { useNavigate } from "react-router-dom";
// import email_notify_icon from "../../assets/icons/email_notify_icon.svg";
import {
  useGetLanguageListQuery,
  useUpdateUserInfoPostMutation,
} from "../../features/questions/questionsapi.service";
import { useDispatch, useSelector } from "react-redux";
import { getProgramAddressDetails } from "../../services/programInfo";
import moment from "moment";
import { updateUserInfo } from "../../services/loginInfo";
import { MenteeFormData, MenteeFormSection } from "./HelpFunction";

export function MenteeApplicationAssismentForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userInfo);
  const userData = userInfo?.data || {};

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
  const youthSignatureRef = useRef(null);
  const parentSignatureRef = useRef(null);
  const searchBar = useRef(null);

  // State for main form data
  const [formData, setFormData] = useState(MenteeFormData);
  
  // Form field definitions
  const [formSections, setFormSections] = useState(MenteeFormSection);

  // Populate form with user data if available
  useEffect(() => {
    if (userInfo && userInfo.data && Object.keys(userInfo.data).length) {
      setFormData((prevData) => ({
        ...prevData,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        youth_phone: userData?.userinfo?.phone_number,
        parent_phone: userData?.userinfo?.parent_phone,
      }));
    }
  }, [userInfo]);

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
    // Handle special cases for different field types
    if (["state", "city", "zip_code"].includes(key)) {
      // Handle address fields
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

  // Handle dynamic field changes (for home members, friends, activities)
  const handleDynamicFieldChange = (groupKey, index, fieldKey, value) => {
    setFormData((prevData) => {
      const updatedGroup = [...prevData[groupKey]];
      
      // Make sure the item at this index exists
      if (!updatedGroup[index]) {
        updatedGroup[index] = {};
      }

      // Update the specific field in this item
      updatedGroup[index] = {
        ...updatedGroup[index],
        [fieldKey]: value,
      };

      return {
        ...prevData,
        [groupKey]: updatedGroup,
        error: {
          ...prevData.error,
          [`${groupKey}_${index}_${fieldKey}`]: "",
        },
      };
    });
  };

  // Add a new item to a dynamic field array
  const handleAddDynamicField = (groupKey, defaultItem = {}) => {
    setFormData((prevData) => ({
      ...prevData,
      [groupKey]: [...prevData[groupKey], { ...defaultItem }],
    }));
  };

  // Remove an item from a dynamic field array
  const handleRemoveDynamicField = (groupKey, index) => {
    if (formData[groupKey].length > 1) {
      setFormData((prevData) => {
        const updatedGroup = [...prevData[groupKey]];
        updatedGroup.splice(index, 1);
        return {
          ...prevData,
          [groupKey]: updatedGroup,
        };
      });
    } else {
      toast.warning("At least one item is required.");
    }
  };

  // Handle preference selection
  const handlePreferenceChange = (preferencePair, selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      preferences: {
        ...prevData.preferences,
        [preferencePair]: selectedOption,
      },
      error: {
        ...prevData.error,
        [`preferences_${preferencePair}`]: "",
      },
    }));
  };

  // Handle validation
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Validate required fields
    formSections.forEach(section => {
      if (section.fields) {
        section.fields.forEach(field => {
          if (field.isRequired && !formData[field.key] && field.type !== 'dynamic_support' && 
              field.type !== 'dynamic_friends' && field.type !== 'activity_rating' && 
              field.type !== 'preference_pairs' && field.type !== 'info_text') {
            newErrors[field.key] = `${field.label} is required`;
            isValid = false;
          }
        });
      }
    });

    // Validate signatures
    if (!formData.youth_signature) {
      newErrors.youth_signature = "Youth signature is required";
      isValid = false;
    }

    if (!formData.parent_signature) {
      newErrors.parent_signature = "Parent/Guardian signature is required";
      isValid = false;
    }

    setFormData((prevData) => ({
      ...prevData,
      error: newErrors,
    }));

    return isValid;
  };

  // Update form data when address is selected
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
      try {
        // Format data for submission
        const payload = new FormData();
        
        // Append general form data
        Object.keys(formData).forEach((key) => {
          // Skip special keys and empty values
          if (
            key !== "error" &&
            key !== "youth_signature" &&
            key !== "parent_signature" &&
            key !== "home_members" &&
            key !== "friends" &&
            key !== "activities" &&
            key !== "preferences" &&
            formData[key] !== undefined &&
            formData[key] !== null &&
            formData[key] !== ""
          ) {
            if (key === "dob") {
              payload.append(key, moment(formData[key]).format("YYYY-MM-DD"));
            } else if (Array.isArray(formData[key])) {
              payload.append(key, JSON.stringify(formData[key]));
            } else {
              payload.append(key, formData[key]);
            }
          }
        });

        // Append complex objects as JSON
        if (formData.home_members.length > 0) {
          payload.append("home_members", JSON.stringify(formData.home_members));
        }
        
        if (formData.friends.length > 0) {
          payload.append("friends", JSON.stringify(formData.friends));
        }
        
        if (formData.activities.length > 0) {
          payload.append("activities", JSON.stringify(formData.activities));
        }
        
        if (formData.preferences) {
          payload.append("preferences", JSON.stringify(formData.preferences));
        }

        // If there are signatures, convert them to blobs and append
        if (youthSignatureRef.current && !youthSignatureRef.current.isEmpty()) {
          const youthSignatureDataURL = youthSignatureRef.current.toDataURL();
          const youthSignatureBlob = await fetch(youthSignatureDataURL).then((r) => r.blob());
          payload.append("youth_signature", youthSignatureBlob, "youth_signature.png");
        }
        
        if (parentSignatureRef.current && !parentSignatureRef.current.isEmpty()) {
          const parentSignatureDataURL = parentSignatureRef.current.toDataURL();
          const parentSignatureBlob = await fetch(parentSignatureDataURL).then((r) => r.blob());
          payload.append("parent_signature", parentSignatureBlob, "parent_signature.png");
        }

        // Make the API call
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

          // Navigate if needed
          const isCompleted = userData?.userinfo?.is_questions_completed;
          const hasFileUpload = userData?.userinfo?.mentee_file_upload;

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
      
      Object.keys(formData.error).forEach(errorKey => {
        // Find which section contains this error
        for (let i = 0; i < formSections.length; i++) {
          const section = formSections[i];
          if (section.fields && section.fields.some(field => field.key === errorKey)) {
            newSections[i].expanded = true;
            break;
          }
          
          // Handle special cases for signatures
          if (errorKey === 'youth_signature' || errorKey === 'parent_signature') {
            // Find signature section
            const signatureSection = newSections.findIndex(section => section.isSignature);
            if (signatureSection !== -1) {
              newSections[signatureSection].expanded = true;
            }
          }
        }
      });
      
      setFormSections(newSections);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? All your data will be lost.")) {
      window.location.reload();
    }
  };

  // Handle youth signature save
  const handleYouthSignatureEnd = () => {
    if (youthSignatureRef.current && !youthSignatureRef.current.isEmpty()) {
      setFormData((prevData) => ({
        ...prevData,
        youth_signature: youthSignatureRef.current.toDataURL(),
        error: {
          ...prevData.error,
          youth_signature: "",
        },
      }));
    }
  };

  // Handle youth signature clear
  const handleClearYouthSignature = () => {
    if (youthSignatureRef.current) {
      youthSignatureRef.current.clear();
      setFormData((prevData) => ({
        ...prevData,
        youth_signature: null,
      }));
    }
  };

  // Handle parent signature save
  const handleParentSignatureEnd = () => {
    if (parentSignatureRef.current && !parentSignatureRef.current.isEmpty()) {
      setFormData((prevData) => ({
        ...prevData,
        parent_signature: parentSignatureRef.current.toDataURL(),
        error: {
          ...prevData.error,
          parent_signature: "",
        },
      }));
    }
  };

  // Handle parent signature clear
  const handleClearParentSignature = () => {
    if (parentSignatureRef.current) {
      parentSignatureRef.current.clear();
      setFormData((prevData) => ({
        ...prevData,
        parent_signature: null,
      }));
    }
  };

  // Toggle section expand/collapse
  const handleSectionToggle = (index) => {
    const newSections = [...formSections];
    newSections[index].expanded = !newSections[index].expanded;
    setFormSections(newSections);
  };

  // Render custom field types
  const renderCustomFields = (section, sectionIndex) => {
    if (section.isSignature) {
      return (
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Youth e-sign
              </Typography>
              <SignatureCanvas
                ref={youthSignatureRef}
                penColor="black"
                canvasProps={{
                  width: 500,
                  height: 200,
                  className: "signature-canvas",
                  style: {
                    border: "1px dashed #eee",
                    backgroundColor: "#F5F8FC",
                  },
                }}
                onEnd={handleYouthSignatureEnd}
              />
              {formData.error.youth_signature && (
                <Typography color="error" variant="caption">
                  {formData.error.youth_signature}
                </Typography>
              )}
              <Box sx={{ mt: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleClearYouthSignature}
                >
                  Clear Signature
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Parent/Guardian e-sign
              </Typography>
              <SignatureCanvas
                ref={parentSignatureRef}
                penColor="black"
                canvasProps={{
                  width: 500,
                  height: 200,
                  className: "signature-canvas",
                  style: {
                    border: "1px dashed #eee",
                    backgroundColor: "#F5F8FC",
                  },
                }}
                onEnd={handleParentSignatureEnd}
              />
              {formData.error.parent_signature && (
                <Typography color="error" variant="caption">
                  {formData.error.parent_signature}
                </Typography>
              )}
              <Box sx={{ mt: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleClearParentSignature}
                >
                  Clear Signature
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      );
    }

    // Otherwise use the standard field renderer with our standard fields
    return (
      <EquipmentFormFields
        fields={section.fields}
        searchBar={searchBar}
        setSearchedOption={setSearchedOption}
        addressFieldData={addressFieldData}
        isLoading={isLoading}
        formData={{ ...formData, error: formData.error }}
        handleChange={handleFieldChange}
      />
    );
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
          Lewis County Mentee Application
        </Typography>

        <Grid2
          container
          spacing={3}
          className={"bg-white drop-shadow-xl rounded-xl !m-4"}
        >
          {formSections.map((section, sectionIndex) => (
            <Grid2 item xs={12} key={`section-${sectionIndex}`}>
              <CustomAccordian
                title={section.title}
                defaultValue={section.expanded}
                handleToggle={() => handleSectionToggle(sectionIndex)}
                children={renderCustomFields(section, sectionIndex)}
              />
            </Grid2>
          ))}
          <Grid2 item xs={12}>
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
          <Grid2 item xs={12}>
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
        
        {/* Success Modal */}
      
        
        {/* Terms & Conditions Modal */}
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
            1. The information I provided will be used to help match me with an appropriate mentor.<br/>
            2. The mentoring program is not obligated to provide a reason for its decision in accepting or rejecting me for a mentor.<br/> 
            3. I understand that the program will conduct background checks on all potential mentees.<br/>
            4. I agree to follow all mentoring program guidelines and understand that any violation will result in suspension and/or termination of the mentoring relationship.<br/>
            5. I understand that the mentee program requires a minimum commitment of one year.<br/>
            6. I certify that all elements of the personal data I have provided are true, accurate, and complete.<br/>
            7. I understand that I am required to notify the program coordinator of any changes in my address, phone number, or other contact information.<br/>
            8. I agree to participate in regular surveys and evaluations related to the mentoring program.<br/>
            9. I understand that regular communication with my mentor and program staff is expected.<br/>
          </p>
        </MuiCustomModal>
      </div>
    </>
  );
}

export default MenteeApplicationAssismentForm;