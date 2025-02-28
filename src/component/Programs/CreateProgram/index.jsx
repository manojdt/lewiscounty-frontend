import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProgramSteps from "./ProgramsSteps";
import { ProgramTabs, ProgramFields } from "../../../utils/formFields";
import { getProgramNameValidate } from "../../../services/programInfo";
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
  useGetAllMentorsQuery,
  useValidateProgramNameMutation,
} from "../../../features/program/programApi.services";
import { useDebounce } from "../../../utils";

const DEFAULT_VALUE = 1;

export default function CreatePrograms() {
  const {
    palette: {
      primary: { main, light },
    },
  } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
      is_sponsored: false,
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
  } = methods;
  const formValues = watch();
  const [tablesPagination, setTablesPagination] = useState({
    certifications: { page: 0, pageSize: 10 },
    mentor_id: { page: 0, pageSize: 10 },
    assign_mentees: { page: 0, pageSize: 10 },
  });

  const { data: currentProgramDetail, isLoading: isDetailFetching } =
    useGetSpecificProgramDetailsQuery(
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
    },
  ] = useCreateProgramMutation();
  const [
    updateProgram,
    {
      isLoading: isProgramUpdating,
      isSuccess: isProgramUpdated,
      isError: IsErrorProgramUpdating,
    },
  ] = useUpdateProgramMutation();

  const [validateProgramName] = useValidateProgramNameMutation();

  const [stepData, setStepData] = useState({});

  const [programAllFields, setProgramAllFields] = useState(ProgramFields);

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
        // if (res?.meta?.requestStatus === "fulfilled") {
        if (res?.is_available) {
          setTabActionInfo({
            ...tabActionInfo,
            error: true,
            message: res?.message,
          });
        }
        // }
      });
  };
  const handleTab = (key) => {
    // scrollToTop();
    const tabIndex = ProgramTabs.findIndex((tab) => tab.key === key);
    // if (stepWiseData.hasOwnProperty(tabIndex + 1) || stepWiseData.hasOwnProperty(tabIndex)) {
    const nextIndex = tabIndex + 1;
    setCurrentStep(nextIndex);
    setTabActionInfo({ ...tabActionInfo, activeTab: key });
    // }
  };

  // const arrayHasEmptyElements = (arrayOfObjects) => {
  //   const hasEmptyValue = arrayOfObjects.some((obj) => {
  //     return Object.values(obj).some(
  //       (value) => value === "" || value === null || value === undefined
  //     );
  //   });
  //   return hasEmptyValue;
  // };
  const handleNextStep = async (data) => {
    // Get the current step's allowed fields
    let currentStepField = ProgramFields[currentStep - 1];

    // Get allowed field names for current step
    const allowedFields = currentStepField.map((field) => field.name);
    // Filter the incoming data to only include allowed fields
    const currentStepData = Object.keys(data)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});

    // Filter stepData to remove fields from current step
    const filteredStepData = Object.keys(stepData)
      .filter((key) => !allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = stepData[key];
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
    setStepData(fieldData);
    const totalSteps = ProgramTabs.length;
    if (currentStep === 1 && !params?.id) {
      dispatch(getProgramNameValidate(data?.program_name)).then((res) => {
        if (res?.meta?.requestStatus === "fulfilled") {
          if (!res?.payload?.is_available) {
            setCurrentStep((prevStep) => {
              const nextStep = prevStep + 1;
              setTabActionInfo({
                ...tabActionInfo,
                activeTab: ProgramTabs[nextStep - 1]?.key || "",
              });
              return nextStep;
            });
          } else {
            setTabActionInfo({
              ...tabActionInfo,
              error: true,
              message: "Program name already exists",
            });
          }
        }
      });
    } else {
      if (currentStep >= totalSteps) {
        const answeredSteps = Object.keys(stepWiseData).length;
        if (
          (answeredSteps === currentStep - 1 &&
            !stepWiseData.hasOwnProperty(currentStep)) ||
          answeredSteps === totalSteps
        ) {
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
            if (fieldData[field]) {
              if (field === "goals") {
                const updateGoals = fieldData[field].map((item) => {
                  // Create a base object with required fields
                  const baseItem = {
                    series: item?.series,
                    name: item?.name,
                    description: item?.description,
                    start_date: item?.start_date,
                    end_date: item?.end_date,
                    mentor_id: item?.mentor_id
                      ? item?.mentor_id?.map((mentor) =>
                          mentor?.hasOwnProperty("mentor_id")
                            ? mentor?.mentor_id
                            : mentor?.id
                        )?.[0]
                      : [], // Safely access the first element of mentor_id
                  };

                  return baseItem;
                });
                // const hasEmptyValue = updateGoals.some((obj) => {
                //   return Object.values(obj).some(
                //     (value) =>
                //       value === "" || value === null || value === undefined
                //   );
                // });
                // if (!hasEmptyValue) {
                  bodyFormData.append(field, JSON.stringify(updateGoals));
                // }
              } else if (field === "prerequisites") {
                const updatePrerequisites = fieldData[field].map((item) => {
                  // Create a base object with required fields
                  const baseItem = {
                    ...item,
                    field_options: item?.field_options?.map(
                      (option) => option.title !== "" && option.title
                    ),
                  };

                  return baseItem;
                });
                // const hasEmptyValue = updatePrerequisites.some((obj) => {
                //   return Object.values(obj).some(
                //     (value) =>
                //       value === "" || value === null || value === undefined
                //   );
                // });
                // if (!hasEmptyValue) {
                  bodyFormData.append(
                    field,
                    JSON.stringify(updatePrerequisites)
                  );
                // }
              } else if (field === "recurring_dates") {
                const updateRecurringProgram = fieldData[field].map((item) => {
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
                bodyFormData.append(
                  field,
                  JSON.stringify(updateRecurringProgram)
                );
              } else {
                let selectedIds;
                if (field === "mentor_id") {
                  selectedIds = fieldData[field].map((item) => item.id)?.[0];
                } else {
                  selectedIds = fieldData[field].map((item) => item.id);
                }
                // For other fields, just stringify the array
                bodyFormData.append(field, JSON.stringify(selectedIds));
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

          if (fieldData?.status === "draft") {
            bodyFormData.append("status", "create");
          }
          if (typeof fieldData?.sponsor_logos === "string" && isReopen) {
            bodyFormData.delete("sponsor_logos");
          }
          if (params?.id && !isReopen) {
            bodyFormData.append("program_id", params?.id);
            // for (let [key, value] of bodyFormData.entries()) {
            //   console.log(`formData: ${key}: ${value}`);
            // }
            await updateProgram({
              program_id: params?.id,
              bodyFormData,
            });
          } else {
            for (let [key, value] of bodyFormData.entries()) {
              console.log(`formData: ${key}: ${value}`);
            }
            if (isReopen) {
              bodyFormData.append("reopen_program_id", params?.id);
            }
            await createProgram(bodyFormData);
          }
        } else {
          setTabActionInfo({ ...tabActionInfo, error: true, message: "" });
        }
      } else {
        setCurrentStep((prevStep) => {
          const nextStep = prevStep < totalSteps ? prevStep + 1 : totalSteps;
          setTabActionInfo({
            ...tabActionInfo,
            activeTab: ProgramTabs[nextStep - 1]?.key || "",
          });
          // scrollToTop();
          return nextStep;
        });
      }
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
    setTabActionInfo({
      ...tabActionInfo,
      activeTab: ProgramTabs[currentStep - 2].key,
    });
    // scrollToTop();
  };

  const handleClose = () => {
    setTabActionInfo({ ...tabActionInfo, error: false });
  };

  useEffect(() => {
    // This effect should only handle field structure updates based on role and step
    let currentStepField = ProgramFields[currentStep - 1];

    // Update fields with dynamic options
    const updatedFields = currentStepField.map((field) => {
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

    // Update program fields structure
    setProgramAllFields((prevFields) =>
      prevFields.map((fields, i) =>
        i === currentStep - 1 ? updatedFields : fields
      )
    );
  }, [currentStep, category?.length]); // Removed currentProgramDetail?.id and params.id from dependencies

  useEffect(() => {
    // Guard clause for required data
    if (!currentProgramDetail?.id || !params.id) return;

    // Field value transformers
    const fieldTransformers = {
      category: (detail) =>
        detail.categories?.[0]?.id || detail.incident_type?.id,
      start_date: (detail, field) => new Date(detail[field]),
      end_date: (detail, field) => new Date(detail[field]),
      day_numbers: (detail) => detail.day_numbers?.split(",").map(Number),
      byday: (detail) => detail.byday?.split(","),
      sponsor_logos: (detail) => detail.sponsor_logos?.[0],
      state: (detail) => detail.location_details?.state_name,
      city: (detail) => detail.location_details?.city,
      zip_code: (detail) => detail.location_details?.zip_code,
      goals_count: (detail) => detail.goals_count,
      is_sponsored: (detail) => detail.is_sponsored,
      goals: (detail) =>
        detail.goals?.map((item) => ({
          ...item,
          start_date: item?.start_date,
          end_date: item?.end_date,
          mentor_id: [item?.mentor_info],
        })),
      prerequisites: (detail) =>
        detail.prerequisites?.map((item) => ({
          ...item,
          field_options: item.field_options?.map((option) =>
            typeof option === "string" ? { title: option } : option
          ), // Ensure proper structure for field_options
        })),
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

    ProgramFields.flat().forEach((field) => {
      const fieldName = field.name;
      let value;

      if (fieldTransformers[fieldName]) {
        value = fieldTransformers[fieldName](currentProgramDetail, fieldName);
      } else {
        value = currentProgramDetail[fieldName];
      }
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
      }

      // Set the value with validation for category field
      if (fieldName === "category") {
        setValue(fieldName, value, {
          shouldValidate: true,
          shouldDirty: true,
        });
      } else {
        setValue(fieldName, value);
      }
    });
  }, [currentProgramDetail, params.id]); // Only run when currentProgramDetail or params.id changes

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
    for (const fields of mandatoryFields) {
      if (!formValues?.[fields]) {
        isValid = await trigger(fields);
      }
    }
    if (isValid) {
      await onSubmit({ ...formValues, status: "draft" });
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
    setStepWiseData((prevStData) => {
      const newStepData = {
        ...prevStData,
        [currentStep]: { ...prevStData[currentStep], ...data },
      };
      return newStepData;
    });
    handleNextStep(data);
    // scrollToTop();
  };

  useEffect(() => {
    const sub = watch((values) => console.log("values", values));

    return () => sub.unsubscribe();
  }, [watch]);

  const handleCancelClick = () => {
    if (!params?.id) {
      setCurrentStep(DEFAULT_VALUE);
    } else {
      navigate("/programs");
    }
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
                  : `Program ${
                      currentProgramDetail?.status === "draft"
                        ? "Drafted"
                        : isProgramUpdated
                        ? "Updated"
                        : "Created"
                    } Successfully!`}
              </span>
            </div>
          )}
        </Backdrop>
        {!isDetailFetching && (
          <div className="px-3 py-4 sm:px-3 md:px-4 lg:px-8 xl:px-8">
            <div className="flex gap-3">
              {ProgramTabs.map((actionBtn, index) => (
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
              ))}
            </div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <div className="py-9">
                  <ProgramSteps
                    setViewDetailsInfo={setViewDetailsInfo}
                    handleProgramCheck={handleProgramCheck}
                    stepData={stepData}
                    stepFields={programAllFields[currentStep - 1]}
                    certificate={certificate}
                    category={category}
                    setViewDetails={setViewDetails}
                    onPaginationChange={handlePaginationChange}
                    tablesPagination={tablesPagination}
                  />
                </div>
                <div className="flex gap-6 justify-center align-middle">
                  {currentStep === 1 && (
                    <MuiButton
                      variant="outlined"
                      color="inherit"
                      onClick={handleCancelClick}
                      autoFocus={false}
                    >
                      {"Cancel"}
                    </MuiButton>
                  )}
                  {currentStep > 1 && (
                    <MuiButton
                      variant="outlined"
                      color="inherit"
                      onClick={handlePreviousStep}
                      autoFocus={false}
                    >
                      {"Back"}
                    </MuiButton>
                  )}
                  {!params?.id && currentStep === ProgramTabs.length && (
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
                  {/* {(currentStep !== '' &&
                            (!Object.keys(programDetails).length)) || (Object.keys(programDetails).length && programDetails.status === 'draft') ? <Button btnType="button" onClick={handleDraft} btnStyle={{ background: 'rgba(197, 197, 197, 1)', color: '#000' }}
                                btnCls="w-[150px]" btnName={'Save as Draft'} btnCategory="primary" /> : null} */}

                  <MuiButton
                    type="submit"
                    id={"program-submit"}
                    autoFocus={false}
                  >
                    {currentStep === ProgramTabs.length ? "Submit" : "Next"}
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
