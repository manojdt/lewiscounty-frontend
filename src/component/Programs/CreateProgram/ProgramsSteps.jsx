import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Controller,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { Calendar } from "primereact/calendar";
import SearchIcon from "../../../assets/icons/search.svg";

import { Button } from "../../../shared";

import CalendarIcon from "../../../assets/images/calender_1x.png";
import HTMLIcon from "../../../assets/images/html1x.png";
import LocationIcon from "../../../assets/images/Location1x.png";
import PlusIcon from "../../../assets/images/plus_temp.png";
import UploadIcon from "../../../assets/images/image_1x.png";
import DeleteIcon from "../../../assets/images/delete_1x.png";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import Tooltip from "../../../shared/Tooltip";
import DownArrowIcon from "../../../assets/icons/arrowDown.svg";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import DataTable from "../../../shared/DataGrid";
import { MentorAssignColumns } from "../../../mock";
import MuiModal from "../../../shared/Modal";
import { useSelector } from "react-redux";
// import { useGetStatesQuery } from '../../../features/programs/program-slice';
// import { useGetCitiesQuery } from '../../../features/program/programApi.services';

const ProgramSteps = ({
  stepFields,
  currentStepData,
  stepData,
  handleAction,
  fetchCategoryData,
  handleProgramCheck,
  handleSearchChange,
  search,
  setToggleRole,
  setCurrent,
  mentor_assign,
  goalData,
}) => {
  const params = useParams();
  const [checkBoxValue, setCheckBoxValue] = useState({});
  const [currentField, setCurrentField] = useState();
  // const [stateId, setStateId] = useState(null);
  // const { data: states } = useGetStatesQuery();
  // const { data: cities } = useGetCitiesQuery(stateId, {
  //   skip: !stateId,
  // });

  // console.log('cities', cities);
  const role = useSelector((state) => state.userInfo?.data?.role);

  const calendarRef = useRef([]);
  const startDateRefs = useRef([]);
  const endDateRefs = useRef([]);

  const getCalendarRef = (index, fieldName) => {
    return fieldName === "start_date"
      ? startDateRefs.current[index]
      : endDateRefs.current[index];
  };
  const {
    register,
    formState: { errors },
    reset,
    getValues,
    setValue,
    watch,
    control,
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sub_programs",
  });

  const [
    subProgramCount,
    is_sponsored = false,
    sub_programs,
    start_date,
    end_date,
    goals,
    program_mode,
  ] = watch([
    "no_of_subprograms",
    "is_sponsored",
    "sub_programs",
    "start_date",
    "end_date",
    "goals",
    "program_mode",
  ]);

  // console.log('stepFields', stepFields);

  const mentorFooterComponent = (props) => {
    return (
      <div className="flex gap-6 justify-center items-center py-4">
        <button
          onClick={() => setCurrentField("")}
          className="py-3 px-6 w-[16%]"
          style={{
            border: "1px solid rgba(29, 91, 191, 1)",
            borderRadius: "3px",
            color: "rgba(29, 91, 191, 1)",
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => {
            setValue(
              currentField,
              props.selectedRows?.find((item) => item)?.id
            );
            setCurrentField("");
          }}
          className="text-white py-3 px-6 w-[16%]"
          style={{
            background:
              "linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)",
            borderRadius: "3px",
          }}
        >
          Add Members
        </button>
      </div>
    );
  };

  React.useEffect(() => {
    const count = parseInt(subProgramCount, 10) || 0;
    const currentLength = fields.length;

    if (count > currentLength) {
      for (let i = currentLength; i < count; i++) {
        append({
          title: "",
          description: "",
          start_date: "",
          end_date: "",
          flexible_time: "",
          mentor_id: "",
        });
      }
    } else if (count < currentLength) {
      for (let i = currentLength - 1; i >= count; i--) {
        remove(i);
      }
    }
  }, [subProgramCount, fields.length, append, remove]);

  const handleLoadFieldValues = () => {
    const fName = [];
    const f = {};
    stepFields.forEach((step) => {
      fName.push(step.name);
    });
    for (const field in stepData) {
      if (fName.includes(field)) f[field] = stepData[field];
      setValue(field, stepData[field]);
    }
  };

  useEffect(() => {
    if (Object.keys(stepData).length && params.id !== "") {
      handleLoadFieldValues();
    }
  }, [stepData]);

  useEffect(() => {
    if (currentStepData !== undefined && Object.keys(currentStepData).length) {
      reset(currentStepData);
    }
    setValue("status", "");
  }, []);

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  }

  const handleDeleteImage = (key) => {
    setValue(key, "");
  };

  const handleCheckbox = (e) => {
    setCheckBoxValue({ ...checkBoxValue, [e.target.name]: e.target.value });
  };

  const handleActionPopup = (fieldName) => {
    // Open popup and allow user to select an item
    setCurrentField(fieldName);
  };

  // const statesOptions = states?.map((state, index) => ({
  //   key: state.id,
  //   value: state.name,
  // }));

  // const citiesOptions = cities?.map((city, index) => ({
  //   key: city.id,
  //   value: city.name,
  // }));

  return (
    <div>
      <div className="flex flex-wrap gap-4">
        {stepFields.map((field, index) => {
          const isAddressField =
            field.name === "address_line1" ||
            field.name === "address_line2" ||
            field.name === "state" ||
            field.name === "city" ||
            field.name === "zip_code";

          if (isAddressField && program_mode !== "physical_location") {
            return null;
          }

          // const validationRules =
          //   program_mode !== 'physical_location' && isAddressField
          //     ? {}
          //     : field.inputRules;

          const dateField =
            field.type === "date"
              ? register(field.name, field.inputRules)
              : undefined;
          let watchFile = field.type === "file" ? watch(field.name) : undefined;
          const dropdownimageField =
            field.type === "dropdown"
              ? register(field.name, field.inputRules)
              : undefined;
          const checkbox =
            field.type === "checkbox"
              ? register(field.name, field.inputRules)
              : undefined;
          let imageName = "";

          if (field.name === "enrollment_fees" && is_sponsored === true) {
            return null;
          }
          if (field.name === "image" && is_sponsored === false) {
            return null;
          }

          const disableFields =
            params?.id && field.name === "program_name" && role === "mentor";

          const disableSelectFields =
            params?.id &&
            (field.name === "course_level" || field.name === "category") &&
            role === "mentor";
          const disableDateFields =
            params?.id &&
            (field.name === "start_date" || field.name === "end_date") &&
            role === "mentor";
          return (
            <div
              className={`relative mb-6  ${
                getWindowDimensions().width <= 1536 &&
                field.width === "width-82"
                  ? "w-[81%]"
                  : field.width
              }`}
              key={index}
            >
              <label
                className="block tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor={field.label}
              >
                {field.label}{" "}
                <span style={{ color: "red" }}>
                  {field?.inputRules?.required ? "*" : ""}
                </span>
              </label>
              {field.type === "radio" ? (
                <FormControl component="fieldset" className="my-3">
                  <Controller
                    name={field.name}
                    control={control}
                    defaultValue={false}
                    render={({ field: controllerField }) => (
                      <RadioGroup
                        {...controllerField}
                        row
                        aria-labelledby="radio-buttons-group"
                        value={controllerField.value?.toString()}
                        onChange={(e) => {
                          const boolValue = e.target.value === "true";
                          controllerField.onChange(boolValue);
                          setValue(field.name, boolValue);
                        }}
                      >
                        {field.options?.map((option) => (
                          <FormControlLabel
                            key={option.key}
                            value={option.key}
                            control={
                              <Radio
                                checked={
                                  controllerField.value?.toString() ===
                                  option.key
                                }
                                checkedIcon={<CheckBoxIcon />}
                                icon={<CheckBoxOutlineBlankIcon />}
                              />
                            }
                            label={option.value}
                          />
                        ))}
                      </RadioGroup>
                    )}
                  />
                </FormControl>
              ) : field.type === "input" ? (
                <div className="relative">
                  {/* <input
                    disabled={disableFields}
                    {...register(field.name, field.inputRules)}
                    type={field.fieldtype}
                    className={`w-full border-none px-3 py-[0.32rem] leading-[2.15] ${
                      disableFields ? 'bg-slate-300' : 'input-bg'
                    } focus:border-none focus-visible:border-none focus-visible:outline-none text-[14px] h-[60px]`}
                    placeholder={field.placeholder}
                    onBlur={(e) => {
                      if (field.name === 'program_name') {
                        handleProgramCheck(e?.target?.value);
                      }
                    }}
                    style={{
                      color: '#232323',
                      borderRadius: '3px',
                    }}
                    aria-invalid={!!errors[field.name]}
                  /> */}
                  <Controller
                    name={field.name}
                    control={control}
                    defaultValue=""
                    rules={field.inputRules}
                    render={({ field: controlledField }) => (
                      <input
                        disabled={disableFields}
                        {...controlledField}
                        type={field.fieldtype}
                        className={`w-full border-none px-3 py-[0.32rem] leading-[2.15] ${
                          disableFields ? "bg-slate-300" : "input-bg"
                        } focus:border-none focus-visible:border-none focus-visible:outline-none text-[14px] h-[60px]`}
                        placeholder={field.placeholder}
                        onBlur={(e) => {
                          controlledField.onBlur();
                          if (field.name === "program_name") {
                            // handelProgramCheck(e?.target?.value);
                          }
                        }}
                        style={{
                          color: "#232323",
                          borderRadius: "3px",
                        }}
                      />
                    )}
                  />
                  {field.icon && field.icon === "location" && (
                    <img
                      className="absolute top-4 right-4"
                      src={LocationIcon}
                      alt="LocationIcon"
                    />
                  )}

                  {field.icon && field.icon === "add" && (
                    <Tooltip title={field.placeholder}>
                      <img
                        className="absolute cursor-pointer top-4 right-4"
                        onClick={() => handleAction(field.name)}
                        src={PlusIcon}
                        alt="PlusIcon"
                      />
                    </Tooltip>
                  )}

                  {errors[field.name] && (
                    <p className="error" role="alert">
                      {errors[field.name].message}
                    </p>
                  )}
                </div>
              ) : field.type === "popup-input" ? (
                <div className="relative">
                  <div
                    className="input-bg h-[60px] w-full mt-2 flex items-center text-[12px] gap-2 cursor-pointer px-6"
                    style={{ borderRadius: "3px" }}
                    onClick={() => handleAction(field.name)}
                  >
                    {(() => {
                      // Get the current field value from watch
                      const fieldValue = watch(field.name);

                      if (!fieldValue) {
                        return null;
                      }

                      if (field.name === "goals") {
                        // Handle goals and equipments fields
                        if (Array.isArray(fieldValue)) {
                          return (
                            <>
                              {fieldValue.slice(0, 6).map((id) => {
                                const dataSource = goalData;
                                const item = dataSource?.find(
                                  (g) => g.id === id
                                );

                                if (item) {
                                  return (
                                    <p
                                      key={id}
                                      className="flex items-center gap-1"
                                    >
                                      <span
                                        className="flex items-center px-3 py-3"
                                        style={{
                                          background: "rgba(223, 237, 255, 1)",
                                          borderRadius: "50%",
                                        }}
                                      ></span>
                                      {item.description}
                                    </p>
                                  );
                                }
                                return null;
                              })}
                              {fieldValue.length > 6 && (
                                <p className="flex items-center gap-1">
                                  <span
                                    className="text-white flex items-center px-2 py-1"
                                    style={{
                                      background: "rgb(29, 91, 191)",
                                      borderRadius: "50%",
                                    }}
                                  >
                                    +{fieldValue.length - 6}
                                  </span>
                                  Others
                                </p>
                              )}
                            </>
                          );
                        }
                      } else {
                        // Handle other popup-input fields
                        if (Array.isArray(fieldValue)) {
                          return (
                            <>
                              {fieldValue.slice(0, 6).map((item, index) => (
                                <p
                                  key={index}
                                  className="flex items-center gap-1"
                                >
                                  <span
                                    className="flex items-center px-3 py-3"
                                    style={{
                                      background: "rgba(223, 237, 255, 1)",
                                      borderRadius: "50%",
                                    }}
                                  ></span>
                                  {item.name ||
                                    `${item.first_name || ""} ${
                                      item.last_name || ""
                                    }`.trim() ||
                                    item.full_name ||
                                    item}
                                </p>
                              ))}
                              {fieldValue.length > 6 && (
                                <p className="flex items-center gap-1">
                                  <span
                                    className="text-white flex items-center px-2 py-1"
                                    style={{
                                      background: "rgb(29, 91, 191)",
                                      borderRadius: "50%",
                                    }}
                                  >
                                    +{fieldValue.length - 6}
                                  </span>
                                  Others
                                </p>
                              )}
                            </>
                          );
                        }
                      }
                    })()}
                  </div>
                  <input
                    {...register(field.name, field.inputRules)}
                    type={field.fieldtype}
                    className="w-full hidden border-none px-3 py-[0.32rem] leading-[2.15] input-bg focus:border-none focus-visible:border-none 
                                                            focus-visible:outline-none text-[14px] h-[60px]"
                    placeholder={field.placeholder}
                    style={{
                      color: "#232323",
                      borderRadius: "3px",
                    }}
                    aria-invalid={!!errors[field.name]}
                  />
                  {field.icon && field.icon === "add" && (
                    <Tooltip title={field.placeholder}>
                      <img
                        className="absolute top-4 right-4 cursor-pointer"
                        onClick={() => handleAction(field.name)}
                        src={PlusIcon}
                        alt="PlusIcon"
                      />
                    </Tooltip>
                  )}

                  {errors[field.name] && (
                    <p className="error" role="alert">
                      {errors[field.name].message}
                    </p>
                  )}
                </div>
              ) : field.type === "dropdown" ? (
                <>
                  <select
                    disabled={disableSelectFields}
                    {...dropdownimageField}
                    className={`w-full border-none px-3 py-[0.32rem] leading-[2.15] ${
                      disableSelectFields ? "bg-slate-300" : "input-bg"
                    } focus:border-none focus-visible:border-none focus-visible:outline-none text-[14px] h-[60px]`}
                    placeholder={field.placeholder}
                    style={{
                      color: "#232323",
                      borderRadius: "3px",
                      borderRight: "16px solid transparent",
                    }}
                    onChange={(e) => {
                      dropdownimageField.onChange(e);

                      // if (field.name === 'state') {
                      //   setStateId(e.target.value);
                      // }
                      if (field.name === "category") {
                        fetchCategoryData(e.target.value);
                      }
                      if (field.name === "environment") {
                        setToggleRole(
                          e.target.value === "Own" ? "mentor" : "admin"
                        );
                        setCurrent(e.currentTarget.value);
                      }
                    }}
                  >
                    <option value="">Select</option>

                    {/* {(field.name === 'state'
                      ? statesOptions
                      : // : field.name === 'city'
                        // ? citiesOptions
                        field.options || []
                    )?.map((option, index) => (
                      <option value={option.key || option.id} key={index}>
                        {option.value || option.name}
                      </option>
                    ))} */}

                    {field &&
                      field.options?.length > 0 &&
                      field.options.map((option, index) => {
                        return (
                          <option value={option.key || option.id} key={index}>
                            {option.value || option.name}
                          </option>
                        );
                      })}
                  </select>
                  {errors[field.name] && (
                    <p className="error" role="alert">
                      {errors[field.name].message}
                    </p>
                  )}
                </>
              ) : field.type === "dynamicFields" ? (
                <>
                  {/* Dynamic Fields for Sub Programs */}

                  {fields &&
                    fields.length > 0 &&
                    fields.map((item, index) => {
                      return (
                        <div
                          key={item.id}
                          className="border border-[#1D5BBF] rounded mb-3"
                        >
                          <div className="flex justify-between px-5 py-4 bg-[#F3F7FC] rounded">
                            <div className="text-sm font-semibold text=[#1D5BBF]">{`Sub Program-${
                              index + 1
                            }`}</div>
                            <div>
                              <img
                                src={DownArrowIcon}
                                alt="DownArrowIcon"
                                className="w-4"
                              />
                            </div>
                          </div>
                          <div
                            key={item.id}
                            className="flex flex-wrap justify-between p-4"
                          >
                            {field.dynamicFields.map((nestedField) => {
                              const fieldValue = watch(
                                `sub_programs.${index}.${nestedField.name}`
                              );

                              // Only use the date value when the field type is date
                              const dateValue =
                                nestedField.type === "date"
                                  ? fieldValue
                                  : undefined;

                              return (
                                <div
                                  key={nestedField.name}
                                  className={nestedField.width}
                                >
                                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2 mt-5">
                                    {nestedField.label}
                                  </label>
                                  <div>
                                    {nestedField.type === "input" ? (
                                      <input
                                        {...register(
                                          `sub_programs.${index}.${nestedField.name}`,
                                          nestedField.inputRules
                                        )}
                                        className="w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg focus:border-none focus-visible:border-none focus-visible:outline-none text-[14px] h-[60px]"
                                        placeholder={nestedField.placeholder}
                                        onBlur={(e) => {
                                          if (
                                            nestedField.name === "title" &&
                                            e?.target?.value
                                          ) {
                                            handleProgramCheck(
                                              e?.target?.value
                                            );
                                          }
                                        }}
                                        // aria-invalid={!!errors[nestedField.name]}
                                      />
                                    ) : nestedField.type === "textarea" ? (
                                      <textarea
                                        rows="4"
                                        className={`block p-2.5 input-bg w-full text-sm text-gray-900  border focus-visible:outline-none focus-visible:border-none ${
                                          nestedField.width === "width-82"
                                            ? "h-[282px]"
                                            : ""
                                        }`}
                                        placeholder={nestedField.placeholder}
                                        {...register(
                                          `sub_programs.${index}.${nestedField.name}`,
                                          nestedField.inputRules
                                        )}
                                      ></textarea>
                                    ) : nestedField.type === "date" ? (
                                      <div className="relative">
                                        <Calendar
                                          value={
                                            dateValue
                                              ? new Date(dateValue)
                                              : null
                                          }
                                          className="calendar-control input-bg"
                                          type={nestedField.type}
                                          {...register(
                                            `sub_programs.${index}.${nestedField.name}`,
                                            nestedField.inputRules
                                          )}
                                          onChange={(e) => {
                                            setValue(
                                              `sub_programs.${index}.${nestedField.name}`,
                                              e.value
                                                ? new Date(
                                                    e.value
                                                  ).toISOString()
                                                : null
                                            );
                                          }}
                                          {...(nestedField.name === "start_date"
                                            ? {
                                                minDate: start_date,
                                                maxDate: end_date,
                                              }
                                            : {})}
                                          {...(nestedField.name === "end_date"
                                            ? {
                                                minDate: start_date,
                                                maxDate: end_date,
                                              }
                                            : {})}
                                          showTime
                                          hourFormat="12"
                                          dateFormat="dd/mm/yy"
                                          ref={(el) => {
                                            if (
                                              nestedField.name === "start_date"
                                            ) {
                                              startDateRefs.current[index] = el;
                                            } else if (
                                              nestedField.name === "end_date"
                                            ) {
                                              endDateRefs.current[index] = el;
                                            }
                                          }}
                                        />
                                        <img
                                          className="absolute top-5 right-2 cursor-pointer"
                                          src={CalendarIcon}
                                          alt="CalendarIcon"
                                          onClick={() => {
                                            const ref = getCalendarRef(
                                              index,
                                              nestedField.name
                                            );
                                            if (ref) {
                                              ref.show();
                                            }
                                          }}
                                        />

                                        {errors?.sub_programs?.[index] && (
                                          <p className="error" role="alert">
                                            {
                                              errors?.sub_programs?.[index]?.[
                                                nestedField.name
                                              ]?.message
                                            }
                                          </p>
                                        )}
                                      </div>
                                    ) : nestedField.type === "radio" ? (
                                      <FormControl
                                        component="fieldset"
                                        className={`my-3`}
                                        error={
                                          !!errors?.sub_programs?.[index]?.[
                                            nestedField.name
                                          ]?.message
                                        }
                                      >
                                        <Controller
                                          name={`sub_programs.${index}.${nestedField.name}`}
                                          control={control}
                                          defaultValue={
                                            nestedField.options?.[0]?.key ===
                                              "true" || false
                                          }
                                          render={({
                                            field: nestedcontrollerField,
                                          }) => (
                                            <RadioGroup
                                              {...nestedcontrollerField}
                                              row
                                              aria-labelledby="radio-buttons-group"
                                              value={nestedcontrollerField.value?.toString()}
                                              onChange={(e) => {
                                                // Convert string value to boolean before setting
                                                const boolValue =
                                                  e.target.value === "true";
                                                nestedcontrollerField.onChange(
                                                  boolValue
                                                );
                                                setValue(
                                                  `sub_programs.${index}.${nestedField.name}`,
                                                  boolValue
                                                ); // Sync with React Hook Form
                                              }}
                                            >
                                              {nestedField.options.map(
                                                (option) => (
                                                  <FormControlLabel
                                                    key={option.key}
                                                    value={option.key}
                                                    control={
                                                      <Radio
                                                        checked={
                                                          nestedcontrollerField.value?.toString() ===
                                                          option.key
                                                        }
                                                        checkedIcon={
                                                          <CheckBoxIcon />
                                                        }
                                                        icon={
                                                          <CheckBoxOutlineBlankIcon />
                                                        }
                                                      />
                                                    }
                                                    label={option.value}
                                                  />
                                                )
                                              )}
                                            </RadioGroup>
                                          )}
                                        />
                                      </FormControl>
                                    ) : (
                                      <div
                                        className="input-bg h-[60px] w-full mt-2 flex items-center relative text-[12px] gap-2 cursor-pointer px-6"
                                        style={{ borderRadius: "3px" }}
                                        onClick={() =>
                                          handleActionPopup(
                                            `sub_programs.${index}.mentor_id`
                                          )
                                        }
                                      >
                                        {sub_programs[index].mentor_id && (
                                          <p className="flex items-center gap-1">
                                            <p
                                              className="flex items-center px-3 py-3"
                                              style={{
                                                background:
                                                  "rgba(223, 237, 255, 1)",
                                                borderRadius: "50%",
                                              }}
                                            ></p>
                                            {
                                              mentor_assign?.find(
                                                (mentor) =>
                                                  mentor?.id ===
                                                  sub_programs[index].mentor_id
                                              )?.name
                                            }
                                          </p>
                                        )}

                                        <input
                                          {...register(
                                            nestedField.name,
                                            nestedField.inputRules
                                          )}
                                          type={nestedField.fieldtype}
                                          className="w-full hidden border-none px-3 py-[0.32rem] leading-[2.15] input-bg focus:border-none focus-visible:border-none 
                                                                                                                    focus-visible:outline-none text-[14px] h-[60px]"
                                          placeholder={nestedField.placeholder}
                                          style={{
                                            color: "#232323",
                                            borderRadius: "3px",
                                          }}
                                          aria-invalid={
                                            !!errors[nestedField.name]
                                          }
                                        />
                                        {nestedField.icon &&
                                          nestedField.icon === "add" && (
                                            <Tooltip
                                              title={nestedField.placeholder}
                                            >
                                              <img
                                                className="absolute top-4 right-4 cursor-pointer"
                                                onClick={() =>
                                                  handleActionPopup(
                                                    `sub_programs.${index}.mentor_id`
                                                  )
                                                }
                                                src={PlusIcon}
                                                alt="PlusIcon"
                                              />
                                            </Tooltip>
                                          )}
                                      </div>
                                    )}
                                  </div>
                                  {errors?.sub_programs?.[index]?.[
                                    nestedField.name
                                  ]?.message && (
                                    <p className="error" role="alert">
                                      {
                                        errors.sub_programs[index][
                                          nestedField.name
                                        ].message
                                      }
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                </>
              ) : field.type === "textbox" ? (
                <>
                  <textarea
                    id={field.name} // Add unique id
                    key={field.name}
                    rows="4"
                    className={`block p-2.5 input-bg w-full text-sm text-gray-900 border focus-visible:outline-none focus-visible:border-none h-[182px]`}
                    placeholder={field.placeholder}
                    {...register(field.name, {
                      ...field.inputRules,
                      onChange: (e) => {
                        // Handle change specifically for this field
                        setValue(field.name, e.target.value, {
                          shouldValidate: true,
                          shouldDirty: true,
                          shouldTouch: true,
                        });
                      },
                    })}
                  ></textarea>
                  {errors[field.name] && (
                    <p className="error" role="alert">
                      {errors[field.name].message}
                    </p>
                  )}
                </>
              ) : field.type === "checkbox" ? (
                <div className="flex items-center me-4">
                  {field.options.map((option, index) => (
                    <div className="flex items-center me-4" key={index}>
                      <input
                        type="radio"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        {...checkbox}
                        onChange={(e) => {
                          checkbox.onChange(e);
                          handleCheckbox(e);
                        }}
                        value={option.key}
                        checked={checkBoxValue[field.name] === option.key}
                      />
                      <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        {option.value}
                      </label>
                    </div>
                  ))}
                </div>
              ) : field.type === "date" ? (
                <div className="relative">
                  <Calendar
                    disabled={disableDateFields}
                    className={`calendar-control ${
                      disableDateFields ? "bg-slate-300" : "input-bg"
                    }`}
                    {...dateField}
                    value={getValues(field.name)}
                    {...(field.name === "start_date"
                      ? { minDate: new Date() }
                      : {})}
                    {...(field.name === "end_date"
                      ? { minDate: getValues("start_date") }
                      : {})}
                    showTime
                    hourFormat="12"
                    dateFormat="dd/mm/yy"
                    ref={(el) => (calendarRef.current[index] = el)}
                  />
                  <img
                    className="absolute top-5 right-2 cursor-pointer"
                    src={CalendarIcon}
                    alt="CalendarIcon"
                    onClick={() => {
                      calendarRef?.current[index]?.show();
                    }}
                  />

                  {errors[field.name] && (
                    <p className="error" role="alert">
                      {errors[field.name].message}
                    </p>
                  )}
                </div>
              ) : field.type === "htmlbuilder" ? (
                <div
                  className="input-bg h-[282px] mt-6 flex items-center justify-center text-[12px] flex-col gap-2 cursor-pointer"
                  style={{ borderRadius: "3px" }}
                >
                  <img src={HTMLIcon} alt="HTMLIcon" />
                  <span>{field.text}</span>
                </div>
              ) : field.type === "file" ? (
                <>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor={field.name}
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-gray-200 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-200 dark:text-gray-400">
                          <span className="font-semibold">Add Logo/Image</span>
                        </p>
                        <p className="text-xs text-gray-200 dark:text-gray-400">
                          (200*200 Pixels)
                        </p>
                      </div>
                      <Controller
                        name={field.name}
                        control={control}
                        defaultValue=""
                        render={({
                          field: { onChange, value, ...inputProps },
                        }) => (
                          <input
                            type="file"
                            id={field.name}
                            multiple={field.name === "image"}
                            accept="image/png, image/jpeg, image/jpg,image/webp,image/heic"
                            onChange={(e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                const fileList = e.target.files; // Keep the FileList object
                                const allowedTypes = [
                                  "image/png",
                                  "image/jpeg",
                                  "image/jpg",
                                  "image/webp",
                                  "image/heic",
                                ];

                                // Validate each file in the FileList
                                const isValid = Array.from(fileList).every(
                                  (file) => allowedTypes.includes(file.type)
                                );

                                if (isValid) {
                                  onChange(fileList); // Pass the FileList directly
                                } else {
                                  console.error(
                                    "One or more files have an unsupported file type."
                                  );
                                }
                              }
                            }}
                            className="hidden"
                            {...inputProps}
                          />
                        )}
                      />
                    </label>
                  </div>
                  {watchFile &&
                    typeof watchFile === "object" &&
                    watchFile[0]?.name && (
                      <>
                        <div
                          className="text-[14px] pt-5"
                          style={{ color: "rgba(0, 0, 0, 1)" }}
                        >
                          Uploaded Image{" "}
                        </div>

                        <div
                          className="flex justify-between items-center w-[30%] mt-5 px-4 py-4"
                          style={{
                            border: "1px solid rgba(29, 91, 191, 0.5)",
                            borderRadius: "3px",
                          }}
                        >
                          <div className="flex w-[80%] gap-3 items-center">
                            <img src={UploadIcon} alt="altlogo" />
                            <span className="text-[12px]">
                              {getValues(field.name) &&
                                getValues(field.name)[0]?.name}
                              {params.id && imageName}
                            </span>
                          </div>
                          <img
                            className="w-[30px] cursor-pointer"
                            onClick={() => handleDeleteImage(field.name)}
                            src={DeleteIcon}
                            alt="DeleteIcon"
                          />
                        </div>
                      </>
                    )}
                  {errors[field.name] && (
                    <p className="error" role="alert">
                      {errors[field.name].message}
                    </p>
                  )}
                </>
              ) : null}
            </div>
          );
        })}
      </div>
      <MuiModal
        modalSize="md"
        modalOpen={!!currentField}
        modalClose={() => setCurrentField("")}
        noheader
      >
        <div className="flex items-center justify-end m-4 relative">
          <input
            type="text"
            id="search-navbar"
            className="block w-full p-2 rounded-lg text-sm text-gray-900 border border-gray-300"
            placeholder="Search here..."
            style={{
              height: "45px",
              width: "280px",
            }}
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
            <img src={SearchIcon} alt="SearchIcon" />
          </div>
        </div>
        <DataTable
          showToolbar={false}
          rows={mentor_assign}
          columns={MentorAssignColumns}
          footerAction={() => setCurrentField("")}
          footerComponent={(props) =>
            mentorFooterComponent(props, currentField)
          }
        />
      </MuiModal>
    </div>
  );
};

export default ProgramSteps;
