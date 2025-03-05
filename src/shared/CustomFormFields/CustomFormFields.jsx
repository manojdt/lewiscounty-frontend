import {
  Checkbox,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { SelectBox } from "../../shared/SelectBox";
import { Calendar } from "primereact/calendar";
import CalendarIcon from "../../assets/icons/CalenderIcon.svg";
//   import UploadIcon from "../../assets/icons/vmUploadIcon.svg";
//   import vmFileDelete from "../../assets/icons/vmFileDelete.svg";
import { CustomUpload } from "./components/CustomUpload";
//   import unselectedVMTypeIcon from "../../assets/icons/unselectedVMTypeIcon.svg";
//   import selectedVMTypeIcon from "../../assets/icons/selectedVMTypeIcon.svg";
import SignatureCanvas from "react-signature-canvas";

export const CustomFormFields = ({
  fields = [],
  formData = "",
  handleChange = () => false,
  handleDeleteFile = () => false,
}) => {
  const calendarRef = React.useRef([]);
  return (
    <>
      <Grid container spacing={4}>
        {fields?.map((fld, index) => {
          return (
            !fld?.isHide && (
              <Grid item xs={fld?.col ?? 6}>
                <Stack spacing={2}>
                  <Typography
                    className="!text-[#353F4F] !text-[14px]"
                    fontWeight={500}
                  >
                    {fld?.label ?? ""}{" "}
                    {fld?.isRequired && fld?.label && (
                      <span className="!text-[#FF0000]">&nbsp; *</span>
                    )}
                  </Typography>

                  {fld?.type === "textbox" && (
                    <TextField
                      variant="outlined"
                      placeholder={fld?.placeholder ?? "Enter text"}
                      fullWidth
                      type={fld?.fieldType ?? "text"}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#1D5BBF0D",
                          borderRadius: 1,
                          border: "none",
                          height: "55px",
                          "& fieldset": {
                            border: "none",
                          },
                        },
                        "& .MuiOutlinedInput-input": {
                          padding: "10px 14px",
                          "&::placeholder": {
                            color: "#C6C6C6",
                          },
                        },
                      }}
                      onWheel={(e) => e.target.blur()}
                      value={formData[fld?.key]}
                      onChange={(e) => handleChange(fld?.key, e.target.value)}
                      disabled={fld?.isDisable ?? false}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              {fld?.endAdornment ?? ""}
                            </InputAdornment>
                          ),
                        },
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          {fld?.endAdornment ?? ""}
                        </InputAdornment>
                      }
                    />
                  )}
                  {fld?.type === "selectBox" && (
                    <SelectBox
                      isBlackArrow
                      background="#1D5BBF0D"
                      selectBox
                      borderColor="transparent"
                      height="55px"
                      color="#353F4F"
                      width="100%"
                      value={formData[fld?.key]}
                      handleChange={(value) =>
                        handleChange(fld?.key, value.target.value)
                      }
                      placeholder={fld?.placeholder ?? "Select"}
                      menuList={fld?.options}
                    />
                  )}
                  {fld?.type === "date" && (
                    <div className="relative !bg-[#1D5BBF0D] cursor-pointer">
                      <Calendar
                        className="calendar-control bg-[#1D5BBF0D]"
                        onChange={(e) => handleChange(fld?.key, e.value)}
                        value={formData[fld?.key]}
                        dateFormat="mm-dd-yy"
                        placeholder={fld?.placeholder ?? "Select"}
                        ref={(el) => (calendarRef.current[index] = el)}
                        minDate={
                          fld?.minDate ? new Date(fld?.minDate) : new Date()
                        }
                        maxDate={
                          fld?.maxDate ? new Date(fld?.maxDate) : new Date()
                        }
                        disabled={fld?.isDisable ?? false}
                      />
                      <img
                        className="absolute top-5 right-2 cursor-pointer"
                        src={CalendarIcon}
                        alt="CalendarIcon"
                        onClick={(e) => {
                          if(!fld?.isDisable){
                            calendarRef?.current[index]?.show();
                          }
                        }}
                      />
                    </div>
                  )}

                  {fld?.type === "time" && (
                    <div className="relative !bg-[#1D5BBF0D] cursor-pointer">
                      <Calendar
                        className="calendar-control bg-[#1D5BBF0D]"
                        onChange={(e) => handleChange(fld?.key, e.value)}
                        value={formData[fld?.key]}
                        timeOnly
                        hourFormat="12"
                        placeholder={fld?.placeholder ?? "Select"}
                        ref={(el) => (calendarRef.current[index] = el)}
                        disabled={fld?.isDisable ?? false}
                      />
                      <img
                        className="absolute top-5 right-2 cursor-pointer"
                        src={CalendarIcon}
                        alt="CalendarIcon"
                        onClick={(e) => {
                          if(!fld?.isDisable){
                            calendarRef?.current[index]?.show();
                          }
                        }}
                      />
                    </div>
                  )}

                  {fld?.type === "textarea" && (
                    <textarea
                      className={`!bg-[#1D5BBF0D] min-h-[100px] p-2`}
                      placeholder={fld?.placeholder ?? "Enter text"}
                      value={formData[fld?.key]}
                      onChange={(e) => handleChange(fld?.key, e.target.value)}
                    ></textarea>
                  )}

                  {fld?.type === "checkbox" && (
                    <Stack direction={"row"} alignItems={"center"} spacing={2}>
                      {fld?.options?.map((data) => {
                        return (
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            spacing={1}
                          >
                            <Checkbox
                              checked={formData[fld?.key] === data?.value}
                              onChange={() =>
                                handleChange(fld?.key, data.value)
                              }
                            />
                            <Typography className="!text-[#232323] !text-[14px]">
                              {data?.label}
                            </Typography>
                          </Stack>
                        );
                      })}
                    </Stack>
                  )}

                  {fld?.type === "upload" && (
                    <CustomUpload
                      uploadedFile={formData[fld?.key]}
                      handleChange={(val) => handleChange(fld?.key, val)}
                      handleDelete={(id) => handleDeleteFile(fld?.key, id)}
                      isMultiFile={fld?.isMultiFile ?? false}
                    />
                  )}

                  {fld?.type === "title" && (
                    <Typography
                      className="!text-[#353F4F] !text-[16px]"
                      fontWeight={500}
                    >
                      {fld?.content}
                    </Typography>
                  )}

                  {/* {fld?.type === "full_checkbox" && (
                      <Stack direction={"row"} alignItems={"center"} spacing={2}>
                        {fld?.options?.map((val) => {
                          return (
                            <Stack
                              direction={"row"}
                              alignItems={"center"}
                              spacing={2}
                              sx={{
                                background:
                                  formData[fld?.key] === val?.value
                                    ? "#FE634E"
                                    : "#FFF8F2",
                                padding: "12px 20px",
                                borderRadius: "3px",
                                cursor: "pointer",
                              }}
                              onClick={() => handleChange(fld?.key, val?.value)}
                            >
                              <img
                                src={
                                  formData[fld?.key] === val?.value
                                    ? selectedVMTypeIcon
                                    : unselectedVMTypeIcon
                                }
                                alt=""
                              />
                              <Typography
                                className={`!text-[${formData[fld?.key] === val?.value
                                  ? "#FFFFFF"
                                  : "#353F4F"
                                  }]`}
                              >
                                {val?.label}
                              </Typography>
                            </Stack>
                          );
                        })}
                      </Stack>
                    )} */}

                  {fld?.type === "signature" && (
                    <SignatureCanvas
                      ref={fld?.ref}
                      penColor="black"
                      canvasProps={{
                        width: 500,
                        height: 200,
                        className: "signature-canvas border border-gray-300",
                      }}
                    />
                  )}

                  {formData?.error?.[fld?.key]?.length > 0 && (
                    <Typography className="!text-[#FF0000] !text-[12px]">
                      {formData?.error?.[fld?.key]}
                    </Typography>
                  )}
                </Stack>
              </Grid>
            )
          );
        })}
      </Grid>
    </>
  );
};
