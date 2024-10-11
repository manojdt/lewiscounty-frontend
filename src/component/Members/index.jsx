import { Backdrop, CircularProgress, Menu, MenuItem } from "@mui/material";
import React, { useEffect, useState } from "react";
import DataTable from "../../shared/DataGrid";
import SearchIcon from '../../assets/icons/search.svg';
import CancelIcon from '../../assets/images/cancel1x.png'
import CalenderIcon from '../../assets/icons/CalenderIcon.svg'
import { allMembersColumns, allMembersolumns } from "../../mock";
import MoreIcon from "../../assets/icons/moreIcon.svg";
import TickCircle from "../../assets/icons/tickCircle.svg";
import CloseCircle from "../../assets/icons/closeCircle.svg";
import ViewIcon from "../../assets/images/view1x.png";
import ShareIcon from "../../assets/icons/Share.svg";
import { useDispatch, useSelector } from "react-redux";
import { deactivateUser, getMembersList } from "../../services/members";
import { useNavigate } from "react-router-dom";
import { memberStatusColor, requestStatusColor, requestStatusText } from "../../utils/constant";
import MuiModal from "../../shared/Modal";
import { useForm } from "react-hook-form";
import { Button } from "../../shared";

const Members = () => {
  const navigate = useNavigate()
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const [actionTab, setActiveTab] = useState("mentor");
  const [activeTableDetails, setActiveTableDetails] = useState({
    column: [],
    data: [],
  });
  const [seletedItem, setSelectedItem] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [actionColumnInfo, setActionColumnInfo] = useState({ cancelPopup: false })
  const dispatch = useDispatch()
  const { mentor, mentee, loading, error } = useSelector(state => state.members)

  const open = Boolean(anchorEl);

  const handleMoreClick = (event, data) => {
    console.log("more", event);
    setSelectedItem(data);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (e) => {
    console.log(e);
  };


  console.log('open', open)

  const handleDeactive = () => {
    handleClose()
    setActionColumnInfo({ ...actionColumnInfo, cancelPopup: true })
  }

  const handleCloseCancelReasonPopup = () => {
    reset()
    setActionColumnInfo({ cancelPopup: false })
  }

  const handleCancelReasonPopupSubmit = (data) => {
    const { reason } = data
    if (reason !== '') {
      reset()
      dispatch(deactivateUser({
        "reason": reason,
        "deactivate_user": seletedItem.id
      })).then(() => {
        handleCloseCancelReasonPopup()
        dispatch(getMembersList({ role_name: actionTab }))
      })
    }
  }

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
    if (e.target.value !== 'all') {
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


    const updatedColumns = [
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
                <span
                  className="w-[80px] flex justify-center h-[30px] px-7"
                  style={{
                    background:
                      params.row.member_active ? memberStatusColor.accept.bgColor : memberStatusColor.cancel.bgColor,
                    lineHeight: "30px",
                    borderRadius: "3px",
                    width: "110px",
                    height: "34px",
                    color: params.row.member_active ? memberStatusColor.accept?.color : memberStatusColor.cancel.color,
                    fontSize: "12px",
                  }}
                >
                  {params.row.member_active ? 'Active' : 'Deactive'}
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
        id: 4,
        renderCell: (params) => {
          console.log("ssss", params);
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
                    navigate(`/mentor-details/${seletedItem.id}`);
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
                {
                  seletedItem.member_active && <MenuItem className="!text-[12px]" onClick={handleDeactive}>
                    <img
                      src={CloseCircle}
                      alt="CancelIcon"
                      className="pr-3 w-[27px]"
                    />
                    Deactive
                  </MenuItem>
                }


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

    console.log('updatedColumns', updatedColumns)

    setActiveTableDetails({ data: tableData, column: updatedColumns });
  }, [mentor, mentee, anchorEl])


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
                      <p className="notify-icon1"></p>
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


      {/* {'Cancel Popup'} */}
      <MuiModal modalSize='md' modalOpen={actionColumnInfo.cancelPopup} modalClose={handleCloseCancelReasonPopup} noheader>

        <div className='px-5 py-5'>
          <div className='flex justify-center flex-col gap-5  mt-4 mb-4'
            style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '10px', }}>
            <div className='flex justify-between px-3 py-4 items-center' style={{ borderBottom: '1px solid rgba(29, 91, 191, 1)' }}>
              <p className='text-[18px]' style={{ color: 'rgba(0, 0, 0, 1)' }}>Deactivate Reason </p>
              <img className='cursor-pointer' onClick={handleCloseCancelReasonPopup} src={CancelIcon} alt="CancelIcon" />
            </div>

            <div className='px-5'>
              {
                error !== '' ? <p className="error" role="alert">{error}</p> : null
              }


              <form onSubmit={handleSubmit(handleCancelReasonPopupSubmit)}>
                <div className='relative pb-8'>
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Reason
                  </label>

                  <div className='relative'>
                    <textarea
                      {...register('reason', {
                        required: "This field is required",
                      })}
                      id="message" rows="4" className={`block p-2.5 input-bg w-full text-sm text-gray-900  border
                                               focus-visible:outline-none focus-visible:border-none`}
                      style={{ border: '2px solid rgba(229, 0, 39, 1)' }}
                      placeholder={''}
                    ></textarea>
                    {errors['reason'] && (
                      <p className="error" role="alert">
                        {errors['reason'].message}
                      </p>
                    )}
                  </div>
                </div>

                <div className='flex justify-center gap-5 items-center pt-5 pb-10'>
                  <Button btnName='Cancel' btnCls="w-[18%]" btnCategory="secondary" onClick={handleCloseCancelReasonPopup} />
                  <button
                    type='submit'
                    className='text-white py-3 px-7 w-[18%]'
                    style={{ background: 'linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)', borderRadius: '3px' }}>
                    Submit
                  </button>
                </div>
              </form>

            </div>


          </div>

        </div>
      </MuiModal>



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
              rows={activeTableDetails.data || []}
              columns={activeTableDetails.column}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Members;
