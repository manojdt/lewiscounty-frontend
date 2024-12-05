import React, { useEffect, useState } from 'react';
import { Button } from '../../shared';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ProfileImageIcon from '../../assets/icons/profile-image-icon.svg';
import CancelIcon from '../../assets/images/cancel1x.png';
import TickColorIcon from '../../assets/icons/tickColorLatest.svg';
import CancelColorIcon from '../../assets/icons/cancelCircle.svg';

import SuccessTik from '../../assets/images/blue_tik1x.png';
import SearchIcon from '../../assets/icons/search.svg';
import { useDispatch, useSelector } from 'react-redux';
import { Backdrop, Checkbox, CircularProgress } from '@mui/material';
import { ProfileFields } from '../../utils/formFields';
import {
  getFollowList,
  getProfileInfo,
  userFollow,
  userUnFollow,
} from '../../services/userList';
import ConnectIcon from '../../assets/images/Connectpop1x.png';
import {
  cancelMemberRequest,
  getCategoryList,
  updateLocalRequest,
  updateMemberRequest,
  updateProgramMenteeRequest,
} from '../../services/request';
import MuiModal from '../../shared/Modal';
import DataTable from '../../shared/DataGrid';
import { categoryColumns } from '../../mock';
import { requestStatus } from '../../utils/constant';
import { useForm } from 'react-hook-form';

