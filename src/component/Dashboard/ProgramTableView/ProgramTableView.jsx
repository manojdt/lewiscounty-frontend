import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MoreIcon from "../../../assets/icons/moreIcon.svg";
import ViewIcon from "../../../assets/images/view1x.png";
import FilterIcon from "../../../assets/icons/filterIcon.svg";
import { pipeUrls } from "../../../utils/constant";
import { programListColumns } from "../../../utils/tableFields";
import { Backdrop, Menu, MenuItem } from "@mui/material";
import DataTable from "../../../shared/DataGrid";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories } from "../../../services/programInfo";
import { Button } from "../../../shared";
import SearchIcon from "../../../assets/icons/SearchColor.svg";
export const ProgramTableView = ({ programView,title,tableIcon,viewpage, setProgramView,programData=[] }) => {
  // const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [seletedItem, setSelectedItem] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
const [searchParams, setSearchParams] = useSearchParams();
const { category, loading: apiLoading } = useSelector(
    (state) => state.programInfo
  );
  const dispatch = useDispatch();
  const [categoryPopup, setCategoryPopup] = useState({
    show: false,
    search: "",
    categoryList: [],
    selectedItem: [],
  });

  const handleMoreClick = (event, data) => {
    setSelectedItem(data);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleNavigation = (programdetails) => {
    let baseUrl = pipeUrls.programdetails;
    if (Object.keys(programdetails).length) {
      navigate(
        `${baseUrl}/${programdetails.program || programdetails?.id}${
          programdetails?.admin_program_request_id
            ? `?request_id=${programdetails?.admin_program_request_id}&type=admin_assign_program`
            : "admin_assign_program" in programdetails
            ? `?program_create_type=admin_program`
            : ""
        }${
          programdetails?.admin_program_request_id ||
          "admin_assign_program" in programdetails
            ? "&"
            : "?"
        }`
      );
    }
  };
  const handleCategoryFilter = () => {
    let options = {
      ...categoryPopup,
      show: true,
      search: "",
      selectedItem: [],
    };
    if (
      searchParams.has("category_id") &&
      searchParams.get("category_id") !== ""
    ) {
      options = {
        ...options,
        selectedItem: searchParams.get("category_id").split(",").map(Number),
      };
    }
    setCategoryPopup(options);
  };
  const handleCategorySearch = (value) => {
    let catList = category.filter((cat) =>
      cat.name.toLowerCase().includes(value.toLowerCase())
    );
    if (value === "") catList = category;
    setCategoryPopup({
      ...categoryPopup,
      search: value,
      categoryList: catList,
    });
  };

  const handleSelectCategory = (categoryId) => {
    let selectedItems = categoryPopup.selectedItem;
    const selectedCategory = selectedItems.includes(categoryId)
      ? selectedItems.filter((select) => select !== categoryId)
      : [...selectedItems, categoryId];
    setCategoryPopup({ ...categoryPopup, selectedItem: selectedCategory });
  };
  const programTableFields = [
    ...programListColumns,
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      id: 0,
      renderCell: (params) => {
        return (
          <>
            <div
              className="cursor-pointer flex items-center h-full"
              onClick={(e) => handleMoreClick(e, params.row)}
            >
              <img src={MoreIcon} alt="MoreIcon" />
            </div>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem
                onClick={(e) => handleNavigation(seletedItem)}
                className="!text-[12px]"
              >
                <img src={ViewIcon} alt="ViewIcon" className="pr-3 w-[30px]" />
                View
              </MenuItem>
            </Menu>
          </>
        );
      },
    },
  ];
  const handleSearchSubmit = () => {
    const selectedCategory = categoryPopup.selectedItem;
    if (selectedCategory.length) {
      searchParams.set("category_id", selectedCategory.toString());
    } else {
      searchParams.delete("category_id");
    }
    setSearchParams(searchParams);
    setCategoryPopup({
      show: false,
      search: "",
      categoryList: category,
      selectedItem: [],
    });
  };

    useEffect(() => {
      setCategoryPopup({
        show: false,
        search: "",
        categoryList: category,
        selectedItem: [],
      });
    }, [category]);
  
    useEffect(() => {
      if (!category.length) {
        dispatch(getAllCategories());
      }
    }, []);
  return (
    <div>
           <div className="title flex justify-between py-3 px-4 border-b-2 items-center">

         <div className="flex gap-4">
              <div
                className="card-dash"
                style={{
                  background:
                    "linear-gradient(180deg, #00B1C0 0%, #005DC6 100%)",
                }}
              ></div>
              <h4>{title}</h4>
              <img
                className="cursor-pointer"
                onClick={handleCategoryFilter}
                src={FilterIcon}
                alt="statistics"
              />
              {tableIcon}
            </div>
            {programData && programData.length ? (
              <p
                className="text-[12px] py-2 px-2 cursor-pointer"
                style={{
                  background: "rgba(217, 228, 242, 1)",
                  color: "rgba(29, 91, 191, 1)",
                  borderRadius: "3px",
                }}
                onClick={() => navigate(viewpage)}
              >
                View All
              </p>
            ) : null}
           </div>
      <div className="py-6 px-6">
        <DataTable
          // loading={isLoading || isFetching}
          rows={programData}
          columns={programTableFields}
          hideCheckbox
        //   rowCount={6}
          // paginationModel={paginationModel1}
          // setPaginationModel={setPaginationModel1}
        />
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={categoryPopup.show}
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
                value={categoryPopup.search}
              />
              <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
                <img src={SearchIcon} alt="SearchIcon" />
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
                {categoryPopup.categoryList.map((category, index) => (
                  <li key={index} className="flex gap-7">
                    <input
                      type="checkbox"
                      className="w-[20px]"
                      checked={categoryPopup.selectedItem.includes(category.id)}
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
                  onClick={() =>
                    setCategoryPopup({
                      ...categoryPopup,
                      search: "",
                      show: false,
                      selectedItem: [],
                    })
                  }
                />
                <Button
                  btnType="button"
                  btnCls="w-[100px]"
                  btnStyle={{ background: "rgba(29, 91, 191, 1)" }}
                  onClick={handleSearchSubmit}
                  btnName={"Ok"}
                  btnCategory="primary"
                />
              </div>
            </div>
          </div>
        </div>
      </Backdrop>
    </div>
  );
};
