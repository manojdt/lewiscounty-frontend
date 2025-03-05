import React, { useEffect, useState } from "react";
import CustomAccordian from "../../shared/CustomAccordian/CustomAccordian";
import { EquipmentFormFields } from "../formFields/formFields";
import { Box, Stack } from "@mui/material";
import { formFieldData, removeFirstUnderscoreWord } from "./HelpFunction";
import { Button } from "../../shared";
import { useDispatch } from "react-redux";
import { getProgramAddressDetails } from "../../services/programInfo";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { updateMenteeQuestionform } from "../../services/loginInfo";

export const MenteeSubmitForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchedOption, setSearchedOption] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [addressFieldData, setAddressFieldData] = useState([]);
  const [fieldData, setFieldData] = useState(formFieldData);
  const [addressState, setAddressState] = useState("");
  const searchBar = React.useRef(null);
  const [ethnicityOptions, setEthnicityOptions] = useState([]);
  const [otherLanguageOptions, setOtherLanguageOptions] = useState([]);
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
      youth_dob: "",
      youth_gender: "",
      youth_street_address: "",
      youth_phone_number: "",
      youth_preferred_language: "",
      referrer_first_name: "",
      referrer_last_name: "",
      referrer_phone: "",
      referrer_email: "",
      youth_living_with: "",
      referrer_relationship: "",
      parent_first_name: "",
      parent_last_name: "",
      parent_street_address: "",
      parent_state: "",
      parent_city: "",
      parent_zip_code: "",
      parent_phone: "",
    },
  });
  const constructResponse = () => {
    return  {
      // user: 1,
      first_name: formData?.youth_first_name,
      last_name: formData?.youth_last_name,
      // email: formData?.youth_,
      phone_number: formData?.youth_phone_number,
      dob: moment(formData.youth_dob).format("yyyy-mm-dd"),
      gender: formData.youth_gender,
      // current_education: formData.youth_grade,
      school: formData?.youth_school,
      grade: formData.youth_grade,
      preferred_languages: [formData?.youth_preferred_language],
      Ethncity: formData.youth_ethnicity,
      street_address: formData?.youth_street_address,
      location: formData.youth_location,

      mentee_referrers: [
        {
          first_name: formData?.referrer_first_name,
          last_name: formData?.referrer_last_name,
          phone_number: formData?.referrer_phone,
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
          location: formData?.guardian_location,
        },
      ],
    };
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

    if (!formData?.youth_dob) {
      isValid = false;
      error.youth_dob = "Date of Birth is Required";
    }
    //  else {
    //   // Optional: Add date validation
    //   const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    //   if (!dobRegex.test(formData.youth_dob)) {
    //     isValid = false;
    //     error.youth_dob = "Invalid Date Format (YYYY-MM-DD)";
    //   }
    // }

    if (!formData?.youth_gender?.trim()) {
      isValid = false;
      error.youth_gender = "Gender is Required";
    } else {
      delete error.youth_gender;
    }

    if (!formData?.youth_street_address?.trim()) {
      isValid = false;
      error.youth_street_address = "Street Address is Required";
    } else {
      delete error.youth_street_address;
    }

    if (!formData?.youth_phone_number?.trim()) {
      isValid = false;
      error.youth_phone_number = "Phone Number is Required";
    }
    // else {
    //   // Phone number validation (assuming US format)
    //   const phoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$/;
    //   if (!phoneRegex.test(formData.youth_phone_number)) {
    //     isValid = false;
    //     error.youth_phone_number = "Invalid Phone Number Format (e.g., (123) 456-7890)";
    //   }
    // }

    if (!formData?.youth_preferred_language?.trim()) {
      isValid = false;
      error.youth_preferred_language = "Preferred Language is Required";
    } else {
      delete error.youth_preferred_language;
    }

    if (!formData?.youth_living_with?.trim()) {
      isValid = false;
      error.youth_living_with = "Living Arrangement is Required";
    } else {
      delete error.youth_living_with;
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

    if (!formData?.referrer_phone?.trim()) {
      isValid = false;
      error.referrer_phone = "Referrer Phone Number is Required";
    }
    // else {
    //   // Phone number validation
    //   const phoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$/;
    //   if (!phoneRegex.test(formData.referrer_phone)) {
    //     isValid = false;
    //     error.referrer_phone = "Invalid Phone Number Format (e.g., (123) 456-7890)";
    //   }
    // }

    if (!formData?.referrer_email?.trim()) {
      isValid = false;
      error.referrer_email = "Referrer Email is Required";
    }
    // else {
    //   // Email validation
    //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //   if (!emailRegex.test(formData.referrer_email)) {
    //     isValid = false;
    //     error.referrer_email = "Invalid Email Format";
    //   }
    // }

    if (!formData?.referrer_relationship?.trim()) {
      isValid = false;
      error.referrer_relationship = "Referrer Relationship is Required";
    } else {
      delete error.referrer_relationship;
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

    if (!formData?.parent_street_address?.trim()) {
      isValid = false;
      error.parent_street_address = "Parent Street Address is Required";
    } else {
      delete error.parent_street_address;
    }

    if (!formData?.parent_state?.trim()) {
      isValid = false;
      error.parent_state = "State is Required";
    } else {
      delete error.parent_state;
    }

    if (!formData?.parent_city?.trim()) {
      isValid = false;
      error.parent_city = "City is Required";
    } else {
      delete error.parent_city;
    }

    if (!formData?.parent_zip_code?.trim()) {
      isValid = false;
      error.parent_zip_code = "Zip Code is Required";
    }
    // else {
    //   // Zip code validation (US format)
    //   const zipRegex = /^\d{5}(-\d{4})?$/;
    //   if (!zipRegex.test(formData.parent_zip_code)) {
    //     isValid = false;
    //     error.parent_zip_code = "Invalid Zip Code Format (e.g., 12345 or 12345-6789)";
    //   }
    // }

    if (!formData?.parent_phone?.trim()) {
      isValid = false;
      error.parent_phone = "Parent Phone Number is Required";
    }
    // else {
    //   // Phone number validation
    //   const phoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$/;
    //   if (!phoneRegex.test(formData.parent_phone)) {
    //     isValid = false;
    //     error.parent_phone = "Invalid Phone Number Format (e.g., (123) 456-7890)";
    //   }
    // }

    // Update form data with errors
    setFormData({
      ...formData,
      error: error,
    });

    return isValid;
  };
  const handleAddressfieldApi = (value, fieldName) => {
    if (!!value) {
      setTimeout(() => {
        dispatch(
          getProgramAddressDetails({ id: value, fieldName: fieldName })
        ).then((response) => {
          if (isLoading) {
            setLoading(false);
          }
          if (!!response?.payload?.data?.length) {
            setAddressFieldData(response?.payload?.data);
          }
        });
      }, 2000);
    }
  };
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
      handleAddressfieldApi(value, apiKey);
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [mappedKey]: value,
      error: {
        ...prevFormData.error,
        [mappedKey]: "",
      },
    }));
  };
  const handleSubmit = () => {
    console.log(formData);
    if (handleValidate()) {
      const res = constructResponse()
      console.log(res,"res")
      dispatch(updateMenteeQuestionform(res))
    }
  };
  const handleDeleteFile = (key, id) => {
    setFormData({
      ...formData,
      [key]: "",
      // formData[key]?.filter((e, i) => i !== id)
    });
  };
  useEffect(() => {
    const fetchEthnicityOptions = async () => {
      try {
        const response = [];
        // await dispatch(getEthnicityOptions());
        if (response?.payload?.data) {
          const options = response.payload.data.map((item) => ({
            label: item.name,
            value: item.id,
          }));
          setEthnicityOptions(options);

          // Update fieldData to include fetched options
          const updatedFieldData = fieldData.map((section) => ({
            ...section,
            fields: section.fields.map((field) =>
              field.key === "youth_ethnicity"
                ? { ...field, options: options }
                : field
            ),
          }));
          setFieldData(updatedFieldData);
        }
      } catch (error) {
        console.error("Failed to fetch ethnicity options", error);
      }
    };

    fetchEthnicityOptions();
  }, []);

  // Handle language change to show/hide other language field
  useEffect(() => {
    const updateLanguageFields = async () => {
      console.log("dhsdjs");
      if (formData.youth_preferred_language === "other") {
        try {
          const response = [];
          // await dispatch(getOtherLanguageOptions());
          if (response) {
            const options = response.map((item) => ({
              label: item.name,
              value: item.id,
            }));
            setOtherLanguageOptions(options);

            // Update fieldData to add other language field
            const updatedFieldData = fieldData.map((section) => {
              if (section.title === "Youth Information") {
                const languageFieldIndex = section.fields.findIndex(
                  (field) => field.key === "youth_preferred_language"
                );

                // Create new fields array with other language select
                const newFields = [
                  ...section.fields.slice(0, languageFieldIndex + 1),
                  {
                    type: "selectBox",
                    label: "Specify Other Language",
                    isRequired: true,
                    col: 6,
                    key: "youth_other_language",
                    options: options,
                  },
                  ...section.fields.slice(languageFieldIndex + 1),
                ];

                return {
                  ...section,
                  fields: newFields,
                };
              }
              return section;
            });

            setFieldData(updatedFieldData);
          }
        } catch (error) {
          console.error("Failed to fetch other language options", error);
        }
      } else {
        // Revert fieldData to remove other language field
        const revertedFieldData = fieldData.map((section) => {
          if (section.title === "Youth Information") {
            // Remove other language field if exists
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

  return (
    <div>
      {" "}
      <div style={{ boxShadow: "4px 4px 25px 0px rgba(0, 0, 0, 0.15)" }}>
        <Box
          className="bg-[#fff] rounded-[10px]"
          sx={{
            boxShadow: "4px 4px 15px 4px #0000000D",
            padding: "30px 20px",
            margin: "50px 30px 30px 30px",
          }}
        >
          <Stack spacing={2}>
            {fieldData?.map((data) => {
              return (
                <CustomAccordian
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
        </Box>
      </div>
    </div>
  );
};
