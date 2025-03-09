import React, { useEffect, useState } from "react";
import { EquipmentFormFields } from "../formFields/formFields";
import { Button } from "../../shared";
import { useAcceptMemberRequestMutation } from "../../features/request/requestAPI.service";
import { useDispatch } from "react-redux";
import { getProgramAddressDetails } from "../../services/programInfo";

const InterviewDetails = ({ handleInterviewEmail,selectedRow }) => {
  const [formData, setFormData] = useState({
    interview_date: "",
    interview_location: "",
    interview_description: "",
    location_id: "",
  });
  const dispatch = useDispatch();
  const [searchedOption, setSearchedOption] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [addressFieldData, setAddressFieldData] = useState([]);
  useEffect(() => {
    if (searchedOption?.id) {
      setFormData({
        ...formData,

        location_id: searchedOption.id,
        interview_location: `${searchedOption?.city}, ${searchedOption?.state_name}, ${searchedOption?.zip_code}`,
      });
    }
  }, [searchedOption.id]);

  const searchBar = React.useRef(null);
  const onConfirm = () => {
    const payload = {
      interview_date: formData?.interview_date,
      interview_location: formData?.location_id,
      interview_description: formData?.interview_description,
    };
    handleInterviewEmail(payload,selectedRow?.id);
  };
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

  const updateState = (key, value, event) => {
    if (key === "interview_location") {
      if (!document.getElementById("fields_overlay") && value) {
        searchBar?.current?.toggle(event);
      }
      if (!isLoading) {
        setIsLoading(true);
      }
      handleAddressfieldApi(value, "city");
    }

    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
      error: {
        ...prevData.error,
        [key]: "", // Clear error when field is updated
      },
    }));
  };

  const fields = [
    {
      type: "custom_date_time",
      label: "Select date and time",
      placeholder: "Select date and time",
      isRequired: false,
      col: 12,
      key: "interview_date",
      isDisable: false,
    },
    {
      type: "textbox",
      label: "Location",
      placeholder: "Search Location",
      isRequired: false,
      col: 12,
      key: "interview_location",
      addressDropdown: true,
      isDisable: false,
    },

    {
      type: "textarea",
      label: "Description",
      isRequired: false,
      col: 12,
      key: "interview_description",
    },
  ];
  return (
    <div>
      <EquipmentFormFields
        fields={fields}
        formData={formData}
        searchBar={searchBar}
        setSearchedOption={setSearchedOption}
        addressFieldData={addressFieldData}
        isLoading={isLoading}
        handleChange={updateState}
      />
      <div className="flex justify-center my-7">
        <Button
          btnCategory="primary"
          btnType="submit"
          btnName={"Confirm and send mail"}
          onClick={onConfirm}
        />
      </div>
    </div>
  );
};

export default InterviewDetails;
