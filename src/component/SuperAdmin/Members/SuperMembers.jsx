import React, { useState } from "react";
import { Backdrop, CircularProgress, Menu, MenuItem, Switch } from "@mui/material";
import SearchIcon from "../../../assets/icons/search.svg";
import { Button } from "../../../shared";
import DataTable from "../../../shared/DataGrid";
import {  useNavigate } from "react-router-dom";
import { memberStatusColor } from "../../../utils/constant";
import MoreIcon from "../../../assets/icons/moreIcon.svg";
import PowerIcon from "../../../assets/icons/PowerIcon.svg";
import ViewIcon from "../../../assets/images/view1x.png";
import DeleteIcon from "../../../assets/icons/Delete.svg";





function SuperMembers() {
  const [seletedItem, setSelectedItem] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const handleMoreClick = (event, data) => {
    setSelectedItem(data);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const supermemberColumn = [
    {
      field: "id",
      headerName: "Member ID",
      flex: 1,
      id: 0,
      align: "center",
      headerAlign: "center",
      minWidth: 150,
    },
    {
      field: "user_name",
      headerName: "UserName",
      flex: 1,
      id: 1,
      minWidth: 200,
    },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
      id: 1,
      minWidth: 200,
    },
    {
      field: "phone_number",
      headerName: "Phone Number",
      flex: 1,
      id: 1,
      minWidth: 200,
      // renderCell: (params) => {
      //   return <div>{dateFormat(params.row.start_date)}</div>;
      // },
    },
    {
      field: "email_address",
      headerName: "Email Address",
      flex: 1,
      id: 1,
      minWidth: 200,
      // renderCell: (params) => {
      //   return <div>{dateFormat(params.row.end_date)}</div>;
      // },
    },
    {
      field: "designation",
      headerName: "Designation",
      flex: 1,
      id: 1,
      minWidth: 200,
      // renderCell: (params) => {
      //   return <div>{dateFormat(params.row.end_date)}</div>;
      // },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      id: 1,
      minWidth: 150,
      renderCell: (params) => {
        return (
          <>
            <div className="cursor-pointer flex items-center h-full relative">
              <span
                className="w-[80px] flex justify-center h-[30px] px-7"
                style={{
                  background: params.row.status
                    ? memberStatusColor.accept.bgColor
                    : memberStatusColor.cancel.bgColor,
                  lineHeight: "30px",
                  borderRadius: "3px",
                  width: params.row.status ? "110px" : "92px",
                  height: "34px",
                  color: params.row.status
                    ? memberStatusColor.accept?.color
                    : memberStatusColor.cancel.color,
                  fontSize: "12px",
                }}
              >
                {params.row.status ? "Active" : "Deactive"}
              </span>
            </div>
          </>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      id: 1,
      align: "center",
      minWidth: 100,
      renderCell: (params) => {
        return (
          <>
            <div
              className="cursor-pointer flex items-center h-full"
              onClick={(e) => handleMoreClick(e, params.row)}
            >
              <img src={MoreIcon} className="pl-4" alt="MoreIcon" />
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
                // onClick={(e) => {
                //   handleClose();
                //   navigate(`/mentor-details/${seletedItem.id}`);
                // }}
                className="!text-[12px]"
              >
                <img
                  src={ViewIcon}
                  alt="ViewIcon"
                  field={params.id}
                  className="pr-3 w-[30px]"
                />
                View
              </MenuItem>
              <MenuItem className="!text-[12px]" onClick={undefined}>
                <img src={PowerIcon} alt="CancelIcon" className="pr-3 w-[27px]" />
                Inactive
              </MenuItem>
              <MenuItem className="!text-[12px]" onClick={undefined}>
                <img src={DeleteIcon} alt="CancelIcon" className="pr-3 w-[27px]" />
                Delete
              </MenuItem>
            </Menu>
          </>
        );
      },
    },
  ];
  
  // const rows = useMemo(() => {
  //   return rowData;
  // }, [rowData]);
  
  const supermemberList = () => {
    const data = [];
    for (let a = 1; a <= 50; a++) {
      data.push({
        id: `# ${a}`,
        user_name: `Liam${a}`,
        category: `Teaching ${a}`,
        // date: "3/7/2024",
        phone_number: `+01878787876${a}`,
        email_address: `johmdeo${a}@gmail.com`,
        designation: "OrgAdmin",
        status: "Deactive",
      });
    }
    return data;
  };
  const supermemberData = supermemberList();
  return (
    <div>
      <div className="px-8 mt-10 ">
        <Backdrop
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={false}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        <div
          className="px-3 py-5"
          style={{ boxShadow: "4px 4px 25px 0px rgba(0, 0, 0, 0.15)" }}
        >
          <div className="flex justify-between px-5 pb-4 mb-8 items-center border-b-2">
            <div className="flex gap-5 items-center text-[18px] font-semibold">
              <p>Org Admin List</p>
            </div>

            <div className="flex gap-5">
              <div className="relative">
                <input
                  type="text"
                  id="search-navbar"
                  className="block w-full p-2 text-sm text-gray-900 border-none"
                  placeholder="Search here..."
                  style={{
                    border: "1px solid rgba(29, 91, 191, 1)",
                    borderRadius: "1px",
                    height: "45px",
                    width: "280px",
                  }}
                  // onChange={(e) => handleSearch(e.target.value)}
                />
                <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
                  <img src={SearchIcon} alt="SearchIcon" />
                </div>
              </div>

              <Button
                btnName="Add Org Admin"
                onClick={() => navigate("/super-members/add")}
              />
            </div>
          </div>

          <div
          // className="mx-4"
          // style={{ border: "1px solid #D9E4F2", borderRadius: "3px" }}
          >
            <div className="px-6 py-70">
              <DataTable
                hideCheckbox
                rows={supermemberData || []}
                columns={supermemberColumn}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperMembers;
