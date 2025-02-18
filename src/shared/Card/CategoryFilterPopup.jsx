import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "../Button";
import FilterIcon from "../../assets/icons/filterIcon.svg";
import { Backdrop } from "@mui/material";

const CategoryFilter = ({
  categories,
  onFilter,
  categories_id,
  initialSelected = [],
  handleGetCategory = () => false,
  triggerIcon,
}) => {
  const [filterState, setFilterState] = useState({
    show: false,
    search: "",
    categoryList: [],  // Initialize as empty array
    selectedItem: initialSelected,
  });

  // Set initial category list when categories prop changes
  useEffect(() => {
    setFilterState(prev => ({
      ...prev,
      categoryList: categories
    }));
  }, [categories]);
  useEffect(() => {
    if(!categories_id)
    setFilterState(prev => ({
      ...prev,
      selectedItem: [],
    }));
  }, [categories_id]);

  // Initial category fetch
  useEffect(() => {
    handleGetCategory("");
  }, []);

  const handleCategoryFilter = () => {
    setFilterState((prev) => ({
      ...prev,
      show: true,
      search: "",
      selectedItem: initialSelected,
      categoryList: categories, // Ensure categories are set when opening
    }));
  };

  const handleCategorySearch = (value) => {
    const catList =
      value === ""
        ? categories
        : categories.filter((cat) =>
            cat.name.toLowerCase().includes(value.toLowerCase())
          );

    setFilterState((prev) => ({
      ...prev,
      search: value,
      categoryList: catList,
    }));
  };

  const handleSelectCategory = (categoryId) => {
    setFilterState((prev) => ({
      ...prev,
      selectedItem: prev.selectedItem.includes(categoryId)
        ? prev.selectedItem.filter((id) => id !== categoryId)
        : [...prev.selectedItem, categoryId],
    }));
  };

  const handleCancel = () => {
    setFilterState({
      show: false,
      search: "",
      categoryList: categories,
      selectedItem: [],
    });
  };

  const handleSubmit = () => {
    onFilter(filterState.selectedItem);
    setFilterState((prev) => ({
      ...prev,
      show: false,
      search: "",
    }));
  };

  return (
    <>
      <div onClick={handleCategoryFilter} className="cursor-pointer pt-1">
        <img className="cursor-pointer" src={FilterIcon} alt="statistics" />
      </div>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={filterState.show}
      >
        <div className="py-3 px-4 bg-white" style={{ borderRadius: "3px" }}>
          <div
            style={{
              border: "1px solid rgba(29, 91, 191, 1)",
              borderRadius: "3px",
            }}
            className="py-5 px-5"
          >
            <div className="relative">
              <input
                type="text"
                className="block w-full p-2 text-sm text-gray-900 border-none"
                onChange={(e) => handleCategorySearch(e.target.value)}
                placeholder="Search Category"
                style={{
                  background: "rgba(238, 245, 255, 1)",
                  height: "55px",
                  width: "400px",
                  borderRadius: "6px",
                  border: "1px solid rgba(29, 91, 191, 1)",
                }}
                value={filterState.search}
              />
              <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-500" />
              </div>
            </div>

            <div className="text-black">
              <ul
                className="py-6 leading-10"
                style={{
                  maxHeight: "250px",
                  overflowY: "scroll",
                  margin: "15px 0px 30px 0",
                }}
              >
                {filterState.categoryList && filterState.categoryList.map((category, index) => (
                  <li key={index} className="flex gap-7">
                    <input
                      type="checkbox"
                      className="w-[20px]"
                      checked={filterState.selectedItem.includes(category.id)}
                      onChange={() => handleSelectCategory(category.id)}
                      value={category.id}
                    />
                    <span className="text-[16px]">{category.name}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-6 justify-center align-middle">
                <Button
                  btnName="Cancel"
                  btnCategory="secondary"
                  onClick={handleCancel}
                />
                <Button
                  btnType="button"
                  btnCls="w-[100px]"
                  btnStyle={{ background: "rgba(29, 91, 191, 1)" }}
                  onClick={handleSubmit}
                  btnName={"Ok"}
                  btnCategory="primary"
                />
              </div>
            </div>
          </div>
        </div>
      </Backdrop>
    </>
  );
};

export default CategoryFilter;