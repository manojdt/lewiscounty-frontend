import { Backdrop, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  requestPageBreadcrumbs,
  new_user_create,
} from "../Breadcrumbs/BreadcrumbsCommonData";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import { Button } from "../../shared";
import MultiSelectElement from "../MultiSelectElement/MultiSelectElement";
import protectedApi from "../../services/api";

export default function CreateNewUser() {
  const [taskSuccess, setTaskSuccess] = useState(false);
  const [search] = useSearchParams();
  const breadcrumbsType = search.get("breadcrumbsType") || "";
  const [breadcrumbsArray, setBreadcrumbsArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errFields, setErrFields] = useState({});
  const [categories, setCategories] = useState([]);
  const [role, setrole] = useState([]);
  const navigate = useNavigate();
  const [selectedRoles, setSelectedRoles] = useState([]);

  const [selectedRole, setSelectedRole] = useState(""); // Single value state

  const handledrop = (selected) => {
    // Clear the error message for role
    setSelectedRoles(selected);
  };

  const [formDetail, setFormDetail] = useState({
    FirstName: "",
    LastName: "",
    PrimaryPhoneNumber: "",
    SecondaryPhoneNumber: "",
    EmailId: "",
    OrgEmailId: "",
    Category: [],
    Role: [],
  });
  useEffect(() => {
    // Fetch categories from API
    setLoading(true);
    protectedApi
      .get("/category")
      .then((response) => {
        setCategories(response.data || []);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  const handledropChange = (selectedOptions) => {
    // Handle the selection change for multi-select
    setErrFields((prevErrors) => ({
      ...prevErrors,
      Category: "", // Clear error for the specific field
    }));

    // Update the Category state with the selected category IDs
    setFormDetail((prevDetail) => ({
      ...prevDetail,
      Category: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [], // Update with selected IDs
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    // Clear error for this field when user changes the value
    setErrFields((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear error for the specific field
    }));
    if (name === "FirstName") {
      setFormDetail((prevDetail) => ({
        ...prevDetail,
        [name]: value,
        OrgEmailId: `${value}${prevDetail?.LastName}@socialroots.ai`,
      }));
    } else if (name === "LastName") {
      setFormDetail((prevDetail) => ({
        ...prevDetail,
        [name]: value,
        OrgEmailId: `${prevDetail?.FirstName}${value}@organisationngo.com`,
      }));
    } else if (type === "select-one") {
      // For single select, store the value as an array
      setFormDetail((prevDetail) => ({
        ...prevDetail,
        [name]: [Number(value)], // Store as an array of numbers
      }));
    } else {
      // For other form fields, just store the value as usual
      setFormDetail((prevDetail) => ({
        ...prevDetail,
        [name]: value,
      }));
    }
  };
  // Handle Breadcrumbs based on type
  const handleBreadcrumbs = (key) => {
    const new_create_user = new_user_create();

    switch (key) {
      case requestPageBreadcrumbs.createNewusers:
        setBreadcrumbsArray(new_create_user);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (breadcrumbsType) {
      handleBreadcrumbs(breadcrumbsType);
    }
  }, [breadcrumbsType]);
  const validateForm = () => {
    let isValid = true;
    let errors = {};

    let firstInvalidField = null;

    let mandatoryFields = [
      "FirstName",
      "LastName",
      "EmailId",
      "PrimaryPhoneNumber",
      "Category",
    ];

    // Check for missing mandatory fields
    mandatoryFields.forEach((field) => {
      if (!formDetail[field]) {
        errors[field] = `${field} is required`;
        if (!firstInvalidField) {
          firstInvalidField = field;
        }
        isValid = false;
      }
    });

    // Set errors if any
    setErrFields(errors);

    // Focus on the first invalid field, if any
    if (firstInvalidField) {
      // Instead of refs, we can use the name attribute directly to focus on the invalid field
      document.getElementsByName(firstInvalidField)[0]?.focus();
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form before submitting
    if (validateForm()) {
      // Prepare the data to send in the API request
      const data = {
        first_name: formDetail.FirstName,
        last_name: formDetail.LastName,
        personal_email: formDetail.EmailId,
        email: formDetail.OrgEmailId,
        phone_number: formDetail.PrimaryPhoneNumber,
        secondary_phone_number: formDetail.SecondaryPhoneNumber,
        is_staff: true,
        role: "mentor",
        categories: formDetail.Category, // Make sure this is an array of IDs
        created_by: "admin",
      };
      setLoading(true);
      protectedApi
        .post("/register", data)
        .then((response) => {
          if (response.status === 200 && response.data?.error) {
            alert(response.data.error);
          } else {
            setTaskSuccess(true);
            setTimeout(() => {
              navigate("/questions");
            }, 3000);
          }
        })
        .catch((error) => {
          console.error("Error creating new org admin:", error);
          alert("Something went wrong, please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  return (
    <div className="px-4 my-6 grid sm:px-4 md:px-6 lg:px-9 xl:px-9">
      {/* Loading Indicator */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Breadcrumbs */}
      <div className="pb-3">
        {breadcrumbsType && <Breadcrumbs items={breadcrumbsArray} />}
      </div>
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        <li className="inline-flex items-center">
          <h2>User Information</h2>
        </li>
      </ol>
      <div className="content px-4 sm:px-4 md:px-8 lg:px-8 xl:px-8">
        <div className="py-9">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <FormField label="First Name" required>
                  <input
                    name="FirstName"
                    value={formDetail.FirstName}
                    onChange={handleInputChange}
                    type="text"
                    className="w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg focus:border-none focus-visible:outline-none text-[14px] h-[60px]"
                    placeholder="Enter First Name"
                  />
                  {errFields.FirstName && (
                    <p className="mt-1 ms-1 text-xs text-red-400">
                      {errFields.FirstName}
                    </p>
                  )}
                </FormField>
              </div>

              <div className="col-span-12 md:col-span-6">
                <FormField label="Last Name" required>
                  <input
                    name="LastName"
                    value={formDetail.LastName}
                    onChange={handleInputChange}
                    type="text"
                    className="w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg focus:border-none focus-visible:outline-none text-[14px] h-[60px]"
                    placeholder="Enter Last Name"
                  />
                  {errFields.LastName && (
                    <p className="mt-1 ms-1 text-xs text-red-400">
                      {errFields.LastName}
                    </p>
                  )}
                </FormField>
              </div>

              <div className="col-span-12 md:col-span-6">
                <FormField label="Personal Email Id" required>
                  <input
                    name="EmailId"
                    value={formDetail.EmailId}
                    onChange={handleInputChange}
                    type="email"
                    className="w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg focus:border-none focus-visible:outline-none text-[14px] h-[60px]"
                    placeholder="Enter Email Id"
                  />
                  {errFields.EmailId && (
                    <p className="mt-1 ms-1 text-xs text-red-400">
                      {errFields.EmailId}
                    </p>
                  )}
                </FormField>
              </div>

              <div className="col-span-12 md:col-span-6">
                <FormField label="User ID">
                  <input
                    name="OrgEmailId"
                    value={formDetail.OrgEmailId}
                    onChange={handleInputChange}
                    type="email"
                    className="w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg focus:border-none focus-visible:outline-none text-[14px] h-[60px]"
                    placeholder="Enter Organization Email ID"
                    disabled
                  />
                  {errFields.OrgEmailId && (
                    <p className="mt-1 ms-1 text-xs text-red-400">
                      {errFields.OrgEmailId}
                    </p>
                  )}
                </FormField>
              </div>

              <div className="col-span-12 md:col-span-6">
                <FormField label="Primary Phone Number" required>
                  <input
                    name="PrimaryPhoneNumber"
                    value={formDetail.PrimaryPhoneNumber}
                    onInput={handleInputChange}
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg focus:border-none focus-visible:outline-none text-[14px] h-[60px]"
                    placeholder="Enter Primary Phone Number"
                  />
                  {errFields.PrimaryPhoneNumber && (
                    <p className="mt-1 ms-1 text-xs text-red-400">
                      {errFields.PrimaryPhoneNumber}
                    </p>
                  )}
                </FormField>
              </div>

              <div className="col-span-12 md:col-span-6">
                <FormField label="Secondary Phone Number">
                  <input
                    name="SecondaryPhoneNumber"
                    value={formDetail.SecondaryPhoneNumber}
                    onInput={handleInputChange}
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg focus:border-none focus-visible:outline-none text-[14px] h-[60px]"
                    placeholder="Enter Secondary Phone Number"
                  />
                </FormField>
              </div>
              <div className="col-span-12 md:col-span-6">
              <FormField label="Select Role" required>
                <MultiSelectElement
                  name="Role"
                  options={[{ label: "Mentor", value: "mentor" }]}
                  value={selectedRoles} // Bind state to value
                  onChange={handledrop}
                  className="content-center w-full border-none py-[0.32rem] leading-[2.15] input-bg focus:border-none focus-visible:outline-none text-[14px] h-[60px]"
                  placeholder="Select Role"
                  required
                />
                </FormField>
              </div>
              <div className="col-span-12 md:col-span-6">
                <FormField label="Select Category" required>
                  <MultiSelectElement
                    name="Category"
                    value={categories
                      .filter((category) =>
                        formDetail.Category.includes(category.id)
                      )
                      .map((category) => ({
                        label: category.name,
                        value: category.id,
                      }))}
                    onChange={handledropChange}
                    options={categories.map((category) => ({
                      label: category.name,
                      value: category.id,
                    }))}
                    className="content-center w-full border-none py-[0.32rem] leading-[2.15] input-bg focus:border-none focus-visible:outline-none text-[14px] h-[60px]"
                    placeholder="Select categories"
                    required
                  />
                  {errFields.Category && (
                    <p className="mt-1 ms-1 text-xs text-red-400">
                      {errFields.Category}
                    </p>
                  )}
                </FormField>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-6 justify-center align-middle py-16">
              <Button
                btnName="Cancel"
                btnCls="w-[30%] sm:w-[30%] md:w-[20%] lg:w-[15%] xl:w-[15%]"
                btnCategory="secondary"
                onClick={() => navigate("")}
              />
              <Button
                btnType="submit"
                btnCls="w-[30%] sm:w-[30%] md:w-[20%] lg:w-[15%] xl:w-[15%]"
                btnName="Add"
                btnCategory="primary"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
function FormField({ required = false, label = "", error, children }) {
  return (
    <>
      {label && (
        <p className="block tracking-wide text-gray-700 text-xs font-bold mb-4">
          <span>{label}</span>
          {required && <span className="text-red-400">*</span>}
        </p>
      )}
      {children}
      {error && <p className="mt-1 ms-1 text-xs text-red-400">{error}</p>}
    </>
  );
}
