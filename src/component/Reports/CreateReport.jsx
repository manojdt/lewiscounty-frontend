import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Backdrop, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { ReportFields } from "../../utils/formFields";
import CalendarIcon from "../../assets/images/calender_1x.png";
import HTMLIcon from "../../assets/images/html1x.png";
import TextIcon from "../../assets/images/text1x.png";

import { Button } from "../../shared";

import SuccessTik from "../../assets/images/blue_tik1x.png";
import CancelIcon from "../../assets/images/cancel1x.png";
import { getAllCategories } from "../../services/programInfo";

import { reportsStatus } from "../../utils/constant";
import {
  createReport,
  getCompletedProgramsByCategoryId,
  getProgramsByCategoryId,
  getReportProgramDetails,
  handleCancelReport,
  updateReportLocalState,
} from "../../services/reportsInfo";
import ToastNotification from "../../shared/Toast";
import { dateTimeFormat } from "../../utils";
import MuiModal from "../../shared/Modal";
import HtmlReport from "../Docusign/Docusignn";
import AddGoalIcon from "../../assets/icons/addGoal.svg";

export default function CreateReport() {
  const userInfo = useSelector((state) => state.userInfo);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const state = useLocation()?.state;
  const role = userInfo.data.role;
  const dispatch = useDispatch();
  const { category, loading: apiLoading } = useSelector(
    (state) => state.programInfo
  );
  const {
    categoryPrograms,
    loading: reportsLoading,
    programDetails,
    status,
  } = useSelector((state) => state.reports);
  const [reportFields, setReportFields] = useState(
    ReportFields(searchParams.get("program_id") ? true : false)
  );
  const [notification, setNotification] = useState({ program: false });
  const [actionType, setActionType] = useState("");
  const [commonLoading, setCommonLoading] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [reportData, setReportData] = React.useState({});

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    getValues,
    setValue,
    trigger,
    clearErrors,
  } = useForm();

  React.useEffect(() => {
    if (state?.type === "new") {
      reset();
      dispatch(updateReportLocalState({ programDetails: {} }));
    }
  }, [state]);

  const onSubmit = (data) => {
    let apiData = {
      // "category": parseInt(data.category),
      request_type: "report",
      program: parseInt(data.program),
      name: data.report_name,
      participated_mentees: data.participated_mentees,
      comments: "none",
      report_links: "none",
      status: data?.action ?? "new",
      is_active: true,
    };
    if (reportData?.data?.request_id) {
      apiData = {
        ...apiData,
        request_id: reportData?.data?.request_id,
        is_active: true,
        report_links: data.description,
      };
    }

    dispatch(createReport(apiData)).then((res) => {
      if (res?.meta?.requestStatus === "fulfilled") {
        dispatch(updateReportLocalState({ programDetails: {}, status: "" }));
        reset();
        if (
          searchParams.get("program_id") &&
          searchParams.get("program_id") !== "" &&
          searchParams.get("program_id") !== null
        ) {
          dispatch(updateReportLocalState({ programDetails: {} }));
          navigate(`/generate_certificate/${searchParams.get("program_id")}`);
        } else {
          navigate("/reports");
        }
      }
    });
  };

  const getProgramInfo = (categoryId) => {
    dispatch(
      getCompletedProgramsByCategoryId({
        categoryId: categoryId,
        type: "report",
      })
    );
  };

  const handleClose = () => {
    setNotification({ program: false });
  };

  const handleProgramData = (programId) => {
    dispatch(getReportProgramDetails(programId, "type"));
  };

  const handleDraft = () => {
    setActionType("draft");
  };

  useEffect(() => {
    if (actionType === "draft") {
      document.getElementById("create-report").submit();
    }
  }, [actionType]);

  // useEffect(() => {
  //     if (status === reportsStatus.create) {
  //         setTimeout(() => {
  //             if (searchParams.get('program_id') && searchParams.get('program_id') !== '' && searchParams.get('program_id') !== null) {
  //                 dispatch(updateReportLocalState({ programDetails: {} }))
  //                 navigate(`/generate_certificate/${searchParams.get('program_id')}`)
  //             } else {
  //                 dispatch(updateReportLocalState({ programDetails: {} }))
  //                 navigate('/reports')
  //             }
  //         }, 3000)
  //     }
  // }, [status])

  useEffect(() => {
    // if (!state?.type) {
    if (programDetails && Object.keys(programDetails).length) {
      let payload = {
        mentor_name: programDetails.mentor_name,
        start_date: dateTimeFormat(programDetails.start_date),
        end_date: dateTimeFormat(programDetails.end_date),
        participated_mentees: programDetails.participated_mentees,
      };
      if (searchParams.has("cat_id") && searchParams.has("program_id")) {
        payload = {
          ...payload,
          category: searchParams.get("cat_id"),
          program: searchParams.get("program_id"),
        };
      }
      reset(payload);
    }

    if (
      searchParams.get("cat_id") !== "" &&
      searchParams.get("program_id") !== ""
    ) {
      setCommonLoading(false);
    }
    // }
  }, [programDetails]);

  useEffect(() => {
    const fields = [...reportFields].map((field) => {
      if (field.name === "category") {
        return {
          ...field,
          options: category,
        };
      }
      return field;
    });
    setReportFields(fields);
    if (searchParams.has("cat_id") && searchParams.get("cat_id") !== "") {
      getProgramInfo(searchParams.get("cat_id"));
    }
  }, [category]);

  useEffect(() => {
    if (notification.program) {
      setTimeout(() => {
        setNotification({ program: false });
      }, [2000]);
    }
  }, [notification.program]);

  useEffect(() => {
    if (categoryPrograms.length) {
      const fields = [...reportFields].map((field) => {
        if (field.name === "program") {
          return {
            ...field,
            options: categoryPrograms,
          };
        }
        return field;
      });
      setReportFields(fields);

      if (
        searchParams.has("program_id") &&
        searchParams.get("program_id") !== ""
      ) {
        handleProgramData(searchParams.get("program_id"));
      }
    } else {
      const fields = [...reportFields].map((field) => {
        if (field.name === "program") {
          return {
            ...field,
            options: [],
          };
        }
        return field;
      });
      setReportFields(fields);
    }

    if (
      !categoryPrograms.length &&
      getValues("category") !== "" &&
      searchParams.get("program_id") === ""
    ) {
      setNotification({ program: true });
    }
  }, [categoryPrograms]);

  useEffect(() => {
    dispatch(getAllCategories());
  }, []);

  useEffect(() => {
    if (
      searchParams.has("cat_id") &&
      searchParams.has("program_id") &&
      searchParams.get("cat_id") !== "" &&
      searchParams.get("program_id") !== ""
    ) {
      setCommonLoading(true);
    }
  }, [searchParams]);

  const handleOpenHtmlReport = async () => {
    const isValid = await trigger([
      "category",
      "program",
      "mentor_name",
      "start_date",
      "end_date",
      "participated_mentees",
      "report_name",
    ]);

    if (isValid) {
      // setOpenReport(true);
      const apiData = {
        // "category": parseInt(data.category),
        request_type: "report",
        program: parseInt(getValues("program")),
        name: getValues("report_name"),
        participated_mentees: getValues("participated_mentees"),
        comments: "none",
        status: "new",
        is_active: false,
        report: "none",
      };
      dispatch(createReport(apiData)).then((res) => {
        if (res?.meta?.requestStatus === "fulfilled") {
          setReportData(res?.payload);
          setOpenReport(true);
          dispatch(updateReportLocalState({ status: "" }));
        }
      });
    } else {
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        document.querySelector(`[name="${firstErrorField}"]`)?.focus();
      }
    }
  };
  console.log("reportData ===>", reportData);
  const handleInputChange = (field_name) => {
    // Clears the error when the user starts typing
    clearErrors(field_name);
  };

  const handleCancelReportAction = () => {
    if (reportData?.data?.request_id) {
      dispatch(handleCancelReport(reportData?.data?.request_id)).then((res) => {
        if (res?.meta?.requestStatus === "fulfilled") {
          reset();
          dispatch(updateReportLocalState({ programDetails: {} }));
          navigate("/reports");
        }
      });
    } else {
      reset();
      dispatch(updateReportLocalState({ programDetails: {} }));
      navigate("/reports");
    }
  };

  return (
    <div className="px-4 sm:px-4 md:px-8 lg:px-9 xl:px-9 my-6 grid ">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={reportsLoading || apiLoading || commonLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={status === reportsStatus.create}
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
              Report action successfully performed
            </p>
          </div>
        </div>
      </Backdrop>

      {notification.program && (
        <ToastNotification
          openToaster={notification.program}
          message={"There is no programs found for this category"}
          handleClose={handleClose}
          toastType={"error"}
        />
      )}

      <div
        className="grid mb-10"
        style={{
          boxShadow: "4px 4px 25px 0px rgba(0, 0, 0, 0.15)",
          borderRadius: "5px",
        }}
      >
        <div className="breadcrum">
          <nav
            className="flex px-7 pt-6 pb-5 mx-2 border-b-2 justify-between"
            aria-label="Breadcrumb"
          >
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <li className="inline-flex items-center">
                <h2>Create New Report</h2>
              </li>
            </ol>
            <img
              className="cursor-pointer"
              onClick={() => handleCancelReportAction()}
              src={CancelIcon}
              alt="CancelIcon"
            />
          </nav>
        </div>
        <div className="content px-4 sm:px-4 md:px-6 lg:px-8 xl:px-8">
          <div className="py-9">
            <form id="create-report" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-wrap gap-4">
                {reportFields.map((field, index) => {
                  const dateField =
                    field.type === "date"
                      ? register(field.name, field.inputRules)
                      : undefined;
                  const dropdownField =
                    field.type === "dropdown"
                      ? register(field.name, field.inputRules)
                      : undefined;
                  return (
                    <div className={`relative mb-6 ${field.width}`} key={index}>
                      <label
                        className="block tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor={field.label}
                      >
                        {field.label}
                      </label>
                      {field.type === "input" ? (
                        <>
                          <input
                            {...register(field.name, field.inputRules)}
                            type={field.fieldtype}
                            className="w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg focus:border-none focus-visible:border-none 
                                                                    focus-visible:outline-none text-[14px] h-[60px]"
                            placeholder={field.placeholder}
                            style={{
                              color: "#232323",
                              borderRadius: "3px",
                            }}
                            disabled={field.disabled}
                            aria-invalid={!!errors[field.name]}
                            onChange={() => handleInputChange(field.name)}
                          />

                          {errors[field.name] && (
                            <p className="error" role="alert">
                              {errors[field.name].message}
                            </p>
                          )}
                        </>
                      ) : field.type === "dropdown" ? (
                        <>
                          <select
                            {...register(field.name, field.inputRules)}
                            className="w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg  
                                                                                focus:border-none focus-visible:border-none focus-visible:outline-none text-[14px] h-[60px]"
                            placeholder={field.placeholder}
                            style={{
                              color: "#232323",
                              borderRadius: "3px",
                            }}
                            disabled={field.disabled}
                            onChange={(e) => {
                              dropdownField.onChange(e);
                              if (field.name === "category")
                                getProgramInfo(e.target.value);
                              if (field.name === "program")
                                handleProgramData(e.target.value);
                              handleInputChange(field.name);
                            }}
                          >
                            <option value="">Select</option>
                            {field.options.map((option, index) => {
                              let opt = { name: option.name || "" };
                              if (field.name === "program") {
                                opt = { name: option.program_name };
                              }
                              return (
                                <option
                                  value={option.id}
                                  key={index}
                                  selected={getValues(field.name) === option.id}
                                >
                                  {opt.name}
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
                      ) : field.type === "textbox" ? (
                        <>
                          <textarea
                            id="message"
                            rows="4"
                            className={`block p-2.5 input-bg w-full text-sm text-gray-900  rounded-lg border
                                                                                focus:visible:outline-none focus:visible:border-none ${
                                                                                  field.width ===
                                                                                  "width-82"
                                                                                    ? "h-[282px]"
                                                                                    : ""
                                                                                }`}
                            placeholder={field.placeholder}
                            {...register(field.name, field.inputRules)}
                            onChange={() => handleInputChange(field.name)}
                            disabled={field.disabled}
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
                                className="w-4 h-4 text-blue-600 bg-gray-100
                                                                                            border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 
                                                                                            dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700
                                                                                            dark:border-gray-600"
                                {...register(field.name, field.inputRules)}
                                onChange={() => handleInputChange(field.name)}
                              />
                              <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                {option.value}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : field.type === "date" ? (
                        <>
                          <div className="relative input-bg">
                            <input
                              {...register(field.name, field.inputRules)}
                              type={field.fieldtype}
                              className="w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg focus:border-none focus-visible:border-none 
                                                                                    focus-visible:outline-none text-[14px] h-[60px]"
                              placeholder={field.placeholder}
                              style={{
                                color: "#232323",
                                borderRadius: "3px",
                              }}
                              disabled={field.disabled}
                              aria-invalid={!!errors[field.name]}
                              onChange={() => handleInputChange(field.name)}
                            />
                            <img
                              className="absolute top-5 right-2"
                              src={CalendarIcon}
                              alt="CalendarIcon"
                            />
                          </div>

                          {errors[field.name] && (
                            <p className="error" role="alert">
                              {errors[field.name].message}
                            </p>
                          )}
                        </>
                      ) : field.type === "popup-input" ? (
                        <div className="relative">
                          <div
                            className="input-bg h-[60px] w-full mt-2 flex items-center 
                                                                                                         text-[12px] gap-2 cursor-pointer px-6"
                            style={{ borderRadius: "3px" }}
                          >
                            {getValues(field.name) &&
                              getValues(field.name)
                                .slice(0, 6)
                                .map((popupfield, index) => {
                                  return (
                                    <>
                                      <p className="flex items-center gap-1">
                                        <p
                                          className="flex items-center px-3 py-3"
                                          style={{
                                            background:
                                              "rgba(223, 237, 255, 1)",
                                            borderRadius: "50%",
                                          }}
                                        ></p>
                                        {popupfield.full_name}
                                      </p>
                                    </>
                                  );
                                })}

                            {field?.value && field?.value?.length > 6 && (
                              <p className="flex items-center gap-1">
                                <p
                                  className="text-white flex items-center px-2 py-1"
                                  style={{
                                    background: "rgb(29, 91, 191)",
                                    borderRadius: "50%",
                                  }}
                                >
                                  {field?.value?.length - 6}
                                </p>
                                Others
                              </p>
                            )}
                          </div>
                        </div>
                      ) : field.type === "editor" ? (
                        <>
                          <div className="flex gap-2">
                            {/* <textarea
                              id="message"
                              rows="4"
                              className={`block p-2.5 input-bg w-[100%] h-[200px] text-sm text-gray-900  rounded-lg border
                                                                                            focus:visible:outline-none focus:visible:border-none ${
                                                                                              field.width ===
                                                                                              "width-82"
                                                                                                ? "h-[282px]"
                                                                                                : ""
                                                                                            }`}
                              placeholder={field.placeholder}
                              {...register(field.name, field.inputRules)}
                              onChange={() => handleInputChange(field.name)}
                            ></textarea>
                            <div
                              className="flex flex-col gap-6 items-center justify-center input-bg w-[9%] sm:w-[9%] md:w-[9%] lg:w-[9%] xl:w-[9%] cursor-pointer"
                              style={{ borderRadius: "3px" }}
                              onClick={() => handleOpenHtmlReport()}
                            >
                              <img src={TextIcon} alt="TextIcon" />
                              <img src={HTMLIcon} alt="HTMLIcon" />
                            </div> */}
                            <div
                              className="border border-dashed border-background-primary-main text-font-primary-main whitespace-nowrap flex items-center justify-center p-3 px-7 rounded-[2px] gap-3 cursor-pointer"
                              onClick={() => handleOpenHtmlReport()}
                            >
                              <img
                                src={AddGoalIcon}
                                alt="AddGoalIcon"
                                className="h-[20px] w-[20px]"
                              />
                              <p>Generate Report Link</p>
                            </div>
                            <input
                              {...register(field.name, field.inputRules)}
                              type={field.fieldtype}
                              className="w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg focus:border-none focus-visible:border-none 
                                                                    focus-visible:outline-none text-[14px] h-[60px]"
                              placeholder={field.placeholder}
                              style={{
                                color: "#232323",
                                borderRadius: "3px",
                              }}
                              disabled={field.disabled}
                              aria-invalid={!!errors[field.name]}
                              onChange={() => handleInputChange(field.name)}
                            />
                          </div>
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
              <div className="flex gap-6 justify-center align-middle py-16">
                <Button
                  btnName="Cancel"
                  btnCls="w-[30%] sm:w-[30%] md:w-[20%] lg:w-[15%] xl:w-[15%]"
                  btnCategory="secondary"
                  onClick={() => handleCancelReportAction()}
                />
                {/* {role !== "admin" && (
                  <Button
                    btnName="Save To Draft"
                    style={{
                      background: "rgba(29, 91, 191, 1)",
                      color: "#fff",
                    }}
                    btnCls="w-[30%] sm:w-[30%] md:w-[20%] lg:w-[15%] xl:w-[15%]"
                    btnCategory="secondary"
                    onClick={handleSubmit((d) =>
                      onSubmit({ ...d, action: "draft" })
                    )}
                  />
                )} */}
                <Button
                  btnType="submit"
                  btnCls="w-[30%] sm:w-[30%] md:w-[20%] lg:w-[15%] xl:w-[15%]"
                  btnName="Submit"
                  btnCategory="primary"
                />
              </div>
            </form>

            <MuiModal
              modalSize="md"
              modalOpen={openReport}
              noheader
              modalClose={() => setOpenReport(false)}
            >
              <HtmlReport
                onCancel={() => {
                  setOpenReport(false);
                }}
                onSave={(data) => {
                  setOpenReport(false);
                  setValue("description", data?.data?.data?.html_content_link);
                }}
                reportId={reportData?.data?.request_id}
              />
            </MuiModal>
          </div>
        </div>
      </div>
    </div>
  );
}
