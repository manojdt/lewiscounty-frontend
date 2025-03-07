import React, { useEffect, useState } from "react";
import CustomAccordian from "../../shared/CustomAccordian/CustomAccordian";
import { EquipmentFormFields } from "../formFields/formFields";
import { Backdrop, Box, Stack } from "@mui/material";
import {
  debounce,
  formFieldData,
} from "./HelpFunction";
import { Button } from "../../shared";
import { useDispatch, useSelector } from "react-redux";
import { getProgramAddressDetails } from "../../services/programInfo";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import SuccessTik from "../../assets/images/menteequestionsuccess.png";
import { useUpdateMenteeQuestionsMutation } from "../../features/login/loginapi.services";
import { useGetLanguageListQuery } from "../../features/questions/questionsapi.service";
import { updateMenteeQuestionform } from "../../services/loginInfo";
export const MenteeSubmitForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.userInfo);
  const [searchedOption, setSearchedOption] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [sucessPopup, setsucessPopup] = useState(false);
  const [addressFieldData, setAddressFieldData] = useState([]);
  const [fieldData, setFieldData] = useState(formFieldData);
  const [addressState, setAddressState] = useState("");
  const searchBar = React.useRef(null);
  const [otherLanguageOptions, setOtherLanguageOptions] = useState([]);

  // const [updateMenteeQuestions] = useUpdateMenteeQuestionsMutation();
  // const { data: languagesData, isLoading: isLanguagesLoading } =
  //   useGetLanguageListQuery();
  const [formData, setFormData] = React.useState({
    youth_first_name: "",
    youth_last_name: "",
    youth_dob: "",
    youth_gender: "",
    youth_street_address: "",
    youth_state: "",
    youth_city: "",
    youth_zipcode: "",
    youth_phone_number: "",
    youth_school: "",
    youth_grade: "",
    youth_preferred_language: "",
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
    parent_zipcode: "",
    parent_phone: "",
    parent_marital_status: "",
    error: {
      youth_first_name: "",
      youth_last_name: "",
      // youth_dob: "",
      // youth_gender: "",
      // youth_street_address: "",
      // youth_phone_number: "",
      // youth_zip_code:'',
      // youth_city:'',
      // youth_state:'',
      // youth_preferred_language: "",
      // referrer_first_name: "",
      // referrer_last_name: "",
      // referrer_phone: "",
      // referrer_email: "",
      // youth_living_with: "",
      // referrer_relationship: "",
      // parent_first_name: "",
      // parent_last_name: "",
      // parent_street_address: "",
      // parent_state: "",
      // parent_city: "",
      // parent_zip_code: "",
      // parent_phone: "",
    },
  });
  const constructResponse = () => {
    const preferred_languages = [
      ...(Array.isArray(formData.youth_preferred_language)
        ? formData.youth_preferred_language
        : [formData.youth_preferred_language]),
      ...(Array.isArray(formData.youth_other_language)
        ? formData.youth_other_language
        : [formData.youth_other_language]),
    ].filter((lang) => lang && lang !== "other");
    // console.log(preferred_languages, "preferred_languages");
    const res = {
      user: userInfo?.data?.user_id,
      first_name: formData?.youth_first_name,
      last_name: formData?.youth_last_name,
      // email: formData?.youth_,
      phone_number: formData?.youth_phone_number,
      dob:formData.youth_dob? moment(formData.youth_dob).format("YYYY-MM-DD"):null,
      gender: formData.youth_gender,
      // current_education: formData.youth_grade,
      school: formData?.youth_school,
      grade: formData.youth_grade,
      preferred_languages: preferred_languages,
      Ethncity: [formData.youth_ethnicity],
      street_address: formData?.youth_street_address,
      mentee_location: formData.youth_location,

      mentee_referrers: [
        {
          first_name: formData?.referrer_first_name,
          last_name: formData?.referrer_last_name,
          phone_number: formData?.referrer_phone,
          email: formData?.referrer_email,
          living_with: formData?.youth_living_with,
          relationship: formData.referrer_relationship,
          referral_reason: formData?.referrer_benefit_reason,
        },
      ],
      mentee_guardian: [
        {
          first_name: formData.parent_first_name,
          last_name: formData?.parent_last_name,
          street_address: formData?.parent_street_address,
          phone_number: formData?.parent_phone,
          marital_status: formData?.parent_marital_status,
          guardian_location: formData?.guardian_location,
        },
      ],
    };
    return res;
  };
  const handleValidate = () => {
    const error = formData?.error || {};
    let isValid = true;

    // Youth Information Validation
    if (!formData?.youth_first_name?.trim()) {
      isValid = false;
      error.youth_first_name = "Youth First Name is Required";
    } else {
      delete error.youth_first_name;
    }

    if (!formData?.youth_last_name?.trim()) {
      isValid = false;
      error.youth_last_name = "Youth Last Name is Required";
    } else {
      delete error.youth_last_name;
    }

    // Referrer Information Validation
    if (!formData?.referrer_first_name?.trim()) {
      isValid = false;
      error.referrer_first_name = "Referrer First Name is Required";
    } else {
      delete error.referrer_first_name;
    }

    if (!formData?.referrer_last_name?.trim()) {
      isValid = false;
      error.referrer_last_name = "Referrer Last Name is Required";
    } else {
      delete error.referrer_last_name;
    }
    if (formData?.referrer_email?.trim()) {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.referrer_email)) {
        isValid = false;
        error.referrer_email = "Invalid Email Format";
      }
    }
    // Parent Information Validation
    if (!formData?.parent_first_name?.trim()) {
      isValid = false;
      error.parent_first_name = "Parent First Name is Required";
    } else {
      delete error.parent_first_name;
    }

    if (!formData?.parent_last_name?.trim()) {
      isValid = false;
      error.parent_last_name = "Parent Last Name is Required";
    } else {
      delete error.parent_last_name;
    }

    // Update form data with errors
    setFormData({
      ...formData,
      error: error,
    });

    return isValid;
  };
  const debouncedAddressFieldApi = React.useCallback(
    debounce((value, fieldName) => {
      if (!!value) {
        dispatch(getProgramAddressDetails({ id: value, fieldName: fieldName }))
          .then((response) => {
            // Always set loading to false when API call completes
            setLoading(false);

            if (!!response?.payload?.data?.length) {
              setAddressFieldData(response?.payload?.data);
            } else {
              // Clear address field data if no results
              setAddressFieldData([]);
            }
          })
          .catch((error) => {
            // Important: Always set loading to false even if there's an error
            console.error("API call error:", error);
            setLoading(false);
            setAddressFieldData([]);
          });
      } else {
        // If no value, reset loading state and clear data
        setLoading(false);
        setAddressFieldData([]);
      }
    }, 500),
    [dispatch]
  );

  useEffect(() => {
    if (searchedOption?.id && addressState) {
      setFormData((prevFormData) => {
        if (addressState === "youth_location") {
          return {
            ...prevFormData,
            youth_city: searchedOption.city,
            youth_state: searchedOption.state_name,
            youth_zip_code: searchedOption.zip_code,
            [addressState]: searchedOption.id,
          };
        } else {
          return {
            ...prevFormData,
            parent_city: searchedOption.city,
            parent_state: searchedOption.state_name,
            parent_zip_code: searchedOption.zip_code,
            [addressState]: searchedOption.id,
          };
        }
      });

      // Reset address-related states
      setAddressState("");
      if (searchBar.current) {
        searchBar.current = null;
      }
    }
  }, [searchedOption.id]);
  const updateState = (key, value, event) => {
    // Mapping for consistent key names
    const keyMappings = {
      state: "youth_state",
      city: "youth_city",
      zip_code: "youth_zip_code",
      parent_state: "parent_state",
      parent_city: "parent_city",
      parent_zip_code: "parent_zip_code",
    };

    const mappedKey = keyMappings[key] || key;

    if (
      [
        "youth_state",
        "youth_city",
        "youth_zipc_ode",
        "parent_state",
        "parent_city",
        "parent_zip_code",
      ].includes(mappedKey)
    ) {
      if (!document.getElementById("fields_overlay") && value) {
        searchBar?.current?.toggle(event);
      }

      setLoading(true);

      const locationState = mappedKey.startsWith("youth_")
        ? "youth_location"
        : "guardian_location";

      setAddressState(locationState);

      // Use the original key for API call
      const apiKey = mappedKey.startsWith("youth_")
        ? key.replace("youth_", "")
        : key.replace("parent_", "");
      debouncedAddressFieldApi(value, apiKey);
    }
    if (mappedKey === "youth_preferred_languag") {
      // Get the current value as an array
      const currentLanguages = Array.isArray(formData[mappedKey])
        ? [...formData[mappedKey]]
        : formData[mappedKey]
        ? [formData[mappedKey]]
        : [];

      // Check if value already exists in the array
      const valueIndex = currentLanguages.indexOf(value);

      // Toggle the value
      if (valueIndex > -1) {
        // Remove if exists
        currentLanguages.splice(valueIndex, 1);
      } else {
        // Add if doesn't exist
        currentLanguages.push(value);
      }

      setFormData((prevFormData) => ({
        ...prevFormData,
        [mappedKey]: currentLanguages,
        error: {
          ...prevFormData.error,
          [mappedKey]: "",
        },
      }));
    } else {
      // Handle other fields normally
      setFormData((prevFormData) => ({
        ...prevFormData,
        [mappedKey]: value,
        error: {
          ...prevFormData.error,
          [mappedKey]: "",
        },
      }));
    }
  };
  const handleSubmit =async () => {
    console.log(formData);
    if (handleValidate()) {
      const res = constructResponse();
      console.log(res, "res");
      dispatch(updateMenteeQuestionform(res)).then((response)=>{
        console.log(response,"response")
        if (response.payload.status===201) {
          setsucessPopup(true);
        }
      })
    }
  };
  const handleLogout = () => {
    localStorage.clear();
    dispatch({ type: "logout" });
    navigate("/login");
  };
  useEffect(() => {
    // If any completion state (success or error) is true, show the backdrop
    if (sucessPopup) {
      // Set timeout to handle cleanup after 3 seconds
      const timer = setTimeout(() => {
        // Reset all states
        setsucessPopup(false);
        handleLogout()
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [sucessPopup]);
  const handleDeleteFile = (key, id) => {
    setFormData({
      ...formData,
      [key]: "",
      // formData[key]?.filter((e, i) => i !== id)
    });
  };

  // Handle language change to show/hide other language field
  useEffect(() => {
    const updateLanguageFields = async () => {
      // Check if "other" is one of the selected languages
      const hasOtherLanguage = Array.isArray(formData.youth_preferred_language)
        ? formData.youth_preferred_language.includes("other")
        : formData.youth_preferred_language === "other";

      // Get the latest field data with dynamic language options
      const currentFieldData = [...fieldData];

      if (hasOtherLanguage) {
        try {
          // Create other language options - you can use the same language list or a different one
          const otherLanguagesList =
          //  languagesData ? 
          //   languagesData.filter(lang => {
          //     // Filter out languages that might be better as "other" options
          //     // This is optional and depends on your requirements
          //     return true;
          //   }).map(lang => ({
          //     label: lang.name || lang.label,
          //     value: lang.code || lang.value,
          //   })) : 
            [
              { label: "French", value: "french" },
              { label: "Mandarin", value: "mandarin" },
              { label: "Arabic", value: "arabic" },
              { label: "Hindi", value: "hindi" },
              { label: "Portuguese", value: "portuguese" },
              { label: "Russian", value: "russian" },
              { label: "Japanese", value: "japanese" },
              { label: "German", value: "german" },
            ];

          // Create the updated field data
          const updatedFieldData = currentFieldData.map((section) => {
            if (section.title === "Youth Information") {
              const languageFieldIndex = section.fields.findIndex(
                (field) => field.key === "youth_preferred_language"
              );

              // Only add the other language field if it doesn't already exist
              if (
                !section.fields.some(
                  (field) => field.key === "youth_other_language"
                )
              ) {
                const newFields = [
                  ...section.fields.slice(0, languageFieldIndex + 1),
                  {
                    type: "multiSelect",
                    label: "Specify Other Language",
                    isRequired: true,
                    col: 6,
                    isMultiSelect: true,
                    key: "youth_other_language",
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

          setFieldData(updatedFieldData);
        } catch (error) {
          console.error("Failed to update other language options", error);
        }
      } else {
        // If "other" is not selected, remove the other language field
        const revertedFieldData = currentFieldData.map((section) => {
          if (section.title === "Youth Information") {
            // Filter out the other language field if it exists
            const newFields = section.fields.filter(
              (field) => field.key !== "youth_other_language"
            );

            return { ...section, fields: newFields };
          }
          return section;
        });

        setFieldData(revertedFieldData);

        // Clear other language value when not selected
        setFormData((prev) => ({
          ...prev,
          youth_other_language: "",
        }));
      }
    };

    updateLanguageFields();
  }, [formData.youth_preferred_language]);
  useEffect(() => {
    if (userInfo && userInfo.data && Object.keys(userInfo.data).length) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        youth_first_name: userInfo.data.first_name,
        youth_last_name: userInfo.data.last_name,
      }));
    }
  }, [userInfo]);
  return (
    <div>
      {" "}
      <div className="mt-6 pl-6">
        <p className="font-bold">Mentee Referral</p>
      </div>
      {/* <div style={{ boxShadow: "4px 4px 25px 0px rgba(0, 0, 0, 0.15)" }}> */}
        <Box
          className="bg-[#fff] rounded-[10px]"
          sx={{
           boxShadow: "4px 4px 25px 0px rgba(0, 0, 0, 0.15)",
            padding: "10px 20px",
            margin: "30px 30px 30px 30px",
          }}
        >
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
                      handleChange={updateState}
                      handleDeleteFile={handleDeleteFile}
                      addressFieldData={addressFieldData}
                      isLoading={isLoading}
                      searchBar={searchBar}
                      setSearchedOption={setSearchedOption}
                    />
                  }
                  defaultValue={true}
                />
              );
            })}
          </Stack>

          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"center"}
            width={"100%"}
            spacing={2}
            mt={2}
          >
            <Button
              btnCategory={"secondary"}
              btnName="Cancel"
              // onClick={() => navigate(-1)}
            />
            <Button
              btnCategory={"primary"}
              btnName="Submit"
              onClick={() => handleSubmit()}
            />
          </Stack>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={sucessPopup}
          >
            <div className="px-5 py-1 flex justify-center items-center">
              <div
                className="flex justify-center items-center flex-col gap-[2.25rem] py-[4rem] px-[3rem] mt-20 mb-20"
                style={{ background: "#fff", borderRadius: "10px" }}
              >
                <img src={SuccessTik} alt="SuccessTik" />
                <p
                  className="text-[16px] text-black font-semibold bg-clip-text"
                  style={{
                    fontWeight: 600,
                  }}
                >
                  {"You're all set"}
                </p>
                <p
                  className="text-[16px] text-black font-semibold bg-clip-text"
                  style={{
                    fontWeight: 400,
                  }}
                >
                  {"Thank you for completing our application. A team member will be in contact with you"}
                </p>
              </div>
            </div>
          </Backdrop>
        </Box>
      {/* </div> */}
    </div>
  );
};
