import React, { useEffect } from "react";
import {
  TextField,
  FormControl,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Radio,
  RadioGroup,
  Checkbox,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { Controller, useFormContext, useFieldArray } from "react-hook-form";
import moment from "moment";
import DeleteIconRounded from "../../../assets/icons/delete-icon.svg";
import { Button as MuiButton } from "@mui/material";
import CustomDateTimePicker from "../../../shared/CustomDateTimePicker/MuiDateTimePicker";
import PopupTableInput from "../../../shared/PopupTableInput/PopupTableInput";
import { WeekdaySelector } from "../../../shared/CustomWeekdaySelector/WeekdaySelector";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CloseIcon from "@mui/icons-material/Close";
// Helper component to handle prerequisite options for a single prerequisite
const PrerequisiteOptions = ({ index, fieldType }) => {
  const {
    control,
    watch,
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  // Use field array for this specific prerequisite's options
  const {
    fields: optionFields,
    append: appendOption,
    // remove: removeOption,
    replace: replaceOptions,
  } = useFieldArray({
    control,
    name: `${fieldType}.${index}.field_options`,
  });

  const selectedFieldType = watch(`${fieldType}.${index}.field_type`);
  const previousFieldType = React.useRef(selectedFieldType);

  const handleAddOptions = () => {
    if (selectedFieldType === "radio" || selectedFieldType === "checkbox") {
      appendOption({ title: "" });
    }
  };

  const handleCloseOption = (option) => {
    console.log("option ===>", option);
    const clearedOptions = optionFields?.filter((i) => i?.id !== option?.id);
    replaceOptions(clearedOptions);
  };

  // Reset field_options when field_type changes
  useEffect(() => {
    if (selectedFieldType !== previousFieldType.current) {
      // Field type has changed, reset options
      if (selectedFieldType === "memo" || selectedFieldType === "file") {
        // For memo and file, add just one empty option and clear any existing values
        replaceOptions([{ title: "" }]);
        // Clear any existing values (important!)
        setValue(`${fieldType}.${index}.field_options.0.title`, "");
      } else if (
        selectedFieldType === "radio" ||
        selectedFieldType === "checkbox"
      ) {
        // For radio and checkbox, add one empty option to start
        replaceOptions([{ title: "" }]);
        // Clear any existing values (important!)
        setValue(`${fieldType}.${index}.field_options.0.title`, "");
      }
      previousFieldType.current = selectedFieldType;
    }
  }, [selectedFieldType, replaceOptions, setValue, fieldType, index]);

  // Initialize options if needed
  useEffect(() => {
    if (
      (selectedFieldType === "radio" ||
        selectedFieldType === "standalone-checkbox") &&
      (!optionFields || optionFields.length === 0)
    ) {
      appendOption({ title: "" });
    }
  }, [selectedFieldType, optionFields, appendOption]);

  if (!selectedFieldType) return null;

  // For memo and file types, render a single input field
  if (selectedFieldType === "memo" || selectedFieldType === "file") {
    return (
      <div className={`w-[50%] mt-4`}>
        <TextField
          variant="standard"
          fullWidth
          placeholder="Enter field value"
          {...register(`${fieldType}.${index}.field_options.0.title`)}
          error={!!errors?.[fieldType]?.[index]?.field_options?.[0]?.title}
          helperText={
            errors?.[fieldType]?.[index]?.field_options?.[0]?.title?.message
          }
          sx={{ bgcolor: "transparent" }}
        />
      </div>
    );
  }

  // For radio and checkbox types, render multiple options with better alignment
  return (
    <div
    // className="flex flex-row justify-between"
    >
      <div>
        {optionFields.map((option, optionIndex) => (
          <div className="flex flex-row gap-2 items-center">
            <div
              key={option.id}
              className={`flex items-center gap-2 w-[50%] mt-4`}
            >
              {selectedFieldType === "radio" ? (
                <RadioButtonUncheckedIcon />
              ) : (
                <CheckBoxOutlineBlankIcon />
              )}
              <TextField
                variant="standard"
                fullWidth
                placeholder={`Option ${optionIndex + 1}`}
                {...register(
                  `${fieldType}.${index}.field_options.${optionIndex}.title`
                )}
                error={
                  !!errors?.[fieldType]?.[index]?.field_options?.[optionIndex]
                    ?.title
                }
                helperText={
                  errors?.[fieldType]?.[index]?.field_options?.[optionIndex]
                    ?.title?.message
                }
                // onBlur={(e) => {
                //   // Only add a new option if this is the last one and it's not empty
                //   if (
                //     e.target.value &&
                //     optionIndex === optionFields.length - 1 &&
                //     (selectedFieldType === "radio" ||
                //       selectedFieldType === "checkbox")
                //   ) {
                //     appendOption({ title: "" });
                //   }
                // }}
                sx={{ bgcolor: "transparent" }}
              />
            </div>
            <div className="!bg-background-error-light p-1 rounded-full mt-4">
              <CloseIcon
                onClick={() => handleCloseOption(option)}
                className="!text-font-error-main cursor-pointer"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-start">
        <MuiButton
          variant="text"
          onClick={() => handleAddOptions()}
          className="py-2 px-4 bg-background-primary-main text-white rounded !mt-2"
        >
          Add +
        </MuiButton>
      </div>
    </div>
  );
};

const DynamicFieldsComponent = ({
  fieldType,
  fields,
  dynamicFields,
  removeFieldFunction,
  appendFieldFunction,
  formValues,
  disablePopupField = false,
  disableDateFields = () => false,
  handleProgramCheck,
  disableRecurringProgram = false,
  isMentorDataLoading = false,
  setMentorSearchValue,
  mentor_assign,
  onPaginationChange,
  tablesPagination,
  getDateValidation,
  start_date,
  end_date,
  MODAL_CONFIG = {},
  handleAction,
}) => {
  const {
    register,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  const renderItemHeader = (field, index) => {
    let headerTitle = "Prerequisite";
    if (fieldType === "goals") {
      headerTitle = "Goal";
    } else if (fieldType === "recurring_dates") {
      headerTitle = "Program cycle";
    }

    return (
      <div className="flex justify-between px-5 py-4 bg-background-primary-light rounded">
        <div className="text-sm font-semibold text-font-primary-main">{`${
          index + 1
        }. ${headerTitle}`}</div>
        {(fieldType === "recurring_dates" || fieldType === "prerequisites") &&
          fields.length > 1 && (
            <button type="button" onClick={() => removeFieldFunction(index)}>
              <img
                className={"w-8 h-8"}
                src={DeleteIconRounded}
                alt="DeleteIconRounded"
              />
            </button>
          )}
      </div>
    );
  };

  const renderField = (nestedField, index) => {
    const fieldName = `${fieldType}.${index}.${nestedField.name}`;

    // Handle conditional rendering of day_numbers field
    if (
      nestedField.name === "day_numbers" &&
      ((fieldType === "goals" && !watch(`goals.${index}.reminder_type`)) ||
        (fieldType === "recurring_dates" &&
          watch(`recurring_dates.${index}.reminder_type`) !== "month_week"))
    ) {
      // Add empty space div if neither byday nor day_numbers should show
      if (
        fieldType === "recurring_dates" &&
        watch(`recurring_dates.${index}.reminder_type`) !== "weekly_byday"
      ) {
        return <div key={`space-${index}`} className="w-[49%]" />;
      }
      return null;
    }

    // Handle conditional rendering of byday field
    if (
      nestedField.name === "byday" &&
      ((fieldType === "goals" && !watch(`goals.${index}.byday`)) ||
        (fieldType === "recurring_dates" &&
          watch(`recurring_dates.${index}.reminder_type`) !== "weekly_byday"))
    ) {
      return null;
    }

    return (
      <div
        key={`${fieldName}-${index}`}
        className={nestedField.width || "w-full"}
      >
        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2 mt-5">
          {nestedField.label}{" "}
          {nestedField?.name === "mentor_id" ? (
            <span className="!text-font-secondary-gray !text-[12px]">
              {"(Optional)"}
            </span>
          ) : (
            ""
          )}
          <span style={{ color: "red" }}>
            {nestedField?.inputRules?.required ? "*" : ""}
          </span>
        </label>

        {renderFieldByType(nestedField, index, fieldName)}
      </div>
    );
  };

  const renderFieldByType = (nestedField, index, fieldName) => {
    switch (nestedField.type) {
      case "input":
        return (
          <TextField
            {...register(fieldName, nestedField.inputRules)}
            placeholder={nestedField.placeholder}
            onBlur={(e) => {
              if (
                nestedField.name === "name" &&
                e?.target?.value &&
                fieldType === "goals" &&
                handleProgramCheck
              ) {
                handleProgramCheck({
                  program_name: e?.target?.value,
                  ...(formValues?.goals?.[index]?.id && {
                    program_id: formValues?.goals?.[index]?.id,
                  }),
                });
              }
            }}
            error={!!errors?.[fieldType]?.[index]?.[nestedField.name]}
            helperText={
              errors?.[fieldType]?.[index]?.[nestedField.name]?.message
            }
            onWheel={(e) => e.target.blur()}
          />
        );

      case "textarea":
        return (
          <TextField
            multiline
            rows={4}
            placeholder={nestedField.placeholder}
            {...register(fieldName, nestedField.inputRules)}
            error={!!errors?.[fieldType]?.[index]?.[nestedField.name]}
            helperText={
              errors?.[fieldType]?.[index]?.[nestedField.name]?.message
            }
          />
        );

      case "date":
        return (
          <div className="relative">
            <CustomDateTimePicker
              disabled={disableDateFields(nestedField.name)}
              placeholder={"mm/dd/yyyy hh:mm AM/PM"}
              {...register(
                fieldName,
                getDateValidation
                  ? getDateValidation(nestedField.name, index)
                  : {}
              )}
              value={
                formValues?.[fieldType]?.[index]?.[nestedField.name]
                  ? moment(formValues?.[fieldType]?.[index]?.[nestedField.name])
                  : null
              }
              onChange={(newValue) => {
                setValue(fieldName, newValue ? newValue.toISOString() : null);
              }}
              minDate={fieldType === "goals" ? moment(start_date) : moment()}
              maxDate={fieldType === "goals" ? moment(end_date) : undefined}
              error={!!errors?.[fieldType]?.[index]?.[nestedField.name]}
              helperText={
                errors?.[fieldType]?.[index]?.[nestedField.name]?.message
              }
            />
          </div>
        );

      case "radio":
        return (
          <FormControl
            component="fieldset"
            className={`my-3`}
            error={!!errors?.[fieldType]?.[index]?.[nestedField.name]?.message}
          >
            <Controller
              name={fieldName}
              control={control}
              defaultValue={
                nestedField.options?.[0]?.key === "true"
                  ? true
                  : nestedField.options?.[0]?.key || ""
              }
              render={({ field: nestedControllerField }) => (
                <RadioGroup
                  {...nestedControllerField}
                  row
                  aria-labelledby="radio-buttons-group"
                  value={String(nestedControllerField.value)}
                  onChange={(e) => {
                    // Convert string value to boolean or keep as string based on field
                    const value =
                      nestedField.name === "reminder_type"
                        ? e.target.value
                        : e.target.value === "true";
                    nestedControllerField.onChange(value);
                    setValue(fieldName, value);
                  }}
                >
                  {nestedField.options &&
                    nestedField.options.map((option) => (
                      <FormControlLabel
                        key={option.key}
                        value={String(option.key)}
                        disabled={disableRecurringProgram}
                        control={
                          <Radio
                            checked={
                              String(nestedControllerField.value) ===
                              String(option.key)
                            }
                          />
                        }
                        label={option.value}
                      />
                    ))}
                </RadioGroup>
              )}
            />
            <FormHelperText>
              {errors?.[fieldType]?.[index]?.[nestedField.name]?.message}
            </FormHelperText>
          </FormControl>
        );

      case "checkbox":
        return (
          <WeekdaySelector
            control={control}
            name={fieldName}
            options={nestedField.options}
          />
        );
      case "standalone-checkbox":
        return (
          <Controller
            name={fieldName}
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={field.value || false}
                    onChange={(e) => field.onChange(e.target.checked)}
                    color="primary"
                  />
                }
                label={nestedField.label}
              />
            )}
          />
        );

      case "popup-input":
        return (
          <Controller
            name={fieldName}
            control={control}
            rules={nestedField.inputRules}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
              let dataSource = mentor_assign?.results || [];
              let fieldValueKey = "full_name";
              let totalRows = mentor_assign?.count || 0;

              return (
                <PopupTableInput
                  disabled={disablePopupField}
                  toolBarComponent={
                    MODAL_CONFIG[nestedField.name]?.createBtnName && (
                      <MuiButton
                        onClick={
                          MODAL_CONFIG[nestedField.name]?.onCreateBtnClick
                        }
                      >
                        {MODAL_CONFIG[nestedField.name]?.createBtnName}
                      </MuiButton>
                    )
                  }
                  onSearchChange={setMentorSearchValue}
                  loading={isMentorDataLoading}
                  fieldName={nestedField.name}
                  label={nestedField.label}
                  valueKey={fieldValueKey}
                  tableData={dataSource}
                  selectedItems={value || []}
                  onChange={onChange}
                  multiSelect={false}
                  columns={MODAL_CONFIG[nestedField.name]?.columns}
                  placeholder={nestedField.placeholder || "Select"}
                  onFieldClick={() =>
                    handleAction && handleAction(nestedField.name)
                  }
                  paginationMode={"server"}
                  totalRows={totalRows}
                  onPaginationChange={onPaginationChange}
                  tablesPagination={
                    tablesPagination && tablesPagination[nestedField.name]
                  }
                  error={error && error?.message}
                />
              );
            }}
          />
        );

      case "dropdown":
        return (
          <Controller
            name={fieldName}
            control={control}
            defaultValue={nestedField.name === "day_numbers" ? [] : ""}
            rules={nestedField.inputRules}
            render={({ field: controlledField }) => {
              const fieldValue =
                nestedField.name === "day_numbers"
                  ? formValues?.[fieldType]?.[index]?.[nestedField.name] || []
                  : formValues?.[fieldType]?.[index]?.[nestedField.name] || "";

              return (
                <TextField
                  select
                  fullWidth
                  value={fieldValue}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    controlledField.onChange(newValue);
                  }}
                  SelectProps={{
                    multiple: nestedField.name === "day_numbers",
                    renderValue: (selected) => {
                      if (nestedField.name === "day_numbers")
                        return selected.join(", ");
                      return selected || "";
                    },
                  }}
                  error={!!errors?.[fieldType]?.[index]?.[nestedField.name]}
                  helperText={
                    errors?.[fieldType]?.[index]?.[nestedField.name]?.message
                  }
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                  {nestedField.options?.map((option) => (
                    <MenuItem
                      key={option.id || option.key}
                      value={option.id || option.key}
                    >
                      <ListItemIcon>{option.icon}</ListItemIcon>
                      <ListItemText>{option.value || option.name}</ListItemText>
                    </MenuItem>
                  ))}
                </TextField>
              );
            }}
          />
        );
      case "dynamicFields": {
        return <PrerequisiteOptions index={index} fieldType={fieldType} />;
      }

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {fields.map((item, index) => (
        <div
          key={item.id}
          className="border border-background-primary-main rounded mb-3"
        >
          {renderItemHeader(item, index)}
          <div className="flex flex-wrap justify-between p-4">
            {dynamicFields.map((nestedField) =>
              renderField(nestedField, index)
            )}
          </div>
        </div>
      ))}

      {(fieldType === "recurring_dates" || fieldType === "prerequisites") && (
        <div className="flex justify-end items-center mb-4">
          <MuiButton
            variant="text"
            onClick={() => {
              if (fieldType === "recurring_dates") {
                appendFieldFunction({
                  start_date: null,
                  end_date: null,
                });
              } else if (fieldType === "prerequisites") {
                appendFieldFunction({
                  question: "",
                  field_type: "",
                  mandatory: false,
                  field_options: [],
                });
              }
            }}
            className="py-2 px-4 bg-background-primary-main text-white rounded"
          >
            Add +
          </MuiButton>
        </div>
      )}
    </div>
  );
};

export default DynamicFieldsComponent;
