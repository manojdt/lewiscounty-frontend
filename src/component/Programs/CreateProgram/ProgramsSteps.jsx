import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import PlusIcon from "../../../assets/icons/add_popup_icon.svg";
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
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import DataTable from "../../../shared/DataGrid";
import { MentorAssignColumns } from "../../../mock";
import MuiModal from "../../../shared/Modal";
import { useSelector } from "react-redux";
import { Button } from "../../../shared";
import { Button as MuiButton } from "@mui/material";
import { formatPhoneNumber, formatZipCode } from "../../../utils/formFields";
import CustomDateTimePicker from "../../../shared/CustomDateTimePicker/MuiDateTimePicker";
import moment from "moment";
import DeleteIconRounded from "../../../assets/icons/delete-icon.svg";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { user } from "../../../utils/constant";

const ProgramSteps = ({
  stepFields,
  currentStepData,
  stepData,
  handleAction,
  handleProgramCheck,
  setToggleRole,
  toggleRole,
  mentorSearchValue,
  isMentorDataLoading,
  setMentorSearchValue,
  mentor_assign,
  goalData,
  certificate,
  materials,
  members,
}) => {
  const params = useParams();
  const { admin, mentor } = user;

  const [searchParams] = useSearchParams();

  const [currentField, setCurrentField] = useState();
  const [selectedMentorsByField, setSelectedMentorsByField] = useState({});
  const getRowIdentifier = (row) => {
    return row.id;
  };
  const role = useSelector((state) => state.userInfo?.data?.role);

  const {
    register,
    formState: { errors },
    reset,
    getValues,
    setValue,
    watch,
    control,
  } = useFormContext();
  const formValues = watch();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "sub_programs",
  });

  const {
    fields: recurringFields,
    append: appendRecurringFields,
    remove: removeRecurringFields,
  } = useFieldArray({
    control,
    name: "recurring_dates",
  });

  const [
    subProgramCount,
    is_sponsored = false,
    sub_programs,
    program_mode,
    recurring_program,
    recurring_dates,
  ] = watch([
    "no_of_subprograms",
    "is_sponsored",
    "sub_programs",
    "program_mode",
    "recurring_program",
    "recurring_dates",
  ]);

  const handleInputChange = (e, field) => {
    const { value } = e.target;

    if (field.name === "phone_number") {
      const formattedValue = formatPhoneNumber(value);
      setValue(field.name, formattedValue);
    } else if (field.name === "zip_code") {
      const zipCodeFormatValue = formatZipCode(value);
      setValue(field.name, zipCodeFormatValue);
    } else {
      setValue(field.name, value.trimStart());
    }
  };
  const handleSelectedRow = (newSelectedRows, fieldId) => {
    const currentSelection = selectedMentorsByField[fieldId]?.[0];
    const newSelection = newSelectedRows[newSelectedRows.length - 1];

    setSelectedMentorsByField((prev) => ({
      ...prev,
      [fieldId]: !newSelection
        ? []
        : !currentSelection || currentSelection.id !== newSelection.id
        ? [newSelection]
        : [],
    }));
  };

  const mentorFooterComponent = ({ selectedRows, setMentorSearchValue }) => {
    const handleActionPopupData = () => {
      // For mentor_id, store just the ID of the single selected row
      const selectedId =
        selectedRows.length > 0 ? getRowIdentifier(selectedRows[0]) : null;
      setValue(currentField, selectedId);
      setCurrentField("");
      setMentorSearchValue("");
    };

    return (
      <div className="flex gap-6 justify-center items-center py-4">
        <button
          onClick={() => setCurrentField("")}
          className="py-3 px-6 rounded-sm border border-background-primary-main text-background-primary-main"
        >
          Cancel
        </button>
        <Button
          btnCategory="primary"
          btnName="Add"
          onClick={() => handleActionPopupData()}
          disabled={selectedMentorsByField.length === 0}
        />
      </div>
    );
  };

  React.useEffect(() => {
    const count = parseInt(subProgramCount, 10) || 0;
    const currentLength = fields.length;

    if (count > currentLength) {
      for (let i = currentLength; i < count; i++) {
        append({
          admin_program_series: i + 1,
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

  React.useEffect(() => {
    if (recurring_program && recurringFields.length === 0) {
      appendRecurringFields({
        start_date: "",
        end_date: "",
      });
    } else if (!recurring_program && recurringFields.length > 0) {
      // Clear recurring fields when recurring_program becomes false
      recurringFields.forEach((_, index) => {
        removeRecurringFields(index);
      });
    }
  }, [
    recurring_program,
    recurringFields.length,
    appendRecurringFields,
    removeRecurringFields,
  ]);

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

  const handleActionPopup = (fieldName) => {
    // Open popup and allow user to select an item
    setCurrentField(fieldName);
  };
  // Watch all start and end dates to implement cross-field validation

  const getMinDate = (field, index, allDates) => {
    if (field === "start_date") {
      if (!allDates) return moment(); // First cycle starts from today

      // For subsequent cycles, start date must be after previous cycle's end date
      const previousEndDate = allDates
        ? [allDates]?.[index - 1]?.[field]
        : watch(field);
      return previousEndDate
        ? moment(previousEndDate).add(1, "minute")
        : moment();
    } else {
      // End date must be after its start date
      const currentStartDate = allDates
        ? [allDates]?.[index]?.[field]
        : watch(field);
      return currentStartDate ? moment(currentStartDate) : moment();
    }
  };

  const getMaxDate = (field, index, allDates) => {
    if (field === "start_date") {
      // Start date must be before its end date if end date is selected
      const currentEndDate = allDates
        ? [allDates]?.[index]?.[field]
        : watch(field);
      return currentEndDate ? moment(currentEndDate) : null;
    } else {
      // End date must be before next cycle's start date if it exists
      const nextStartDate = allDates
        ? [allDates]?.[index + 1]?.[field]
        : watch(field);
      return nextStartDate ? moment(nextStartDate) : null;
    }
  };

  const getDateValidation = (fieldName, index = null) => {
    return {
      required: `${
        fieldName === "end_date" ? "End Date" : "Start Date"
      } is required`,
      validate: {
        isValid: (value) => !value || moment(value).isValid() || "Invalid date",
        dateOrder: (value) => {
          if (fieldName === "end_date") {
            const startDate =
              index !== null
                ? getValues(`sub_programs.${index}.start_date`)
                : getValues("start_date");

            return (
              !value ||
              !startDate ||
              moment(value).isAfter(moment(startDate)) ||
              "End date must be after start date"
            );
          }
          return true;
        },
        timeOrder: (value) => {
          if (fieldName === "end_date") {
            const startDate =
              index !== null
                ? getValues(`sub_programs.${index}.start_date`)
                : getValues("start_date");

            if (
              value &&
              startDate &&
              moment(value).isSame(moment(startDate), "day")
            ) {
              return (
                moment(value).isAfter(moment(startDate)) ||
                "End time must be after start time on the same day"
              );
            }
          }
          return true;
        },
        minDateTime: (value) => {
          if (fieldName === "end_date") {
            const startDate =
              index !== null
                ? getValues(`sub_programs.${index}.start_date`)
                : getValues("start_date");

            if (value && startDate) {
              const minEndDate = moment(startDate)
                .add(1, "day")
                .add(1, "hour")
                .startOf("hour");

              return (
                moment(value).isSameOrAfter(minEndDate) ||
                `End date must be at least 1 day and 1 hour after the start date (${minEndDate.format(
                  "MM/DD/YYYY hh:mm A"
                )})`
              );
            }
          }
          return true;
        },
      },
    };
  };

  // Add cleanup for selectedMentorsByField when fields are removed:
  useEffect(() => {
    const fieldIds = fields.map((f, i) => `sub_programs.${i}.mentor_id`);
    setSelectedMentorsByField((prev) => {
      const newState = {};
      Object.keys(prev).forEach((key) => {
        if (fieldIds.includes(key)) {
          newState[key] = prev[key];
        }
      });
      return newState;
    });
  }, [fields.length]);

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

          let watchFile = field.type === "file" ? watch(field.name) : undefined;

          if (field.name === "enrollment_fees" && is_sponsored === true) {
            return null;
          }
          if (field.name === "sponsor_logos" && is_sponsored === false) {
            return null;
          }

          const disableFields =
            params?.id &&
            field.name === "program_name" &&
            toggleRole === mentor;

          const disableSelectFields =
            params?.id &&
            (field.name === "course_level" || field.name === "category") &&
            toggleRole === mentor;
          // const disableDateFields = (fieldName) =>
          //   params?.id &&
          //   (fieldName === "start_date" || fieldName === "end_date") &&
          //   role === mentor;

          const disableDateFields = (fieldName) =>
            params?.id &&
            (fieldName === "start_date" || fieldName === "end_date") &&
            toggleRole === mentor &&
            searchParams.get("type") !== "re_open";

          const disableRecurringProgram =
            params?.id &&
            field.name === "recurring_program" &&
            toggleRole === mentor;
          return (
            <div className={`relative mb-6  ${field.width}`} key={index}>
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
                            disabled={disableRecurringProgram}
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
                  <Controller
                    name={field.name}
                    control={control}
                    defaultValue=""
                    rules={field.inputRules}
                    render={({ field: controlledField }) => (
                      <TextField
                        type={field.fieldtype}
                        placeholder={field.placeholder}
                        disabled={disableFields}
                        value={formValues[field.name] || ""} // Use formValues directly instead of controlledField.value
                        onChange={(e) => {
                          const value = e.target.value;
                          if (field.name === "enrollment_fees") {
                            controlledField.onChange(
                              value === "" ? "" : Number(value)
                            );
                          } else {
                            handleInputChange(e, field);
                          }
                        }}
                        onBlur={controlledField.onBlur}
                        InputProps={{
                          startAdornment: field.name === "enrollment_fees" && (
                            <AttachMoneyIcon />
                          ),
                        }}
                        error={!!errors[field.name]}
                        helperText={errors[field.name]?.message}
                        onWheel={(e) => e.target.blur()}
                      />
                    )}
                  />
                </div>
              ) : field.type === "popup-input" ? (
                <div className="relative">
                  <div
                    className="input-bg h-[60px] w-full mt-2 flex items-center text-[12px] gap-2 px-6"
                    style={{ borderRadius: "3px" }}
                  >
                    {(() => {
                      // Get the current field value from watch
                      const fieldValue = watch(field.name);

                      if (!fieldValue) {
                        return null;
                      }
                      if (Array.isArray(fieldValue)) {
                        return (
                          <>
                            {fieldValue.slice(0, 6).map((id) => {
                              const dataSource =
                                field.name === "certifications"
                                  ? certificate
                                  : field.name === "goals"
                                  ? goalData
                                  : field.name === "learning_materials"
                                  ? materials
                                  : field.name === "members"
                                  ? members
                                  : [];
                              const item = dataSource?.find((g) => g.id === id);

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
                                    {item.description ||
                                      item.name ||
                                      `${item.first_name || ""} ${
                                        item.last_name || ""
                                      }`}
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
                  <Controller
                    name={field.name}
                    control={control}
                    defaultValue=""
                    rules={field.inputRules}
                    render={({ field: controlledField }) => {
                      return (
                        <TextField
                          select
                          fullWidth
                          disabled={disableSelectFields}
                          value={formValues[field?.name] || ""}
                          onChange={(e) => {
                            controlledField.onChange(e);

                            // Handle special case for environment field
                            if (field.name === "environment") {
                              setToggleRole(
                                e.target.value === "Own" ? mentor : admin
                              );
                            }
                          }}
                          error={!!errors[field.name]}
                          helperText={errors[field.name]?.message}
                        >
                          <MenuItem value="">
                            <em>Select</em>
                          </MenuItem>
                          {field.options?.map((option, index) => (
                            <MenuItem
                              key={option.id || option.key || index}
                              value={option.id || option.key}
                            >
                              {option.value || option.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      );
                    }}
                  />
                </>
              ) : field.name === "sub_programs" ? (
                <>
                  {fields &&
                    fields.length > 0 &&
                    fields.map((item, index) => {
                      return (
                        <div
                          key={item.id}
                          className="border border-[#1D5BBF] rounded mb-3"
                        >
                          <div className="flex justify-between px-5 py-4 bg-[#F3F7FC] rounded">
                            <div className="text-sm font-semibold text-font-primary-main">{`${
                              index + 1
                            }. Subject`}</div>
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
                              return (
                                <div
                                  key={nestedField.name}
                                  className={nestedField.width}
                                >
                                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2 mt-5">
                                    {nestedField.label}
                                    <span style={{ color: "red" }}>
                                      {nestedField?.inputRules?.required
                                        ? "*"
                                        : ""}
                                    </span>
                                  </label>
                                  <div>
                                    {nestedField.type === "input" ? (
                                      <TextField
                                        {...register(
                                          `sub_programs.${index}.${nestedField.name}`,
                                          nestedField.inputRules
                                        )}
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
                                        error={
                                          !!errors?.sub_programs?.[index]?.[
                                            nestedField.name
                                          ]
                                        }
                                        helperText={
                                          errors?.sub_programs?.[index]?.[
                                            nestedField.name
                                          ]?.message
                                        }
                                        onWheel={(e) => e.target.blur()}
                                      />
                                    ) : nestedField.type === "textarea" ? (
                                      <TextField
                                        multiline
                                        rows={4}
                                        placeholder={nestedField.placeholder}
                                        {...register(
                                          `sub_programs.${index}.${nestedField.name}`,
                                          nestedField.inputRules
                                        )}
                                        error={
                                          !!errors?.sub_programs?.[index]?.[
                                            nestedField.name
                                          ]
                                        }
                                        helperText={
                                          errors?.sub_programs?.[index]?.[
                                            nestedField.name
                                          ]?.message
                                        }
                                      />
                                    ) : nestedField.type === "date" ? (
                                      <div className="relative">
                                        <CustomDateTimePicker
                                          placeholder={"mm/dd/yyyy hh:mm AM/PM"}
                                          {...register(
                                            `sub_programs.${index}.${nestedField.name}`,
                                            getDateValidation(
                                              nestedField.name,
                                              index
                                            )
                                          )}
                                          value={
                                            sub_programs?.[index]?.[
                                              nestedField.name
                                            ]
                                              ? moment(
                                                  sub_programs?.[index]?.[
                                                    nestedField.name
                                                  ]
                                                )
                                              : null
                                          }
                                          onChange={(newValue) => {
                                            setValue(
                                              `sub_programs.${index}.${nestedField.name}`,
                                              newValue
                                                ? newValue.toISOString()
                                                : null
                                            );
                                          }}
                                          minDate={getMinDate(
                                            nestedField?.name,
                                            index,
                                            "sub_programs"
                                          )}
                                          maxDate={getMaxDate(
                                            nestedField?.name,
                                            index,
                                            "sub_programs"
                                          )}
                                          error={
                                            !!errors?.sub_programs?.[index]?.[
                                              nestedField.name
                                            ]
                                          }
                                          helperText={
                                            errors?.sub_programs?.[index]?.[
                                              nestedField.name
                                            ]?.message
                                          }
                                        />
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
                                    ) : nestedField.type === "popup-input" ? (
                                      <div className="relative">
                                        <div
                                          className="input-bg h-[60px] w-full mt-2 flex items-center relative text-[12px] gap-2 px-6"
                                          style={{ borderRadius: "3px" }}
                                        >
                                          {sub_programs[index]?.mentor_id && (
                                            <p className="flex items-center gap-1">
                                              <span
                                                className="flex items-center px-3 py-3"
                                                style={{
                                                  background:
                                                    "rgba(223, 237, 255, 1)",
                                                  borderRadius: "50%",
                                                }}
                                              />
                                              {
                                                mentor_assign?.find(
                                                  (mentor) =>
                                                    mentor?.id ===
                                                    sub_programs[index]
                                                      .mentor_id
                                                )?.name
                                              }
                                            </p>
                                          )}

                                          <Controller
                                            name={`sub_programs.${index}.mentor_id`}
                                            control={control}
                                            rules={nestedField.inputRules}
                                            defaultValue=""
                                            render={({ field }) => (
                                              <input
                                                {...field}
                                                type="hidden"
                                                className="hidden"
                                              />
                                            )}
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
                                        {errors?.sub_programs?.[index]
                                          ?.mentor_id && (
                                          <p className="mt-1 text-xs text-red-500">
                                            {
                                              errors.sub_programs[index]
                                                .mentor_id.message
                                            }
                                          </p>
                                        )}
                                      </div>
                                    ) : null}
                                  </div>
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
                  <TextField
                    multiline
                    id={field.name} // Add unique id
                    key={field.name}
                    rows={4}
                    placeholder={field.placeholder}
                    {...register(field.name, {
                      ...field.inputRules,
                      onChange: (e) => {
                        // Handle change specifically for this field
                        setValue(field.name, e.target.value.trimStart(), {
                          shouldValidate: false,
                          shouldDirty: true,
                          shouldTouch: true,
                        });
                      },
                    })}
                    error={!!errors[field.name]}
                    helperText={errors[field.name]?.message}
                  />
                </>
              ) : field.type === "date" ? (
                <div className="relative">
                  <CustomDateTimePicker
                    disabled={disableDateFields(field.name)}
                    {...register(field?.name, getDateValidation(field?.name))}
                    value={
                      getValues(field.name)
                        ? moment(getValues(field.name))
                        : null
                    }
                    placeholder={"mm/dd/yyyy hh:mm AM/PM"}
                    onChange={(newValue) => {
                      setValue(
                        field.name,
                        newValue ? newValue.toISOString() : null
                      );
                    }}
                    {...(field.name === "start_date"
                      ? {
                          minDate: moment(), // Use moment object directly
                        }
                      : {})}
                    {...(field.name === "end_date"
                      ? {
                          minDate: getValues("start_date")
                            ? moment(getValues("start_date")).add(1, "day") // Use moment object directly
                            : null,
                          minDateTime: getValues("start_date")
                            ? moment(getValues("start_date"))
                                .add(1, "day")
                                .add(1, "hour")
                                .startOf("hour") // Use moment object directly
                            : null,
                        }
                      : {})}
                    error={!!errors?.[field.name]}
                    helperText={errors?.[field.name]?.message}
                  />
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
                        rules={field.inputRules}
                        render={({
                          field: { onChange, value, ...inputProps },
                        }) => (
                          <input
                            type="file"
                            id={field.name}
                            multiple={field.name === "sponsor_logos"}
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
                    ((typeof watchFile === "object" && watchFile[0]?.name) ||
                      (typeof watchFile === "string" && watchFile)) && (
                      <>
                        <div
                          className="text-sm pt-5"
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
                          <div className="flex w-4/5 gap-3 items-center">
                            <img src={UploadIcon} alt="upload icon" />
                            <span className="text-xs">
                              {typeof watchFile === "object"
                                ? watchFile[0]?.name
                                : watchFile}
                            </span>
                          </div>
                          <img
                            className="w-8 cursor-pointer"
                            onClick={() => handleDeleteImage(field.name)}
                            src={DeleteIcon}
                            alt="delete icon"
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
              ) : (
                field.name === "recurring_dates" &&
                recurring_program && (
                  <div className="w-full">
                    {recurringFields.map((recField, index) => {
                      return (
                        <div
                          key={recField.id}
                          className="border rounded-md p-4 mb-4"
                        >
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium text-sm">
                              Program cycle - {index + 1}
                            </h4>
                            {recurringFields.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeRecurringFields(index)}
                              >
                                <img
                                  className={"w-8 h-8"}
                                  src={DeleteIconRounded}
                                  alt="DeleteIconRounded"
                                />
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            {field?.dynamicFields?.map((nestedRecField) => (
                              <div
                                key={nestedRecField?.name}
                                className="relative"
                              >
                                <label className="block text-gray-700 text-xs font-bold mb-1">
                                  {nestedRecField?.label}
                                </label>
                                <CustomDateTimePicker
                                  disabled={disableDateFields(
                                    nestedRecField.name
                                  )}
                                  {...register(
                                    `recurring_dates.${index}.${nestedRecField?.name}`,
                                    getDateValidation(
                                      nestedRecField?.name,
                                      index
                                    )
                                  )}
                                  value={
                                    recurring_dates?.[index]?.[
                                      nestedRecField?.name
                                    ]
                                      ? moment(
                                          recurring_dates?.[index]?.[
                                            nestedRecField.name
                                          ]
                                        )
                                      : null
                                  }
                                  onChange={(newValue) => {
                                    setValue(
                                      `recurring_dates.${index}.${nestedRecField?.name}`,
                                      newValue ? newValue.toISOString() : null
                                    );
                                  }}
                                  minDate={getMinDate(
                                    nestedRecField?.name,
                                    index,
                                    "recurring_dates"
                                  )}
                                  maxDate={getMaxDate(
                                    nestedRecField?.name,
                                    index,
                                    "recurring_dates"
                                  )}
                                  error={
                                    !!errors.recurring_dates?.[index]?.[
                                      nestedRecField?.name
                                    ]
                                  }
                                  helperText={
                                    errors.recurring_dates?.[index]?.[
                                      nestedRecField?.name
                                    ]?.message
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                    <div className="flex justify-end items-center mb-4">
                      <MuiButton
                        disabled={params?.id && toggleRole === mentor}
                        variant="text"
                        onClick={() =>
                          appendRecurringFields({
                            start_date: null,
                            end_date: null,
                          })
                        }
                        className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Add +
                      </MuiButton>
                    </div>
                  </div>
                )
              )}
            </div>
          );
        })}
      </div>
      <MuiModal
        modalSize="md"
        modalOpen={!!currentField}
        modalClose={() => {
          setCurrentField("");
          setMentorSearchValue("");
        }}
        title="Add mentor"
      >
        <TextField
          fullWidth={false}
          size="small"
          sx={{
            marginBottom: 2,
            "& .MuiOutlinedInput-notchedOutline": {
              border: "1px solid",
            },
          }}
          placeholder="Search mentor"
          value={mentorSearchValue}
          onChange={(e) => setMentorSearchValue(e.target.value)}
        />
        <DataTable
          loading={isMentorDataLoading}
          disableMultipleSelection={true}
          disableSelectionOnClick={false} // Add this line
          rows={mentor_assign}
          columns={MentorAssignColumns}
          checkboxSelection
          selectedAllRows={selectedMentorsByField[currentField] || []}
          handleSelectedRow={(rows) => handleSelectedRow(rows, currentField)}
          footerAction={() => setCurrentField("")}
          footerComponent={(props) =>
            mentorFooterComponent({
              ...props,
              selectedMentorsByField,
              setMentorSearchValue,
            })
          }
        />
      </MuiModal>
    </div>
  );
};

export default ProgramSteps;
