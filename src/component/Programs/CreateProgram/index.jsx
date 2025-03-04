import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProgramSteps from "./ProgramsSteps";
import {
  ProgramTabs,
  ProgramFields,
  ProgramInformationFields,
} from "../../../utils/formFields";
import MuiModal from "../../../shared/Modal";
import Tooltip from "../../../shared/Tooltip";
import CancelIcon from "../../../assets/icons/closeIcon.svg";
import CertificateIcon from "../../../assets/images/dummy_certificate.png";
import SuccessIcon from "../../../assets/images/Success_tic1x.png";
import FailedIcon from "../../../assets/icons/programErrorIcon.svg";
import ToastNotification from "../../../shared/Toast";
import { FormProvider, useForm } from "react-hook-form";
import { Button as MuiButton, useTheme } from "@mui/material";
import {
  useCreateProgramMutation,
  useUpdateProgramMutation,
  useGetSpecificProgramDetailsQuery,
  useGetAllCategoriesQuery,
  useGetCertificatesQuery,
  useValidateProgramNameMutation,
} from "../../../features/program/programApi.services";

const DEFAULT_VALUE = 1;

export default function CreatePrograms() {
  const {
    palette: {
      primary: { main, light },
    },
  } = useTheme();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.userInfo);
  const params = useParams();
  const [currentStep, setCurrentStep] = useState(DEFAULT_VALUE);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [stepWiseData, setStepWiseData] = useState({});

  const [viewDetails, setViewDetails] = useState({
    certificate: false,
  });

  const [viewDetailsInfo, setViewDetailsInfo] = useState({
    certificate: {},
  });

  const [tabActionInfo, setTabActionInfo] = useState({
    activeTab: "program_information",
    error: false,
    message: "",
  });

  const methods = useForm({
    defaultValues: {
      goals_count: 1,
      goals: [
        {
          name: "",
          description: "",
          start_date: "",
          end_date: "",
          mentor_id: [],
        },
      ],
      is_sponsored: true,
      prerequisites: [
        {
          question: "",
          field_type: "",
          mandatory: false,
          field_options: [{ title: "" }],
        },
      ],
    },
  });

  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    unregister,
    clearErrors,
    trigger,
    getValues,
  } = methods;
  const formValues = watch();

  const [tablesPagination, setTablesPagination] = useState({
    certifications: { page: 0, pageSize: 10 },
    mentor_id: { page: 0, pageSize: 10 },
    assign_mentees: { page: 0, pageSize: 10 },
  });

  const {
    data: currentProgramDetail,
    isLoading: isDetailFetching,
  } = useGetSpecificProgramDetailsQuery(
    { id: params?.id },
    { skip: !params?.id, refetchOnMountOrArgChange: true }
  );

  const { data: category } = useGetAllCategoriesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { data: certificate } = useGetCertificatesQuery(
    {
      ...(formValues?.category && {
        category_id: formValues?.category,
      }),
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !formValues?.category,
    }
  );

  const [
    createProgram,
    {
      isLoading: isProgramCreating,
      isSuccess: isProgramCreated,
      isError: IsErrorProgramCreating,
      data: createResponse,
    },
  ] = useCreateProgramMutation();
  const [
    updateProgram,
    {
      isLoading: isProgramUpdating,
      isSuccess: isProgramUpdated,
      isError: IsErrorProgramUpdating,
      data: updateResponse,
    },
  ] = useUpdateProgramMutation();

  const [validateProgramName] = useValidateProgramNameMutation();

  const [stepData, setStepData] = useState({});

  const [programAllFields, setProgramAllFields] = useState(
    ProgramInformationFields
  );

  const scrollToTop = () => {
    const dashboardContent = document.querySelector(".dashboard-content");
    if (dashboardContent) {
      dashboardContent.scrollIntoView({ block: "start" });
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
      });
    }
  };

  const resetViewInfo = { certificate: false };

  const handlePaginationChange = (tableName, newModel) => {
    setTablesPagination((prev) => ({
      ...prev,
      [tableName]: {
        page: newModel.page,
        pageSize: newModel.pageSize,
      },
    }));
  };

  const handleProgramCheck = (data) => {
    validateProgramName(data)
      .unwrap()
      .then((res) => {
        if (res?.meta?.requestStatus === "fulfilled") {
          if (res?.is_available) {
            setTabActionInfo({
              ...tabActionInfo,
              error: true,
              message: res?.message,
            });
          }
        }
      });
  };

  const handleNextStep = async (data) => {
    // Get the current step's allowed fields

    // Get allowed field names for current step
    const allowedFields = ProgramInformationFields.map((field) => field.name);
    // Filter the incoming data to only include allowed fields
    const currentStepData = Object.keys(data)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});

    // Filter stepData to remove fields from current step
    const filteredStepData = Object.keys(data)
      .filter((key) => !allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});

    // Combine filtered previous step data with current step data
    let fieldData = {
      ...filteredStepData,
      ...currentStepData,
      location: data.location ? data.location : null,
    };

    // Remove specific fields based on is_sponsored condition
    if (fieldData.is_sponsored === true) {
      delete fieldData.enrollment_fees;
    }
    if (fieldData.is_sponsored === false) {
      delete fieldData.sponsor_logos;
    }
    fieldData = Object.entries(fieldData)
      .filter(
        ([_, value]) => value !== "" && value !== null && value !== undefined
      )
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
    // setStepData(fieldData);
    if (!params?.id) {
      // Validate program name before proceeding with form submission
      try {
        const res = await validateProgramName(data).unwrap();
        console.log("res", res);

        // Check if the program name is available
        if (res?.meta?.requestStatus === "fulfilled") {
          if (res?.is_available) {
            // If program name is not available (is_available is true), show error and don't proceed
            setTabActionInfo({
              ...tabActionInfo,
              error: true,
              message: res?.message,
            });
            // Exit the function early without proceeding to formData logic
            return;
          }
        }
        // If we get here, either res.is_available is false or we didn't get a fulfilled status
        // In either case, proceed with form submission
        await processFormData(fieldData, formValues);
      } catch (error) {
        console.error("Error validating program name:", error);
        setTabActionInfo({
          ...tabActionInfo,
          error: true,
          message: "Error validating program name",
        });
      }
    } else {
      // For existing programs (with ID), skip validation and proceed directly
      await processFormData(fieldData, formValues);
    }
  };

  // Helper function to process and submit form data
  const processFormData = async (fieldData, formValues) => {
    let bodyFormData = new FormData();

    const jsonFields = [
      "prerequisites",
      "certifications",
      "goals",
      "recurring_dates",
      "mentor_id",
      "assign_mentees",
    ];

    jsonFields.forEach((field) => {
      if (jsonFields.includes(field) && Array.isArray(formValues[field])) {
        // Specific handling for mentor_id and assign_mentees
        if (field === "mentor_id" || field === "assign_mentees") {
          const ids = formValues[field]
            .map((item) => item.id)
            .filter((id) => id); // Extract ids
          if (ids.length > 0) {
            if (field === "mentor_id") {
              bodyFormData.append(field, JSON.stringify(ids?.[0]));
            } else {
              bodyFormData.append(field, JSON.stringify(ids));
            }
          }
        }
        // Handle goals
        else if (field === "goals") {
          const goalEntries = formValues[field].map((goal) => {
            return {
              ...goal,
              mentor_id: goal?.mentor_id
                ? goal?.mentor_id?.map((mentor) =>
                    mentor?.hasOwnProperty("mentor_id")
                      ? mentor?.mentor_id
                      : mentor?.id
                  )?.[0]
                : [],
            };
          });
          if (goalEntries.length > 0) {
            bodyFormData.append(field, JSON.stringify(goalEntries));
          }
        }
        // Handle prerequisites
        else if (field === "prerequisites") {
          const updatePrerequisites = fieldData[field].map((item) => {
            // Create a base object with required fields
            const baseItem = {
              ...item,
              field_options: item?.field_options
                ?.filter(
                  (option) =>
                    typeof option.title === "string" &&
                    option.title.trim() !== ""
                )
                .map((option) => option.title),
            };

            return baseItem;
          });

          bodyFormData.append(field, JSON.stringify(updatePrerequisites));
        } else if (field === "recurring_dates") {
          const updateRecurringProgram = formValues[field].map((item) => {
            // Create a base object with required fields
            const baseItem = {
              start_date: item?.start_date,
              end_date: item?.end_date,
              reminder_type: item?.reminder_type,
              ...(item?.day_numbers && {
                day_numbers: item.day_numbers?.join(","),
              }),
              ...(item?.byday && { byday: item.byday?.join(",") }),
            };

            return baseItem;
          });
          bodyFormData.append(field, JSON.stringify(updateRecurringProgram));
        }
        // Handle other json fields normally
        else {
          // Check if the array contains valid objects with values
          const isValidArray = formValues[field].some((item) => {
            if (Array.isArray(item)) {
              return item.length > 0; // Ensure item is not an empty array
            }
            return Object.values(item).some(
              (value) => value !== "" && value !== null && value !== undefined
            );
          });

          // If the array contains valid objects, stringify and append to FormData
          if (isValidArray) {
            bodyFormData.append(field, JSON.stringify(formValues[field]));
          }
        }
      }
    });

    // Remove fields based on is_sponsored before creating FormData
    if (fieldData.is_sponsored === true) {
      delete fieldData.enrollment_fees;
    }
    if (fieldData.is_sponsored === false) {
      delete fieldData.sponsor_logos;
    }

    for (let key in fieldData) {
      if (key === "sponsor_logos") {
        if (fieldData[key]?.[0] instanceof File) {
          bodyFormData.append(key, fieldData[key][0]);
        } else if (key === "day_numbers" || key === "byday") {
          bodyFormData.append(key, fieldData[key]?.join(","));
        } else {
          bodyFormData.append(key, fieldData[key]);
        }
      } else if (["start_date", "end_date"].includes(key)) {
        bodyFormData.append(key, new Date(fieldData[key]).toISOString());
      } else if (!jsonFields.includes(key)) {
        bodyFormData.append(key, fieldData[key]);
      }
    }

    bodyFormData.append("program_admin", userInfo.data?.user_id);

    if (typeof fieldData?.sponsor_logos === "string" && isReopen) {
      bodyFormData.delete("sponsor_logos");
    }

    if (params?.id && !isReopen) {
      if (fieldData?.status === "draft") {
        bodyFormData.append("status", "create");
      }
      bodyFormData.append("program_id", params?.id);
      // for (let [key, value] of bodyFormData.entries()) {
      //   console.log(`formData: ${key}: ${value}`);
      // }
      await updateProgram({
        program_id: params?.id,
        bodyFormData,
      });
    } else {
      // for (let [key, value] of bodyFormData.entries()) {
      //   console.log(`formData: ${key}: ${value}`);
      // }
      if (isReopen) {
        bodyFormData.append("reopen_program_id", params?.id);
      }
      await createProgram(bodyFormData);
    }
  };

  const handleClose = () => {
    setTabActionInfo({ ...tabActionInfo, error: false });
  };

  const updatedFields = ProgramInformationFields.map((field) => {
    switch (field.name) {
      case "category":
        return {
          ...field,
          options:
            category?.map((cat) => ({
              id: cat.id,
              name: cat.name,
              value: cat.name,
            })) || [],
        };
      default:
        return field;
    }
  });

  useEffect(() => {
    // Guard clause for required data
    if (!currentProgramDetail?.id || !params.id) return;

    // Field value transformers
    const fieldTransformers = {
      category: (detail) =>
        detail.categories?.[0]?.id || detail.incident_type?.id,
      start_date: (detail, field) =>
        detail[field] ? new Date(detail[field]) : null,
      end_date: (detail, field) =>
        detail[field] ? new Date(detail[field]) : null,
      day_numbers: (detail) => detail.day_numbers?.split(",").map(Number),
      byday: (detail) => detail.byday?.split(","),
      sponsor_logos: (detail) => detail.sponsor_logos?.[0],
      state: (detail) => detail.location_details?.state_name,
      city: (detail) => detail.location_details?.city,
      zip_code: (detail) => detail.location_details?.zip_code,
      goals_count: (detail) => detail.goals_count,
      is_sponsored: (detail) => detail.is_sponsored,
      mentor_id: (detail) => (detail.mentor_id ? [detail.mentor_id] : []),
      goals: (detail) => {
        // Check if goals exist and is an array
        if (!detail.goals || !Array.isArray(detail.goals)) {
          return [];
        }

        return detail.goals.map((item) => ({
          id: item?.id,
          name: item?.name,
          description: item?.description,
          start_date: item?.start_date ? new Date(item.start_date) : null,
          end_date: item?.end_date ? new Date(item.end_date) : null,
          mentor_id: item?.mentor_info ? [item.mentor_info] : [],
          status: item?.status,
          // Include any other fields that might be needed for goals
        }));
      },
      prerequisites: (detail) => {
        if (!detail.prerequisites || !Array.isArray(detail.prerequisites)) {
          return [
            {
              question: "",
              field_type: "",
              mandatory: false,
              field_options: [{ title: "" }],
            },
          ];
        }

        return detail.prerequisites.map((item) => {
          // Create a base object with required fields
          const baseItem = {
            ...item,
            field_options: Array.isArray(item?.field_options)
              ? item.field_options
                  .filter(
                    (option) =>
                      typeof option === "string" && option.trim() !== ""
                  )
                  .map((option) => ({ title: option }))
              : [{ title: "" }], // Always ensure at least one empty field_option
          };

          // If there are no valid field_options after filtering, add an empty one
          if (!baseItem.field_options.length) {
            baseItem.field_options = [{ title: "" }];
          }

          return baseItem;
        });
      },
      recurring_dates: (detail) => {
        return detail.recurring_programs_details?.map((detail) => ({
          ...detail,
          ...(detail?.day_numbers && {
            day_numbers: detail.day_numbers?.split(",").map(Number),
          }),
          ...(detail?.byday && { byday: detail.byday?.split(",") }),
        }));
      },
    };

    // Process all fields
    ProgramInformationFields.forEach((field) => {
      const fieldName = field.name;

      // Skip processing if field is not defined
      if (!fieldName) return;

      let value;
      if (fieldTransformers[fieldName]) {
        value = fieldTransformers[fieldName](currentProgramDetail, fieldName);
      } else {
        value = currentProgramDetail[fieldName];
      }

      // Handle location fields specially
      if (["city", "state", "zip_code"].includes(fieldName)) {
        const filteredName = fieldName === "state" ? "state_name" : fieldName;
        if (currentProgramDetail?.location_details) {
          setValue(
            fieldName,
            currentProgramDetail?.location_details[filteredName]
          );
          if (currentProgramDetail?.location_details?.id) {
            setValue("location", currentProgramDetail.location_details.id);
          }
        }
      } else if (fieldName === "goals") {
        // Special handling for goals to ensure it's properly set
        setValue(fieldName, value);

        // If goals_count exists, make sure it's updated too
        if (value && Array.isArray(value)) {
          setValue("goals_count", value.length);
        }
      } else if (fieldName === "category") {
        // Set the value with validation for category field
        setValue(fieldName, value, {
          shouldValidate: true,
          shouldDirty: true,
        });
      } else {
        setValue(fieldName, value);
      }
    });
  }, [currentProgramDetail, params.id, setValue, getValues]); // Only run when currentProgramDetail or params.id changes

  useEffect(() => {
    // If any completion state (success or error) is true, show the backdrop
    if (
      isProgramCreated ||
      isProgramUpdated ||
      IsErrorProgramCreating ||
      IsErrorProgramUpdating
    ) {
      setShowBackdrop(true);

      // Set timeout to handle cleanup after 3 seconds
      const timer = setTimeout(() => {
        // Reset all states
        setShowBackdrop(false);

        // Only navigate on success cases
        if (isProgramCreated || isProgramUpdated) {
          navigate("/programs");
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isProgramCreated, isProgramUpdated, IsErrorProgramUpdating]);

  useEffect(() => {
    if (tabActionInfo.error) {
      setTimeout(() => {
        setTabActionInfo({ ...tabActionInfo, error: false });
      }, 3000);
    }
  }, [tabActionInfo.error]);

  const onDraftSubmit = async () => {
    clearErrors();
    let isValid = true;
    const mandatoryFields = ["category", "program_name"];
    const { state, city, zip_code, ...data } = formValues;
    // Check for mandatory fields
    for (const fields of mandatoryFields) {
      if (!data?.[fields]) {
        isValid = await trigger(fields);
      }
    }

    if (isValid) {
      let bodyFormData = new FormData();

      // Define jsonFields that need special handling
      const jsonFields = [
        "prerequisites",
        "certifications",
        "goals",
        "recurring_dates",
        "mentor_id",
        "assign_mentees",
      ];

      // Iterate through the data object
      for (let key in data) {
        // Check if the key exists and the value is not empty, null, or undefined
        if (
          data.hasOwnProperty(key) &&
          data[key] !== "" &&
          data[key] !== null &&
          data[key] !== undefined
        ) {
          // Handle jsonFields (arrays of objects)
          if (jsonFields.includes(key) && Array.isArray(data[key])) {
            // Specific handling for mentor_id and assign_mentees
            if (key === "mentor_id" || key === "assign_mentees") {
              const ids = data[key].map((item) => item.id).filter((id) => id); // Extract ids
              if (ids.length > 0) {
                if (key === "mentor_id") {
                  bodyFormData.append(key, JSON.stringify(ids?.[0]));
                } else {
                  bodyFormData.append(key, JSON.stringify(ids));
                }
              }
            }
            // Handle goals
            else if (key === "goals") {
              const goalEntries = data[key].map((goal) => {
                return {
                  ...goal,
                  mentor_id: goal?.mentor_id
                    ? goal?.mentor_id?.map((mentor) =>
                        mentor?.hasOwnProperty("mentor_id")
                          ? mentor?.mentor_id
                          : mentor?.id
                      )?.[0]
                    : [],
                };
              });
              if (goalEntries.length > 0) {
                bodyFormData.append(key, JSON.stringify(goalEntries));
              }
            }
            // Handle prerequisites
            else if (key === "prerequisites") {
              const updatePrerequisites = data[key].map((item) => {
                // Create a base object with required fields
                const baseItem = {
                  ...item,
                  field_options: item?.field_options
                    ?.filter(
                      (option) =>
                        typeof option.title === "string" &&
                        option.title.trim() !== ""
                    )
                    .map((option) => option.title),
                };

                return baseItem;
              });

              bodyFormData.append(key, JSON.stringify(updatePrerequisites));
            } else if (key === "recurring_dates") {
              const updateRecurringProgram = data[key].map((item) => {
                // Create a base object with required fields
                const baseItem = {
                  start_date: item?.start_date,
                  end_date: item?.end_date,
                  reminder_type: item?.reminder_type,
                  ...(item?.day_numbers && {
                    day_numbers: item.day_numbers?.join(","),
                  }),
                  ...(item?.byday && { byday: item.byday?.join(",") }),
                };

                return baseItem;
              });
              bodyFormData.append(key, JSON.stringify(updateRecurringProgram));
            }
            // Handle other json fields normally
            else {
              // Check if the array contains valid objects with values
              const isValidArray = data[key].some((item) => {
                if (Array.isArray(item)) {
                  return item.length > 0; // Ensure item is not an empty array
                }
                return Object.values(item).some(
                  (value) =>
                    value !== "" && value !== null && value !== undefined
                );
              });

              // If the array contains valid objects, stringify and append to FormData
              if (isValidArray) {
                bodyFormData.append(key, JSON.stringify(data[key]));
              }
            }
          }
          // Handle special cases for files and dates
          else if (key === "sponsor_logos" && data[key]?.[0] instanceof File) {
            bodyFormData.append(key, data[key][0]);
          } else if (["start_date", "end_date"].includes(key)) {
            bodyFormData.append(key, new Date(data[key]).toISOString());
          } else if (key === "day_numbers" || key === "byday") {
            bodyFormData.append(key, data[key]?.join(","));
          }
          // Handle all other fields
          else {
            bodyFormData.append(key, data[key]);
          }
        }
      }

      // Append additional fields
      bodyFormData.append("program_admin", userInfo.data?.user_id);
      bodyFormData.append("status", "draft");

      if (params?.id) {
        bodyFormData.append("program_id", params?.id);
        await updateProgram({
          program_id: params?.id,
          bodyFormData,
        });
      } else {
        await createProgram(bodyFormData);
      }
    }
  };

  useEffect(() => {
    const isAddressField = [
      "address_line1",
      "address_line2",
      "state",
      "city",
      "zip_code",
    ];

    if (
      formValues?.program_mode &&
      formValues?.program_mode !== "physical_location"
    ) {
      isAddressField.forEach((field) => unregister(field));
    }
  }, [formValues?.program_mode, unregister]);

  useEffect(() => {
    scrollToTop();
  }, [currentStep]);

  useEffect(() => {
    return () => {
      // Cleanup function that runs when component unmounts
      reset(); // Reset the entire form when navigating away
    };
  }, [reset]);

  const location = useLocation(); // Get query parameters
  const queryParams = new URLSearchParams(location.search);
  const isReopen = queryParams.get("status") === "isReopen";

  const onSubmit = (program_data) => {
    const { state, city, zip_code, ...data } = program_data;
    if (isReopen) {
      const { end_date, start_date } = data;
      const startDate = new Date(start_date).getTime();
      const endDate = new Date(end_date).getTime();
      const current_date = new Date().getTime();
      if (startDate < current_date || endDate <= current_date) {
        setTabActionInfo({
          ...tabActionInfo,
          error: true,
          message: "Please change the start and end date",
        });
        return null;
      }
    }
    // setStepWiseData((prevStData) => {
    //   const newStepData = {
    //     ...prevStData,
    //     [currentStep]: { ...prevStData[currentStep], ...data },
    //   };
    //   return newStepData;
    // });
    handleNextStep(data);
    // scrollToTop();
  };

  useEffect(() => {
    const sub = watch((values) => console.log("values", values));

    return () => sub.unsubscribe();
  }, [watch]);

  const handleCancelClick = () => {
    navigate("/programs");

    reset();
  };
  return (
    <div className="dashboard-content px-8 mt-10">
      <div className="border border-background-primary-main rounded">
        <div className="title flex justify-between py-5 px-4 border-b-2 items-center">
          <div className="flex gap-4 font-medium">
            <h4>{params.id ? "Update Program" : "Create New Program"}</h4>
          </div>
          <div className="flex gap-20 items-center">
            <Tooltip title="Cancel">
              <img
                className="cursor-pointer"
                onClick={handleCancelClick}
                src={CancelIcon}
                alt="CancelIcon"
              />
            </Tooltip>
          </div>
        </div>
        {tabActionInfo.error && (
          <ToastNotification
            openToaster={tabActionInfo.error}
            message={
              tabActionInfo?.message
                ? tabActionInfo?.message
                : "Please fill all mandatory fields"
            }
            handleClose={handleClose}
            toastType={"error"}
          />
        )}

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={
            showBackdrop || // Control visibility with local state
            isProgramCreating ||
            isProgramUpdating
          }
        >
          {isProgramCreating || isProgramUpdating || isDetailFetching ? (
            <CircularProgress color="inherit" />
          ) : (
            <div className="w-[450px] bg-white flex flex-col gap-10 h-[230px] justify-center items-center rounded-[10px] border border-background-primary-main">
              <img
                className="h-[45px] w-[45px]"
                src={
                  isProgramCreated || isProgramUpdated
                    ? SuccessIcon
                    : FailedIcon
                }
                alt="StatusIcon"
              />
              <span style={{ color: "#232323", fontWeight: 600 }}>
                {IsErrorProgramCreating || IsErrorProgramUpdating
                  ? `Error ${
                      IsErrorProgramCreating ? "Creating" : "Updating"
                    } program`
                  : createResponse?.message || updateResponse?.message}
              </span>
            </div>
          )}
        </Backdrop>
        {!isDetailFetching && (
          <div className="px-3 py-4 sm:px-3 md:px-4 lg:px-8 xl:px-8">
            <div className="flex gap-3">
              {/* {ProgramTabs.map((actionBtn, index) => (
                <Tooltip title={actionBtn.name}>
                  <button
                    key={index}
                    className={`px-5 py-4 text-[14px] rounded-sm ${
                      tabActionInfo.activeTab === actionBtn.key
                        ? "bg-background-primary-main text-white"
                        : "bg-[#F3F7FC] text-black"
                    }`}
                    onClick={() => handleTab(actionBtn.key)}
                  >
                    {actionBtn.name}
                  </button>
                </Tooltip>
              ))} */}
            </div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <div className="py-9">
                  <ProgramSteps
                    setViewDetailsInfo={setViewDetailsInfo}
                    handleProgramCheck={handleProgramCheck}
                    currentProgramDetail={currentProgramDetail}
                    isDetailFetching={isDetailFetching}
                    stepFields={updatedFields}
                    certificate={certificate}
                    setViewDetails={setViewDetails}
                    onPaginationChange={handlePaginationChange}
                    tablesPagination={tablesPagination}
                  />
                </div>
                <div className="flex gap-6 justify-center align-middle">
                  {/* {currentStep === 1 && ( */}
                  <MuiButton
                    variant="outlined"
                    color="inherit"
                    onClick={handleCancelClick}
                    autoFocus={false}
                  >
                    {"Cancel"}
                  </MuiButton>
                  {/* )} */}
                  {/* {currentStep > 1 && (
                    <MuiButton
                      variant="outlined"
                      color="inherit"
                      onClick={handlePreviousStep}
                      autoFocus={false}
                    >
                      {"Back"}
                    </MuiButton>
                  )} */}
                  {(!params?.id ||
                    currentProgramDetail?.status === "draft") && (
                    // && currentProgramDetail?.status === "draft"
                    <MuiButton
                      sx={{
                        background: light,
                        color: main,
                        border: "none",
                      }}
                      onClick={onDraftSubmit}
                    >
                      {"Draft"}
                    </MuiButton>
                  )}
                  <MuiButton type="submit" autoFocus={false}>
                    {params?.id ? "Submit" : "Create"}
                  </MuiButton>
                </div>
              </form>
            </FormProvider>
          </div>
        )}

        <MuiModal
          modalSize="lg"
          modalOpen={viewDetails.certificate}
          modalClose={() => setViewDetails(resetViewInfo)}
          noheader
        >
          <div className="px-5 py-5">
            <div
              className="flex justify-center flex-col gap-5  mt-4 mb-4"
              style={{
                border: "1px solid rgba(217, 228, 242, 1)",
                borderRadius: "10px",
              }}
            >
              <div
                className="flex justify-between px-3 py-4 items-center"
                style={{ background: "rgba(217, 228, 242, 1)" }}
              >
                <p
                  className="text-[14px]"
                  style={{ color: "rgba(24, 40, 61, 1)" }}
                >
                  {viewDetailsInfo.certificate?.name}{" "}
                </p>
                <img
                  className="cursor-pointer"
                  onClick={() => setViewDetails(resetViewInfo)}
                  src={CancelIcon}
                  alt="CancelIcon"
                />
              </div>
              <div className="px-4 py-3">
                <p className="text-[12px] pb-6">
                  {viewDetailsInfo.certificate?.certificate_description}
                </p>
                <img
                  className="w-full h-[500px]"
                  src={CertificateIcon}
                  alt="CertificateIcon"
                />
              </div>
              <div className="flex justify-center items-center pt-5 pb-10">
                <button
                  onClick={() => setViewDetails(resetViewInfo)}
                  className="text-white py-3 px-7 w-[25%] bg-background-primary-main"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </MuiModal>
      </div>
    </div>
  );
}
