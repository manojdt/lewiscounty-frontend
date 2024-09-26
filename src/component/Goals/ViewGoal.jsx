import React, { useEffect, useState } from 'react'

import UploadIcon from "../../assets/images/image_1x.png"
import DeleteIcon from "../../assets/images/delete_1x.png"
import CancelIcon from '../../assets/images/cancel-colour1x.png'
import EditIcon from '../../assets/images/Edit1x.png'
import FileIcon from '../../assets/icons/linkIcon.svg'
import ReportUserIcon from '../../assets/images/report.png'
import SuccessTik from '../../assets/images/blue_tik1x.png';
import ReportVideoIcon from '../../assets/images/report1.png'
import ActiveGoalIcon from '../../assets/images/active-goals.png';
import InprogressGoalIcon from '../../assets/images/in-progress.png';
import CompletedGoalIcon from '../../assets/images/completed-goal.png';
import CancelGoalIcon from '../../assets/images/cancel-goals.png';
import ConnectIcon from '../../assets/images/Connectpop1x.png'
import OverDeleteIcon from '../../assets/images/delete_1x.png'
import CancelModalIcon from '../../assets/images/cancel1x.png'
import BatchIcon from '../../assets/icons/GoalBatch.svg'
import SearchIcon from '../../assets/icons/search.svg';
import CancelColorIcon from '../../assets/icons/cancelCircle.svg'
import { Button } from '../../shared'
import { useNavigate, useParams } from 'react-router-dom'
import MuiModal from '../../shared/Modal';
import { useDispatch, useSelector } from 'react-redux'
import { Backdrop, CircularProgress } from '@mui/material'
import { getGoalInfo, updateGoalStatus } from '../../services/goalsInfo'
import { goalDataStatus, goalPeriods, goalStatus, requestStatus } from '../../utils/constant'
import { getCategoryList, updateGoalRequest, updateLocalRequest } from '../../services/request'
import DataTable from '../../shared/DataGrid'
import { categoryColumns } from '../../mock'


