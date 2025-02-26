import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import modal_tick_icon from "../../assets/icons/modal_tick_icon.svg";
import modal_error_icon from "../../assets/icons/programErrorIcon.svg";
import PlusIcon from "../../assets/icons/add_popup_icon.svg";
import CancelIcon from "../../assets/icons/closeIcon.svg";
import Tooltip from "../../shared/Tooltip";
import { CreateMeetingFields } from "../../utils/formFields";
import { Button } from "../../shared";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Button as MuiButton,
  Radio,
  RadioGroup,
  Select,
  TextField,
  useTheme,
} from "@mui/material";
import { getProgramMentees } from "../../services/userprograms";
import { CalendarMentee } from "../../mock";
import {
  useCreateCalendarEventMutation,
  useGetCalendarEventQuery,
  useUpdateCalendarEventMutation,
} from "../../features/schedule/scheduleApi.services";
import { Avatar } from "@mui/material";
import { MuiCustomModal } from "../../shared/Modal/MuiCustomModal";
import { FormLabelRequired } from "../../utils";
import MuiTimePicker from "../../shared/CustomTimePicker/MuiTimePicker";
import moment from "moment";
import PopupTableInput from "../../shared/PopupTableInput/PopupTableInput";
import MuiDatePicker from "../../shared/CustomDatePicker/MuiDatePicker";
import { WeekdaySelector } from "../../shared/CustomWeekdaySelector/WeekdaySelector";

