import React, { useEffect, useState } from 'react'

import UploadIcon from "../../assets/images/image_1x.png"
import DeleteIcon from "../../assets/images/delete_1x.png"
import CancelIcon from '../../assets/images/cancel-colour1x.png'
import EditIcon from '../../assets/images/Edit1x.png'
import FileIcon from '../../assets/icons/linkIcon.svg'
import ReportUserIcon from '../../assets/images/report.png'
import SuccessTik from '../../assets/images/blue_tik1x.png';
import ReportVideoIcon from '../../assets/images/report1.png'
import { Button } from '../../shared'
import { useNavigate, useParams } from 'react-router-dom'
import MuiModal from '../../shared/Modal';
import { useDispatch, useSelector } from 'react-redux'
import { Backdrop, CircularProgress } from '@mui/material'
import { getReportDetails } from '../../services/reportsInfo'
import { dateTimeFormat } from '../../utils'
import { reportAllStatus } from '../../utils/constant'


const ViewReport = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [startTask, setStartTask] = useState(false)
    const params = useParams();
    const dispatch = useDispatch()
    const { reportDetails, loading: reportsLoading } = useSelector(state => state.reports)

    const handleSubmitTask = () => {
        if (!startTask) {
            setStartTask(false)
        } else {
            setLoading(true)
        }
    }

    useEffect(() => {
        if (params.id === '5') {
            setStartTask(true)
        }

        if (params && params.id !== '') {
            dispatch(getReportDetails(params.id))
        }
    }, [params])

    useEffect(() => {
        if (loading) {
            setTimeout(() => {
                setLoading(false)
                if (params.id === '5') navigate('/dashboard')
                else navigate('/mentee-tasks')
            }, 3000)
        }
    }, [loading])

    console.log('paaa', params)
    return (
        <div className="px-9 py-9">
            <MuiModal modalOpen={loading} modalClose={() => setLoading(false)} noheader>
                <div className='px-5 py-1 flex justify-center items-center'>
                    <div className='flex justify-center items-center flex-col gap-5 py-10 px-20 mt-20 mb-20'
                        style={{ background: 'linear-gradient(101.69deg, #1D5BBF -94.42%, #00AEBD 107.97%)', borderRadius: '10px' }}>
                        <img src={SuccessTik} alt="SuccessTik" />
                        <p className='text-white text-[12px]'>Task Submitted Successfully</p>
                    </div>

                </div>
            </MuiModal>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={reportsLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {
                (!reportsLoading && Object.keys(reportDetails).length > 0) &&


                <div className='px-3 py-5' style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)' }}>
                    <div className='flex justify-between px-5 pb-4 mb-8 items-center border-b-2'>
                        <div className='flex gap-5 items-center text-[20px]'>
                            <p>View {reportDetails?.report_name} </p>

                            {
                                reportDetails?.report_status === 'pending' &&

                                <div className="inset-y-0 end-0 flex items-center pe-3 cursor-pointer"
                                    onClick={() => navigate(`/edit-report/${reportDetails.id}`)}
                                >
                                    <img src={EditIcon} alt='EditIcon' />
                                </div>
                            }


                        </div>

                        <div className='flex gap-8 items-center'>
                            <div className="relative">
                                <div className="inset-y-0 end-0 flex items-center pe-3 cursor-pointer"
                                    onClick={() => navigate('/reports')}
                                >
                                    <img src={CancelIcon} alt='CancelIcon' />
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className='px-4'>
                        <div className="relative flex gap-6 justify-between">
                            <table className="w-[50%] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <tbody style={{ border: '1px solid rgba(0, 174, 189, 1)' }}>
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" style={{ border: '1px solid rgba(0, 174, 189, 1)' }} className="px-6 py-4 font-medium whitespace-nowrap ">
                                            Category
                                        </th>
                                        <td className="px-6 py-4 text-white" style={{ background: 'rgba(0, 174, 189, 1)' }}>
                                            {reportDetails.category_name}
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th style={{ border: '1px solid rgba(0, 174, 189, 1)' }} scope="row" className="px-6 py-4 font-medium  whitespace-nowrap ">
                                            Program Name
                                        </th>
                                        <td className="px-6 py-4 text-white" style={{ background: 'rgba(0, 174, 189, 1)' }}>
                                            {reportDetails.program_name}
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b dark:bg-gray-800 ">
                                        <th style={{ border: '1px solid rgba(0, 174, 189, 1)' }} scope="row" className="px-6 py-4 font-medium whitespace-nowrap ">
                                            Program Creator
                                        </th>
                                        <td className="px-6 py-4 text-white" style={{ background: 'rgba(0, 174, 189, 1)' }}>
                                            Admin
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b  dark:bg-gray-800">
                                        <th style={{ border: '1px solid rgba(0, 174, 189, 1)' }} scope="row" className="px-6 py-4 font-medium whitespace-nowrap ">
                                            Mentor Name
                                        </th>
                                        <td className="px-6 py-4 text-white" style={{ background: 'rgba(0, 174, 189, 1)' }}>
                                            {reportDetails.mentor_name}
                                        </td>
                                    </tr>

                                </tbody>
                            </table>

                            <table className="w-[50%] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <tbody style={{ border: '1px solid rgba(29, 91, 191, 1)' }}>
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" style={{ border: '1px solid rgba(29, 91, 191, 1)' }} className="px-6 py-4 font-medium whitespace-nowrap ">
                                            Program Start Date and Time
                                        </th>
                                        <td className="px-6 py-4 text-white" style={{ background: 'rgba(29, 91, 191, 1)' }}>
                                            {dateTimeFormat(reportDetails.program_start_date_and_time)}
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th style={{ border: '1px solid rgba(29, 91, 191, 1)' }} scope="row" className="px-6 py-4 font-medium  whitespace-nowrap ">
                                            Program End Date and Time
                                        </th>
                                        <td className="px-6 py-4 text-white" style={{ background: 'rgba(29, 91, 191, 1)' }}>
                                            {dateTimeFormat(reportDetails.program_end_date_and_time)}
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b dark:bg-gray-800 ">
                                        <th style={{ border: '1px solid rgba(29, 91, 191, 1)' }} scope="row" className="px-6 py-4 font-medium whitespace-nowrap ">
                                            Participated Mentees
                                        </th>
                                        <td className="px-6 py-4 text-white" style={{ background: 'rgba(29, 91, 191, 1)' }}>
                                            {reportDetails.participated_mentees.length} Member
                                        </td>
                                    </tr>


                                </tbody>
                            </table>
                        </div>

                        <div className='task-desc  mt-5 px-5 py-6' style={{ border: '1px solid rgba(29, 91, 191, 0.5)' }}>
                            <div className='flex items-center hidden' style={{ background: 'rgba(248, 249, 250, 1)' }}>
                                <p className='text-[20px] w-[50%] px-20 leading-10'>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                    incididunt ut labore et dolore magna aliqua. </p>
                                <img style={{ width: '50%' }} src={ReportUserIcon} alt="ReportUserIcon" />
                            </div>

                            <div className='leading-10 py-6 hidden'>
                                any organizations rely on PL/SQL for data integration, but Informatica ETL offers a more efficient approach. This
                                migration unlocks significant benefits, including streamlined workflows, improved scalability, and easier maintenance.
                                Let's explore why migrating to Informatica ETL can be the key to unlocking your data's full potential.
                            </div>

                            <img className='w-full hidden' src={ReportVideoIcon} alt="ReportVideoIcon" />

                            <div className='py-8 leading-9 hidden'>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                                dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                                non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                                reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                                proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                                nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
                                in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                culpa qui officia deserunt mollit anim id est laborum."
                            </div>

                            <div className='flex flex-col gap-3 mb-10'>
                                <div>
                                    Report Name : {reportDetails.report_name}
                                </div>

                                <div>
                                    Report Description : {reportDetails.description}
                                </div>
                            </div>



                            <div className='close-btn flex justify-center gap-7 pb-5'>

                                <Button btnType="button" btnCls="w-[14%]"
                                    onClick={() => { navigate('/reports') }} btnName='Cancel'
                                    btnCategory="secondary"
                                />

                                {
                                    reportDetails.report_status === reportAllStatus.pending &&

                                    <Button btnType="button" btnCls="w-[14%]"
                                        onClick={() => { navigate(`/edit-report/${reportDetails.id}`) }} btnName='Edit'

                                        btnStyle={{ background: 'rgba(0, 174, 189, 1)' }} />
                                }


                                <Button btnType="button" btnCls="w-[14%]"
                                    onClick={() => { navigate('/reports') }} btnName='Close'
                                    btnStyle={{ background: 'rgba(29, 91, 191, 1)' }}
                                />
                            </div>
                        </div>






                    </div>


                </div>

            }
        </div>
    )
}

export default ViewReport