const ViewGoal = ({ type = '' }) => {
    const navigate = useNavigate()
    const params = useParams();
    const dispatch = useDispatch()
    const [pageloading, setPageLoading] = useState(false)
    const [categoryPopup, setCategoryPopup] = useState({ show: false, selectedItem: [], page: '', tab: '' })
    const [actionModal, setActionModal] = useState({ start: false, started: false, cancel: false, cancelled: false, complete: false, completed: false })

    const { goalInfo, loading, status } = useSelector(state => state.goals)
    const userInfo = useSelector(state => state.userInfo)
    const { categoryList, loading: requestLoading, status: reqStatus, } = useSelector(state => state.requestList);

    const role = userInfo.data.role

    let imageIcon = ActiveGoalIcon

    const handleActionBtn = () => {
        setActionModal({ ...actionModal, started: false, start: true })
    }

    const handleActionCompleteBtn = () => {
        setActionModal({ ...actionModal, complete: true })
    }

    const handleSubmitGoal = () => {
        dispatch(updateGoalStatus({ id: parseInt(goalInfo.id), action: 'complete' }))
        resetActionModal()
    }

    const handleStartGoal = () => {
        dispatch(updateGoalStatus({ id: parseInt(goalInfo.id), action: 'start' }))
        resetActionModal()
    }




    const resetActionModal = () => {
        setActionModal({ start: false, started: false, cancel: false, cancelled: false, complete: false, completed: false })
    }


    const handleCancelGoal = () => {
        setActionModal({ ...actionModal, cancel: true, cancelled: false })
    }

    const handleCloseGoal = () => {
        if (role === 'admin') {
            dispatch(updateGoalRequest({
                status: "cancel",
                id: params.id
            }))
        } else {
            dispatch(updateGoalStatus({ id: parseInt(goalInfo.id), action: 'abort' }))
        }
    }

    const handleCloseActionModal = () => {
        resetActionModal()
    }

    // Category Popup Close
    const handleCloseCategoryPopup = () => {
        setCategoryPopup({ show: false, selectedItem: [], page: '', tab: '' })
    }

    const handleAcceptCancelProgramRequest = (actionType) => {
        if (actionType === 'approve') {
            dispatch(getCategoryList())
        }

        if (actionType === 'reject') {
            setActionModal({ ...actionModal, cancel: true })
        }
    }


    const handleSelectedItems = (selectedInfo) => {

        let data = { ...categoryPopup }
        if (selectedInfo.length) {
            data = { ...data, selectedItem: selectedInfo }
        }
        const categoryId = []
        data.selectedItem.forEach((selected) => categoryId.push(selected.categories_id))
        const payload = {
            status: "accept",
            id: params.id,
            categories: categoryId
        }
        dispatch(updateGoalRequest(payload))
    }

    const footerComponent = (props) => {
        return (
            <div className='flex gap-6 justify-center items-center py-4'>
                <button onClick={() => setCategoryPopup({ show: false, selectedItem: [] })} className='py-3 px-6 w-[16%]'
                    style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '3px', color: 'rgba(29, 91, 191, 1)' }}>Cancel</button>
                <button onClick={() => { console.log(props); handleSelectedItems(props.selectedRows) }}
                    className='text-white py-3 px-6 w-[16%]'
                    style={{ background: 'linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)', borderRadius: '3px' }}>Submit</button>
            </div>)
    }


    useEffect(() => {
        if (reqStatus === requestStatus.categoryload) {
            setCategoryPopup({ show: true, selectedItem: [] })
            setTimeout(() => {
                dispatch(updateLocalRequest({ status: '' }))
            }, 2000)
        }


        if (reqStatus === requestStatus.goalupdate) {
            if (categoryPopup.show) handleCloseCategoryPopup()
            if (actionModal.cancel) resetActionModal()
            setTimeout(() => {
                dispatch(getGoalInfo(params.id))
                dispatch(updateLocalRequest({ status: '' }))
            }, 3000)
        }

    }, [reqStatus])

    useEffect(() => {
        if (status === goalStatus.start) {
            setActionModal({ started: true, start: false, cancel: false, cancelled: false });
            setTimeout(() => {
                resetActionModal()
                navigate('/goals')
            }, [2000])
        }

        if (status === goalStatus.complete) {
            setActionModal({ started: false, start: false, cancel: false, completed: true });
            setTimeout(() => {
                resetActionModal()
                navigate('/goals')
            }, [2000])
        }


        if (status === goalStatus.abort) {
            setActionModal({ started: false, start: false, cancel: false, cancelled: true });
            setTimeout(() => {
                resetActionModal()
                navigate('/goals')
            }, [2000])
        }

    }, [status])

    useEffect(() => {
        if (actionModal.started) {

        }
    }, [actionModal.started])

    useEffect(() => {
        dispatch(getGoalInfo(params.id))
    }, [])

    if (Object.keys(goalInfo).length) {
        switch (goalInfo.goal_status) {
            case 'inactive':
                imageIcon = CancelGoalIcon
                break;
            case 'ongoing':
                imageIcon = InprogressGoalIcon
                break;
            case 'completed':
                imageIcon = CompletedGoalIcon
                break;
            case 'aborted':
                imageIcon = CancelGoalIcon
                break;
            default:
                imageIcon = ActiveGoalIcon
                break
        }

    }

    return (
        <div className="px-9 py-9">
            <MuiModal modalOpen={actionModal.started || actionModal.cancelled || actionModal.completed} modalClose={resetActionModal} noheader>
                <div className='px-5 py-1 flex justify-center items-center'>
                    <div className='flex justify-center items-center flex-col gap-5 py-10 px-20 mt-20 mb-20'
                        style={{ background: 'linear-gradient(101.69deg, #1D5BBF -94.42%, #00AEBD 107.97%)', borderRadius: '10px' }}>
                        <img src={SuccessTik} alt="SuccessTik" />
                        <p className='text-white text-[12px]'>Goal is {actionModal.cancelled ? 'Cancelled ' : actionModal.completed ? 'Completed ' : 'Stared '} Successfully</p>
                    </div>

                </div>
            </MuiModal>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading || pageloading || requestLoading}
            >
                <CircularProgress color="inherit" />

            </Backdrop>


            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={actionModal.start}
            >
                <div className="popup-content w-2/6 bg-white flex flex-col gap-2 h-[330px] justify-center items-center">
                    <img src={ConnectIcon} alt="ConnectIcon" />

                    <div className='py-5'>
                        <p style={{ color: 'rgba(24, 40, 61, 1)', fontWeight: 600, fontSize: '18px' }}>Are you sure you want to Start goal?</p>
                    </div>
                    <div className='flex justify-center'>
                        <div className="flex gap-6 justify-center align-middle">
                            <Button btnCls="w-[130px]" btnName='Cancel' btnCategory="secondary" onClick={resetActionModal} />
                            <Button btnCls="w-[130px]" btnType="button" btnName='Start goal' btnCategory="primary"
                                onClick={handleStartGoal}
                            />
                        </div>
                    </div>
                </div>

            </Backdrop>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={actionModal.complete}
            >
                <div className="popup-content w-2/6 bg-white flex flex-col gap-2 h-[330px] justify-center items-center">
                    <img src={ConnectIcon} alt="ConnectIcon" />

                    <div className='py-5'>
                        <p style={{ color: 'rgba(24, 40, 61, 1)', fontWeight: 600, fontSize: '18px' }}>Are you sure you want to Complete the goal?</p>
                    </div>
                    <div className='flex justify-center'>
                        <div className="flex gap-6 justify-center align-middle">
                            <Button btnCls="w-[170px]" btnName='Cancel' btnCategory="secondary" onClick={resetActionModal} />
                            <Button btnCls="w-[170px]" btnType="button" btnName='Complete goal' btnCategory="primary"
                                onClick={handleSubmitGoal}
                            />
                        </div>
                    </div>
                </div>

            </Backdrop>




            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={actionModal.cancel}
            >
                <div className="popup-content w-2/6 bg-white flex flex-col gap-2 h-[330px] justify-center items-center">

                    <div style={{ borderRadius: '15px' }} className='relative flex flex-col gap-2 justify-center 
                        items-center py-14 px-16'>

                        {/* <img className='absolute top-2 right-3 cursor-pointer' onClick={handleCloseActionModal}
                            src={CancelModalIcon} alt="CancelIcon" /> */}

                        <img className='w-[50px]' src={role === 'admin' ? CancelColorIcon : OverDeleteIcon} alt="OverDeleteIcon" />
                        {
                            role === 'admin' && <div className='text-[24px] font-semibold' style={{ color: '#000' }}>Reject</div>
                        }

                        <div className='py-5 mb-3'>
                            <p style={{ color: 'rgba(24, 40, 61, 1)', fontWeight: 600, fontSize: '18px' }}>
                                Are you sure want to {role === 'admin' ? 'reject ' : 'cancel '} this goal?</p>
                        </div>
                        <div className='flex justify-center'>
                            <div className="flex gap-6 justify-center align-middle">
                                <button style={{
                                    border: '1px solid rgba(229, 0, 39, 1)', color: 'rgba(229, 0, 39, 1)', borderRadius: '3px',
                                    width: '130px', padding: '13px'
                                }}
                                    onClick={handleCloseActionModal} >
                                    No
                                </button>
                                <button style={{
                                    background: 'rgba(229, 0, 39, 1)',
                                    color: '#fff', borderRadius: '3px',
                                    width: '130px', padding: '13px'
                                }}
                                    onClick={handleCloseGoal} >
                                    Yes
                                </button>

                            </div>
                        </div>
                    </div>
                </div>

            </Backdrop>


            <MuiModal modalOpen={reqStatus === requestStatus.goalupdate} modalClose={resetActionModal} noheader>
                <div className='px-5 py-1 flex justify-center items-center'>
                    <div className='flex justify-center items-center flex-col gap-5 py-10 px-20 mt-20 mb-20'
                        style={{ background: 'linear-gradient(101.69deg, #1D5BBF -94.42%, #00AEBD 107.97%)', borderRadius: '10px' }}>
                        <img src={SuccessTik} alt="SuccessTik" />
                        <p className='text-white text-[12px]'>Goal request is updated Successfully</p>
                    </div>

                </div>
            </MuiModal>

            {/* { 'Select Categort Popup'} */}
            <MuiModal modalSize='md' modalOpen={categoryPopup.show} modalClose={handleCloseCategoryPopup} noheader>
                <div className='px-5 py-5'>
                    <div className='flex justify-center flex-col gap-5 px-5 pb-5 mt-4 mb-4'
                        style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '10px', }}>
                        <div className='flex justify-between px-3 py-4 items-center' style={{ borderBottom: '1px solid rgba(29, 91, 191, 1)' }}>
                            <p className='text-[18px]' style={{ color: 'rgba(0, 0, 0, 1)' }}>Select Category</p>
                            <img className='cursor-pointer' onClick={handleCloseCategoryPopup} src={CancelIcon} alt="CancelIcon" />
                        </div>
                        <div className='flex justify-between px-3 mb-4'>
                            <div className="relative w-full">
                                <input type="text" id="search-navbar" className="block w-full p-2 text-sm text-gray-900 border-none"
                                    placeholder="Search here..." style={{
                                        border: '1px solid rgba(29, 91, 191, 1)',
                                        borderRadius: '50px',
                                        height: '60px',
                                        width: '100%'
                                    }} />
                                <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
                                    <img src={SearchIcon} alt='SearchIcon' />
                                </div>
                            </div>
                        </div>


                        <DataTable
                            rows={categoryList}
                            columns={categoryColumns}
                            height={'460px'}
                            footerComponent={footerComponent}
                            selectedAllRows={categoryPopup.selectedItem}
                        />

                    </div>
                </div>

            </MuiModal>


            {
                Object.keys(goalInfo).length && !loading ?
                    <div className='px-3 py-5' style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)' }}>
                        <div className='flex justify-between px-5 pb-4 mb-8 items-center border-b-2'>
                            <div className='flex gap-5 items-center text-[20px]'>
                                <p>Goals </p>
                            </div>
                        </div>

                        <div className='px-4' style={{ border: '1px solid rgba(223, 237, 255, 1)', borderRadius: '10px' }}>

                            <div className=''>
                                <div className='flex justify-between px-5 py-5 items-center border-b-2'>
                                    <div className='flex gap-5 items-center text-[20px]'>
                                        <p>{goalDataStatus[goalInfo.goal_status]} </p>
                                        {
                                            (goalInfo.goal_status === 'active' && role !== 'admin') &&
                                            <div className="inset-y-0 end-0 flex items-center pe-3 cursor-pointer"
                                                onClick={() => navigate('/edit-report/1')}
                                            >
                                                <img src={EditIcon} alt='EditIcon' />
                                            </div>
                                        }


                                    </div>

                                    <div className='flex gap-8 items-center'>
                                        <div className="relative">
                                            <div className="inset-y-0 end-0 flex items-center pe-3 cursor-pointer"
                                                onClick={() => navigate('/goals')}
                                            >
                                                <img src={CancelIcon} alt='CancelIcon' />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="grid grid-cols-5 gap-8 py-12 px-9">
                                <div className='col-span-2'>
                                    <img className='w-full' src={imageIcon} alt="ActiveGoalIcon" />
                                </div>
                                <div className='col-span-3 relative'>
                                    <h3 className='text-[28px]' style={{ color: 'rgba(24, 40, 61, 1)', fontWeight: 700 }}>
                                        {goalInfo.goal_name}
                                    </h3>
                                    {
                                        goalInfo.goal_status === 'completed' && <img className='absolute top-0 right-0' src={BatchIcon} alt="BatchIcon" />
                                    }

                                    <div className='py-7'>
                                        <table className="w-[700px] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 !bg-white">
                                            <tbody>
                                                <tr className="bg-white text-black">
                                                    <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap w-[20px] ">
                                                        Start date:
                                                    </th>
                                                    <td className="px-6 py-4">
                                                        {goalInfo.start_date}
                                                    </td>
                                                </tr>
                                                <tr className="bg-white text-black">
                                                    <th scope="row" className="px-6 py-4 font-medium  whitespace-nowrap w-[20px]">
                                                        Period:
                                                    </th>
                                                    <td className="px-6 py-4">
                                                        {goalPeriods.find(goalPeriod => parseInt(goalPeriod.value) === parseInt(goalInfo.period))?.name}
                                                    </td>
                                                </tr>
                                                <tr className="bg-white text-black">
                                                    <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap w-[20px]">
                                                        Status :
                                                    </th>
                                                    <td className="px-6 py-4">
                                                        {goalDataStatus[goalInfo.goal_status]}
                                                    </td>
                                                </tr>


                                            </tbody>
                                        </table>
                                    </div>
                                    <div className='leading-8'>
                                        {goalInfo.goal_description}
                                    </div>

                                    <div className='flex items-center py-9 gap-4'>
                                        {
                                            (goalInfo.goal_status === 'completed' || type === 'mentor') &&
                                            <>
                                                <Button
                                                    onClick={() => navigate('/goals')}
                                                    btnName={'Close'} btnCatergory="primary"
                                                    style={{ background: 'linear-gradient(to right, #00AEBD, #1D5BBF)', borderRadius: '27px', width: '180px' }} />
                                            </>
                                        }

                                        {
                                            (type === '' && role !== 'admin') &&

                                            <>


                                                {
                                                    goalInfo.goal_status === 'ongoing' &&
                                                    <>
                                                        <Button btnName="Cancel Goal" style={{ border: '1px solid rgba(0, 0, 0, 1)', borderRadius: '27px', width: '180px', color: 'rgba(24, 40, 61, 1)' }}
                                                            onClick={handleCancelGoal}
                                                        />
                                                        <Button
                                                            onClick={handleActionCompleteBtn}
                                                            btnName={'Complete Goal'} btnCatergory="primary"
                                                            style={{ background: 'linear-gradient(to right, #00AEBD, #1D5BBF)', borderRadius: '27px', width: '180px' }} />
                                                        {/* <Button
                                                            onClick={() => navigate('/goals')}
                                                            btnName={'Close'} btnCatergory="primary"
                                                            style={{ background: 'linear-gradient(to right, #00AEBD, #1D5BBF)', borderRadius: '27px', width: '180px' }} /> */}
                                                    </>
                                                }

                                                {
                                                    goalInfo.goal_status === 'active' &&
                                                    <>
                                                        <Button btnName="Back" style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '27px', width: '180px', color: 'rgba(29, 91, 191, 1)' }}
                                                            onClick={() => navigate('/goals')}
                                                        />

                                                        <Button
                                                            onClick={handleActionBtn}
                                                            btnName={'Start'} btnCatergory="primary" style={{ background: 'linear-gradient(to right, #00AEBD, #1D5BBF)', borderRadius: '27px', width: '180px' }} />
                                                    </>
                                                }


                                                {
                                                    goalInfo.goal_status === 'aborted' &&
                                                    <>
                                                        <Button btnName="Back" style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '27px', width: '180px', color: 'rgba(29, 91, 191, 1)' }}
                                                            onClick={() => navigate('/goals')}
                                                        />

                                                        <Button
                                                            onClick={() => console.log('re create')}
                                                            btnName={'Re-Create Goal'} btnCatergory="primary" style={{ background: 'linear-gradient(to right, #00AEBD, #1D5BBF)', borderRadius: '27px', width: '180px' }} />
                                                    </>
                                                }

                                            </>
                                        }


                                        {
                                            (role === 'admin' && goalInfo.goal_status !== 'completed') ?

                                                <>
                                                    {
                                                        goalInfo.goal_status === 'inactive' ?

                                                            <>
                                                                <button className='py-3 px-16 text-white text-[14px] flex items-center' style={{
                                                                    border: "1px solid #E0382D",
                                                                    borderRadius: '5px',
                                                                    color: '#E0382D'
                                                                }}
                                                                    onClick={() => handleAcceptCancelProgramRequest('reject', params.id)}
                                                                >Reject Request
                                                                </button>
                                                                <button className='py-3 px-16 text-white text-[14px] flex items-center' style={{
                                                                    background: "#16B681",
                                                                    borderRadius: '5px'
                                                                }}
                                                                    onClick={() => handleAcceptCancelProgramRequest('approve', params.id)}
                                                                >Approve Request
                                                                </button>
                                                            </>

                                                            :

                                                            goalInfo.goal_status === 'aborted' ?
                                                                <button className='py-3 px-16 text-white text-[14px] flex items-center' style={{
                                                                    border: "1px solid #E0382D",
                                                                    borderRadius: '5px',
                                                                    color: '#E0382D',
                                                                    cursor: 'not-allowed'
                                                                }}
                                                                    onClick={() => undefined}
                                                                >Cancelled
                                                                </button>
                                                                :
                                                                <button className='py-3 px-16 text-white text-[14px] flex items-center' style={{
                                                                    background: "#16B681",
                                                                    borderRadius: '5px',
                                                                    cursor: 'not-allowed'
                                                                }}
                                                                    onClick={undefined}
                                                                >Approved
                                                                </button>
                                                    }




                                                </>

                                                : null
                                        }




                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    : null
            }
        </div>
    )
}

export default ViewGoal
