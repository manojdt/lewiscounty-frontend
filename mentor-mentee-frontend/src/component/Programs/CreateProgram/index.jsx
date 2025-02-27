import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReactPlayer from "react-player";
import MoreIcon from "../../../assets/icons/moreIcon.svg";
import ProgramSteps from "./ProgramsSteps";
import { ProgramTabs, ProgramFields } from "../../../utils/formFields";
import {
  updateNewPrograms,
  getProgramNameValidate,
} from "../../../services/programInfo";
import {
  CertificateColumns,
  GoalColumns,
  MaterialColumns,
  MemberColumns,
} from "../../../mock";
import DataTable from "../../../shared/DataGrid";
import { goalStatus, programStatus, user } from "../../../utils/constant";
import MuiModal from "../../../shared/Modal";
import Tooltip from "../../../shared/Tooltip";
import CancelIcon from "../../../assets/icons/closeIcon.svg";
import SuccessTik from "../../../assets/images/blue_tik1x.png";
import CertificateIcon from "../../../assets/images/dummy_certificate.png";
import SuccessIcon from "../../../assets/images/Success_tic1x.png";
import FailedIcon from "../../../assets/icons/programErrorIcon.svg";
import ToastNotification from "../../../shared/Toast";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../../../shared";
import {
  useCreateProgramMutation,
  useUpdateProgramMutation,
  useGetProgramGoalsQuery,
  useGetCountryStatesQuery,
  useGetCitiesQuery,
  useGetSpecificProgramDetailsQuery,
  useGetAllCategoriesQuery,
  useGetCertificatesQuery,
  useGetMembersQuery,
  useGetAllMentorsQuery,
  useUpdateProgramReopenMutation,
} from "../../../features/program/programApi.services";
import { MuiMenuDropDown } from "../../../shared/Dropdown/MuiMenuDropDown";
import GoalCreationModal from "./GoalCreationModal";
import MaterialsCreationModal from "./MaterialsCreationModal";
import { useGetAllMaterialsQuery } from "../../../features/materials/materialApis.services";
import CertificatesCreationModal from "./CertificateCreationModal";
import { useDebounce } from "../../../utils";

const EquipMentListMenuItems = [{ label: "View", action: "view" }];
const DEFAULT_VALUE = 1;

const scrollToTop = () => {
  const dashboardContent = document.querySelector('.dashboard-content');
  if (dashboardContent) {
    dashboardContent.scrollIntoView({  block: 'start' });
  } else {
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }
};

