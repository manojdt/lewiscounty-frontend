import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReactPlayer from "react-player";

import ProgramSteps from "./ProgramsSteps";
import { ProgramTabs, ProgramFields } from "../../../utils/formFields";
import {
  updateNewPrograms,
  getAllCategories,
  getAllMaterials,
  getAllCertificates,
  getAllSkills,
  getAllMembers,
  createNewPrograms,
  editUpdateProgram,
  getProgramNameValidate,
  getAllMentors,
} from "../../../services/programInfo";
import {
  CertificateColumns,
  MaterialColumns,
  MemberColumns,
  SkillsColumns,
} from "../../../mock";
import DataTable from "../../../shared/DataGrid";
import { programStatus } from "../../../utils/constant";
import MuiModal from "../../../shared/Modal";
import Tooltip from "../../../shared/Tooltip";

import CancelIcon from "../../../assets/images/cancel-colour1x.png";
import SuccessTik from "../../../assets/images/blue_tik1x.png";
import SearchIcon from "../../../assets/images/search1x.png";
import CertificateIcon from "../../../assets/images/dummy_certificate.png";
import SuccessIcon from "../../../assets/images/Success_tic1x.png";
import FailedIcon from "../../../assets/images/cancel3x.png";
import ToastNotification from "../../../shared/Toast";
import { getProgramDetails } from "../../../services/userprograms";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../../../shared";
import {
  useCreateProgramMutation,
  useUpdateProgramMutation,
  useValidateProgramNameQuery,
  useGetProgramDetailsByIdQuery,
} from "../../../features/program/programApi.services";