export default function ProfileView() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [confirmPopup, setConfirmPopup] = useState({
    show: false,
    category: false,
    selectedItem: [],
  });
  const [categoryOptions, setCategoryOptions] = useState({
    search: '',
    list: [],
  });
  const [menteeRequestOption, setMenteeRequestOption] = useState({
    modal: false,
    cancel: false,
  });
  const [activity, setActivity] = useState({
    modal: false,
    following: false,
    complete: false,
  });
  const {
    userDetails,
    loading: userInfoLoading,
    followInfo,
  } = useSelector((state) => state.userList);
  const { profile, loading } = useSelector((state) => state.profileInfo);
  const { data } = useSelector((state) => state.userInfo);
  const {
    categoryList,
    status: requeststatus,
    loading: reportLoading,
    error,
  } = useSelector((state) => state.requestList);
  const params = useParams();
  const [searchParams] = useSearchParams();
  const pageType = window.location.href.includes('mentor-details')
    ? 'Mentor'
    : 'Mentee';
  const role = data?.role || '';

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const loadUserProfile = () => {
    dispatch(getProfileInfo({ id: params.id }));
    dispatch(getFollowList(params.id));
  };

  const followResponseHandle = () => {
    setActivity({
      modal: false,
      complete: true,
      following: !activity.following,
    });
    dispatch(getFollowList(params.id)).then(() => {
      setTimeout(() => {
        setActivity({ ...activity, modal: false, complete: false });
      }, 3000);
    });
  };

  const handleFollow = () => {
    if (followInfo.is_following) {
      dispatch(userUnFollow({ user_id: params.id })).then(() => {
        followResponseHandle();
      });
    }
    if (!followInfo.is_following) {
      dispatch(userFollow({ user_id: params.id })).then(() => {
        followResponseHandle();
      });
    }
  };

  const handleShowPopup = () => {
    setActivity({ ...activity, modal: true });
  };

  // Reset Confirm Popup
  const resetConfirmPopup = () => {
    setConfirmPopup({ show: false, category: false, selectedItem: [] });
  };

  const resetMenteeRequest = () => {
    setMenteeRequestOption({ modal: false, cancel: false });
  };

  // Admin Action
  const handleMemberAcceptRequest = () => {
    if (role === 'admin') {
      dispatch(getCategoryList());
    }

    if (role === 'mentor') {
      setMenteeRequestOption({ modal: true, cancel: false });
    }
  };

  // Member Cancel opup
  const handleMemberCancelRequest = () => {
    if (role === 'admin') {
      setConfirmPopup({ show: true, category: false, selectedItem: [] });
    }

    if (role === 'mentor') {
      setMenteeRequestOption({ modal: false, cancel: true });
    }
  };

  // Handle Selected Items for Category
  const handleSelectedItems = (selectedInfo) => {
    let data = { ...confirmPopup };
    if (selectedInfo.length) {
      data = { ...data, selectedItem: selectedInfo };
    }

    const categoryId = [];
    data.selectedItem.forEach((selected) =>
      categoryId.push(selected.categories_id)
    );
    const payload = {
      member_id: params.id,
      categories_id: confirmPopup?.selectedItem,
    };
    dispatch(updateMemberRequest(payload)).then((res) => {
      if (res?.meta?.requestStatus === "fulfilled") {
        navigate("/all-request")
      }
    })
  };

  // Confirm Accept Popup
  const handleConfirmPopup = () => {
    if (role === 'admin') {
      dispatch(
        cancelMemberRequest({ member_id: params.id, })).then((res) => {
          if (res?.meta?.requestStatus === "fulfilled") {
            navigate("/all-request")
          }
        })
    }

    if (role === 'mentor') {
      dispatch(
        updateProgramMenteeRequest({
          id: parseInt(searchParams.get('request_id')),
          action: 'accept',
        })
      ).then(() => {
        setTimeout(() => {
          console.log('MMMM');
          dispatch(updateLocalRequest({ status: '' }));
          resetMenteeRequest();
          navigate('/all-request');
        }, 100);
      });
    }
  };

  const footerComponent = (props) => {
    return (
      <div className='flex gap-6 justify-center items-center py-4'>
        <button
          onClick={() => resetConfirmPopup()}
          className='py-3 px-6 w-[16%]'
          style={{
            border: '1px solid rgba(29, 91, 191, 1)',
            borderRadius: '3px',
            color: 'rgba(29, 91, 191, 1)',
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => {
            handleSelectedItems(props.selectedRows);
          }}
          className='text-white py-3 px-6 w-[16%]'
          style={{
            background:
              'linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)',
            borderRadius: '3px',
          }}
        >
          Submit
        </button>
      </div>
    );
  };

  const handleSearchCategory = (e) => {
    let catList = categoryOptions.list.filter((list) =>
      list.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    if (e.target.value === '') catList = categoryList;
    setCategoryOptions({ search: e.target.value, list: catList });
  };

  const handleCancelReasonPopupSubmit = (data) => {
    if (data.cancel_reason !== '') {
      dispatch(
        updateProgramMenteeRequest({
          id: parseInt(searchParams.get('request_id')),
          action: 'cancel',
          cancelled_reason: data.cancel_reason,
        })
      ).then(() => {
        setTimeout(() => {
          console.log('MMMM');
          dispatch(updateLocalRequest({ status: '' }));
          resetMenteeRequest();
          navigate('/all-request');
        }, 100);
      });
    }
  };

  useEffect(() => {
    // Category load action
    if (requeststatus === requestStatus.categoryload) {
      setCategoryOptions({ search: '', list: categoryList });
      setConfirmPopup({ show: false, category: true, selectedItem: [] });
      setTimeout(() => {
        dispatch(updateLocalRequest({ status: '' }));
      }, 2000);
    }

    if (
      requeststatus === requestStatus.memberupdate ||
      requeststatus === requestStatus.membercancel
    ) {
      resetConfirmPopup();
      setTimeout(() => {
        resetMenteeRequest();
        dispatch(updateLocalRequest({ status: '' }));
        dispatch(getProfileInfo({ id: params.id }));
        navigate('/all-request');
      }, 3000);
    }

    // if (requestStatus === requestStatus.programupdate) {
    //     console.log('llll');
    //     setTimeout(() => {
    //         console.log('MMMM');
    //         // dispatch(updateLocalRequest({ status: '' }));
    //         // resetMenteeRequest()
    //         navigate('/all-request')
    //     }, 3000);
    // }
  }, [requeststatus]);

  useEffect(() => {
    if (params.id) {
      loadUserProfile();
    }
  }, [params]);

  const handleSelectCategory = (value) => {
    setConfirmPopup({
      ...confirmPopup,
      selectedItem: !confirmPopup?.selectedItem?.includes(value) ? [...confirmPopup?.selectedItem, value] : confirmPopup?.selectedItem?.filter((e) => e !== value)

    })
  }

  const categoryColumn = [
    {
      field: 'checkbox',
      headerName: '',
      id: 0,
      for: ['admin', 'mentor'],
      width: 100,
      renderCell: (params) => {
        return <div>
          <Checkbox checked={confirmPopup?.selectedItem?.includes(params?.row?.categories_id)}
            onChange={() => handleSelectCategory(params?.row?.categories_id)} />
        </div>
      }
    },
    ...categoryColumns
  ]


  return (
    <div className='profile-container'>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => 999999 }}
        open={loading || userInfoLoading || reportLoading}
      >
        <CircularProgress color='inherit' />
      </Backdrop>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={activity.modal}
      >
        <div className='popup-content w-2/6 bg-white flex flex-col gap-2 h-[330px] justify-center items-center'>
          <img src={ConnectIcon} alt='ConnectIcon' />
          <span style={{ color: '#232323', fontWeight: 600, fontSize: '24px' }}>
            {followInfo.is_following ? 'Unfollow' : 'Follow'}
          </span>

          <div className='py-5'>
            <p
              style={{
                color: 'rgba(24, 40, 61, 1)',
                fontWeight: 600,
                fontSize: '18px',
              }}
            >
              Are you sure you want to{' '}
              {followInfo.is_following ? 'Unfollow' : 'Follow'} {pageType}?
            </p>
          </div>
          <div className='flex justify-center'>
            <div className='flex gap-6 justify-center align-middle'>
              <Button
                btnName='Cancel'
                btnCategory='secondary'
                onClick={() => setActivity({ modal: false, following: false })}
              />
              <Button
                btnType='button'
                btnCls='w-[110px]'
                btnName={followInfo.is_following ? 'Unfollow' : 'Follow'}
                btnCategory='primary'
                onClick={handleFollow}
              />
            </div>
          </div>
        </div>
      </Backdrop>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={
          requeststatus === requestStatus.memberupdate ||
          requeststatus === requestStatus.membercancel
        }
      >
        <div className='px-5 py-1 flex justify-center items-center'>
          <div className='flex justify-center items-center flex-col gap-[2.25rem] py-[4rem] px-[3rem] mt-20 mb-20'
            style={{ background: '#fff', borderRadius: '10px' }}>
            <img src={SuccessTik} alt="SuccessTik" />
            <p className='text-[16px] font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#1D5BBF] to-[#00AEBD]'
              style={{
                fontWeight: 600
              }}
            >Request updated successfully</p>
          </div>

        </div>
      </Backdrop>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={activity.complete}
      >
        <div className='px-5 py-1 flex justify-center items-center'>
          <div className='flex justify-center items-center flex-col gap-[2.25rem] py-[4rem] px-[3rem] mt-20 mb-20'
            style={{ background: '#fff', borderRadius: '10px' }}>
            <img src={SuccessTik} alt="SuccessTik" />
            <p className='text-[16px] font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#1D5BBF] to-[#00AEBD]'
              style={{
                fontWeight: 600
              }}
            > Successfully{' '}
            {followInfo.is_following ? 'followed ' : 'unfollowed '}{' '}
            {pageType.toLowerCase()}</p>
          </div>

        </div>
      </Backdrop>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => 1 }}
        open={menteeRequestOption.modal}
      >
        <div className='popup-content w-2/6 bg-white flex flex-col gap-2 h-[330px] justify-center items-center'>
          <img src={TickColorIcon} alt='TickColorIcon' />
          <span style={{ color: '#232323', fontWeight: 600, fontSize: '24px' }}>
            Approve
          </span>
          <div className='py-5'>
            <p
              style={{
                color: 'rgba(24, 40, 61, 1)',
                fontWeight: 600,
                fontSize: '18px',
              }}
            >
              Are you sure want to accept program request?
            </p>
          </div>
          <div className='flex justify-center'>
            <div className='flex gap-6 justify-center align-middle'>
              <Button
                btnCls='w-[110px]'
                btnName={'Cancel'}
                btnCategory='secondary'
                onClick={resetMenteeRequest}
              />
              <Button
                btnType='button'
                btnCls='w-[110px]'
                btnName={'Approve'}
                style={{ background: '#16B681' }}
                btnCategory='primary'
                onClick={handleConfirmPopup}
              />
            </div>
          </div>
        </div>
      </Backdrop>

      <MuiModal
        modalSize='md'
        modalOpen={menteeRequestOption.cancel}
        modalClose={undefined}
        noheader
      >
        <div className='px-5 py-5'>
          <div
            className='flex justify-center flex-col gap-5  mt-4 mb-4'
            style={{
              border: '1px solid rgba(29, 91, 191, 1)',
              borderRadius: '10px',
            }}
          >
            <div
              className='flex justify-between px-3 py-4 items-center'
              style={{ borderBottom: '1px solid rgba(29, 91, 191, 1)' }}
            >
              <p className='text-[18px]' style={{ color: 'rgba(0, 0, 0, 1)' }}>
                Reject Request Reason{' '}
              </p>
              <img
                className='cursor-pointer'
                onClick={resetMenteeRequest}
                src={CancelIcon}
                alt='CancelIcon'
              />
            </div>

            <div className='px-5'>
              {error !== '' ? (
                <p className='error' role='alert'>
                  {error}
                </p>
              ) : null}

              <form onSubmit={handleSubmit(handleCancelReasonPopupSubmit)}>
                <div className='relative pb-8'>
                  <label className='block tracking-wide text-gray-700 text-xs font-bold mb-2'>
                    Reject Reason
                  </label>

                  <div className='relative'>
                    <textarea
                      {...register('cancel_reason', {
                        required: 'This field is required',
                      })}
                      id='message'
                      rows='4'
                      className={`block p-2.5 input-bg w-full text-sm text-gray-900  border
                                                                   focus-visible:outline-none focus-visible:border-none`}
                      style={{ border: '2px solid rgba(229, 0, 39, 1)' }}
                      placeholder={''}
                    ></textarea>
                    {errors['cancel_reason'] && (
                      <p className='error' role='alert'>
                        {errors['cancel_reason'].message}
                      </p>
                    )}
                  </div>
                </div>

                <div className='flex justify-center gap-5 items-center pt-5 pb-10'>
                  <Button
                    btnName='Cancel'
                    btnCls='w-[18%]'
                    btnCategory='secondary'
                    onClick={resetConfirmPopup}
                  />
                  <button
                    type='submit'
                    className='text-white py-3 px-7 w-[18%]'
                    style={{
                      background:
                        'linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)',
                      borderRadius: '3px',
                    }}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </MuiModal>

      {/* Select Categort Popup */}
      <MuiModal
        modalSize='md'
        modalOpen={confirmPopup.category}
        modalClose={resetConfirmPopup}
        noheader
      >
        <div className='px-5 py-5'>
          <div
            className='flex justify-center flex-col gap-5 px-5 pb-5 mt-4 mb-4'
            style={{
              border: '1px solid rgba(29, 91, 191, 1)',
              borderRadius: '10px',
            }}
          >
            <div
              className='flex justify-between px-3 py-4 items-center'
              style={{ borderBottom: '1px solid rgba(29, 91, 191, 1)' }}
            >
              <p className='text-[18px]' style={{ color: 'rgba(0, 0, 0, 1)' }}>
                Select Category
              </p>
              <img
                className='cursor-pointer'
                onClick={resetConfirmPopup}
                src={CancelIcon}
                alt='CancelIcon'
              />
            </div>
            <div className='flex justify-between px-3 mb-4'>
              <div className='relative w-full'>
                <input
                  type='text'
                  id='search-navbar'
                  className='block w-full p-2 text-sm text-gray-900 border-none'
                  placeholder='Search here...'
                  style={{
                    border: '1px solid rgba(29, 91, 191, 1)',
                    borderRadius: '50px',
                    height: '60px',
                    width: '100%',
                  }}
                  onChange={handleSearchCategory}
                  value={categoryOptions.search}
                />
                <div className='absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none'>
                  <img src={SearchIcon} alt='SearchIcon' />
                </div>
              </div>
            </div>

            <DataTable
              rows={categoryOptions.list}
              columns={categoryColumn}
              height={'460px'}
              footerComponent={footerComponent}
              selectedAllRows={confirmPopup.selectedItem}
              hideCheckbox
            />
          </div>
        </div>
      </MuiModal>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => 1 }}
        open={confirmPopup.show}
      >
        <div className='popup-content w-2/6 bg-white flex flex-col gap-2 h-[330px] justify-center items-center'>
          <img src={CancelColorIcon} alt='CancelColorIcon' />
          <span style={{ color: '#232323', fontWeight: 600, fontSize: '24px' }}>
            Reject
          </span>
          <div className='py-5'>
            <p
              style={{
                color: 'rgba(24, 40, 61, 1)',
                fontWeight: 600,
                fontSize: '18px',
              }}
            >
              Are you sure want to reject the member request?
            </p>
          </div>
          <div className='flex justify-center'>
            <div className='flex gap-6 justify-center align-middle'>
              <Button
                btnCls='w-[110px]'
                btnName={'No'}
                btnCategory='secondary'
                onClick={resetConfirmPopup}
              />
              <Button
                btnType='button'
                btnCls='w-[110px]'
                btnName={'Yes'}
                style={{ background: '#E0382D' }}
                btnCategory='primary'
                onClick={handleConfirmPopup}
              />
            </div>
          </div>
        </div>
      </Backdrop>

      <div className='flex justify-between items-center mb-8'>
        {/* <div className='text-color font-medium'>My {pageType} Profile</div> */}
        <div className='text-color font-medium !text-[20px]'>Profile</div>
      </div>

      <div
        className='profile-content py-8 px-14'
        style={{
          border: '1px solid rgba(219, 224, 229, 1)',
          background: 'rgba(255, 255, 255, 1)',
        }}
      >
        {/* <div className='flex justify-between items-center mb-8'>
          <div className='text-color font-medium'>Profile Picture</div>
        </div> */}

        <div className='flex justify-between items-center'>
          <div className='py-4 relative w-[12%]'>
            <div className='upload-profile'>
              <label
                className='w-[40%] pb-3 rounded-lg text-white text-[14px] cursor-pointer'
                style={{
                  border: 'none',
                }}
              >
                <img
                  src={userDetails?.profile_image || ProfileImageIcon}
                  style={{ borderRadius: '50%', height: '143px' }}
                  alt='ProfileImageIcon'
                />
              </label>
            </div>
          </div>
          <div className='flex gap-5'>
            {role !== 'admin' ? (
              <>
                {role === 'mentor' &&
                  searchParams.has('type') &&
                  searchParams.get('type') === 'mentee_request' &&
                  searchParams.has('request_id') &&
                  searchParams.get('request_id') !== '' ? (
                  <div className='flex gap-4 pt-10'>
                    <button
                      className='py-3 px-16 text-white text-[14px] flex items-center'
                      style={{
                        border: '1px solid #E0382D',
                        borderRadius: '5px',
                        color: '#E0382D',
                      }}
                      onClick={() => handleMemberCancelRequest()}
                    >
                      Reject
                    </button>
                    <button
                      className='py-3 px-16 text-white text-[14px] flex items-center'
                      style={{
                        background: '#16B681',
                        borderRadius: '5px',
                      }}
                      onClick={() => handleMemberAcceptRequest()}
                    >
                      Approve
                    </button>
                  </div>
                ) : (
                  <>
                    <Button
                      onClick={handleShowPopup}
                      btnType='button'
                      btnCategory='secondary'
                      btnName={followInfo.is_following ? 'Unfollow' : 'Follow'}
                      btnCls={'w-[150px]'}
                    />
                    <Button
                      btnType='button'
                      btnName='Chat'
                      btnCls={'w-[150px]'}
                    />
                  </>
                )}
              </>
            ) : role === 'admin' ? (
              <>
                {userDetails?.approve_status === 'new' ||
                  userDetails?.approve_status === 'pending' ? (
                  <div className='flex gap-4 pt-10'>
                    <button
                      className='py-3 px-16 text-white text-[14px] flex items-center'
                      style={{
                        border: '1px solid #E0382D',
                        borderRadius: '5px',
                        color: '#E0382D',
                      }}
                      onClick={() => handleMemberCancelRequest()}
                    >
                      Reject
                    </button>
                    <button
                      className='py-3 px-16 text-white text-[14px] flex items-center'
                      style={{
                        background: '#16B681',
                        borderRadius: '5px',
                      }}
                      onClick={() => handleMemberAcceptRequest()}
                    >
                      Approve
                    </button>
                  </div>
                ) : // userDetails?.approve_status === 'accept' ?

                  //     <button className='py-3 px-16 mt-7 text-white text-[14px] flex items-center' style={{
                  //         background: "#16B681",
                  //         borderRadius: '5px'
                  //     }}
                  //         onClick={() => undefined}
                  //     >Approved
                  //     </button>
                  //     :

                  //     userDetails?.approve_status === 'cancel' ?
                  //         <div className='flex gap-4 pt-10' >
                  //             <button className='py-3 px-16 text-white text-[14px] flex items-center' style={{
                  //                 border: "1px solid #E0382D",
                  //                 borderRadius: '5px',
                  //                 color: '#E0382D',
                  //                 cursor: 'not-allowed'
                  //             }}
                  //                 onClick={() => undefined}
                  //             >Rejected
                  //             </button>
                  //         </div>

                  // :

                  null}
              </>
            ) : null}
          </div>
        </div>

        <div className='grid grid-cols-6 gap-3 mt-12'>
          {ProfileFields.map((profilefield, index) => (
            <div className='col-span-2' key={index}>
              <div className='mb-5'>
                <label
                  className='block tracking-wide  text-xs mb-2'
                  style={{ color: 'rgba(116, 116, 116, 1)' }}
                >
                  {profilefield.label}
                </label>
                <p className='text-[14px]'>{userDetails[profilefield.name]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