export default function CreatePrograms() {
  const { admin, mentor, mentee } = user;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userInfo);
  const params = useParams();
  const [loading, setLoading] = useState({ create: false, success: false });
  const [currentStep, setCurrentStep] = useState(DEFAULT_VALUE);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const role = userInfo.data.role || "";
  const [toggleRole, setToggleRole] = useState("");
  const [searchParams] = useSearchParams();
  const [mentorSearchValue, setMentorSearchValue] = useState("");
  const searchValue = useDebounce(mentorSearchValue, 500);

  useEffect(() => {
    scrollToTop();
  }, [currentStep]); 
  const program_create_type = searchParams.get("program_create_type") || "";
  const re_open_type = searchParams.get("type") || "";

  const { allPrograms, status } = useSelector((state) => state.programInfo);

  const methods = useForm({
    defaultValues:
      toggleRole === admin
        ? { no_of_subprograms: 1, sub_programs: [] }
        : undefined,
  });
  const location = useLocation(); // Get query parameters
  const queryParams = new URLSearchParams(location.search);
  const isReopen = queryParams.get("type") === "re_open";
  const { handleSubmit, reset, setValue, watch, unregister } = methods;
  // const state = watch('state');
  const formValues = watch();

  const { data: category, isLoading: isCategoryFetching } =
    useGetAllCategoriesQuery(undefined, {
      refetchOnMountOrArgChange: true,
    });

  const { data: mentor_assign, isFetching } = useGetAllMentorsQuery(
    {
      role_name: "mentor",
      page: 1,
      limit: 100,
      status: "active",
      ...(searchValue && { search: searchValue }),
    },
    {
      skip: role !== admin,
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: currentProgramDetail, isLoading: isDetailFetching } =
    useGetSpecificProgramDetailsQuery(
      { id: params?.id, ...(program_create_type && { program_create_type }) },
      { skip: !params?.id, refetchOnMountOrArgChange: true }
    );
  const { data: goals } = useGetProgramGoalsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: countryStates } = useGetCountryStatesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { data: cities } = useGetCitiesQuery(
    {
      ...(formValues?.state && { state_id: +formValues?.state }),
    },
    { refetchOnMountOrArgChange: true, skip: !formValues?.state }
  );

  const { data: materials } = useGetAllMaterialsQuery(
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
  const { data: members } = useGetMembersQuery(
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

  const [
    updateProgramReopen,
    {
      isLoading: isProgramReopenUpdating,
      isSuccess: isProgramReopenUpdated,
      isError: IsErrorProgramReopenUpdating,
    },
  ] = useUpdateProgramReopenMutation();

  const [stepData, setStepData] = useState({});
  const [actionModal, setActionModal] = useState("");
  const [openMaterialModal, setOpenMaterialModal] = React.useState(false);
  const [openCertificateModal, setOpenCertificateModal] = React.useState(false);
  const [openGoalsModal, setOpenGoalsModal] = React.useState(false);

  const [programAllFields, setProgramAllFields] = useState(ProgramFields);
  const [formDetails, setFormDetails] = useState({
    category: [],
    materials: [],
    certificate: [],
    members: [],
    goals: [],
    learning_materials: [],
  });

  const ID_ONLY_FIELDS = [
    "goals",
    "certifications",
    "learning_materials",
    "members",
  ];
  const [tempSelectedRows, setTempSelectedRows] = useState([]);
  const [logo, setLogo] = useState({});
  const [stepWiseData, setStepWiseData] = useState({});
  const [selectedItem, setSelectedItem] = React.useState({});
  const [programApiStatus, setProgramApiStatus] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMoreClick = (event, data) => {
    setSelectedItem(data);
    setAnchorEl(event.currentTarget);
  };

  const handleMoreClose = () => {
    setAnchorEl(null);
  };

  const handleMaterialCreateBtnClick = () => {
    setOpenMaterialModal(true);
  };

  const handleCertificateCreateBtnClick = () => {
    setOpenCertificateModal(true);
  };

  const handleClickOpen = () => {
    setOpenGoalsModal(true);
  };

  const handleMenuClick = async (action) => {
    switch (action) {
      case "view":
        handleViewOptionClick();
        break;
      default:
        break;
    }
    handleClose();
  };

  const handleCloseModal = () => {
    setOpenCertificateModal(false);
    setOpenMaterialModal(false);
    setOpenGoalsModal(false);
  };

  const [viewDetails, setViewDetails] = useState({
    material: false,
    certificate: false,
  });

  const [viewDetailsInfo, setViewDetailsInfo] = useState({
    material: {},
    certificate: {},
  });

  const [tabActionInfo, setTabActionInfo] = useState({
    activeTab: "program_information",
    error: false,
    message: "",
  });

  const resetViewInfo = { material: false, certificate: false };

  const filteredProgramTabs = ProgramTabs.filter((tab) => {
    // Exclude "program_testimonials" if role is admin
    if (tab.key === "program_testimonials" && toggleRole === admin) {
      return false;
    }
    // Add other conditions here if needed
    return true;
  });

  const handleViewOptionClick = () => {
    switch (actionModal) {
      case "goals":
        navigate(`/view-goal/${selectedItem?.id}`, {
          state: {
            id: selectedItem?.id,
            type: "view",
          },
        });
        break;

      default:
        break;
    }
    handleMoreClose();
  };

  const handleProgramCheck = (data) => {
    dispatch(getProgramNameValidate(data)).then((res) => {
      if (res?.meta?.requestStatus === "fulfilled") {
        if (!res?.payload?.is_available) {
          // setCurrentStep((prevStep) => {
          //   const nextStep = prevStep + 1;
          //   setTabActionInfo({
          //     ...tabActionInfo,
          //     activeTab: filteredProgramTabs[nextStep - 1]?.key || "",
          //   });
          //   return nextStep;
          // });
        } else {
          setTabActionInfo({
            ...tabActionInfo,
            error: true,
            message: "Program name already exists",
          });
        }
      }
    });
  };
  const handleTab = (key) => {
    const tabIndex = filteredProgramTabs.findIndex((tab) => tab.key === key);
    // if (stepWiseData.hasOwnProperty(tabIndex + 1) || stepWiseData.hasOwnProperty(tabIndex)) {
    const nextIndex = tabIndex + 1;
    setCurrentStep(nextIndex);
    setTabActionInfo({ ...tabActionInfo, activeTab: key });
    // }
    scrollToTop();
  };

  const handleNextStep = async (data, stData) => {
    // Get the current step's allowed fields
    let currentStepField = ProgramFields[currentStep - 1];

    // Apply the same filtering logic as in useEffect
    if (toggleRole !== "") {
      currentStepField = currentStepField.filter((curfields) =>
        curfields.for?.includes(toggleRole)
      );

      // Handle admin role field width adjustments
      if (toggleRole === admin) {
        const widthAdjustMentField1 = [
          "max_mentor_count",
          "max_mentee_count",
          "group_chat_requirement",
          "individual_chat_requirement",
        ];
        const widthAdjustMentField2 = ["auto_approval", "venue"];

        currentStepField = currentStepField.map((programfield) => {
          if (widthAdjustMentField1.includes(programfield.name)) {
            return { ...programfield, width: "w-[24%]" };
          }
          if (widthAdjustMentField2.includes(programfield.name)) {
            return { ...programfield, width: "w-[49%]" };
          }
          return programfield;
        });
      }
    }

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
      .filter(([_, value]) => value !== null && value !== undefined)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
    setStepData(fieldData);

    const totalSteps = filteredProgramTabs.length;

    if (currentStep === 1 && role === mentor && !params?.id) {
      dispatch(getProgramNameValidate(data?.program_name)).then((res) => {
        if (res?.meta?.requestStatus === "fulfilled") {
          if (!res?.payload?.is_available) {
            setCurrentStep((prevStep) => {
              const nextStep = prevStep + 1;
              setTabActionInfo({
                ...tabActionInfo,
                activeTab: filteredProgramTabs[nextStep - 1]?.key || "",
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

          const booleanFields = [
            "group_chat_requirement",
            "individual_chat_requirement",
            "mentee_upload_certificates",
          ];

          if (toggleRole !== admin) {
            booleanFields.forEach((field) => {
              if (fieldData[field] !== undefined) {
                fieldData[field] = fieldData[field] === "true";
              }
            });
          } else {
            booleanFields.forEach((field) => {
              delete fieldData[field];
            });
          }

          const jsonFields = [
            "learning_materials",
            "certifications",
            "members",
            "goals",
            "sub_programs",
            "recurring_dates",
          ];

          jsonFields.forEach((field) => {
            if (fieldData[field]) {
              bodyFormData.append(field, JSON.stringify(fieldData[field]));
            }
          });

          for (let key in fieldData) {
            if (
              (key === "program_image" || key === "sponsor_logos") &&
              fieldData[key]?.[0] instanceof File
            ) {
              bodyFormData.append(key, fieldData[key][0]);
            } else if (["start_date", "end_date"].includes(key)) {
              bodyFormData.append(key, new Date(fieldData[key]).toISOString());
            } else if (!jsonFields.includes(key)) {
              bodyFormData.append(key, fieldData[key]);
            }
          }
          bodyFormData.append("program_admin", userInfo.data?.user_id);
          if (toggleRole === admin) {
            bodyFormData.append("status", "started");
          }

          // Handle re-open condition
          if (searchParams.get("type") === "re_open") {
            bodyFormData.append("reopen_program_id", params?.id);
            await updateProgramReopen({
              // program_id: params?.id,
              bodyFormData,
              // role: toggleRole === admin ? toggleRole : "",
            });
          } else {
            if (params?.id) {
              if (isReopen) {
                bodyFormData.append("reopen_program_id", params?.id);
                await createProgram({
                  bodyFormData,
                  role: toggleRole === admin ? toggleRole : "",
                });
              }
          else{
              if (
                currentProgramDetail.status === "draft" &&
                status !== "draft"
              ) {
                bodyFormData.append("status", "create");
              }
              if (typeof fieldData?.program_image === "string") {
                bodyFormData.delete("program_image");
              }
              if (typeof fieldData?.sponsor_logos === "string") {
                bodyFormData.delete("sponsor_logos");
              }
              await updateProgram({
                program_id: params?.id,
                bodyFormData,
                role: toggleRole === admin ? toggleRole : "",
              });
            }
            } else {
              await createProgram({
                bodyFormData,
                role: toggleRole === admin ? toggleRole : "",
              });
            }
          }
        } else {
          setTabActionInfo({ ...tabActionInfo, error: true, message: "" });
        }
      } else {
        let allLogo = { ...logo };
        if (
          data.hasOwnProperty("sponsor_logos") &&
          data?.sponsor_logos?.length
        ) {
          allLogo.sponsor_logos = data.sponsor_logos[0];
        }
        if (
          data.hasOwnProperty("program_image") &&
          data?.program_image?.length
        ) {
          allLogo.program_image = data.program_image[0];
        }
        setLogo(allLogo);

        setCurrentStep((prevStep) => {
          const nextStep = prevStep < totalSteps ? prevStep + 1 : totalSteps;
          setTabActionInfo({
            ...tabActionInfo,
            activeTab: filteredProgramTabs[nextStep - 1]?.key || "",
          });
          scrollToTop();
          return nextStep;
        });
      }
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
    setTabActionInfo({
      ...tabActionInfo,
      activeTab: filteredProgramTabs[currentStep - 2].key,
    });
    scrollToTop();
  };

  const handleAction = (key) => {
    setActionModal(key);
  };

  const updateFormFields = (key, value, currentStep) => {
    const currentStepFields = programAllFields[currentStep];
    const updatedFields = currentStepFields.map((field) => {
      if (field.name === key) {
        return {
          ...field,
          value,
        };
      }
      return field;
    });

    const updateProgramFields = programAllFields.map((field, index) => {
      if (index === currentStep) {
        return updatedFields;
      }
      return field;
    });

    setProgramAllFields(updateProgramFields);
  };

  const handleAddPopupData = (key, value) => {
    try {
      if (!value.length) return;

      // For fields that only need IDs
      // if (ID_ONLY_FIELDS.includes(key)) {
      // Only use the currently selected IDs from the DataTable
      const selectedIds = value.map((row) => row.id);
      setValue(key, selectedIds);
      // Store the full objects in tempSelectedRows for display
      setTempSelectedRows(value);
      // } else {
      //   // For object fields - use only the currently selected rows
      //   setValue(key, value);
      //   setTempSelectedRows(value);
      // }

      // Update form fields with the new selection
      updateFormFields(key, value, currentStep - 1);
      setActionModal("");
    } catch (error) {
      console.error("Error updating form value:", error);
    }
  };

  const createUpdatedColumns = (originalColumns, type) => {
    return originalColumns.map((col) => {
      if (col.field === "action") {
        if (type === "goals") {
          return {
            ...col,
            renderCell: (params) => {
              return (
                <div className="flex items-center h-full">
                  <img
                    src={MoreIcon}
                    className="cursor-pointer"
                    alt="MoreIcon"
                    onClick={(e) => handleMoreClick(e, params.row)}
                  />
                </div>
              );
            },
          };
        } else {
          return {
            ...col,
            renderCell: (params) => {
              const handleClick = () => {
                const updates = {
                  viewDetailsInfo: { [type]: params.row },
                  viewDetails: {
                    material: type === "material",
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
      }

      if (col.field === "status") {
        return {
          ...col,
          renderCell: (params) => {
            const status = params.value;
            const getColor = (status) => {
              switch (status) {
                case goalStatus.active:
                  return "bg-yellow-300 text-yellow-500";
                case "pending":
                  return "bg-orange-300 text-orange-500";
                default:
                  return "bg-red-300 text-red-500";
              }
            };

            return (
              <span
                className={`px-2 py-1 rounded text-sm font-medium ${getColor(
                  status
                )}`}
              >
                {status}
              </span>
            );
          },
        };
      }

      if (col.field === "progress") {
        return {
          ...col,
          renderCell: (params) => {
            const level = params.value || 0; // Fallback to 0 if no level
            return (
              <div className="flex items-center gap-2 h-full">
                <div className="relative w-full bg-gray-200 rounded h-2">
                  <div
                    className="absolute top-0 left-0 h-2 bg-blue-500 rounded"
                    style={{ width: `${level}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{`${level}%`}</span>
              </div>
            );
          },
        };
      }

      return col;
    });
  };

  // Create updated columns using the helper function
  const updatedMaterialColumn = createUpdatedColumns(
    MaterialColumns,
    "material"
  );
  const updatedCertificateColumn = createUpdatedColumns(
    CertificateColumns,
    "certificate"
  );
  const updatedMemberColumn = createUpdatedColumns(MemberColumns, "members");
  const updatedGoalColumns = createUpdatedColumns(GoalColumns, "goals");

  const MODAL_CONFIG = {
    learning_materials: {
      modalTitle: "Add learning materials",
      rows: "materials",
      columns: updatedMaterialColumn,
      btnName: "Submit",
      createBtnName: "Add Materials",
      onCreateBtnClick: handleMaterialCreateBtnClick,
    },
    certifications: {
      modalTitle: "Add certificate",
      rows: "certificate",
      columns: updatedCertificateColumn,
      btnName: "Add Certificate",
      // createBtnName: "Create New Certificate",
      // onCreateBtnClick: handleCertificateCreateBtnClick,
    },
    members: {
      modalTitle: "Add Users",
      rows: "members",
      columns: updatedMemberColumn,
      btnName: "Add Users",
    },
    goals: {
      modalTitle: "Add goals",
      rows: "goals",
      columns: updatedGoalColumns,
      btnName: "Add Goals",
      createBtnName: "Create Goals",
      onCreateBtnClick: handleClickOpen,
    },
  };
  const FooterComponent = ({ selectedRows, action }) => {
    const cancelButtonStyle = {
      border: "1px solid rgba(29, 91, 191, 1)",
      borderRadius: "3px",
      color: "rgba(29, 91, 191, 1)",
    };

    return (
      <div className="flex gap-6 justify-center items-center py-4">
        <button
          onClick={() => {
            setTempSelectedRows([]);
            setActionModal("");
          }}
          className="py-3 px-6"
          style={cancelButtonStyle}
        >
          Cancel
        </button>
        <Button
          btnCategory="primary"
          btnName={MODAL_CONFIG[action]?.btnName}
          onClick={() => handleAddPopupData(action, selectedRows)}
        />
      </div>
    );
  };

  useEffect(() => {
    if (!actionModal) {
      setTempSelectedRows([]);
    } else if (actionModal && formValues[actionModal]) {
      // For ID-only fields (goals), we need to find the full objects
      if (ID_ONLY_FIELDS.includes(actionModal)) {
        const selectedIds = formValues[actionModal];
        const allRows = formDetails[MODAL_CONFIG[actionModal].rows] || [];

        const selectedRows = allRows.filter((row) =>
          selectedIds.includes(row.id)
        );
        setTempSelectedRows(selectedRows);
      } else {
        // For other fields that store full objects, use as is
        setTempSelectedRows(formValues[actionModal]);
      }
    }
  }, [actionModal]);

  const buttonStyle = {
    background: "rgb(29, 91, 191)",
    color: "rgb(255, 255, 255)",
    padding: "2px 20px",
    height: "32px",
    margin: "9px 0px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "3px",
  };

  const ViewDetailsButton = ({ onClick }) => (
    <button style={buttonStyle} onClick={onClick}>
      View Details
    </button>
  );

  const handleClose = () => {
    setTabActionInfo({ ...tabActionInfo, error: false });
  };

  useEffect(() => {
    if (loading.success) {
      setTimeout(() => {
        setLoading({ create: false, success: false });
        if (allPrograms && allPrograms.length) {
          navigate(`/programs?type=${programStatus.yetToPlan}`);
        }
      }, [3000]);
    }
  }, [loading]);

  useEffect(() => {
    if (allPrograms && allPrograms.length && loading.create) {
      setTimeout(() => {
        setLoading({ create: false, success: true });
      }, [3000]);
    }
  }, [allPrograms]);

  useEffect(() => {
    if (role) {
      setToggleRole(role);
    }
    if (role === mentee) navigate("/programs");
  }, [role]);

  useEffect(() => {
    // This effect should only handle field structure updates based on role and step
    let currentStepField = ProgramFields[currentStep - 1];

    // Filter fields based on toggleRole
    if (toggleRole !== "") {
      currentStepField = currentStepField.filter((curfields) =>
        curfields.for?.includes(toggleRole)
      );

      if (toggleRole === admin) {
        const widthAdjustMentField1 = [
          "max_mentor_count",
          "max_mentee_count",
          "group_chat_requirement",
          "individual_chat_requirement",
        ];
        const widthAdjustMentField2 = ["auto_approval", "venue"];

        currentStepField = currentStepField.map((programfield) => {
          if (widthAdjustMentField1.includes(programfield.name)) {
            return { ...programfield, width: "w-[24%]" };
          }
          if (widthAdjustMentField2.includes(programfield.name)) {
            return { ...programfield, width: "w-[49%]" };
          }
          return programfield;
        });
      }
    }

    // Update fields with dynamic options
    const updatedFields = currentStepField.map((field) => {
      switch (field.name) {
        case "category":
          return { ...field, options: category || [] };
        case "state":
          return { ...field, options: countryStates };
        case "city":
          return { ...field, options: cities || [] };
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

    // Update form details
    setFormDetails((prev) => ({
      ...prev,
      category,
      certificate,
      members,
      goals: goals?.results,
      materials: materials?.results,
    }));
  }, [
    currentStep,
    toggleRole,
    role,
    category?.length,
    countryStates?.length,
    cities?.length,
    formValues?.state,
    materials?.results,
    goals?.results,
    members,
  ]); // Removed currentProgramDetail?.id and params.id from dependencies

  // Separate useEffect for initializing form values from currentProgramDetail
  // Add a separate effect to handle city initialization after cities data is available
  useEffect(() => {
    if (cities?.length > 0 && currentProgramDetail?.city_details?.id) {
      setValue("city", currentProgramDetail.city_details.id);
    }
  }, [cities, currentProgramDetail?.city_details?.id]);

  useEffect(() => {
    if (
      currentProgramDetail &&
      Object.keys(currentProgramDetail).length &&
      params.id
    ) {
      if (
        currentProgramDetail?.role === "Admin" &&
        currentProgramDetail.hasOwnProperty("admin_program")
      ) {
        setToggleRole(mentor);
      }

      // Set initial values from currentProgramDetail
      ProgramFields.flat().forEach((field) => {
        const fieldName = field.name;

        if (fieldName === "category") {
          // Handle category field specifically
          let categoryId;
          if (currentProgramDetail.categories?.length) {
            categoryId = currentProgramDetail.categories[0]?.id;
          } else if (currentProgramDetail?.incident_type?.id) {
            categoryId = currentProgramDetail.incident_type.id;
          }

          // Use setValue with shouldValidate and shouldDirty options
          setValue(fieldName, categoryId, {
            shouldValidate: true,
            shouldDirty: true,
          });
        } else {
          let value = currentProgramDetail[fieldName];

          if (fieldName === "start_date" || fieldName === "end_date") {
            value = new Date(value);
          }
          if (
            [
              "mentee_upload_certificates",
              "group_chat_requirement",
              "individual_chat_requirement",
            ].includes(fieldName)
          ) {
            value = value ? "true" : "false";
          }
          if (fieldName === "program_image") {
            value = currentProgramDetail["program_image"];
          }
          if (fieldName === "program_type") {
            value = currentProgramDetail["program_type"]?.id;
          }
          if (
            fieldName === "sponsor_logos" &&
            currentProgramDetail["sponsor_logos"]
          ) {
            value = currentProgramDetail["sponsor_logos"][0];
          }
          if (ID_ONLY_FIELDS.includes(fieldName)) {
            value = currentProgramDetail[fieldName]?.map((item) => item?.id);
          }
          // if (fieldName === "state") {
          //   value = currentProgramDetail["state_details"]?.id;
          //   setValue(fieldName, value);
          // }
          // Remove city initialization from here as it's handled by the separate effect
          if (fieldName === "recurring_dates") {
            value = currentProgramDetail["recurring_programs_details"];
          }
          if(['state','city','zip_code'].includes(fieldName)){
            const filteredName = fieldName === "state" ? "state_name" : fieldName;
            if(currentProgramDetail?.location_details){
               setValue(fieldName,currentProgramDetail?.location_details[filteredName])
              }
            if (currentProgramDetail?.location_details?.id) {
                setValue("location", currentProgramDetail.location_details.id);
              }
          }else{
            setValue(fieldName, value);
          }

          // if (fieldName !== "state" && fieldName !== "city") {
          //   setValue(fieldName, value);
          // }
        }
      });
    }
  }, [currentProgramDetail, params.id]); // Only run when currentProgramDetail or params.id changes

  useEffect(() => {
    // If any completion state (success or error) is true, show the backdrop
    if (
      isProgramCreated ||
      isProgramUpdated ||
      isProgramReopenUpdated ||
      IsErrorProgramCreating ||
      IsErrorProgramUpdating ||
      IsErrorProgramReopenUpdating ||
      status === programStatus.exist ||
      status === programStatus.error
    ) {
      setShowBackdrop(true);

      // Set timeout to handle cleanup after 3 seconds
      const timer = setTimeout(() => {
        // Reset all states
        dispatch(updateNewPrograms({ status: "" }));
        setShowBackdrop(false);

        // Only navigate on success cases
        if (isProgramCreated || isProgramUpdated || isProgramReopenUpdated) {
          navigate("/programs");
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [
    isProgramCreated,
    isProgramUpdated,
    isProgramReopenUpdated,
    IsErrorProgramUpdating,
    status,
  ]);

  useEffect(() => {
    if (tabActionInfo.error) {
      setTimeout(() => {
        setTabActionInfo({ ...tabActionInfo, error: false });
      }, 3000);
    }
  }, [tabActionInfo.error]);

  const handleDraft = () => {
    setValue("status", "draft");
    document.getElementById("program-submit").click();
  };

  useEffect(() => {
    const isAddressField = [
      "address_line1",
      "address_line2",
      "state",
      "city",
      "zip_code",
    ];

    if (formValues?.program_mode && formValues?.program_mode !== "physical_location") {
      isAddressField.forEach((field) => unregister(field));
    }
  }, [formValues?.program_mode, unregister]);

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
    scrollToTop();
  };

  useEffect(() => {
    const sub = watch((values) => console.log("values", values));

    return () => sub.unsubscribe();
  }, [watch]);

  const handleCancelClick = () => {
    if (role === admin && toggleRole === mentor && !params?.id) {
      setToggleRole(admin);
      setCurrentStep(DEFAULT_VALUE);
    } else {
      navigate("/programs");
    }
    reset();
  };
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
        {/* {validationData && validationData?.is_available && (
          <ToastNotification
            openToaster={validationData && validationData?.is_available}
            message={validationData?.message}
            handleClose={handleClose}
            toastType={"error"}
          />
        )} */}

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={
            showBackdrop || // Control visibility with local state
            isProgramCreating ||
            isProgramUpdating ||
            isProgramReopenUpdating
          }
        >
          {isProgramCreating || isProgramUpdating || isProgramReopenUpdating ? (
            <CircularProgress color="inherit" />
          ) : (
            <div className="w-[450px] bg-white flex flex-col gap-10 h-[230px] justify-center items-center rounded-[10px] border border-background-primary-main">
              <img
              className="h-[45px] w-[45px]"
                src={
                  isProgramCreated || isProgramUpdated || isProgramReopenUpdated
                    ? SuccessIcon
                    : FailedIcon
                }
                alt="StatusIcon"
              />
              <span style={{ color: "#232323", fontWeight: 600 }}>
                {status === programStatus.exist
                  ? "Program already exists"
                  : status === programStatus.error
                  ? "There is a Server Error. Please try again later"
                  : IsErrorProgramCreating ||
                    IsErrorProgramUpdating ||
                    IsErrorProgramReopenUpdating
                  ? `Error ${
                      IsErrorProgramCreating ? "Creating" : "Updating"
                    } program`
                  : `Program ${
                      programApiStatus === "draft"
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
              {filteredProgramTabs.map((actionBtn, index) => (
                <Tooltip title={actionBtn.name}>
                  <button
                    key={index}
                    className="px-5 py-4 text-[14px]"
                    style={{
                      background:
                        tabActionInfo.activeTab === actionBtn.key
                          ? "linear-gradient(97.86deg, #005DC6 -15.07%, #00B1C0 112.47%)"
                          : "rgba(249, 249, 249, 1)",
                      color:
                        tabActionInfo.activeTab === actionBtn.key
                          ? "#fff"
                          : "#000",
                      borderRadius: "3px",
                    }}
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
                    currentStepData={
                      stepData[filteredProgramTabs[currentStep - 1].key]
                    }
                    setMentorSearchValue={setMentorSearchValue}
                    mentorSearchValue={mentorSearchValue}
                    isMentorDataLoading={isFetching}
                    toggleRole={toggleRole}
                    setToggleRole={setToggleRole}
                    handleAction={handleAction}
                    handleProgramCheck={handleProgramCheck}
                    stepData={stepData}
                    stepFields={programAllFields[currentStep - 1]}
                    mentor_assign={mentor_assign?.results}
                    goalData={goals?.results}
                    certificate={certificate}
                    materials={materials?.results}
                    members={members}
                  />
                </div>
                <div className="flex gap-6 justify-center align-middle">
                  {currentStep === 1 && (
                    <Button
                      btnName="Cancel"
                      btnCategory="secondary"
                      onClick={handleCancelClick}
                    />
                  )}
                  {currentStep > 1 && (
                    <Button
                      btnName="Back"
                      btnCategory="secondary"
                      onClick={handlePreviousStep}
                    />
                  )}
                  {/* {currentStep === filteredProgramTabs.length && (
                    <Button
                      btnType="button"
                      onClick={handleDraft}
                      btnStyle={{
                        background: "#787575",
                        color: "#000",
                      }}
                      btnCls="w-[150px]"
                      btnName={"Save as Draft"}
                      btnCategory="primary"
                    />
                  )} */}
                  {/* {(currentStep !== '' &&
                            (!Object.keys(programDetails).length)) || (Object.keys(programDetails).length && programDetails.status === 'draft') ? <Button btnType="button" onClick={handleDraft} btnStyle={{ background: 'rgba(197, 197, 197, 1)', color: '#000' }}
                                btnCls="w-[150px]" btnName={'Save as Draft'} btnCategory="primary" /> : null} */}

                  <Button
                    btnType="submit"
                    id={"program-submit"}
                    btnCls="w-[100px]"
                    btnName={
                      currentStep === filteredProgramTabs.length
                        ? "Submit"
                        : "Next"
                    }
                    btnCategory="primary"
                  />
                </div>
              </form>
            </FormProvider>
          </div>
        )}
        <MuiModal
          modalSize="lg"
          modalOpen={viewDetails.material}
          modalClose={() => {
            setViewDetails(resetViewInfo);
          }}
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
                  {viewDetailsInfo.material?.name}{" "}
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
                  {viewDetailsInfo.material?.material_details}
                </p>
                {viewDetailsInfo.material.material_type === "document" ? (
                  <a
                    className="underline"
                    href={viewDetailsInfo.material.file}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {viewDetailsInfo.material.name}
                  </a>
                ) : null}

                {viewDetailsInfo.material.material_type === "video" ? (
                  <ReactPlayer
                    // onPlay={this.handlePlay()}
                    // onPause={this.handlePause()}
                    url={viewDetailsInfo.material.file}
                  />
                ) : // <video width="auto" height="auto" controls autoplay >
                //     <source src={viewDetailsInfo.material.file} type="video/ogg" />
                //     Your browser does not support the video tag.
                // </video>
                null}
              </div>
              <div className="flex justify-center items-center pt-5 pb-10">
                <button
                  onClick={() => setViewDetails(resetViewInfo)}
                  className="text-white py-3 px-7 w-[25%]"
                  style={{
                    background:
                      "linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)",
                    borderRadius: "3px",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </MuiModal>

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
                <p className="text-[12px] py-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </p>
              </div>
              <div className="flex justify-center items-center pt-5 pb-10">
                <button
                  onClick={() => setViewDetails(resetViewInfo)}
                  className="text-white py-3 px-7 w-[25%]"
                  style={{
                    background:
                      "linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)",
                    borderRadius: "3px",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </MuiModal>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading.success}
        >
          <div className="px-5 py-1 flex justify-center items-center">
            <div
              className="flex justify-center items-center flex-col gap-[2.25rem] py-[4rem] px-[3rem] mt-20 mb-20"
              style={{ background: "#fff", borderRadius: "10px" }}
            >
              <img src={SuccessTik} alt="SuccessTik" />
              <p
                className="text-[16px] font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#1D5BBF] to-[#00AEBD]"
                style={{
                  fontWeight: 600,
                }}
              >
                Requested Successfully
              </p>
            </div>
          </div>
        </Backdrop>
        <MuiModal
          modalSize="md"
          modalOpen={actionModal !== ""}
          modalClose={() => setActionModal("")}
          title={MODAL_CONFIG[actionModal]?.modalTitle}
        >
          {actionModal && MODAL_CONFIG[actionModal] && (
            <DataTable
              showToolbar={true}
              toolBarComponent={
                MODAL_CONFIG[actionModal].createBtnName && (
                  <Button
                    btnName={MODAL_CONFIG[actionModal].createBtnName}
                    btnCategory="primary"
                    onClick={MODAL_CONFIG[actionModal].onCreateBtnClick}
                  />
                )
              }
              rows={formDetails[MODAL_CONFIG[actionModal].rows]}
              columns={MODAL_CONFIG[actionModal].columns}
              footerAction={() => setActionModal("")}
              footerComponent={(props) => (
                <FooterComponent
                  selectedRows={tempSelectedRows}
                  action={actionModal}
                />
              )}
              selectedAllRows={tempSelectedRows}
              handleSelectedRow={(selected) => {
                setTempSelectedRows(selected);
              }}
              rowCount={
                formDetails[MODAL_CONFIG[actionModal].rows]?.length || 0
              }
            />
          )}
        </MuiModal>
        <MuiMenuDropDown
          anchorEl={anchorEl}
          open={open}
          onClose={handleMoreClose}
          menuItems={EquipMentListMenuItems}
          handleMenuClick={handleMenuClick}
        />
        <MaterialsCreationModal
          categoryId={formValues.category}
          categoryData={category}
          isOpen={openMaterialModal}
          handleCloseModal={handleCloseModal}
        />
        <CertificatesCreationModal
          isOpen={openCertificateModal}
          handleCloseModal={handleCloseModal}
        />
        <GoalCreationModal
          isOpen={openGoalsModal}
          handleCloseModal={handleCloseModal}
        />
      </div>
    </div>
  );
}
