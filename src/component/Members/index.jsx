import { Backdrop, CircularProgress, Menu, MenuItem } from "@mui/material";
import React, { useEffect, useState } from "react";
import DataTable from "../../shared/DataGrid";
import SearchIcon from '../../assets/icons/search.svg';
import CalenderIcon from '../../assets/icons/CalenderIcon.svg'
import { allMembersColumns, allMembersolumns } from "../../mock";
import MoreIcon from "../../assets/icons/moreIcon.svg";
import TickCircle from "../../assets/icons/tickCircle.svg";
import CloseCircle from "../../assets/icons/closeCircle.svg";
import ViewIcon from "../../assets/images/view1x.png";
import ShareIcon from "../../assets/icons/Share.svg";
import { useDispatch, useSelector } from "react-redux";
import { getMembersList } from "../../services/members";

const Members = () => {
  const [actionTab, setActiveTab] = useState("mentor");
  const [activeTableDetails, setActiveTableDetails] = useState({
    column: [],
    data: [],
  });
  const [seletedItem, setSelectedItem] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch()
  const { mentor, mentee, loading } = useSelector(state => state.members)

  const open = Boolean(anchorEl);

  const handleMoreClick = (event, data) => {
    console.log("more");
    setSelectedItem(data);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (e) => {
    console.log(e);
  };


  let membersTab = [
    {
      name: "Mentor",
      key: "mentor",
    },
    {
      name: "Mentee",
      key: "mentee",
    },
  ];

  const handleTab = (key) => {
    setActiveTab(key);
  };

  const handleStatus = (e) => {
    let payload = { role_name: actionTab }
    if(e.target.value !== 'all'){
      payload = { ...payload, status: e.target.value }
    }
    dispatch(getMembersList(payload))
  }

  useEffect(() => {
    let tableData = []
    if (actionTab === 'mentor') {
      tableData = mentor
    }

    if (actionTab === 'mentee') {
      tableData = mentee
    }

    const columns = allMembersColumns.filter((col) =>
      col.for.includes(actionTab)
    );


    let col = [
      ...columns,
      {
        field: "status",
        headerName: "Status",
        flex: 1,
        id: 2,
        renderCell: (params) => {
          return (
            <>
              <div className="cursor-pointer flex items-center h-full relative">
                {/* <span
                  className="w-[80px] flex justify-center h-[30px] px-7"
                  style={{
                    background:
                      requestStatusColor[params.row.status]?.bgColor || "",
                    lineHeight: "30px",
                    borderRadius: "3px",
                    width: "110px",
                    height: "34px",
                    color: requestStatusColor[params.row.status]?.color || "",
                    fontSize: "12px",
                  }}
                >
                  {requestStatusText[params.row.status] || ""}
                </span> */}
              </div>
            </>
          );
        },
      },
      {
        field: "action",
        headerName: "Action",
        flex: 1,
        id: 4,
        renderCell: (params) => {
          console.log("ssss", params);
          // if (params.row.status !== 'new' && params.row.status !== 'pending') return <></>
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
                  onClick={(e) => {
                    handleClose();
                    //   navigate(`/mentor-details/${seletedItem.id}`);
                  }}
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
  
                <MenuItem className="!text-[12px]">
                  <img
                    src={TickCircle}
                    alt="AcceptIcon"
                    className="pr-3 w-[27px]"
                  />
                  Chat
                </MenuItem>
                <MenuItem className="!text-[12px]">
                  <img
                    src={CloseCircle}
                    alt="CancelIcon"
                    className="pr-3 w-[27px]"
                  />
                  Deactive
                </MenuItem>
  
                <MenuItem className="!text-[12px]">
                  <img
                    src={ShareIcon}
                    alt="ShareIcon"
                    className="pr-3 w-[27px]"
                  />
                  Share
                </MenuItem>
  
                <MenuItem className="!text-[12px]">
                  <img
                    src={ShareIcon}
                    alt="ShareIcon"
                    className="pr-3 w-[27px]"
                  />
                  Assign to Task
                </MenuItem>
              </Menu>
            </>
          );
        },
      },
    ];

    setActiveTableDetails({ data: tableData, column: col });
  }, [mentor, mentee])


  useEffect(() => {
    dispatch(getMembersList({ role_name: actionTab }))
  }, [actionTab]);

  return (
    <div className="program-request px-8 mt-10">
      <div className="px-6 program-info">
        {membersTab.length ? (
          <div className="flex justify-between px-5 mb-4 items-center border-b-2 ">
            <ul className="tab-list">
              {membersTab.map((discussion, index) => (
                <li
                  className={`${actionTab === discussion.key ? "active" : ""
                    } relative`}
                  key={index}
                  onClick={() => handleTab(discussion.key)}
                >
                  <div className="flex justify-center pb-1">
                    <div
                      className={`total-proram-count relative ${actionTab === discussion.key ? "active" : ""
                        }`}
                    >
                      10
                      <p className="notify-icon"></p>
                    </div>
                  </div>
                  <div className="text-[13px]"> {`${discussion.name}`}</div>
                  {actionTab === discussion.key && <span></span>}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      <div className="col-span-4">
        <div
          style={{
            boxShadow: "4px 4px 25px 0px rgba(0, 0, 0, 0.05)",
            borderRadius: "10px",
          }}
        >
          <div className="title flex justify-end py-3 px-4 items-center">
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
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
                  <img src={SearchIcon} alt="SearchIcon" />
                </div>
              </div>
              <div className="relative flex gap-3 py-3 px-3" style={{ border: '1px solid rgba(24, 40, 61, 0.25)' }}>
                <select className='focus:outline-none' onChange={handleStatus}>
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="px-6 py-7 program-info">
            <Backdrop sx={{ zIndex: (theme) => 999999999 }} open={loading}>
              <CircularProgress color="inherit" />
            </Backdrop>

            <DataTable
              rows={activeTableDetails.data}
              columns={activeTableDetails.column}
              hideFooter
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Members;
