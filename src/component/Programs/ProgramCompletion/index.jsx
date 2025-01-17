import React, { useEffect, useState } from 'react'

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import CompletedIcon from '../../../assets/images/completed-teaching-program1x.png'
import ReopenIcon from '../../../assets/images/reopen-request1x.png'
import ExtendIcon from '../../../assets/images/extend-request1x.png'
import MoreIcon from '../../../assets/images/more1x.png';

import { Button } from '../../../shared'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { getProgramDetails } from '../../../services/userprograms';
import { Backdrop, CircularProgress } from '@mui/material';
import { dateFormatRever } from '../../../utils';
import moment from 'moment';
import { programCompletionPage } from '../../Breadcrumbs/BreadcrumbsCommonData';
import Breadcrumbs from '../../Breadcrumbs/Breadcrumbs';

export default function ProgramCompletion() {
    const navigate = useNavigate()
    const params = useParams();
    const [anchorEl, setAnchorEl] = useState(null);
    const [completedProgram, setCompletedProgram] = useState({})
    const [breadcrumbsArray, setBreadcrumbsArray] = useState([]);
    const dispatch = useDispatch()
    const { programdetails, loading: programLoading, error, status, menteeList } = useSelector(state => state.userPrograms)

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if (Object.keys(programdetails).length) {
            let startDate = ''
            let endDate = ''
            if (programdetails.start_date !== '') {
                startDate = programdetails?.start_date ? new Date(programdetails?.start_date)?.toISOString().substring(0, 10).split("-") : ""
            }
            const actualStartDate = startDate.length ? `${startDate[2]}/${startDate[1]}/${startDate[0]}` : ''

            if (programdetails.end_date !== '') {
                endDate = programdetails?.start_date ? new Date(programdetails?.start_date)?.toISOString().substring(0, 10).split("-") : ""
            }
            const actualEndDate = endDate.length ? `${endDate[2]}/${endDate[1]}/${endDate[0]}` : ''

            setCompletedProgram({
                ...programdetails,
            })
        }
    }, [programdetails])

    useEffect(() => {
        if (programdetails.program_name) {
            setBreadcrumbsArray(programCompletionPage(programdetails.program_name))
        }
    }, [programdetails])


    useEffect(() => {
        if (params.id) {
            const programId = params.id;
            if (programId && programId !== '') {
                dispatch(getProgramDetails({ id: programId }))
            }
        }
    }, [params.id])

    return (
        <div className="px-9 my-6 grid">
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={programLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {
                Object.keys(completedProgram).length ?
                    <div className='grid mb-10' style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)', borderRadius: '5px' }}>
                        <div className='breadcrum'>
                            <nav className="flex px-7 pt-6 pb-5 mx-2 border-b-2 justify-between" aria-label="Breadcrumb">
                                <Breadcrumbs items={breadcrumbsArray} />
                                {/* <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                                    <li className="inline-flex items-center">
                                        <p className="inline-flex items-center text-sm font-medium" style={{ color: 'rgba(89, 117, 162, 1)' }}>
                                            Program
                                        </p>
                                        <svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                                        </svg>
                                    </li>
                                   
                                    <li className="inline-flex items-center">
                                        <p className="inline-flex items-center text-sm font-medium" style={{ color: 'rgba(89, 117, 162, 1)' }}>
                                            {programdetails.program_name}
                                        </p>
                                        <svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                                        </svg>
                                    </li>
                                    <li>
                                        <div className="flex items-center">
                                            <p className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">
                                                Completed </p>
                                        </div>
                                    </li>
                                </ol> */}
                                {/* <div className='cursor-pointer' onClick={handleClick}>
                                    <img src={MoreIcon} alt='MoreIcon' />
                                </div> */}
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                        "aria-labelledby": "basic-button",
                                    }}
                                >
                                    {/* <MenuItem onClick={handleClose} className='!text-[12px]'>
                                <img src={ExtendIcon} alt="ExtendIcon" className='pr-3 w-[25px]' />
                                Extend Request </MenuItem>
                            <MenuItem onClick={handleClose} className='!text-[12px]'>
                                <img src={ReopenIcon} alt="ReopenIcon" className='pr-3 w-[25px]' />
                                Reopen  Request
                            </MenuItem> */}
                                </Menu>
                            </nav>
                        </div>
                        <div className="flex justify-center items-center flex-col gap-8 py-10">
                            <div
                                className="font-semibold"
                                style={{ color: "rgba(29, 91, 191, 1)" }}
                            >
                                Completed {programdetails?.program_name} Program
                            </div>
                            <img src={CompletedIcon} alt="CompletedIcon" className="w-[2%]" />
                            <div>
                                <div className="relative ">
                                    <table className="w-[800px] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        <tbody style={{ border: "1px solid rgba(29, 91, 191, 1)" }}>
                                            <tr className="bg-white border-b">
                                                <th
                                                    scope="row"
                                                    style={{ border: "1px solid rgba(29, 91, 191, 1)" }}
                                                    className="px-6 py-4 font-medium whitespace-nowrap text-font-secondary-black"
                                                >
                                                    Start Date | End Date
                                                </th>
                                                <td
                                                    className="px-6 py-4 text-white"
                                                    style={{ background: "rgba(29, 91, 191, 1)" }}
                                                >
                                                    {programdetails?.start_date
                                                        ? `${moment(programdetails?.start_date).format(
                                                            "MM-DD-YYYY"
                                                        )}`
                                                        : "-"}{" "}
                                                    |{" "}
                                                    {programdetails?.end_date
                                                        ? `${moment(programdetails?.end_date).format(
                                                            "MM-DD-YYYY"
                                                        )}`
                                                        : "-"}
                                                </td>
                                            </tr>
                                            <tr className="bg-white border-b">
                                                <th
                                                    style={{ border: "1px solid rgba(29, 91, 191, 1)" }}
                                                    scope="row"
                                                    className="px-6 py-4 font-medium  whitespace-nowrap text-font-secondary-black"
                                                >
                                                    Durations
                                                </th>
                                                <td
                                                    className="px-6 py-4 text-white"
                                                    style={{ background: "rgba(29, 91, 191, 1)" }}
                                                >
                                                    {programdetails?.duration} {" Days"}
                                                </td>
                                            </tr>
                                            <tr className="bg-white border-b ">
                                                <th
                                                    style={{ border: "1px solid rgba(29, 91, 191, 1)" }}
                                                    scope="row"
                                                    className="px-6 py-4 font-medium whitespace-nowrap text-font-secondary-black"
                                                >
                                                    Attended Mentees
                                                </th>
                                                <td
                                                    className="px-6 py-4 text-white"
                                                    style={{ background: "rgba(29, 91, 191, 1)" }}
                                                >
                                                    {programdetails?.participated_mentees_count}
                                                </td>
                                            </tr>
                                            {programdetails?.program_mode !== "virtual_meeting" && (
                                                <tr className="bg-white border-b ">
                                                    <th
                                                        style={{ border: "1px solid rgba(29, 91, 191, 1)" }}
                                                        scope="row"
                                                        className="px-6 py-4 font-medium whitespace-nowrap text-font-secondary-black"
                                                    >
                                                        Location
                                                    </th>
                                                    <td
                                                        className="px-6 py-4 text-white"
                                                        style={{ background: "rgba(29, 91, 191, 1)" }}
                                                    >
                                                        {`${programdetails?.city_details?.name}, ${programdetails?.state_details?.abbreviation}`}
                                                    </td>
                                                </tr>
                                            )}
                                            <tr className="bg-white border-b">
                                                <th
                                                    style={{ border: "1px solid rgba(29, 91, 191, 1)" }}
                                                    scope="row"
                                                    className="px-6 py-4 font-medium whitespace-nowrap text-font-secondary-black"
                                                >
                                                    Program status
                                                </th>
                                                <td
                                                    className="px-6 py-4 text-white"
                                                    style={{ background: "rgba(29, 91, 191, 1)" }}
                                                >
                                                    {programdetails?.program_mode === "virtual_meeting"
                                                        ? "Online"
                                                        : "Offline"}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {/* <p>If you want to take more time for this program request to admin,
                                <span style={{ color: 'rgba(29, 91, 191, 1)', textDecoration: 'underline', cursor: 'pointer' }}> CLICK HERE</span>
                            </p> */}
                        </div>

                        <div className="flex gap-6 justify-center align-middle py-10">
                            <Button
                                btnName="Skip"
                                btnCls="w-[13%]"
                                btnCategory="secondary"
                                onClick={() => navigate(`/generate_certificate/${params.id}`)}
                            />
                            <Button
                                btnType="button"
                                btnCls="w-[13%]"
                                onClick={() =>
                                    navigate(
                                        `/create-report?program_id=${params.id}&cat_id=${programdetails?.categories[0]?.id}`
                                    )
                                }
                                btnName="Create Report"
                                btnCategory="primary"
                            />
                        </div>
                    </div>:""}
    </div>
    );
}
