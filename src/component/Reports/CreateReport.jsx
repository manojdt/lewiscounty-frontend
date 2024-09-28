import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';
import { useForm } from 'react-hook-form';
import { Backdrop, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { ReportFields } from '../../utils/formFields'
import CalendarIcon from '../../assets/images/calender_1x.png'
import HTMLIcon from '../../assets/images/html1x.png'
import TextIcon from "../../assets/images/text1x.png";


import { Button } from '../../shared';

import { assignMenteeColumns, assignMenteeRows, MenteeAssignColumns } from '../../mock';
import DataTable from '../../shared/DataGrid';
import SuccessTik from '../../assets/images/blue_tik1x.png';
import CancelIcon from '../../assets/images/cancel1x.png'
import { getAllCategories } from '../../services/programInfo';

import { getMentees, getProgramDetails, updateProgram } from '../../services/userprograms';
import { pipeUrls, programActionStatus, reportsStatus } from '../../utils/constant';
import { createReport, getProgramsByCategoryId, getReportProgramDetails } from '../../services/reportsInfo';
import ToastNotification from '../../shared/Toast';
import { dateTimeFormat } from '../../utils';
import MuiModal from '../../shared/Modal';





export default function CreateReport() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();

    const params = useParams();

    const dispatch = useDispatch()
    const { programdetails, loading: programLoading, error, menteeList } = useSelector(state => state.userPrograms)
    const { category, loading: apiLoading } = useSelector(state => state.programInfo)
    const { categoryPrograms, loading: reportsLoading, programDetails, status } = useSelector(state => state.reports)
    const [reportFields, setReportFields] = useState(ReportFields)
    const [dateFormat, setDateFormat] = useState({})
    const [menteeAllList, setAllMenteeList] = useState([])
    const [notification, setNotification] = useState({ program: false })
    const [actionType, setActionType] = useState('')
    const [commonLoading, setCommonLoading] = useState(false)
    const [disableField, setDisabledField] = useState(false)
    const [loading, setLoading] = useState(false)

    const [updatedMemberColumn, setUpdatedMemberColumn] = useState(MenteeAssignColumns)

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        getValues,
        setValue
    } = useForm();

    const onSubmit = (data) => {
        console.log('Submit11', data)

        const apiData = {
            "category": parseInt(data.category),
            "program": parseInt(data.program),
            "report_name": data.report_name,
            "participated_mentees": data.participated_mentees,
            "description": data.description,
            "action": data?.action || "submit"
        }

        dispatch(createReport(apiData))
        // dispatch(updateProgram({ id: programdetails.id, status: programActionStatus.assigned }))
        // reset()
    }

    const getProgramInfo = (categoryId) => {
        dispatch(getProgramsByCategoryId(categoryId))
    }

    const handleClose = () => {
        setNotification({ program: false })
    }

    const handleProgramData = (programId) => {
        dispatch(getReportProgramDetails(programId))
    }


    const handleDraft = () => {
        setActionType('draft')
    }

    useEffect(() => {
        if (actionType === 'draft') {
            document.getElementById('create-report').submit()
        }
    }, [actionType])

    useEffect(() => {
        if (status === reportsStatus.create) {
            setTimeout(() => {
                navigate('/reports')
            }, 3000)
        }
    }, [status])

    useEffect(() => {
        if (programDetails && Object.keys(programDetails).length) {
            console.log('sssssssssss')
            reset({
                mentor_name: programDetails.mentor_full_name,
                start_date: dateTimeFormat(programDetails.start_date),
                end_date: dateTimeFormat(programDetails.end_date),
                participated_mentees: programDetails.participated_mentees,
                category: searchParams.get('cat_id') || '',
                program: searchParams.get('program_id') || ''
            })
        }

        if(searchParams.get('cat_id') !== '' && searchParams.get('program_id') !== ''){
            setCommonLoading(false)
        }
    }, [programDetails])

    useEffect(() => {
        const fields = [...reportFields].map(field => {
            if (field.name === 'category') {
                return {
                    ...field,
                    options: category
                }
            }
            return field
        })
        setReportFields(fields)

        if(searchParams.has('cat_id') && searchParams.get('cat_id') !== ''){
            getProgramInfo(searchParams.get('cat_id'))
        }

    }, [category])

    useEffect(() => {
        if (notification.program) {
            setTimeout(() => {
                setNotification({ program: false })
            }, [2000])
        }
    }, [notification.program])


    useEffect(() => {
        if (categoryPrograms.length) {
            const fields = [...reportFields].map(field => {
                if (field.name === 'program') {
                    return {
                        ...field,
                        options: categoryPrograms
                    }
                }
                return field
            })
            setReportFields(fields)

            if(searchParams.has('program_id') && searchParams.get('program_id') !== ''){
                handleProgramData(searchParams.get('program_id'))
            }
        }

        if (!categoryPrograms.length && getValues('category') !== '' && searchParams.get('program_id') === '') {
            setNotification({ program: true })
        }
    }, [categoryPrograms])

    useEffect(() => {
        dispatch(getAllCategories())
    }, [])

    useEffect(() => {
        if (searchParams.has('cat_id') && searchParams.has('program_id') && searchParams.get('cat_id') !== '' && searchParams.get('program_id') !== '') {
            setCommonLoading(true)
        }
    }, [searchParams])


    console.log('Values', getValues())

    return (
        <div className="px-9 my-6 grid">

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={reportsLoading || apiLoading || commonLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <MuiModal modalOpen={status === reportsStatus.create} modalClose={() => setLoading(false)} noheader>
                <div className='px-5 py-1 flex justify-center items-center'>
                    <div className='flex justify-center items-center flex-col gap-5 py-10 px-20 mt-20 mb-20'
                        style={{ background: 'linear-gradient(101.69deg, #1D5BBF -94.42%, #00AEBD 107.97%)', borderRadius: '10px' }}>
                        <img src={SuccessTik} alt="SuccessTik" />
                        <p className='text-white text-[12px]'>Report action successfully performed</p>
                    </div>

                </div>
            </MuiModal>

            {
                notification.program &&

                <ToastNotification openToaster={notification.program} message={'There is no programs found for this category'} handleClose={handleClose} toastType={'error'} />

            }


            <div className='grid mb-10' style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)', borderRadius: '5px' }}>
                <div className='breadcrum'>
                    <nav className="flex px-7 pt-6 pb-5 mx-2 border-b-2 justify-between" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                            <li className="inline-flex items-center">
                                <h2>Create New Report</h2>
                            </li>
                        </ol>
                        <img className='cursor-pointer' onClick={() => navigate('/reports')}
                            src={CancelIcon} alt="CancelIcon" />
                    </nav>



                </div>
                <div className='content px-8'>
                    <div className="py-9">
                        <form id="create-report" onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex flex-wrap gap-4">
                                {
                                    reportFields.map((field, index) => {
                                        const dateField = field.type === 'date' ? register(field.name, field.inputRules) : undefined
                                        const dropdownField = field.type === 'dropdown' ? register(field.name, field.inputRules) : undefined
                                        return (
                                            <div className={`relative mb-6 ${field.width}`} key={index}>
                                                <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor={field.label}>
                                                    {field.label}
                                                </label>
                                                {
                                                    field.type === 'input' ?
                                                        <>
                                                            <input {...register(field.name, field.inputRules)}
                                                                type={field.fieldtype}
                                                                className="w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg focus:border-none focus-visible:border-none 
                                                                    focus-visible:outline-none text-[14px] h-[60px]"
                                                                placeholder={field.placeholder}
                                                                style={{
                                                                    color: "#232323",
                                                                    borderRadius: '3px'
                                                                }}
                                                                disabled={field.disabled}
                                                                aria-invalid={!!errors[field.name]}
                                                            />

                                                            {errors[field.name] && (
                                                                <p className="error" role="alert">
                                                                    {errors[field.name].message}
                                                                </p>
                                                            )}
                                                        </>
                                                        :
                                                        field.type === 'dropdown' ?
                                                            <>
                                                                <select
                                                                    {...register(field.name, field.inputRules)}
                                                                    className="w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg  
                                                                                focus:border-none focus-visible:border-none focus-visible:outline-none text-[14px] h-[60px]"
                                                                    placeholder={field.placeholder}
                                                                    style={{
                                                                        color: "#232323",
                                                                        borderRadius: '3px'
                                                                    }}
                                                                    disabled={field.disabled}
                                                                    onChange={(e) => {
                                                                        // console.log('dateField123', dateField)
                                                                        dropdownField.onChange(e)
                                                                        if (field.name === 'category') getProgramInfo(e.target.value)
                                                                        if (field.name === 'program') handleProgramData(e.target.value)
                                                                    }}
                                                                >
                                                                    <option value="">Select</option>
                                                                    {
                                                                        field.options.map((option, index) => {
                                                                            let opt = { name: option.name || '' }
                                                                            if (field.name === 'program') {
                                                                                opt = { name: option.program_name }
                                                                            }
                                                                            return (
                                                                                <option
                                                                                    value={option.id}
                                                                                    key={index}
                                                                                    selected={getValues(field.name) === option.id}
                                                                                >
                                                                                    {opt.name}
                                                                                </option>)
                                                                        })
                                                                    }
                                                                </select>
                                                                {errors[field.name] && (
                                                                    <p className="error" role="alert">
                                                                        {errors[field.name].message}
                                                                    </p>
                                                                )}
                                                            </>
                                                            :

                                                            field.type === 'textbox' ?
                                                                <>
                                                                    <textarea id="message" rows="4" className={`block p-2.5 input-bg w-full text-sm text-gray-900  rounded-lg border
                                                                                focus:visible:outline-none focus:visible:border-none ${field.width === 'width-82' ? 'h-[282px]' : ''}`}
                                                                        placeholder={field.placeholder}
                                                                        {...register(field.name, field.inputRules)}></textarea>
                                                                    {errors[field.name] && (
                                                                        <p className="error" role="alert">
                                                                            {errors[field.name].message}
                                                                        </p>
                                                                    )}
                                                                </>
                                                                :
                                                                field.type === 'checkbox' ?
                                                                    <div className="flex items-center me-4">
                                                                        {
                                                                            field.options.map((option, index) =>
                                                                                <div className="flex items-center me-4" key={index}>
                                                                                    <input type="radio" className="w-4 h-4 text-blue-600 bg-gray-100
                                                                                            border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 
                                                                                            dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700
                                                                                            dark:border-gray-600"
                                                                                        {...register(field.name, field.inputRules)}
                                                                                    />
                                                                                    <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{option.value}</label>
                                                                                </div>
                                                                            )
                                                                        }


                                                                    </div>
                                                                    :
                                                                    field.type === 'date' ?
                                                                        <>
                                                                            <div className='relative input-bg'>
                                                                                <input {...register(field.name, field.inputRules)}
                                                                                    type={field.fieldtype}
                                                                                    className="w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg focus:border-none focus-visible:border-none 
                                                                                    focus-visible:outline-none text-[14px] h-[60px]"
                                                                                    placeholder={field.placeholder}
                                                                                    style={{
                                                                                        color: "#232323",
                                                                                        borderRadius: '3px'
                                                                                    }}
                                                                                    disabled={field.disabled}
                                                                                    aria-invalid={!!errors[field.name]}
                                                                                />
                                                                                <img className='absolute top-5 right-2' src={CalendarIcon} alt="CalendarIcon" />
                                                                            </div>

                                                                            {errors[field.name] && (
                                                                                <p className="error" role="alert">
                                                                                    {errors[field.name].message}
                                                                                </p>
                                                                            )}
                                                                        </>

                                                                        :
                                                                        field.type === 'popup-input' ?

                                                                            <div className='relative'>
                                                                                <div className='input-bg h-[60px] w-full mt-2 flex items-center 
                                                                                                         text-[12px] gap-2 cursor-pointer px-6'
                                                                                    style={{ borderRadius: '3px' }}
                                                                                >
                                                                                    {
                                                                                        getValues(field.name) && getValues(field.name).slice(0, 6).map((popupfield, index) => {
                                                                                            console.log('kkkkkkkkkkkk')
                                                                                            return (
                                                                                                <>
                                                                                                    <p className='flex items-center gap-1'>
                                                                                                        <p className='flex items-center px-3 py-3' style={{
                                                                                                            background: 'rgba(223, 237, 255, 1)', borderRadius: '50%',

                                                                                                        }}></p>
                                                                                                        {
                                                                                                            popupfield.mentee_name
                                                                                                        }
                                                                                                    </p>
                                                                                                </>
                                                                                            )
                                                                                        })
                                                                                    }

                                                                                    {

                                                                                        field?.value && field?.value?.length > 6 &&

                                                                                        <p className='flex items-center gap-1'>
                                                                                            <p className='text-white flex items-center px-2 py-1' style={{
                                                                                                background: 'rgb(29, 91, 191)', borderRadius: '50%',

                                                                                            }}>{field?.value?.length - 6}</p>
                                                                                            Others</p>
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                            :

                                                                            field.type === 'editor' ?
                                                                                <>
                                                                                    <div className='flex gap-3'>
                                                                                        <textarea id="message" rows="4" className={`block p-2.5 input-bg w-[95%] h-[200px] text-sm text-gray-900  rounded-lg border
                                                                                            focus:visible:outline-none focus:visible:border-none ${field.width === 'width-82' ? 'h-[282px]' : ''}`}
                                                                                            placeholder={field.placeholder}
                                                                                            {...register(field.name, field.inputRules)}></textarea>
                                                                                        <div className='flex flex-col gap-6 items-center justify-center input-bg w-[4%]' style={{ borderRadius: '3px' }}>
                                                                                            <img src={TextIcon} alt="TextIcon" />
                                                                                            <img src={HTMLIcon} alt="HTMLIcon" />
                                                                                        </div>
                                                                                    </div>
                                                                                    {errors[field.name] && (
                                                                                        <p className="error" role="alert">
                                                                                            {errors[field.name].message}
                                                                                        </p>
                                                                                    )}
                                                                                </>
                                                                                :
                                                                                null
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="flex gap-6 justify-center align-middle py-16">
                                <Button btnName='Cancel' btnCls="w-[13%]" btnCategory="secondary" onClick={() => navigate('/reports')} />
                                <Button btnName='Save To Draft'
                                    style={{ background: 'rgba(29, 91, 191, 1)', color: '#fff' }}
                                    btnCls="w-[13%]" btnCategory="secondary" onClick={handleSubmit((d) => onSubmit({ ...d, action: 'draft' }))} />
                                <Button btnType="submit" btnCls="w-[13%]" btnName='Submit' btnCategory="primary" />
                            </div>
                        </form>



                    </div>
                </div>
            </div>




        </div>
    )

}
