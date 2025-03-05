import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { SelectBox } from "../../shared/SelectBox";
import { Calendar } from "primereact/calendar";
import CalendarIcon from "../../assets/icons/calendar.svg";
import unselectedVMTypeIcon from "../../assets/icons/unselectedVMTypeIcon.svg";
import selectedVMTypeIcon from "../../assets/icons/selectedVMTypeIcon.svg";
import SignatureCanvas from "react-signature-canvas";
import SearchModal from "./SearchModal";
import { CustomUpload } from "./CustomUpload";
import moment from "moment";
import MuiDatePicker from "../../shared/CustomDatePicker/MuiDatePicker";

export const EquipmentFormFields = ({
  fields = [],
  formData = "",
  handleChange = () => false,
  handleDeleteFile = () => false,
  addressFieldData,
  isLoading,
  searchBar,
  setSearchedOption,
}) => {
  const handleInputClick = (e, field) => {
    if (["zip_code", "state", "city"].includes(field.key))
      if (!document.getElementById("fields_overlay") && e.target.value) {
        searchBar?.current?.toggle(e);
      }
  };
  const calendarRef = React.useRef([]);
  const formatPhoneNumber = (value) => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, "");

    // Format based on length
    if (numericValue.length <= 3) {
      return numericValue;
    } else if (numericValue.length <= 6) {
      return `(${numericValue.slice(0, 3)}) ${numericValue.slice(3)}`;
    } else {
      return `(${numericValue.slice(0, 3)}) ${numericValue.slice(
        3,
        6
      )}-${numericValue.slice(6, 10)}`;
    }
  };

  const formatZipCode = (value) => {
    value = value.replace(/\D/g, "");

    if (value.length > 5) {
      value = value.slice(0, 5) + "-" + value.slice(5, 9);
    }

    value = value.slice(0, 10);

    return value;
  };

  const onSearchOptionClick = (option) => {
    setSearchedOption(option);
  };

  return (
    <>
      <Grid container spacing={4}>
        {fields?.map((fld, index) => {
          const shouldDisplay = fld.conditionalDisplay
          ? Array.isArray(formData[fld.conditionalDisplay])
            ? formData[fld.conditionalDisplay].includes(fld.conditionalValue)
            : formData[fld.conditionalDisplay] === fld.conditionalValue
          : true;
          return (
            !fld?.isHide && shouldDisplay && (
              <Grid item xs={fld?.col ?? 6}>
                <Stack spacing={2}>
                  <Typography
                    className="!text-[#353F4F] !text-[14px]"
                    fontWeight={500}
                  >
                    {fld?.label ?? ""}{" "}
                    {fld?.isRequired && fld?.label && (
                      <span className="!text-[#FF0000]">&nbsp; *</span>
                    )}
                  </Typography>

                  {fld?.type === "textbox" && (
                    <>
                      {" "}
                      <TextField
                        placeholder={fld?.placeholder ?? "Enter text"}
                        fullWidth
                        type={fld?.fieldType ?? "text"}
                        onWheel={(e) => e.target.blur()}
                        value={formData[fld?.key]}
                        onChange={(e) => {
                          if (fld?.is_pattern) {
                            const formatted =
                              fld?.format_type === "zip_code"
                                ? formatZipCode(e.target.value)
                                : formatPhoneNumber(e.target.value);
                            handleChange(fld?.key, formatted, e);
                          } else {
                            handleChange(fld?.key, e.target.value, e);
                          }
                          if (["state", "city", "zip_code"].includes(fld.key)) {
                            searchBar.current.toggle(e);
                          }
                        }}
                        onClick={(e) => handleInputClick(e, fld)}
                        disabled={fld?.isDisable ?? false}
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment position="end">
                                {fld?.endAdornment ?? ""}
                              </InputAdornment>
                            ),
                          },
                        }}
                        endAdornment={
                          <InputAdornment position="end">
                            {fld?.endAdornment ?? ""}
                          </InputAdornment>
                        }
                        inputProps={{
                          pattern: fld?.is_pattern
                            ? fld?.pattern // Correctly converted regex to string
                            : "",
                          title: `Invalid ${fld?.label}`, // Tooltip if validation fails
                        }}
                      />
                      {["state", "city", "zip_code"].includes(fld.key) && (
                        <SearchModal
                          searchBar={searchBar}
                          isLoading={isLoading}
                          addressFieldData={addressFieldData}
                          onSearchOptionClick={onSearchOptionClick}
                        />
                      )}
                    </>
                  )}

                  {fld?.type === "selectBox" && (
                    <SelectBox
                      isBlackArrow
                      background="#FAFAFA"
                      selectBox
                      borderColor="transparent"
                      height="55px"
                      color="#353F4F"
                      width="100%"
                      value={formData[fld?.key]}
                      handleChange={(value) =>
                        handleChange(fld?.key, value.target.value)
                      }
                      placeholder={fld?.placeholder ?? "Select"}
                      menuList={fld?.options}
                      disabled={fld?.isDisable ?? false}
                    />
                  )}
                  {fld?.type === "date" && (
                    <div className="relative !bg-[#FAFAFA] cursor-pointer">
                      <Calendar
                        className="calendar-control bg-[#FAFAFA]"
                        onChange={(e) => handleChange(fld?.key, e.value)}
                        value={formData[fld?.key]}
                        dateFormat="mm-dd-yy"
                        placeholder={fld?.placeholder ?? "Select"}
                        ref={(el) => (calendarRef.current[index] = el)}
                        minDate={fld?.minDate ? fld?.minDate : new Date()}
                        // maxDate={""}
                        disabled={fld?.isDisable ?? false}
                      />
                      <img
                        className="absolute top-5 right-2 cursor-pointer"
                        src={CalendarIcon}
                        alt="CalendarIcon"
                        onClick={(e) => {
                          if (!fld?.isDisable) {
                            calendarRef?.current[index]?.show();
                          }
                        }}
                      />
                    </div>
                  )}
                  {fld?.type === "custom_date" && (
                    <div className="relative !bg-[#FAFAFA] cursor-pointer">
                      <MuiDatePicker
                        disabled={fld?.isDisable ?? false}
                        value={
                          formData[fld?.key] ? moment(formData[fld?.key]) : null
                        }
                        placeholder={fld?.placeholder ?? "Select"}
                        onChange={(newValue) => {
                          handleChange(
                            fld.key,
                            newValue ? newValue.toISOString() : null
                          );
                        }}
                      />
                    </div>
                  )}

                  {fld?.type === "time" && (
                    <div className="relative !bg-[#FAFAFA] cursor-pointer">
                      <Calendar
                        className="calendar-control bg-[#FAFAFA]"
                        onChange={(e) => handleChange(fld?.key, e.value)}
                        value={formData[fld?.key]}
                        timeOnly
                        hourFormat="12"
                        placeholder={fld?.placeholder ?? "Select"}
                        ref={(el) => (calendarRef.current[index] = el)}
                        disabled={fld?.isDisable ?? false}
                      />
                      <img
                        className="absolute top-5 right-2 cursor-pointer"
                        src={CalendarIcon}
                        alt="CalendarIcon"
                        onClick={(e) => {
                          if (!fld?.isDisable) {
                            calendarRef?.current[index]?.show();
                          }
                        }}
                      />
                    </div>
                  )}

                  {fld?.type === "textarea" && (
                    <textarea
                      className={`!bg-[${
                        fld?.background ?? "#1D5BBF0D"
                      }] min-h-[100px] p-2`}
                      placeholder={fld?.placeholder ?? "Enter text"}
                      value={formData[fld?.key]}
                      onChange={(e) => handleChange(fld?.key, e.target.value)}
                    ></textarea>
                  )}

                  {fld?.type === "checkbox" && (
                    <Stack direction={"row"} alignItems={"center"} spacing={2}>
                      {fld?.options?.map((data) => {
                        return (
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            spacing={1}
                            key={data.value} // Add a unique key for each checkbox
                          >
                            <Checkbox
                              checked={
                                // Ensure formData[fld?.key] is an array before calling .includes()
                                Array.isArray(formData[fld?.key])
                                  ? formData[fld?.key].includes(data.value)
                                  : formData[fld?.key] === data.value
                              }
                              onChange={() => {
                                if (fld?.isMultiple) {
                                  // Handle multi-selection
                                  const selectedValues = Array.isArray(
                                    formData[fld?.key]
                                  )
                                    ? formData[fld?.key]
                                    : []; // Ensure selectedValues is an array
                                  const value = data.value;

                                  let updatedValues;
                                  if (selectedValues.includes(value)) {
                                    // If the value is already selected, remove it
                                    updatedValues = selectedValues.filter(
                                      (v) => v !== value
                                    );
                                  } else {
                                    // If the value is not selected, add it
                                    updatedValues = [...selectedValues, value];
                                  }

                                  // Update the form data
                                  handleChange(fld?.key, updatedValues);
                                } else {
                                  // Handle single selection
                                  handleChange(fld?.key, data.value);
                                }
                              }}
                            />
                            <Typography className="!text-[#232323] !text-[14px]">
                              {data?.label}
                            </Typography>
                          </Stack>
                        );
                      })}
                    </Stack>
                  )}
                  {fld.type === "radio" && (
                    <FormControl
                      component="fieldset"
                      className="my-3"
                      error={!!formData.error?.[fld?.key]}
                    >
                      <RadioGroup
                        row
                        value={formData[fld?.key]}
                        onChange={(e) => {
                          const Value = e.target.value;
                          handleChange(fld.key, Value);
                        }}
                      >
                        {fld.options?.map((option) => (
                          <FormControlLabel
                            key={option.value}
                            value={option.value}
                            control={
                              <Radio
                                checked={formData[fld?.key] === option.value}
                              />
                            }
                            label={option.label}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  )}
                  {fld?.type === "upload" && (
                    <CustomUpload
                      uploadedFile={formData[fld?.key]}
                      handleChange={(val) => handleChange(fld?.key, val)}
                      handleDelete={(id) => handleDeleteFile(fld?.key, id)}
                      isMultiFile={fld?.isMultiFile ?? false}
                    />
                  )}

                  {fld?.type === "title" && (
                    <Typography
                      className="!text-[#353F4F] !text-[16px]"
                      fontWeight={500}
                    >
                      {fld?.content}
                    </Typography>
                  )}

                  {fld?.type === "full_checkbox" && (
                    <Stack direction={"row"} alignItems={"center"} spacing={2}>
                      {fld?.options?.map((val) => {
                        return (
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            spacing={2}
                            sx={{
                              background:
                                formData[fld?.key] === val?.value
                                  ? "#FE634E"
                                  : "#FFF8F2",
                              padding: "12px 20px",
                              borderRadius: "3px",
                              cursor: "pointer",
                            }}
                            onClick={() => handleChange(fld?.key, val?.value)}
                          >
                            <img
                              src={
                                formData[fld?.key] === val?.value
                                  ? selectedVMTypeIcon
                                  : unselectedVMTypeIcon
                              }
                              alt=""
                            />
                            <Typography
                              className={`!text-[${
                                formData[fld?.key] === val?.value
                                  ? "#FFFFFF"
                                  : "#353F4F"
                              }]`}
                            >
                              {val?.label}
                            </Typography>
                          </Stack>
                        );
                      })}
                    </Stack>
                  )}

                  {fld?.type === "signature" && (
                    <SignatureCanvas
                      ref={fld?.ref}
                      penColor="black"
                      canvasProps={{
                        width: 500,
                        height: 200,
                        className: "signature-canvas border border-gray-300",
                      }}
                    />
                  )}

                  {formData?.error?.[fld?.key]?.length > 0 && (
                    <Typography className="!text-[#FF0000] !text-[12px]">
                      {formData?.error?.[fld?.key]}
                    </Typography>
                  )}
                </Stack>
              </Grid>
            )
          );
        })}
      </Grid>
    </>
  );
};
