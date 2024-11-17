import { Backdrop, CircularProgress, Menu, MenuItem, Switch } from "@mui/material";
import React, { useEffect, useState } from "react";
import DataTable from "../../shared/DataGrid";
import SearchIcon from '../../assets/icons/search.svg';
import CancelIcon from '../../assets/images/cancel1x.png'
import { allMembersColumns } from "../../mock";
import MoreIcon from "../../assets/icons/moreIcon.svg";
import TickCircle from "../../assets/icons/tickCircle.svg";
import CloseCircle from "../../assets/icons/closeCircle.svg";
import PowerIcon from "../../assets/icons/PowerIcon.svg";
import PlusCircle from "../../assets/icons/PlusBorder.svg";
import TickColorIcon from '../../assets/icons/tickColorLatest.svg'
import SuccessTik from '../../assets/images/blue_tik1x.png';
import ViewIcon from "../../assets/images/view1x.png";
import ShareIcon from "../../assets/icons/Share.svg";
import { useDispatch, useSelector } from "react-redux";
import { deactivateUser, getMembersList } from "../../services/members";
import { useNavigate } from "react-router-dom";
import { memberStatusColor } from "../../utils/constant";
import MuiModal from "../../shared/Modal";
import { useForm } from "react-hook-form";
import { Button } from "../../shared";
import AssignMentorProgram from "./AssignMentorProgram";

const Members = () => {
  const navigate = useNavigate()
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const [actionTab, setActionTab] = useState("mentor");
  const [activeTableDetails, setActiveTableDetails] = useState({
    column: [],
    data: [],
  });
  const [seletedItem, setSelectedItem] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [actionColumnInfo, setActionColumnInfo] = useState({ cancelPopup: false, menteecancel: false })
  const [assignProgramInfo, setAssignProgramInfo] = useState({ assignPopup: false, message: '' })
  const [filterInfo, setFilterInfo] = useState({ search: '', status: '' })
  const dispatch = useDispatch()
  const { mentor, mentee, loading, error } = useSelector(state => state.members)

  const open = Boolean(anchorEl);

  const handleMoreClick = (event, data) => {
    setSelectedItem(data);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };




  const handleDeactive = () => {
    handleClose()
    setActionColumnInfo({
      cancelPopup: actionTab === 'mentor',
      menteecancel: actionTab === 'mentee'
    })
  }

  const handleCloseCancelReasonPopup = () => {
    reset()
    setActionColumnInfo({ cancelPopup: false, menteecancel: false })
  }

  // Mentor Deactivate
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

  // Mentee Deactivate
  const handleMenteeConfirmPopup = () => {
    dispatch(deactivateUser({
      "deactivate_user": seletedItem.id
    })).then(() => {
      handleCloseCancelReasonPopup()
      dispatch(getMembersList({ role_name: actionTab }))
    })
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
    setActionTab(key);
  };

  const handleStatus = (e) => {
    setFilterInfo({ ...filterInfo, status: e.target.value })
  }

  const handleSearch = (value) => {
    setFilterInfo({ ...filterInfo, search: value })
  };

  const handleAssignProgramOrTask = () => {
    handleClose()
    setAssignProgramInfo({ assignPopup: true, message: '' })
  }

  const handleAssignProgramClose = (type = '') => {
    let payload = { assignPopup: false }

    if (type === 'taskassigned') {
      payload = { ...payload, message: 'Program Assigned to Mentor Successfully' }
      dispatch(getMembersList({ role_name: actionTab }))
    }

    setAssignProgramInfo({ ...assignProgramInfo, ...payload })
  }

  // Mentor Auto Approval
  const handleChange = (row) => {
    console.log('Approval', row)
  }

  useEffect(() => {
    if (assignProgramInfo.message !== '') {
      setTimeout(() => {
        setAssignProgramInfo({ assignPopup: false, message: '' })
      }, 2000)
    }
  }, [assignProgramInfo])

  useEffect(() => {
    let tableData = []
    if (actionTab === 'mentor') {
      tableData = mentor
    }

    if (actionTab === 'mentee') {
      tableData = mentee
    }

    let columns = allMembersColumns.filter((col) =>
      col.for.includes(actionTab)
    );


    if (actionTab === 'mentor') {
      columns = columns.map(column => {
        if (column.field === 'auto_approval') {
          return {
            ...column,
            renderCell: (params) => {
              return (
                <div>
                  <Switch
                    checked={false}
                    onChange={() => handleChange(params.row)}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </div>
              )
            }

          }
        }
        return column

      })
    }


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
                    width: params.row.member_active ? "110px" : "92px",
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
        align: 'center',
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
                  !seletedItem.member_active && <MenuItem className="!text-[12px]" onClick={undefined}>
                    <img
                      src={PowerIcon}
                      alt="CancelIcon"
                      className="pr-3 w-[27px]"
                    />
                    Activate
                  </MenuItem>
                }
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

                {
                  !seletedItem.member_active &&

                  <MenuItem className="!text-[12px]" onClick={handleAssignProgramOrTask}>
                    <img
                      src={PlusCircle}
                      alt="ShareIcon"
                      className="pr-3 w-[27px]"
                    />
                    Assign {actionTab === 'mentor' ? 'Mentor Program' : 'to Task'}
                  </MenuItem>
                }

              </Menu>
            </>
          );
        },
      },
    ];


    setActiveTableDetails({ data: tableData, column: updatedColumns });
  }, [mentor, mentee, anchorEl])

  useEffect(() => {
    let payload = { role_name: actionTab }
    if (filterInfo.status !== '' && filterInfo.status !== 'all') {
      payload = { ...payload, status: filterInfo.status }
    }
    if (filterInfo.search !== '') {
      payload = { ...payload, search: filterInfo.search }
    }
    dispatch(getMembersList(payload))
  }, [filterInfo])

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

      {/* Success Modal */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={assignProgramInfo.message !== ''}
      >
        <div className='px-5 py-1 flex justify-center items-center'>
          <div className='flex justify-center items-center flex-col gap-5 py-10 px-20 mt-20 mb-20'
            style={{ background: 'linear-gradient(101.69deg, #1D5BBF -94.42%, #00AEBD 107.97%)', borderRadius: '10px' }}>
            <img src={SuccessTik} alt="SuccessTik" />
            <p className='text-white text-[12px]'>{assignProgramInfo.message}</p>
          </div>

        </div>
      </Backdrop>


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

      {/* Mentee Deactive Popup */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => 1 }}
        open={actionColumnInfo.menteecancel}
      >
        <div className="popup-content w-2/6 bg-white flex flex-col gap-2 h-[330px] justify-center items-center">
          <img src={TickColorIcon} alt="TickColorIcon" />

          <div className='py-5'>
            <p style={{ color: 'rgba(24, 40, 61, 1)', fontWeight: 600, fontSize: '18px' }}>
              Are you sure want to Deactivate ?
            </p>
          </div>
          <div className='flex justify-center'>
            <div className="flex gap-6 justify-center align-middle">
              <Button btnCls="w-[150px]" btnName={'Cancel'} btnCategory="secondary" onClick={handleCloseCancelReasonPopup} />
              <Button btnType="button" btnCls="w-[150px]" btnName={'Deactivate'}
                style={{ background: '#16B681' }} btnCategory="primary"
                onClick={handleMenteeConfirmPopup}
              />
            </div>
          </div>
        </div>

      </Backdrop>


      {
        assignProgramInfo.assignPopup && <AssignMentorProgram open={assignProgramInfo.assignPopup} handleClose={handleAssignProgramClose} selectedItem={seletedItem} />
      }


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
