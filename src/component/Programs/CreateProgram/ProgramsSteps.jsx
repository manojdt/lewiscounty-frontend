import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import UploadIcon from "../../../assets/images/image_1x.png";
import DeleteIcon from "../../../assets/images/delete_1x.png";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { Button as MuiButton } from "@mui/material";
import { formatZipCode } from "../../../utils/formFields";
import { CertificateColumns, MentorAssignColumns } from "../../../mock";
import CustomDateTimePicker from "../../../shared/CustomDateTimePicker/MuiDateTimePicker";
import moment from "moment";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { MuiMenuDropDown } from "../../../shared/Dropdown/MuiMenuDropDown";
import { getProgramAddressDetails } from "../../../services/programInfo";
import { OverlayPanel } from "primereact/overlaypanel";
import PopupTableInput from "../../../shared/PopupTableInput/PopupTableInput";
import { WeekdaySelector } from "../../../shared/CustomWeekdaySelector/WeekdaySelector";
import DynamicFieldsComponent from "./DynamicFieldsComponent"; // Import the new component

const ProgramSteps = ({
  stepFields,
  stepData,
  handleProgramCheck,
  isMentorDataLoading,
  setMentorSearchValue,
  mentor_assign,
  certificate,
  setViewDetailsInfo,
  setViewDetails,
  onPaginationChange,
  tablesPagination,
}) => {
  const dispatch = useDispatch();
  const location = useLocation(); // Get query parameters

  // Parse query params
  const queryParams = new URLSearchParams(location.search);
  const isReopen = queryParams.get("status") === "isReopen";

  const [anchorEl, setAnchorEl] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const [openEquipmentModal, setOpenEquipmentModal] = React.useState(false);
  const searchBar = useRef(null);

  const open = Boolean(anchorEl);

  const handleMoreClose = () => {
    setAnchorEl(null);
  };

  const handleViewOptionClick = () => {
    switch (actionModal) {
      case "equipments":
        handleClickViewEquipment();
        break;

      default:
        break;
    }
    handleMoreClose();
  };

  const handleMenuClick = async (action) => {
    switch (action) {
      case "view":
        handleViewOptionClick();
        break;
      default:
        break;
    }
    handleMoreClose();
  };
  const params = useParams();

  const {
    register,
    formState: { errors },
    getValues,
    setValue,
    watch,
    control,
  } = useFormContext();
  const formValues = watch();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "goals",
  });

  const {
    fields: recurringFields,
    append: appendRecurringFields,
    remove: removeRecurringFields,
  } = useFieldArray({
    control,
    name: "recurring_dates",
  });
  const {
    fields: prerequisiteFields,
    append: appendPrerequisiteField,
    remove: removePrerequisiteField,
  } = useFieldArray({
    control,
    name: "prerequisites",
  });

  const [
    goalsCount,
    is_sponsored,
    program_mode,
    recurring_program,
    start_date,
    end_date,
  ] = watch([
    "goals_count",
    "is_sponsored",
    "program_mode",
    "recurring_program",
    "start_date",
    "end_date",
  ]);

  const handleInputClick = (e, field) => {
    if (["zip_code", "state", "city"].includes(field.name))
      if (!document.getElementById("fields_overlay") && e.target.value) {
        searchBar?.current?.toggle(e);
      }
  };

  const handleAddressFieldsAPI = (fieldName, value) => {
    if (fieldName === "zip_code") {
      const zipCodeFormatValue = formatZipCode(value);
      setValue(fieldName, zipCodeFormatValue);
    } else {
      setValue(fieldName, value);
    }
    if (!!value) {
      setTimeout(() => {
        dispatch(
          getProgramAddressDetails({ id: value, fieldName: fieldName })
        ).then((response) => {
          if (isLoading) setLoading(false);
          if (!!response?.payload?.data?.length) {
            setFilteredData(response?.payload?.data);
          }
        });
      }, 2000);
    }
  };
  const [actionModal, setActionModal] = useState("");

  const handleAction = (key) => {
    setActionModal(key);
  };

  const handleClickViewEquipment = () => {
    setOpenEquipmentModal(true);
  };

  const handleInputChange = (e, field) => {
    const { value } = e.target;
    if (["zip_code", "state", "city"].includes(field.name)) {
      if (!document.getElementById("fields_overlay") && e.target.value) {
        searchBar?.current?.toggle(e);
      }
      if (!isLoading) {
        setLoading(true);
      }
      handleAddressFieldsAPI(field.name, value);
    } else {
      setValue(field.name, value.trimStart());
    }
  };

  const ViewDetailsButton = ({ onClick }) => (
    <MuiButton size="small" onClick={onClick}>
      View Details
    </MuiButton>
  );

  const createUpdatedColumns = (originalColumns, type) => {
    return originalColumns.map((col) => {
      if (col.field === "action") {
        return {
          ...col,
          renderCell: (params) => {
            const handleClick = () => {
              const updates = {
                viewDetailsInfo: { [type]: params.row },
                viewDetails: {
                  certificate: type === "certificate",
                },
              };

              setViewDetailsInfo((prev) => ({
                ...prev,
                ...updates.viewDetailsInfo,
              }));

              setViewDetails(updates.viewDetails);
            };

            return <ViewDetailsButton onClick={handleClick} />;
          },
        };
      }

      return col;
    });
  };

  // Create updated columns using the helper function
  const updatedCertificateColumn = createUpdatedColumns(
    CertificateColumns,
    "certificate"
  );
  const updatedMemberColumn = createUpdatedColumns(
    MentorAssignColumns,
    "assign_mentor_id"
  );

  const updatedMentorAssignColumns = createUpdatedColumns(
    MentorAssignColumns,
    "mentor_id"
  );

  // Updated MODAL_CONFIG with correct handlers
  const MODAL_CONFIG = {
    certifications: {
      modalTitle: "Add certificate",
      rows: "certificate",
      columns: updatedCertificateColumn,
      btnName: "Add Certificate",
    },
    members: {
      modalTitle: "Add Mentor",
      rows: "assign_mentor_id",
      columns: updatedMemberColumn,
      btnName: "Add Mentor",
    },
    mentor_id: {
      modalTitle: "Add Program Manager",
      rows: "mentor_id",
      columns: updatedMentorAssignColumns,
      btnName: "Add Program Manager",
    },
  };

  React.useEffect(() => {
    const count = parseInt(goalsCount, 10) || 0;
    const currentLength = fields.length;

    if (count > currentLength) {
      for (let i = currentLength; i < count; i++) {
        append({
          series: i + 1,
          name: "",
          description: "",
          start_date: "",
          end_date: "",
          mentor_id: "",
        });
      }
    } else if (count < currentLength) {
      for (let i = currentLength - 1; i >= count; i--) {
        remove(i);
      }
    }
  }, [goalsCount, fields.length, append, remove]);

  React.useEffect(() => {
    if (recurring_program && recurringFields?.length === 0 && !params?.id) {
      appendRecurringFields({
        start_date: "",
        end_date: "",
      });
    } else if (!recurring_program && recurringFields?.length > 0) {
      // Clear recurring fields when recurring_program becomes false
      recurringFields.forEach((_, index) => {
        removeRecurringFields(index);
      });
    }
  }, [
    recurring_program,
    recurringFields?.length,
    appendRecurringFields,
    removeRecurringFields,
  ]);

  // Initialize prerequisites if empty
  React.useEffect(() => {
    // Initialize with one prerequisite item if none exists
    if (prerequisiteFields?.length === 0 && !params?.id) {
      appendPrerequisiteField({
        question: "",
        field_type: "",
        mandatory: false,
        field_options: [], // Initialize empty - the DynamicFieldsComponent will handle adding options as needed
      });
    }
  }, [prerequisiteFields?.length, appendPrerequisiteField, params?.id]);

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

  const handleDeleteImage = (key) => {
    setValue(key, "");
  };

  // Get date validation for fields
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
                ? getValues(`goals.${index}.start_date`)
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
                ? getValues(`goals.${index}.start_date`)
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
                ? getValues(`goals.${index}.start_date`)
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

  // Determine if fields should be disabled
  const disablePopupField = params?.id && !isReopen;
  const disableRecurringProgram = params?.id && !isReopen;
  const disableDateFields = (fieldName) =>
    params?.id &&
    (fieldName === "start_date" || fieldName === "end_date") &&
    !isReopen;

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

          if (field.name === "enrollment_fees" && is_sponsored !== false) {
            // Only show enrollment_fees when is_sponsored is explicitly false
            return null;
          }
          if (field.name === "sponsor_logos" && is_sponsored !== true) {
            // Only show sponsor_logos when is_sponsored is explicitly true
            return null;
          }

          const disableFields = params?.id && field.name === "program_name";

          const disableSelectFields =
            params?.id &&
            (field.name === "course_level" ||
              field.name === "category" ||
              field.name === "type");

          const onFilteredDataChange = (programInfo) => {
            ["zip_code", "state", "city"].map((item) => {
              const updated_item = item === "state" ? "state_name" : item;
              setValue(item, programInfo[updated_item]);
            });
            setValue("location", programInfo.id);
          };

          if (
            field.name === "day_numbers" &&
            formValues?.reminder_type !== "month_week"
          ) {
            // Add empty space div if neither byday nor day_numbers should show
            if (formValues?.reminder_type !== "weekly_byday") {
              return <div key={`space-${index}`} className="w-[49%]" />;
            }
            return null;
          }

          if (
            field.name === "byday" &&
            formValues?.reminder_type !== "weekly_byday"
          ) {
            return null;
          }

          // Handle dynamic fields rendering for goals, recurring_dates, and prerequisites
          if (field.type === "dynamicFields") {
            if (field.name === "goals") {
              return (
                <DynamicFieldsComponent
                  key={`dynamic-${field.name}`}
                  fieldType="goals"
                  fields={fields}
                  dynamicFields={field.dynamicFields}
                  removeFieldFunction={remove}
                  appendFieldFunction={append}
                  formValues={formValues}
                  disablePopupField={disablePopupField}
                  disableDateFields={disableDateFields}
                  handleProgramCheck={handleProgramCheck}
                  isMentorDataLoading={isMentorDataLoading}
                  setMentorSearchValue={setMentorSearchValue}
                  mentor_assign={mentor_assign}
                  onPaginationChange={onPaginationChange}
                  tablesPagination={tablesPagination}
                  getDateValidation={getDateValidation}
                  start_date={start_date}
                  end_date={end_date}
                  MODAL_CONFIG={MODAL_CONFIG}
                  handleAction={handleAction}
                />
              );
            } else if (field.name === "recurring_dates" && recurring_program) {
              return (
                <DynamicFieldsComponent
                  key={`dynamic-${field.name}`}
                  fieldType="recurring_dates"
                  fields={recurringFields}
                  dynamicFields={field.dynamicFields}
                  removeFieldFunction={removeRecurringFields}
                  appendFieldFunction={appendRecurringFields}
                  formValues={formValues}
                  disablePopupField={disablePopupField}
                  disableDateFields={disableDateFields}
                  disableRecurringProgram={disableRecurringProgram}
                  getDateValidation={getDateValidation}
                  MODAL_CONFIG={MODAL_CONFIG}
                  handleAction={handleAction}
                />
              );
            } else if (field.name === "prerequisites") {
              return (
                <DynamicFieldsComponent
                  key={`dynamic-${field.name}`}
                  fieldType="prerequisites"
                  fields={prerequisiteFields}
                  dynamicFields={field.dynamicFields}
                  removeFieldFunction={removePrerequisiteField}
                  appendFieldFunction={appendPrerequisiteField}
                  formValues={formValues}
                  disablePopupField={disablePopupField}
                  MODAL_CONFIG={MODAL_CONFIG}
                  handleAction={handleAction}
                />
              );
            } else {
              return null;
            }
          }

          // For standard field types
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
                <Controller
                  name={field.name}
                  control={control}
                  defaultValue={false}
                  rules={field.inputRules}
                  render={({ field: controllerField }) => (
                    <FormControl
                      component="fieldset"
                      className="my-3"
                      error={!!errors[field.name]}
                    >
                      <RadioGroup
                        {...controllerField}
                        row
                        aria-labelledby="radio-buttons-group"
                        value={controllerField.value?.toString()}
                        onChange={(e) => {
                          const Value =
                            field.name === "reminder_type"
                              ? e.target.value
                              : e.target.value === "true";
                          controllerField.onChange(Value);
                          setValue(field.name, Value);
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
                              />
                            }
                            label={option.value}
                          />
                        ))}
                      </RadioGroup>
                      <FormHelperText>
                        {errors[field.name]?.message}
                      </FormHelperText>
                    </FormControl>
                  )}
                />
              ) : field.type === "checkbox" ? (
                <Controller
                  name={field.name}
                  control={control}
                  render={() => (
                    <WeekdaySelector
                      control={control}
                      name={field.name}
                      options={field.options}
                    />
                  )}
                />
              ) : field.type === "input" ? (
                <>
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
                          {...controlledField}
                          value={formValues[field.name] || ""}
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
                          onClick={(e) => handleInputClick(e, field)}
                          onBlur={controlledField.onBlur}
                          InputProps={{
                            startAdornment: field.name ===
                              "enrollment_fees" && <AttachMoneyIcon />,
                          }}
                          error={!!errors[field.name]}
                          helperText={errors[field.name]?.message}
                          onWheel={(e) => e.target.blur()}
                        />
                      )}
                    />
                  </div>

                  {["zip_code", "state", "city"].includes(field.name) && (
                    <OverlayPanel
                      ref={searchBar}
                      id="fields-overlay"
                      style={{
                        width: "350px",
                        top: "63px !important",
                        height: "200px",
                        overflow: "auto",
                      }}
                      className={isLoading ? "custom-overlay" : ""}
                      onClose={() => console.log("Close")}
                    >
                      {!!filteredData?.length &&
                        !isLoading &&
                        filteredData?.map((item) => {
                          return (
                            <div
                              key={item.id}
                              className=" flex cursor-pointer"
                              style={{ height: "50px" }}
                              onClick={() => onFilteredDataChange(item)}
                            >
                              <div className="pr-1">{item.city},</div>
                              <div className="pr-1">{item.state_code},</div>
                              <div>{item.zip_code}</div>
                            </div>
                          );
                        })}
                      {isLoading && <div className="loader"></div>}
                    </OverlayPanel>
                  )}
                </>
              ) : field.type === "popup-input" ? (
                <Controller
                  name={field.name}
                  control={control}
                  rules={field.inputRules}
                  render={({ field: { onChange }, fieldState: { error } }) => {
                    let dataSource;
                    let fieldValueKey;
                    let totalRows = 0;

                    if (field.name === "certifications") {
                      dataSource = certificate || [];
                      fieldValueKey = "name";
                      totalRows = certificate?.length;
                    } else if (field.name === "assign_mentor_id") {
                      dataSource = mentor_assign || [];
                      fieldValueKey = "full_name";
                      totalRows = mentor_assign?.length;
                    }
                    return (
                      <PopupTableInput
                        disabled={disablePopupField}
                        fieldName={field.name}
                        toolBarComponent={
                          MODAL_CONFIG[actionModal]?.createBtnName && (
                            <MuiButton
                              onClick={
                                MODAL_CONFIG[actionModal]?.onCreateBtnClick
                              }
                            >
                              {MODAL_CONFIG[actionModal]?.createBtnName}
                            </MuiButton>
                          )
                        }
                        label={field.label}
                        valueKey={fieldValueKey}
                        tableData={dataSource}
                        selectedItems={formValues[field.name] || []}
                        onChange={onChange}
                        multiSelect={true}
                        columns={MODAL_CONFIG[actionModal]?.columns}
                        placeholder={MODAL_CONFIG[actionModal]?.modalTitle}
                        onFieldClick={() => handleAction(field.name)}
                        paginationMode={"client"}
                        totalRows={totalRows}
                        onPaginationChange={onPaginationChange}
                        tablesPagination={tablesPagination[field.name]}
                        error={error && error.message}
                      />
                    );
                  }}
                />
              ) : field.type === "dropdown" ? (
                <Controller
                  name={field.name}
                  control={control}
                  defaultValue="" // Explicitly set default value as empty string
                  rules={field.inputRules}
                  render={({ field: controlledField }) => {
                    const fieldValue =
                      field.name === "day_numbers"
                        ? formValues[field.name] || []
                        : formValues[field.name] || ""; // Ensure empty string as fallback

                    return (
                      <TextField
                        select
                        fullWidth
                        disabled={disableSelectFields}
                        value={fieldValue} // Use the properly handled value
                        onChange={(e) => {
                          const newValue = e.target.value;
                          // Ensure we're passing the correct value type
                          controlledField.onChange(newValue);                         
                        }}
                        SelectProps={{
                          multiple: field.name === "day_numbers",
                        }}
                        error={!!errors[field.name]}
                        helperText={errors[field.name]?.message}
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        {field.options?.map((option) => (
                          <MenuItem
                            key={option.id || option.key}
                            value={option.id || option.key}
                          >
                            {option.value || option.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    );
                  }}
                />
              ) : field.type === "textbox" ? (
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
                      setValue(field.name, e.target.value?.trimStart(), {
                        shouldDirty: true,
                        shouldTouch: true,
                      });
                    },
                  })}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]?.message}
                />
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
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed cursor-pointer bg-gray-50"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
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
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Add Logo/Image</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
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
              ) : null}
            </div>
          );
        })}
      </div>

      <MuiMenuDropDown
        anchorEl={anchorEl}
        open={open}
        onClose={handleMoreClose}
        menuItems={[]}
        handleMenuClick={handleMenuClick}
      />
    </div>
  );
};

export default ProgramSteps;
