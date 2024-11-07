import { Backdrop, CircularProgress, Tooltip } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import CancelIcon from "../../../assets/images/cancel1x.png";
import { Button } from "../../../shared";

function AddSuperMember() {
  const navigate = useNavigate();
  return (
    <div className="px-9 my-6 grid">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        // open={reportsLoading || apiLoading}
        open={false}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* <MuiModal modalOpen={status === certificateStatus.create} modalClose={() => setLoading(false)} noheader>
                <div className='px-5 py-1 flex justify-center items-center'>
                    <div className='flex justify-center items-center flex-col gap-5 py-10 px-20 mt-20 mb-20'
                        style={{ background: 'linear-gradient(101.69deg, #1D5BBF -94.42%, #00AEBD 107.97%)', borderRadius: '10px' }}>
                        <img src={SuccessTik} alt="SuccessTik" />
                        <p className='text-white text-[12px]'>Certificate action successfully performed</p>
                    </div>

                </div>
            </MuiModal> */}
      <div
        className="grid mb-10"
        style={{
          boxShadow: "4px 4px 25px 0px rgba(0, 0, 0, 0.15)",
          borderRadius: "5px",
        }}
      >
        <div className="breadcrum">
          <div className="breadcrum">
            <nav
              className="flex px-7 pt-6 pb-5 mx-2 border-b-2 justify-between"
              aria-label="Breadcrumb"
            >
              <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li className="inline-flex items-center">
                  <h2>Add New Org Admin</h2>
                </li>
              </ol>
              <img
                className="cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(-1);
                }}
                src={CancelIcon}
                alt="CancelIcon"
              />
            </nav>
          </div>
          <div className="content px-8">
            <div className="py-9">
              <form>
                {/* <div className="flex flex-wrap gap-4">
                  <div>asasas</div>
                </div> */}
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-6">
                    <div className={`relative mb-6 `}>
                      <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                        {"First Name"}
                      </label>
                      <input
                        type="text"
                        className="w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg focus:border-none focus-visible:border-none focus-visible:outline-none text-[14px] h-[60px]"
                        id="basic-url1"
                        aria-describedby="basic-addon1"
                        style={{
                          color: "#232323",
                          borderRadius: "3px",
                          //   paddingLeft:
                          //     field.name === "phone_number" ? "76px" : "10px",
                        }}
                        placeholder="Enter First Name"
                      />
                    </div>
                  </div>
                  <div className="col-span-6">
                    <div className={`relative mb-6 `}>
                      <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                        {"Last Name"}
                      </label>
                      <input
                        type="text"
                        className="w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg focus:border-none focus-visible:border-none focus-visible:outline-none text-[14px] h-[60px]"
                        id="basic-url1"
                        aria-describedby="basic-addon1"
                        style={{
                          color: "#232323",
                          borderRadius: "3px",
                          //   paddingLeft:
                          //     field.name === "phone_number" ? "76px" : "10px",
                        }}
                        placeholder="Enter Last Name"
                      />
                    </div>
                  </div>
                  <div className="col-span-6">
                    <div className={`relative mb-6 `}>
                      <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                        {"Member ID"}
                      </label>
                      <input
                        type="text"
                        className="w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg focus:border-none focus-visible:border-none focus-visible:outline-none text-[14px] h-[60px]"
                        id="basic-url1"
                        aria-describedby="basic-addon1"
                        style={{
                          color: "#232323",
                          borderRadius: "3px",
                          //   paddingLeft:
                          //     field.name === "phone_number" ? "76px" : "10px",
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-span-6">
                    <div className={`relative mb-6 `}>
                      <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                        {"User Name"}
                      </label>
                      <input
                        type="text"
                        className="w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg focus:border-none focus-visible:border-none focus-visible:outline-none text-[14px] h-[60px]"
                        id="basic-url1"
                        aria-describedby="basic-addon1"
                        style={{
                          color: "#232323",
                          borderRadius: "3px",
                          //   paddingLeft:
                          //     field.name === "phone_number" ? "76px" : "10px",
                        }}
                        placeholder="Enter User name"
                      />
                    </div>
                  </div>
                  <div className="col-span-6">
                    <div className={`relative mb-6 `}>
                      <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                        {"Email ID"}
                      </label>
                      <input
                        type="text"
                        className="w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg focus:border-none focus-visible:border-none focus-visible:outline-none text-[14px] h-[60px]"
                        id="basic-url1"
                        aria-describedby="basic-addon1"
                        style={{
                          color: "#232323",
                          borderRadius: "3px",
                          //   paddingLeft:
                          //     field.name === "phone_number" ? "76px" : "10px",
                        }}
                        placeholder="Enter Email ID"
                      />
                    </div>
                  </div>
                  <div className="col-span-6">
                    <div className={`relative mb-6 `}>
                      <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                        {"Phone Number"}
                      </label>
                      <input
                        type="text"
                        className="w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg focus:border-none focus-visible:border-none focus-visible:outline-none text-[14px] h-[60px]"
                        id="basic-url1"
                        aria-describedby="basic-addon1"
                        style={{
                          color: "#232323",
                          borderRadius: "3px",
                          //   paddingLeft:
                          //     field.name === "phone_number" ? "76px" : "10px",
                        }}
                        placeholder="Enter Phone number"
                      />
                    </div>
                  </div>
                  <div className="col-span-12">
                    <div className={`relative mb-6 `}>
                      <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                        {"Select Category"}
                      </label>
                      <select
                        className="w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg focus:border-none focus-visible:border-none focus-visible:outline-none text-[14px] h-[60px]"
                        placeholder={"Category"}
                        style={{
                          color: "#232323",
                          borderRadius: "3px",
                        }}
                        // disabled={field.disabled}
                      >
                        <option value="">No Options</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex gap-6 justify-center align-middle py-16">
                  <Button
                    btnName="Cancel"
                    btnCls="w-[18%]"
                    btnCategory="secondary"
                    onClick={() => navigate("/certificates")}
                  />
                  <Button
                    btnType="submit"
                    btnCls="w-[18%]"
                    btnName="Add New Org admin"
                    btnCategory="primary"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddSuperMember;
