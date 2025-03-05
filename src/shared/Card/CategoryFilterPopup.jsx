import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "../Button";
import FilterIcon from "../../assets/icons/filterIcon.svg";
import { Backdrop } from "@mui/material";

const CategoryFilter = ({
  categories = [],
  onFilter,
  categories_id,
  initialSelected = [],
  handleGetCategory = () => false,
  triggerIcon,
}) => {
  // Initialize state with initialSelected or categories_id
  const [filterState, setFilterState] = useState({
    show: false,
    search: "",
    categoryList: [],
    selectedItem: [],
  });

  // Effect to handle initial selection and category_id changes
  useEffect(() => {
    if (categories?.length > 0) {
      setFilterState((prev) => ({
        ...prev,
        categoryList: categories,
      }));
    }
  }, [categories]);

  // Effect to handle categories_id changes
  useEffect(() => {
    if (categories_id) {
      // Convert categories_id to array if it's a string
      const categoryIds = categories_id
        .toString()
        .split(",")
        .map((id) => parseInt(id));
      // Filter to only include valid category IDs
      const validIds = categoryIds.filter((id) =>
        categories.some((cat) => cat.id === id)
      );
      setFilterState((prev) => ({
        ...prev,
        selectedItem: validIds,
      }));
    } else {
      // Clear selection if no categories_id
      setFilterState((prev) => ({
        ...prev,
        selectedItem: [],
      }));
    }
  }, [categories_id, categories]);

  const handleCategoryFilter = () => {
    handleGetCategory("");
    setFilterState((prev) => ({
      ...prev,
      show: true,
      search: "",
    }));
  };

  const handleCategorySearch = (value) => {
    handleGetCategory(value);
    setFilterState((prev) => ({
      ...prev,
      search: value,
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
    // Reset to the URL parameter selection state
    if (categories_id) {
      const categoryIds = categories_id
        .toString()
        .split(",")
        .map((id) => parseInt(id));
      setFilterState((prev) => ({
        ...prev,
        show: false,
        search: "",
        selectedItem: categoryIds,
      }));
    } else {
      setFilterState((prev) => ({
        ...prev,
        show: false,
        search: "",
        selectedItem: [],
      }));
    }
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
        {triggerIcon ? (
          triggerIcon
        ) : (
          <img className="cursor-pointer" src={FilterIcon} alt="filter" />
        )}
      </div>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={filterState.show}
      >
        <div className="py-3 px-4 bg-white rounded-md">
          <div className="py-5 px-5 border border-[#1D5BBF] rounded-md">
            <div className="relative">
              <input
                type="text"
                className="block w-full p-2 text-sm text-gray-900 border-none bg-[#EEF5FF] h-[55px] w-[400px] rounded-md border border-[#1D5BBF]"
                onChange={(e) => handleCategorySearch(e.target.value)}
                placeholder="Search Category"
                value={filterState.search}
              />
              <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-500" />
              </div>
            </div>

            <div className="text-black">
              <ul className="py-6 leading-10 max-h-[250px] overflow-y-auto my-[15px]">
                {categories?.map((category, index) => (
                  <li key={category.id || index} className="flex gap-7">
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
              <div className="flex gap-6 justify-center items-center">
                <Button
                  btnName="Cancel"
                  btnCategory="secondary"
                  onClick={handleCancel}
                />
                <Button
                  btnType="button"
                  btnCls="w-[100px]"
                  btnStyle={{ background: "#1D5BBF" }}
                  onClick={handleSubmit}
                  btnName="Ok"
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
