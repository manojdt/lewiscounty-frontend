import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Backdrop, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { ReportFields } from '../../utils/formFields'
import CalendarIcon from '../../assets/images/calender_1x.png'
import HTMLIcon from '../../assets/images/html1x.png'
import TextIcon from "../../assets/images/text1x.png";
import UploadIcon from "../../assets/images/image_1x.png"
import DeleteIcon from "../../assets/images/delete_1x.png"


import { Button } from '../../shared';
import { MenteeAssignColumns } from '../../mock';
import SuccessTik from '../../assets/images/blue_tik1x.png';
import CancelIcon from '../../assets/images/cancel1x.png'
import { getAllCategories } from '../../services/programInfo';

import { reportsStatus } from '../../utils/constant';
import { getProgramsByCategoryId, getReportDetails, getReportProgramDetails, updateReportDetails, updateReportLocalState } from '../../services/reportsInfo';
import { dateTimeFormat } from '../../utils';
import ToastNotification from '../../shared/Toast';




export default function EditReport() {
    const navigate = useNavigate()
    const [addMenteeModal, setMentalModal] = useState(false)
    const [taskSuccess, setTaskSuccess] = useState(false)
    const [searchParams] = useSearchParams();

    const params = useParams();

    const dispatch = useDispatch()

    const [reportFields, setReportFields] = useState(ReportFields(true))
    const [dateFormat, setDateFormat] = useState({})
    const [menteeAllList, setAllMenteeList] = useState([])
    const [notification, setNotification] = useState({ program: false })

    const { category, loading: apiCategoryLoading } = useSelector(state => state.programInfo)
    const { reportDetails, loading: reportsLoading, categoryPrograms, programDetails, status } = useSelector(state => state.reports)


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
        const apiData = {
            "id": params.id,
            "category": parseInt(data.category),
            "program": parseInt(data.program),
            "name": data.report_name,
            "participated_mentees": data.participated_mentees,
            "comments": data.description,
            "status": data?.action || "submit",
        }
        dispatch(updateReportDetails(apiData))
    }


    const handleAddMentee = () => {
        setMentalModal(true)
        const updateMemberColumns = [...MenteeAssignColumns].map(mcol => {
            return mcol
        })
        setUpdatedMemberColumn(updateMemberColumns)
    }


    useEffect(() => {
        if (status === reportsStatus.update) {
            setTimeout(() => {
                navigate('/reports')
            }, 3000)
        }
    }, [status])

    useEffect(() => {
        if (programDetails && Object.keys(programDetails).length && Object.keys(reportDetails).length) {
            const updateFormValues = {
                category: reportDetails.category,
                program: programDetails.id,
                mentor_name: programDetails.mentor_name,
                start_date: dateTimeFormat(programDetails.start_date),
                end_date: dateTimeFormat(programDetails.end_date),
                participated_mentees: programDetails.participated_mentees,
                report_name: reportDetails.name,
                description: reportDetails.html_content_link
            }
            reset(updateFormValues)
        }
    }, [programDetails,])

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

            // reset({
            //     program: '',
            //     mentor_name: '',
            //     start_date: '',
            //     end_date: '',
            //     participated_mentees: [],
            // })
        }

        if (!categoryPrograms.length && getValues('category') && getValues('category') !== '') {
            const fields = [...reportFields].map(field => {
                if (field.name === 'program') {
                    return {
                        ...field,
                        options: []
                    }
                }
                return field
            })
            setReportFields(fields)
            // reset({
            //     program: '',
            //     mentor_name: '',
            //     start_date: '',
            //     end_date: '',
            //     participated_mentees: [],
            // })
            setNotification({ program: true })
        }
    }, [categoryPrograms])


    const getCategoryPrograms = (categoryId) => {
        dispatch(getProgramsByCategoryId(categoryId))
    }

    const getProgramInfo = (programId) => {
        dispatch(getReportProgramDetails(programId,"type"))
    }

    useEffect(() => {
        if (Object.keys(reportDetails).length) {
            getCategoryPrograms(reportDetails.category)
            getProgramInfo(reportDetails.program)
        }
    }, [reportDetails])


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
    }, [category])


    useEffect(() => {
        if (params && params.id) {
            dispatch(getAllCategories())
            dispatch(getReportDetails(params.id))
        }
    }, [params])

    useEffect(() => {
        if (notification.program) {
            setTimeout(() => {
                setNotification({ program: false })
            }, [2000])
        }
    }, [notification.program])


    const handleClose = () => {
        setNotification({ program: false })
    }

    const handleAddPopupData = (value) => {
        if (value.length) {
            setValue('mentees_list', value)
            setMentalModal(false)
            setAllMenteeList(value)
        }
    }

    useEffect(() => {
        return () => {
            dispatch(updateReportLocalState({ programDetails: {}, reportDetails: {} }))
        }
    }, [])


    return (
        <div className="px-9 my-6 grid">

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={reportsLoading || apiCategoryLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            {
                notification.program &&

                <ToastNotification openToaster={notification.program} message={'There is no programs found for this category'} handleClose={handleClose} toastType={'error'} />

            }


            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={status === reportsStatus.update}
            >
                <div className='px-5 py-1 flex justify-center items-center'>
                    <div className='flex justify-center items-center flex-col gap-[2.25rem] py-[4rem] px-[3rem] mt-20 mb-20'
                        style={{ background: '#fff', borderRadius: '10px' }}>
                        <img src={SuccessTik} alt="SuccessTik" />
                        <p className='text-[16px] font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#1D5BBF] to-[#00AEBD]'
                            style={{
                                fontWeight: 600
                            }}
                        >Report updated Successfully</p>
                    </div>

                </div>
            </Backdrop>


            {
                (!reportsLoading && Object.keys(reportDetails).length) &&


                <div className='grid mb-10' style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)', borderRadius: '5px' }}>
                    <div className='breadcrum'>
                        <nav className="flex px-7 pt-6 pb-5 mx-2 border-b-2 justify-between" aria-label="Breadcrumb">
                            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                                <li className="inline-flex items-center">
                                    <h2>{searchParams.has("type") && searchParams.get("type") === 're-open' ? 'Re-open' : 'Edit'} - {reportDetails.name} </h2>
                                </li>
                            </ol>
                            <img className='cursor-pointer' onClick={() => {
                                reset()
                                dispatch(updateReportLocalState({ programDetails: {}, reportDetails: {} }))
                            navigate('/reports')}}
                                src={CancelIcon} alt="CancelIcon" />
                        </nav>
                    </div>
                    <div className='content px-8'>
                        <div className="py-9">
                            <form onSubmit={handleSubmit(onSubmit)}>
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
                                                                            dropdownField.onChange(e)
                                                                            if (field.name === 'category') getCategoryPrograms(e.target.value)
                                                                            if (field.name === 'program') getProgramInfo(e.target.value)
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
                                                                            {...register(field.name, field.inputRules)}
                                                                            disabled={field.disabled}></textarea>
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
                                                                                                return (
                                                                                                    <>
                                                                                                        <p className='flex items-center gap-1'>
                                                                                                            <p className='flex items-center px-3 py-3' style={{
                                                                                                                background: 'rgba(223, 237, 255, 1)', borderRadius: '50%',

                                                                                                            }}></p>
                                                                                                            {
                                                                                                                popupfield.full_name
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
                                                                                field.type === 'text' ?
                                                                                    <>
                                                                                        <div className='flex justify-between'>
                                                                                            <div className='input-bg h-[60px] w-[86%] mt-2 flex items-center 
                                                                                         text-[12px] gap-2 cursor-pointer px-6'
                                                                                                style={{ borderRadius: '3px' }}>

                                                                                                {
                                                                                                    menteeAllList && menteeAllList.slice(0, 6).map((popupfield, index) => {
                                                                                                        return (
                                                                                                            <>
                                                                                                                <p className='flex items-center gap-1'>
                                                                                                                    <p className='flex items-center px-3 py-3' style={{
                                                                                                                        background: 'rgba(223, 237, 255, 1)', borderRadius: '50%',

                                                                                                                    }}></p>
                                                                                                                    {


                                                                                                                        `${popupfield.first_name} ${popupfield.last_name}`
                                                                                                                    }
                                                                                                                </p>
                                                                                                            </>
                                                                                                        )
                                                                                                    })
                                                                                                }

                                                                                                {
                                                                                                    menteeAllList && menteeAllList?.length > 6 &&

                                                                                                    <p className='flex items-center gap-1'>
                                                                                                        <p className='text-white flex items-center px-2 py-1' style={{
                                                                                                            background: 'rgb(29, 91, 191)', borderRadius: '50%',

                                                                                                        }}>{menteeAllList.length - 6}</p>
                                                                                                        Others</p>

                                                                                                }


                                                                                            </div>
                                                                                            <button type='button' className='h-[60px] mt-2 w-[13%] text-[14px]'
                                                                                                style={{ border: '1px dotted rgba(29, 91, 191, 1)', color: 'rgba(29, 91, 191, 1)' }}
                                                                                                onClick={handleAddMentee}>
                                                                                                Add Mentees
                                                                                            </button>
                                                                                        </div>
                                                                                        {errors[field.name] && (
                                                                                            <p className="error" role="alert">
                                                                                                {errors[field.name].message}
                                                                                            </p>
                                                                                        )}
                                                                                    </>
                                                                                    :




                                                                                    field.type === 'editor' ?
                                                                                        <>
                                                                                            <div className='flex gap-3'>
                                                                                                <textarea id="message" rows="4" className={`block p-2.5 input-bg w-[100%] h-[200px] text-sm text-gray-900  rounded-lg border
                                                                                            focus:visible:outline-none focus:visible:border-none ${field.width === 'width-82' ? 'h-[282px]' : ''}`}
                                                                                                    placeholder={field.placeholder}
                                                                                                    {...register(field.name, field.inputRules)}></textarea>
                                                                                                {/* <div className='flex flex-col gap-6 items-center justify-center input-bg w-[4%]' style={{ borderRadius: '3px' }}>
                                                                                                    <img src={TextIcon} alt="TextIcon" />
                                                                                                    <img src={HTMLIcon} alt="HTMLIcon" />
                                                                                                </div> */}
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

                                <div className='flex justify-between mb-10 hidden'>
                                    <div>
                                        <div className='text-[14px] pt-5' style={{ color: 'rgba(0, 0, 0, 1)' }}>Uploaded Image</div>
                                        <div className='uploaded-images'>
                                            <div className='flex gap-3 w-[400px] justify-between items-center mt-5 px-4 py-4'
                                                style={{ border: '1px solid rgba(29, 91, 191, 0.5)', borderRadius: '3px' }}>
                                                <div className='flex gap-3 items-center'>
                                                    <img src={UploadIcon} alt="altlogo" />
                                                    <span className='text-[12px]'>145816452.jpg</span>
                                                </div>
                                                <img className='w-[30px] cursor-pointer' onClick={() => console.log('delete')} src={DeleteIcon} alt="DeleteIcon" />
                                            </div>
                                        </div>

                                    </div>

                                    <div>
                                        <div className='text-[14px] pt-5' style={{ color: 'rgba(0, 0, 0, 1)' }}>Uploaded Video</div>

                                        <div className='flex gap-3 w-[400px] justify-between items-center mt-5 px-4 py-4'
                                            style={{ border: '1px solid rgba(29, 91, 191, 0.5)', borderRadius: '3px' }}>
                                            <div className='flex gap-3 items-center'>
                                                <img src={UploadIcon} alt="altlogo" />
                                                <span className='text-[12px]'>loripusum.video</span>
                                            </div>
                                            <img className='w-[30px] cursor-pointer' onClick={() => console.log('delete')} src={DeleteIcon} alt="DeleteIcon" />
                                        </div>
                                    </div>


                                    <div>
                                        <div className='text-[14px] pt-5' style={{ color: 'rgba(0, 0, 0, 1)' }}>Uploaded Files</div>

                                        <div className='flex gap-3 w-[400px] justify-between items-center mt-5 px-4 py-4'
                                            style={{ border: '1px solid rgba(29, 91, 191, 0.5)', borderRadius: '3px' }}>
                                            <div className='flex gap-3 items-center'>
                                                <img src={UploadIcon} alt="altlogo" />
                                                <span className='text-[12px]'>loripusum.PDF</span>
                                            </div>
                                            <img className='w-[30px] cursor-pointer' onClick={() => console.log('delete')} src={DeleteIcon} alt="DeleteIcon" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-6 justify-center align-middle py-16">
                                    <Button btnName='Cancel' btnCls="w-[13%]" btnCategory="secondary" onClick={() => {
                                         reset()
                                         dispatch(updateReportLocalState({ programDetails: {}, reportDetails: {} }))
                                        navigate('/reports')
                                        }} />
                                    {
                                        (reportDetails.status === 'draft' || searchParams.get('type') === 're-open') &&
                                        <Button btnName='Save To Draft'
                                            style={{ background: 'rgba(29, 91, 191, 1)', color: '#fff' }}
                                            btnCls="w-[13%]" btnCategory="secondary" onClick={handleSubmit((d) => onSubmit({ ...d, action: 'draft' }))} />
                                    }

                                    <Button btnType="submit" btnCls="w-[13%]" btnName={searchParams.get('type') === 're-open'||reportDetails.status === 'draft'? 'Submit' : `Save Changes`} btnCategory="primary" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

            }


        </div>
    )

}