export default function CreateMeeting() {
  const {
    palette: {
      primary: { main, light },
    },
  } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const id = searchParams.get("id");
  const status = searchParams.get("status");
  const { data: getEvent, isLoading: calendarLoading } =
    useGetCalendarEventQuery(
      { id, ...(status === "draft" && { status }) },
      { skip: !id }
    );

  const [
    updateCalendarEvent,
    { isSuccess, isError, data, reset: resetMeetingUpdate },
  ] = useUpdateCalendarEventMutation();

  const [
    createCalendarEvent,
    {
      isSuccess: isMeetingCreated,
      isLoading,
      isError: isErrorCreateMeeting,
      data: meetingCreateResponse,
      reset: resetMeetingCreation,
    },
  ] = useCreateCalendarEventMutation();
  const { programMenteeList, loading: menteeLoading } = useSelector(
    (state) => state.userPrograms
  );
  const [createMeetingLoading, setCreateMeetingLoading] = useState(false);
  const [addMenteeModal, setMentalModal] = useState(false);

  const [showBackdrop, setShowBackdrop] = React.useState(false);
  const [tablesPagination, setTablesPagination] = useState({
    page: 0,
    pageSize: 10,
  });

  const dispatch = useDispatch();

  const handlePaginationChange = (tableName, newModel) => {
    setTablesPagination((prev) => ({
      ...prev,
      page: newModel.page,
      pageSize: newModel.pageSize,
    }));
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    clearErrors,
    trigger,
    control,
  } = useForm({});
  const formValues = watch();

  useEffect(() => {
    if (getEvent?.id && id) {
      const resetFields = {
        ...getEvent,
        guests: getEvent.guests?.join(", ") || "", // Convert array to comma-separated string
      };

      reset(resetFields);
    }
  }, [getEvent, reset]);

  const onSubmit = async (values) => {
    let modifiedValues = { ...values };

    // Process attendees
    if (modifiedValues?.attendees?.length > 0) {
      modifiedValues.attendees = modifiedValues.attendees.map(
        (attendee) => attendee.email
      );
    }

    // Process guests
    if (modifiedValues?.guests && modifiedValues.guests !== "") {
      modifiedValues.guests = modifiedValues.guests
        .split(",")
        .map((guest) => guest.trim());
    }

    // Remove undefined values from the `values` object
    const cleanedValues = Object.keys(modifiedValues).reduce((acc, key) => {
      if (modifiedValues[key] || modifiedValues[key]?.length > 0) {
        acc[key] = modifiedValues[key];
      }
      return acc;
    }, {});

    // Prepare the API payload
    let apiData = {
      ...cleanedValues,
      ...(cleanedValues?.day_numbers && {
        day_numbers: cleanedValues.day_numbers?.join(","),
      }),
      ...(cleanedValues?.byday && { byday: cleanedValues.byday?.join(",") }),
    };

    // Send the payload to the appropriate API function
    if (apiData && id) {
      if (apiData?.status === "draft") {
        delete apiData?.status;
      }
      await updateCalendarEvent({
        apiData,
        eventSelect: apiData?.event,
      });
      return;
    }
    await createCalendarEvent(apiData);
  };

  const onDraftSubmit = async () => {
    clearErrors();
    let isValid = true;
    const mandatoryFields = ["start_date", "end_date", "start", "end", "title"];
    for (const fields of mandatoryFields) {
      if (!formValues?.[fields]) {
        isValid = await trigger(fields);
      }
    }
    if (isValid) {
      await onSubmit({ ...formValues, status: "draft" });
    }
  };

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  }

  useEffect(() => {
    dispatch(getProgramMentees());
  }, []);

  const handleAction = () => {
    setMentalModal(true);
  };

  useEffect(() => {
    const sub = watch((values) => console.log("values", values));

    return () => sub.unsubscribe();
  }, [watch]);

  const submitButtonName = id ? "Update Meeting" : "Create Meeting";

  const handleCancel = () => {
    reset();
    resetMeetingCreation();
    resetMeetingUpdate();
    clearErrors(); // Clear any form errors
    setShowBackdrop(false); // Close the modal
  };

  useEffect(() => {
    if (isSuccess || isError || isErrorCreateMeeting || isMeetingCreated) {
      setShowBackdrop(true);

      // Set timeout to handle cleanup after 3 seconds
      const timer = setTimeout(() => {
        // Reset all states
        setShowBackdrop(false);

        // Only navigate on success cases
        if (isSuccess || isMeetingCreated) {
          navigate("/calendar");
          handleCancel();
        }
      }, 3000);
      return () => {
        clearTimeout(timer);

        handleCancel();
      };
    }
  }, [isError, isErrorCreateMeeting, isMeetingCreated, isSuccess]);

  const getDateValidation = (fieldName) => {
    return {
      required: `${
        fieldName === "end_date" ? "End Date" : "Start Date"
      } is required`,
      validate: {
        isValid: (value) => !value || moment(value).isValid() || "Invalid date",
        dateOrder: (value) => {
          if (fieldName === "end_date") {
            const startDate = getValues("start_date");

            return (
              !value ||
              !startDate ||
              moment(value).isSameOrAfter(moment(startDate)) ||
              "End date must be after start date"
            );
          }
          return true;
        },
      },
    };
  };

  useEffect(() => {
    const startDate = formValues?.start_date;

    if (formValues?.date_category === "do_not_repeat" && startDate) {
      setValue("end_date", startDate);
    }
  }, [formValues.date_category, formValues?.start_date]);
  return (
    <div className="dashboard-content px-8 mt-10">
      <div
        style={{
          boxShadow: "4px 4px 25px 0px rgba(0, 0, 0, 0.05)",
          borderRadius: "10px",
        }}
      >
        <div className="title flex justify-between py-3 px-4 border-b-2 items-center">
          <div className="flex gap-4">
            <h4>{id ? "Edit Meeting" : "Create New Meeting"}</h4>
          </div>
          <div className="flex gap-20 items-center">
            <Tooltip title="Cancel">
              <img
                className="cursor-pointer"
                onClick={() => navigate("/calendar")}
                src={CancelIcon}
                alt="CancelIcon"
              />
            </Tooltip>
          </div>
        </div>

        <Backdrop
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={menteeLoading | isLoading || calendarLoading}
        >
          {(menteeLoading || isLoading || calendarLoading) && (
            <CircularProgress color="inherit" />
          )}
        </Backdrop>

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={createMeetingLoading}
          onClick={() => setCreateMeetingLoading(false)}
        >
          <div className="px-5 py-1 flex justify-center items-center">
            <div
              className="flex justify-center items-center flex-col gap-[2.25rem] py-[4rem] px-[3rem] mt-20 mb-20"
              style={{ background: "#fff", borderRadius: "10px" }}
            >
              <img src={modal_tick_icon} alt="SuccessTik" />
              <p
                className="text-[16px] font-semibold text-font-primary-main"
                style={{
                  fontWeight: 600,
                }}
              >
                Meeting created successfully to Mentees
              </p>
            </div>
          </div>
        </Backdrop>

        <MuiCustomModal
          PaperProps={{
            sx: {
              background: "rgba(249, 249, 249, 1)",
            },
          }}
          open={showBackdrop}
          maxWidth="sm"
          onClose={() => setShowBackdrop(false)}
        >
          <div className="flex justify-center items-center flex-col gap-y-4">
            {(isSuccess || isMeetingCreated) && (
              <Avatar src={modal_tick_icon} />
            )}
            {(isError || isErrorCreateMeeting) && (
              <Avatar src={modal_error_icon} />
            )}
            <p
              className={`
            ${
              isSuccess || isMeetingCreated
                ? "text-font-primary-main"
                : "text-red-500"
            } 
          pb-4 text-center font-normal text-md`}
              role="alert"
            >
              {data?.message ||
                data?.msg ||
                meetingCreateResponse?.message ||
                meetingCreateResponse?.detail ||
                meetingCreateResponse?.msg}
            </p>
          </div>
        </MuiCustomModal>

        <div className="px-8 py-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-wrap gap-4">
              {CreateMeetingFields.map((field, index) => {
                if (
                  field.name === "event" &&
                  (location.pathname === "/create-meeting" ||
                    status === "draft")
                ) {
                  return null;
                }
                // Handle visibility for byday and day_numbers
                if (
                  field.name === "day_numbers" &&
                  formValues?.date_category !== "month_week"
                ) {
                  // Add empty space div if neither byday nor day_numbers should show
                  if (formValues?.date_category !== "weekly_byday") {
                    return <div key={`space-${index}`} className="w-[49%]" />;
                  }
                  return null;
                }

                if (
                  field.name === "byday" &&
                  formValues?.date_category !== "weekly_byday"
                ) {
                  return null;
                }

                // Handle end_date disabled state
                const isEndDateDisabled =
                  field.name === "end_date" &&
                  formValues?.date_category === "do_not_repeat";

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
                    <FormLabelRequired
                      required={field?.inputRules?.required}
                      htmlFor={field.label}
                    >
                      {field.label}
                    </FormLabelRequired>
                    {field.type === "input" ? (
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
                              {...controlledField}
                              value={formValues[field.name] || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                controlledField.onChange(value);
                              }}
                              onBlur={controlledField.onBlur}
                              InputProps={{
                                endAdornment: field.icon &&
                                  field.icon === "add" && (
                                    <Tooltip title={field.placeholder}>
                                      <img
                                        className="absolute cursor-pointer top-4 right-4"
                                        onClick={() => handleAction(field.name)}
                                        src={PlusIcon}
                                        alt="PlusIcon"
                                      />
                                    </Tooltip>
                                  ),
                              }}
                              error={!!errors[field.name]}
                              helperText={errors[field.name]?.message}
                              onWheel={(e) => e.target.blur()}
                            />
                          )}
                        />
                      </div>
                    ) : field.type === "radio" ? (
                      <Controller
                        name={field.name}
                        control={control}
                        rules={field.inputRules}
                        render={({ field: controllerField }) => (
                          <FormControl
                            fullWidth
                            component="fieldset"
                            className="my-3"
                            error={!!errors[field.name]}
                          >
                            <RadioGroup
                              sx={{ justifyContent: "space-between" }}
                              {...controllerField}
                              row
                              value={controllerField.value}
                              onChange={(e) => {
                                const value = e.target.value;
                                controllerField.onChange(value);
                                setValue(field.name, value);
                              }}
                            >
                              {field.options?.map((option) => (
                                <FormControlLabel
                                  key={option.key}
                                  value={option.key}
                                  control={
                                    <Radio
                                      checked={
                                        controllerField.value === option.key
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
                    ) : field.type === "popup-input" ? (
                      <div className="relative">
                        <Controller
                          name={field.name}
                          control={control}
                          rules={field.inputRules}
                          render={({ field: { onChange, name } }) => {
                            let dataSource = programMenteeList;
                            let fieldValueKey = "first_name";
                            let totalRows = 0;

                            return (
                              <PopupTableInput
                                // disabled={disablePopupField}
                                fieldName={name}
                                label={field.label}
                                valueKey={fieldValueKey}
                                tableData={dataSource}
                                selectedItems={formValues[field.name]}
                                onChange={onChange}
                                multiSelect={true}
                                columns={CalendarMentee}
                                placeholder={field.placeholder}
                                onFieldClick={() => handleAction(field.name)}
                                paginationMode={"client"}
                                totalRows={totalRows}
                                onPaginationChange={handlePaginationChange}
                                tablesPagination={tablesPagination}
                                error={
                                  !!errors[field.name] &&
                                  errors[field.name].message
                                }
                              />
                            );
                          }}
                        />
                      </div>
                    ) : field.type === "dropdown" ? (
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
                              value={formValues[field?.name] || ""}
                              onChange={(e) => {
                                controlledField.onChange(e);
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
                    ) : field.type === "select" ? (
                      <Controller
                        name={field.name}
                        control={control}
                        defaultValue={[]}
                        rules={field.inputRules}
                        render={({ field: controlledField }) => {
                          return (
                            <Select
                              fullWidth
                              placeholder={field.placeholder}
                              multiple={field.name === "day_numbers"}
                              value={formValues[field?.name] || []}
                              onChange={(e) => {
                                controlledField.onChange(e);
                              }}
                              error={!!errors[field.name]}
                              helperText={errors[field.name]?.message}
                            >
                              <MenuItem value="">
                                <em>Select</em>
                              </MenuItem>
                              {field.options?.map((item) => (
                                <MenuItem key={item} value={item}>
                                  {item}
                                </MenuItem>
                              ))}
                            </Select>
                          );
                        }}
                      />
                    ) : field.type === "date" ? (
                      <div className="relative">
                        <MuiDatePicker
                          disabled={isEndDateDisabled}
                          {...register(
                            field?.name,
                            getDateValidation(field?.name)
                          )}
                          value={
                            getValues(field.name)
                              ? moment(getValues(field.name))
                              : null
                          }
                          placeholder={"mm/dd/yyyy"}
                          onChange={(newValue) => {
                            setValue(
                              field.name,
                              newValue
                                ? moment(newValue).format("YYYY-MM-DD")
                                : null
                            );
                          }}
                          {...(field.name === "start_date"
                            ? {
                                minDate: moment(), // Use moment object directly
                              }
                            : {})}
                          {...(field.name === "end_date"
                            ? {
                                minDate: moment(getValues("start_date")), // Use moment object directly
                              }
                            : {})}
                          error={!!errors?.[field.name]}
                          helperText={errors?.[field.name]?.message}
                        />
                      </div>
                    ) : field.type === "time" ? (
                      <div className="relative">
                        <Controller
                          name={field.name}
                          control={control}
                          rules={field.inputRules}
                          defaultValue=""
                          render={({ field: { onChange, value } }) => (
                            <MuiTimePicker
                              format="hh:mm A" // Display in 12-hour format with AM/PM
                              ampm={true}
                              value={value ? moment(value, "HH:mm") : null}
                              onChange={(newValue) => {
                                const timeString = newValue
                                  ? moment(newValue).format("HH:mm")
                                  : null;
                                onChange(timeString);
                              }}
                              error={!!errors[field.name]}
                              helperText={errors[field.name]?.message}
                            />
                          )}
                        />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-6 justify-center align-middle">
              <MuiButton
                color="primary"
                variant="outlined"
                onClick={() => navigate("/calendar")}
              >
                {"Cancel"}
              </MuiButton>
              {(status === "draft" ||
                location.pathname === "/create-meeting") && (
                <Button
                  btnName="Draft"
                  btnCls="w-[170px]"
                  btnStyle={{
                    background: light,
                    color: main,
                    border: "none",
                  }}
                  btnCategory="secondary"
                  onClick={onDraftSubmit}
                />
              )}
              <Button
                btnType="submit"
                btnCls="w-[170px]"
                btnName={submitButtonName}
                btnCategory="primary"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