export default function CreatePrograms() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userInfo);
  const params = useParams();
  const [loading, setLoading] = useState({ create: false, success: false });
  const [currentStep, setCurrentStep] = useState(1);

  const role = userInfo.data.role || "";
  const [toggleRole, setToggleRole] = useState("");
  const {
    allPrograms,
    category,
    materials,
    certificate,
    skills,
    members,
    mentor_assign,
    loading: apiLoading,
    status,
  } = useSelector((state) => state.programInfo);

  const methods = useForm({
    defaultValues:
      toggleRole === "admin"
        ? { no_of_subprograms: 1, sub_programs: [] }
        : undefined,
  });

  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = methods;
  const { data: currentProgramDetail, isLoading: isDetailFetching } =
    useGetProgramDetailsByIdQuery(
      { id: params.id, role },
      { skip: !params?.id && !role }
    );
  // const [program_name] = watch(["program_name"]);
  // const { data: validationData, isFetching } = useValidateProgramNameQuery(
  //   {
  //     program_name,
  //     program_id: params?.id,
  //   },
  //   {
  //     refetchOnMountOrArgChange: true,
  //     // Only run the query when we're on step 1, user is mentor, and it's a new program
  //     skip: !(
  //       currentStep === 1 &&
  //       role === "mentor" &&
  //       !params?.id &&
  //       program_name
  //     ),
  //   }
  // );
  // console.log("validationData", validationData);
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

  const [stepData, setStepData] = useState({});
  const [actionModal, setActionModal] = useState("");
  const [programAllFields, setProgramAllFields] = useState(ProgramFields);
  const [current, setCurrent] = useState("");
  const [formDetails, setFormDetails] = useState({
    category: [],
    materials: [],
    skills: [],
    certificate: [],
    members: [],
  });

  const [logo, setLogo] = useState({});
  const [stepWiseData, setStepWiseData] = useState({});
  const [programApiStatus, setProgramApiStatus] = useState("");

  const [viewDetails, setViewDetails] = useState({
    material: false,
    skills: false,
    certificate: false,
  });
  const [viewDetailsInfo, setViewDetailsInfo] = useState({
    material: {},
    skills: {},
    certificate: {},
  });
  const [tabActionInfo, setTabActionInfo] = useState({
    activeTab: "program_information",
    error: false,
  });

  const resetViewInfo = { material: false, skills: false, certificate: false };

  const filteredProgramTabs = ProgramTabs.filter((tab) => {
    // Exclude "program_testimonials" if role is "admin"
    if (tab.key === "program_testimonials" && toggleRole === "admin") {
      return false;
    }
    // Add other conditions here if needed
    return true;
  });
  
  const handleTab = (key) => {
    const tabIndex = filteredProgramTabs.findIndex((tab) => tab.key === key);
    // if (stepWiseData.hasOwnProperty(tabIndex + 1) || stepWiseData.hasOwnProperty(tabIndex)) {
    const nextIndex = tabIndex + 1;
    setCurrentStep(nextIndex);
    setTabActionInfo({ ...tabActionInfo, activeTab: key });
    // }
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
      if (toggleRole === "admin") {
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
    // const saveDraft = (data)=> {
    //     let fieldData = {
    //         ...stepData, ...data,
    //     }
    //     setStepData(fieldData)

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
    };

    // Remove specific fields based on is_sponsored condition
    if (fieldData.is_sponsored === true) {
      delete fieldData.enrollment_fees;
    }
    if (fieldData.is_sponsored === false) {
      delete fieldData.image;
    }

    setStepData(fieldData);
    const totalSteps = filteredProgramTabs.length;
    if (currentStep === 1 && role === "mentor" && !params?.id) {
      dispatch(
        getProgramNameValidate({
          program_name: data?.program_name,
          program_id: params?.id,
        })
      ).then((res) => {
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
            setTabActionInfo({ ...tabActionInfo, error: true });
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

          if (toggleRole !== "admin") {
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
            "skills",
            "certificates",
            "members",
            "sub_programs",
          ];

          jsonFields.forEach((field) => {
            if (fieldData[field]) {
              bodyFormData.append(field, JSON.stringify(fieldData[field]));
            }
          });

          // Remove fields based on is_sponsored before creating FormData
          if (fieldData.is_sponsored === true) {
            delete fieldData.enrollment_fees;
          }
          if (fieldData.is_sponsored === false) {
            delete fieldData.image;
          }

          for (let key in fieldData) {
            if (
              (key === "program_image" || key === "image") &&
              fieldData[key]?.[0] instanceof File
            ) {
              bodyFormData.append(key, fieldData[key][0]);
            } else if (["start_date", "end_date"].includes(key)) {
              bodyFormData.append(key, new Date(fieldData[key]).toISOString());
            } else if (!jsonFields.includes(key)) {
              bodyFormData.append(key, fieldData[key]);
            }
          }

          let status = fieldData.status === "draft" ? "draft" : "";
          setProgramApiStatus(status);

          if (params?.id) {
            if (currentProgramDetail.status === "draft" && status !== "draft") {
              bodyFormData.append("status", "create");
            }
            if (typeof fieldData?.program_image === "string") {
              bodyFormData.delete("program_image");
            }
            if (typeof fieldData?.image === "string") {
              bodyFormData.delete("image");
            }
            // bodyFormData.append("program_id", params?.id);
            await updateProgram({
              program_id: params?.id,
              bodyFormData,
              role: toggleRole === "admin" ? toggleRole : "",
            });
          } else {
            if (toggleRole === "admin") {
              bodyFormData.append("status", "started");
            }
            bodyFormData.append("program_admin", userInfo.data?.user_id);
            await createProgram({
              bodyFormData,
              role: toggleRole === "admin" ? toggleRole : "",
            });
          }
        } else {
          setTabActionInfo({ ...tabActionInfo, error: true });
        }
      } else {
        let allLogo = { ...logo };
        if (data.hasOwnProperty("image") && data?.image?.length) {
          allLogo.image = data.image[0];
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
      if (value.length) {
        setValue(key, value);
        updateFormFields(key, value, currentStep - 1);
        setActionModal("");
      }
    } catch (error) {
      console.error("Error updating form value:", error);
      // Handle error appropriately
    }
  };

  const footerComponent = (props) => {
    return (
      <div className="flex gap-6 justify-center items-center py-4">
        <button
          onClick={() => setActionModal("")}
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
          onClick={() =>
            handleAddPopupData("learning_materials", props.selectedRows)
          }
          className="text-white py-3 px-6 w-[16%]"
          style={{
            background:
              "linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)",
            borderRadius: "3px",
          }}
        >
          Add Material
        </button>
      </div>
    );
  };

  const skillsFooterComponent = (props) => {
    return (
      <div className="flex gap-6 justify-center items-center py-4">
        <button
          onClick={() => setActionModal("")}
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
          onClick={() => handleAddPopupData("skills", props.selectedRows)}
          className="text-white py-3 px-6 w-[16%]"
          style={{
            background:
              "linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)",
            borderRadius: "3px",
          }}
        >
          Add Skills
        </button>
      </div>
    );
  };

  const certificateFooterComponent = (props) => {
    return (
      <div className="flex gap-6 justify-center items-center py-4">
        <button
          onClick={() => setActionModal("")}
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
          onClick={() => handleAddPopupData("certificates", props.selectedRows)}
          className="text-white py-3 px-6 w-[16%]"
          style={{
            background:
              "linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)",
            borderRadius: "3px",
          }}
        >
          Add Certificate
        </button>
      </div>
    );
  };

  const memberFooterComponent = (props) => {
    return (
      <div className="flex gap-6 justify-center items-center py-4">
        <button
          onClick={() => setActionModal("")}
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
          onClick={() => handleAddPopupData("members", props.selectedRows)}
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

  const handleModalSearch = (field) => {
    switch (field.target.name) {
      case "learning_materials":
        const material = [...materials].filter((material) =>
          material.name.toLowerCase().includes(field.target.value)
        );
        setFormDetails({ ...formDetails, materials: material });
        break;
      case "skills":
        const skill = [...skills].filter((skils) =>
          skils.name.toLowerCase().includes(field.target.value)
        );
        setFormDetails({ ...formDetails, skills: skill });
        break;
      case "certificates":
        const certificates = [...certificate].filter((certificate) =>
          certificate.name.toLowerCase().includes(field.target.value)
        );
        setFormDetails({ ...formDetails, certificate: certificates });
        break;
      case "members":
        const member = [...members].filter((member) =>
          member.first_name.toLowerCase().includes(field.target.value)
        );
        setFormDetails({ ...formDetails, members: member });
        break;
      default:
        break;
    }
  };

  const fetchCategoryData = (categoryId) => {
    dispatch(getAllMaterials(categoryId));
    dispatch(getAllCertificates(categoryId));
    dispatch(getAllSkills(categoryId));
    dispatch(getAllMembers(categoryId));
  };

  useEffect(() => {
    if (role === "admin") {
      dispatch(getAllMentors());
    }
  }, [role]);

  const updatedMaterialColumn = [...MaterialColumns].map((mcol) => {
    if (mcol.field === "action") {
      return {
        ...mcol,
        renderCell: (params) => {
          return (
            <button
              style={{
                background: "rgb(29, 91, 191)",
                color: "rgb(255, 255, 255)",
                padding: "2px 20px",
                height: "32px",
                margin: "9px 0px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "3px",
              }}
              onClick={() => {
                setViewDetailsInfo({
                  ...viewDetailsInfo,
                  material: params.row,
                });
                setViewDetails({
                  material: true,
                  skills: false,
                  certificate: false,
                });
              }}
            >
              View Details
            </button>
          );
        },
      };
    }
    return mcol;
  });

  const updatedSkillColumn = [...SkillsColumns].map((mcol) => {
    if (mcol.field === "action") {
      return {
        ...mcol,
        renderCell: (params) => {
          return (
            <button
              style={{
                background: "rgb(29, 91, 191)",
                color: "rgb(255, 255, 255)",
                padding: "2px 20px",
                height: "32px",
                margin: "9px 0px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "3px",
              }}
              onClick={() => {
                setViewDetailsInfo({ ...viewDetailsInfo, skills: params.row });
                setViewDetails({
                  material: false,
                  skills: true,
                  certificate: false,
                });
              }}
            >
              View Details
            </button>
          );
        },
      };
    }
    return mcol;
  });

  const updatedCertificateColumn = [...CertificateColumns].map((mcol) => {
    if (mcol.field === "action") {
      return {
        ...mcol,
        renderCell: (params) => {
          return (
            <button
              style={{
                background: "rgb(29, 91, 191)",
                color: "rgb(255, 255, 255)",
                padding: "2px 20px",
                height: "32px",
                margin: "9px 0px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "3px",
              }}
              onClick={() => {
                setViewDetailsInfo({
                  ...viewDetailsInfo,
                  certificate: params.row,
                });
                setViewDetails({
                  material: false,
                  skills: false,
                  certificate: true,
                });
              }}
            >
              View Details
            </button>
          );
        },
      };
    }
    return mcol;
  });

  const handleClose = () => {
    setTabActionInfo({ ...tabActionInfo, error: false });
  };

  useEffect(() => {
    if (loading.success) {
      setTimeout(() => {
        setLoading({ create: false, success: false });
        if (allPrograms && allPrograms.length) {
          navigate(`/dashboard?type=${programStatus.yetToPlan}`);
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
    dispatch(getAllCategories());
  }, []);

  useEffect(() => {
    if (role) {
      setToggleRole(role);
    }
    if (role === "mentee") navigate("/programs");
  }, [role]);

  useEffect(() => {
    if (currentStep === 1 || toggleRole !== "") {
      const widthAdjustMentField1 = [
        "max_mentor_count",
        "max_mentee_count",
        "group_chat_requirement",
        "individual_chat_requirement",
      ];
      const widthAdjustMentField2 = ["auto_approval", "venue"];
      let currentStepField = ProgramFields[currentStep - 1];

      // Filter fields based on toggleRole
      if (toggleRole !== "") {
        currentStepField = currentStepField.filter((curfields) =>
          curfields.for?.includes(toggleRole)
        );

        if (toggleRole === "admin") {
          currentStepField = currentStepField.map((programfield) => {
            if (widthAdjustMentField1.includes(programfield.name)) {
              return {
                ...programfield,
                width: "w-[24%]",
              };
            }
            if (widthAdjustMentField2.includes(programfield.name)) {
              return {
                ...programfield,
                width: "w-[49%]",
              };
            }
            return programfield;
          });
        }
      }

      // Update category options
      const updatedFields = currentStepField.map((field) => {
        if (field.name === "category") {
          return {
            ...field,
            options: category, // Set category options
          };
        }
        return field;
      });

      // Update programAllFields while preserving other steps
      const fields = programAllFields.map((field, i) => {
        if (i === currentStep - 1) {
          return updatedFields; // Update only current step
        }
        return field; // Preserve other steps
      });

      setProgramAllFields(fields);
    }

    // Update form details
    setFormDetails({
      category,
      materials,
      certificate,
      skills,
      members,
    });
  }, [
    currentStep,
    toggleRole,
    category,
    materials,
    certificate,
    skills,
    members,
  ]);

  useEffect(() => {
    if (
      isProgramCreated ||
      status === programStatus.exist ||
      status === programStatus.error ||
      IsErrorProgramCreating ||
      IsErrorProgramUpdating ||
      isProgramUpdated
    ) {
      setTimeout(() => {
        dispatch(updateNewPrograms({ status: "" }));
        if (
          isProgramCreated ||
          isProgramUpdated ||
          IsErrorProgramCreating ||
          IsErrorProgramUpdating
        )
          navigate("/dashboard");
      }, [3000]);
    }
  }, [
    IsErrorProgramCreating,
    IsErrorProgramUpdating,
    isProgramCreated,
    isProgramUpdated,
    status,
  ]);

  useEffect(() => {
    if (tabActionInfo.error) {
      setTimeout(() => {
        setTabActionInfo({ ...tabActionInfo, error: false });
      }, 3000);
    }
  }, [tabActionInfo.error]);
  useEffect(() => {
  console.log(status,"status")
  }, [status]);

  useEffect(() => {
    if (
      currentProgramDetail &&
      Object.keys(currentProgramDetail).length &&
      params.id !== ""
    ) {
      let stepListData = {};
      let data = {};

      programAllFields.forEach((field, index) => {
        let stepField = {};
        field.forEach((fl, i) => {
          let currentField = fl.name;
          let currentFieldValue = currentProgramDetail[currentField];

          // Handle special cases
          if (
            currentField === "category" &&
            currentProgramDetail.categories?.length
          ) {
            currentFieldValue = currentProgramDetail.categories[0]?.id;
            fetchCategoryData(currentProgramDetail.categories[0]?.id);
          }

          if (currentField === "start_date" || currentField === "end_date") {
            currentFieldValue = new Date(currentProgramDetail[currentField]);
          }

          if (
            [
              "mentee_upload_certificates",
              "group_chat_requirement",
              "individual_chat_requirement",
            ].includes(currentField)
          ) {
            currentFieldValue = currentProgramDetail[currentField]
              ? "true"
              : "false";
          }

          if (currentField === "certificates") {
            currentFieldValue = currentProgramDetail["certifications"];
          }

          if (currentField === "testimonial_type") {
            currentFieldValue = currentProgramDetail["testimonial_types"];
          }

          if (currentField === "program_image") {
            currentFieldValue = currentProgramDetail["program_image"];
          }

          // Set value in React Hook Form
          setValue(currentField, currentFieldValue);

          stepField[currentField] = currentFieldValue;
        });
        stepListData = { ...stepListData, [index]: stepField };
        data = { ...data, ...stepField };
      });

      setStepData(data);
    }
  }, [currentProgramDetail]);

  const handleDraft = () => {
    setValue("status", "draft");
    document.getElementById("program-submit").click();
  };
  const onSubmit = (data) => {
    // setStepWiseData(combinedData);
    setStepWiseData((prevStData) => {
      const newStepData = {
        ...prevStData,
        [currentStep]: { ...prevStData[currentStep], ...data },
      };
      return newStepData;
    });
    handleNextStep(data);
    // reset();
  };

  // useEffect(() => {
  //   const sub = watch((values) => console.log("values", values));

  //   return () => sub.unsubscribe();
  // }, [watch]);

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
                onClick={() => navigate("/programs")}
                src={CancelIcon}
                alt="CancelIcon"
              />
            </Tooltip>
          </div>
        </div>

        {tabActionInfo.error && (
          <ToastNotification
            openToaster={tabActionInfo.error}
            message={"Please fill all mandatory fields"}
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
            isProgramCreating ||
            isProgramCreated||
            isProgramUpdating ||
            isDetailFetching ||
            IsErrorProgramCreating ||
            IsErrorProgramUpdating ||
            status === programStatus.update
          
          }
        >
          {isProgramCreating || isProgramUpdating || isDetailFetching ? (
            <CircularProgress color="inherit" />
          ) : null}

          {isProgramCreated ||
          status === programStatus.exist ||
          status === programStatus.error ||
          isProgramUpdated ||
          IsErrorProgramCreating ||
          IsErrorProgramUpdating ? (
            <div className="w-2/6 bg-white flex flex-col gap-4 h-[330px] justify-center items-center">
              <img
                src={
                  status === programStatus.exist ||
                  IsErrorProgramCreating ||
                  IsErrorProgramUpdating
                    ? FailedIcon
                    : isProgramCreated || isProgramUpdated
                    ? SuccessIcon
                    : FailedIcon
                }
                alt="VerifyIcon"
              />
              <span style={{ color: "#232323", fontWeight: 600 }}>
                {status === programStatus.exist
                  ? "Program already exist"
                  : status === programStatus.error
                  ? "There is a Server Error. Please try again later"
                  : IsErrorProgramCreating || IsErrorProgramUpdating
                  ? `Error ${
                      IsErrorProgramCreating
                        ? "Creating"
                        : IsErrorProgramUpdating
                        ? "Updating"
                        : ""
                    } program`
                  : `Program ${
                      programApiStatus === "draft"
                        ? "Drafed"
                        : isProgramUpdated
                        ? "Updated"
                        : "Created"
                    } Successfully!`}
              </span>
            </div>
          ) : null}
        </Backdrop>

        {!isDetailFetching && (
          <div className="px-8 py-4">
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
              <form id={"program-submit"} onSubmit={handleSubmit(onSubmit)}>
                <div className="py-9">
                  <ProgramSteps
                    currentStepData={
                      stepData[filteredProgramTabs[currentStep - 1].key]
                    }
                    setCurrent={setCurrent}
                    setToggleRole={setToggleRole}
                    fetchCategoryData={fetchCategoryData}
                    handleAction={handleAction}
                    stepData={stepData}
                    stepFields={programAllFields[currentStep - 1]}
                    mentor_assign={mentor_assign}
                  />
                </div>
                <div className="flex gap-6 justify-center align-middle">
                  {currentStep === 1 && (
                    <Button
                      btnName="Cancel"
                      btnCategory="secondary"
                      onClick={() => {
                        if (current !== "own") {
                          navigate("/programs");
                        }
                        setToggleRole("admin");
                        reset();
                      }}
                    />
                  )}
                  {currentStep > 1 && (
                    <Button
                      btnName="Back"
                      btnCategory="secondary"
                      onClick={handlePreviousStep}
                    />
                  )}
                  {currentStep === filteredProgramTabs.length && (
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
                  )}
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
          modalOpen={viewDetails.skills}
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
                  {viewDetailsInfo.skills?.name}
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
                  {viewDetailsInfo.skills?.desc}
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
          modalSize="lg"
          modalOpen={actionModal !== ""}
          modalClose={() => setActionModal("")}
          noheader
        >
          <div className="relative">
            <input
              className="input-bg w-full h-[60px] px-5 mb-4 text-[14px]"
              style={{ borderRadius: "50px" }}
              placeholder="Search"
              name={actionModal}
              onChange={(e) => handleModalSearch(e)}
            />
            <img
              className="absolute top-4 right-7"
              src={SearchIcon}
              alt="SearchIcon"
            />
          </div>
          {actionModal === "learning_materials" ? (
            <DataTable
              rows={formDetails.materials}
              columns={updatedMaterialColumn}
              footerAction={() => setActionModal("")}
              footerComponent={footerComponent}
              selectedAllRows={stepData?.learning_materials || []}
            />
          ) : actionModal === "skills" ? (
            <DataTable
              rows={formDetails.skills}
              columns={updatedSkillColumn}
              footerAction={() => setActionModal("")}
              footerComponent={skillsFooterComponent}
              selectedAllRows={stepData?.skills || []}
            />
          ) : actionModal === "certificates" ? (
            <DataTable
              rows={formDetails.certificate}
              columns={updatedCertificateColumn}
              footerAction={() => setActionModal("")}
              footerComponent={certificateFooterComponent}
              selectedAllRows={stepData?.certificates || []}
            />
          ) : actionModal === "members" ? (
            <DataTable
              rows={formDetails.members}
              columns={MemberColumns}
              footerAction={() => setActionModal("")}
              footerComponent={memberFooterComponent}
              selectedAllRows={stepData?.members || []}
            />
          ) : null}
        </MuiModal>
      </div>
    </div>
  );
}
