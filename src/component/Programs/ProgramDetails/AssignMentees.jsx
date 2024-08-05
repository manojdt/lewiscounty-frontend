import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';
import { useForm } from 'react-hook-form';
import { Backdrop, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { AssignMenteesFields } from '../../../utils/formFields'
import CalendarIcon from '../../../assets/images/calender_1x.png'
import HTMLIcon from '../../../assets/images/html1x.png'
import TextIcon from "../../../assets/images/text1x.png";


import { Button } from '../../../shared';
import MuiModal from '../../../shared/Modal';
import MuiTable from '../../../shared/Table';
import { assignMenteeColumns, assignMenteeRows, MenteeAssignColumns } from '../../../mock';
import DataTable from '../../../shared/DataGrid';
import SuccessTik from '../../../assets/images/blue_tik1x.png';
import { getAllCategories } from '../../../services/programInfo';
import './program.css'

import { assignProgramTask, getMentees, getProgramDetails, getProgramMentees, updateProgram } from '../../../services/userprograms';
import { pipeUrls, programActionStatus, programStatus } from '../../../utils/constant';




export default function AssignMentees() {
    const navigate = useNavigate()
    const [addMenteeModal, setMentalModal] = useState(false)
    const [taskSuccess, setTaskSuccess] = useState(false)

    const params = useParams();

    const dispatch = useDispatch()
    const { programdetails, loading: programLoading, error, status, menteeList, programMenteeList } = useSelector(state => state.userPrograms)
    const { category, loading: apiLoading } = useSelector(state => state.programInfo)
    const [menteeFields, setMenteeFields] = useState(AssignMenteesFields)
    const [dateFormat, setDateFormat] = useState({})
    const [menteeAllList, setAllMenteeList] = useState([])

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

        const apiData = {
            ...data,
            program_id: programdetails.id,
            start_date: new Date(data.start_date).toISOString(),
            end_date: new Date(data.end_date).toISOString(),
            mentor: programdetails?.mentor_info?.id,
            due_date: new Date(data.due_date).toISOString()
        }
        console.log('submit', apiData)
        if (programdetails.status === programActionStatus.yettostart) {
            dispatch(updateProgram({ id: programdetails.id, status: programActionStatus.assigned }))
        }
        dispatch(assignProgramTask(apiData))
       
        // reset()
        // setLoading(true)
        // setTaskSuccess(true)
    }

    useEffect(() => {
        if (status === programActionStatus.assigned || status === programStatus.taskassigned) {
            setTaskSuccess(true)
            setTimeout(() => {
                navigate(`${pipeUrls.startprogram}/${programdetails.id}`)
            }, [3000])
        }

        // if(status === programStatus.taskassigned){
        //     dispatch(updateProgram({ id: programdetails.id, status: programActionStatus.assigned }))
        // }
    }, [status])

    const handleAddMentee = () => {
        setMentalModal(true)

        const updateMemberColumns = [...MenteeAssignColumns].map(mcol => {
            if (mcol.field === 'action') {
                return {
                    ...mcol,
                    renderCell: (params) => {
                        return <button style={{
                            background: 'rgb(29, 91, 191)',
                            color: 'rgb(255, 255, 255)',
                            padding: '2px 20px',
                            height: '32px',
                            margin: '9px 0px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: '3px'
                        }}
                            onClick={() => {
                                console.log(params);
                                navigate(`/mentee-details/${params.id}`)
                            }}>View Details</button>;
                    }
                }
            }
            return mcol
        })

        setUpdatedMemberColumn(updateMemberColumns)

    }

    const footerAction = (key) => {
        setMentalModal(false)
    }

    // useEffect(() => {
    //     if (taskSuccess) {
    //         setTimeout(() => {
    //             setTaskSuccess(false)

    //             navigate(`${pipeUrls.startprogram}/${programdetails.id}`)
    //         }, [2000])
    //     }
    // }, [taskSuccess])

    useEffect(() => {
        const fields = [...menteeFields].map(field => {
            if (field.name === 'category_id') {
                return {
                    ...field,
                    options: category
                }
            }
            return field
        })
        setMenteeFields(fields)
    }, [category])


    useEffect(() => {
        if (!Object.keys(programdetails).length) {
            const programId = params.id;
            if (programId && programId !== '') {
                dispatch(getProgramDetails(programId))
            }
        }
    }, [params.id])

    useEffect(() => {
        if (Object.keys(programdetails).length) {
            console.log('tarttt', new Date(programdetails.start_date))
            let fieldValue = {
                category_id: programdetails.categories.length ? programdetails.categories[0].id : '',
                program_id: programdetails.program_name,
                mentor: `${programdetails?.mentor_info?.first_name} ${programdetails?.mentor_info?.last_name}`,
                start_date: new Date(programdetails.start_date),
                end_date: new Date(programdetails.end_date),
                duration: programdetails.duration,
                mentees_list: '',
                task_details: '',
                due_date: ''
            }

            console.log('rest', fieldValue, programdetails)

            reset(fieldValue)
        }
    }, [programdetails])

    useEffect(() => {
        if (!category.length) {
            dispatch(getAllCategories())
        }
        dispatch(getProgramMentees())

    }, [])

    const handleAddPopupData = (value) => {
        if (value.length) {
            setValue('mentees_list', value)
            setMentalModal(false)
            setAllMenteeList(value)
        }
    }

    const CustomFooterStatusComponent = (props) => {
        return (
            <div className='flex gap-6 justify-center items-center py-4'>
                <button onClick={() => setMentalModal(false)} className='py-3 px-6 w-[16%]'
                    style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '3px', color: 'rgba(29, 91, 191, 1)' }}>Cancel</button>
                <button onClick={() => handleAddPopupData(props.selectedRows)}
                    className='text-white py-3 px-6 w-[16%]'
                    style={{ background: 'linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)', borderRadius: '3px' }}>Add Mentees</button>
            </div>
        );
    }

    console.log('addMenteeModal', addMenteeModal)

    console.log('getValues', getValues('category_id'))
    console.log('getValues mentees_list', getValues('mentees_list'))

    return (
        <div className="px-9 my-6 grid">

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={programLoading || apiLoading || loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            {
                Object.keys(programdetails).length ?
                    <div className='grid mb-10' style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)', borderRadius: '5px' }}>
                        <div className='breadcrum'>
                            <nav className="flex px-7 pt-6 pb-5 mx-2 border-b-2 justify-between" aria-label="Breadcrumb">
                                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                                    <li className="inline-flex items-center">
                                        <span className="inline-flex items-center text-sm font-medium cursor-pointer" style={{ color: 'rgba(89, 117, 162, 1)' }}>
                                            Program
                                        </span>
                                        <svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                                        </svg>
                                    </li>
                                    <li>
                                        <div className="flex items-center">
                                            <span className="ms-1 text-sm font-medium cursor-pointer" style={{ color: 'rgba(89, 117, 162, 1)' }}>
                                                Planned Program </span>
                                            <svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                                            </svg>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="flex items-center">
                                            <span className="ms-1 text-sm font-medium cursor-pointer text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">
                                                Assign Task to Mentees </span>
                                        </div>
                                    </li>
                                </ol>
                            </nav>
                        </div>
                        <div className='content px-8'>
                            <div className="py-9">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="flex flex-wrap gap-4">
                                        {
                                            menteeFields.map((field, index) => {
                                                const dateField = field.type === 'date' ? register(field.name, field.inputRules) : undefined
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
                                                                        // placeholder={field.placeholder}
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
                                                                        >
                                                                            <option value="">Select</option>
                                                                            {
                                                                                field.options.map((option, index) =>
                                                                                    <option
                                                                                        value={option.id}
                                                                                        key={index}
                                                                                        selected={getValues(field.name) === option.id}
                                                                                    >
                                                                                        {option.name}
                                                                                    </option>)
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
                                                                                        <Calendar
                                                                                            className='calendar-control w-full'
                                                                                            {...dateField}
                                                                                            {...register(field.name, field.inputRules)}
                                                                                            value={field.disabled ? new Date(programdetails[field.name]) : dateFormat[field.name]}
                                                                                            onChange={(e) => {
                                                                                                dateField.onChange(e)
                                                                                                setDateFormat({ ...dateFormat, [field.name]: e.value })
                                                                                            }}
                                                                                            disabled={field.disabled}
                                                                                            showTime
                                                                                            hourFormat="12"
                                                                                            dateFormat="dd/mm/yy"
                                                                                            style={{ width: '30%' }}
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
                                                                                field.type === 'text' ?
                                                                                    <>
                                                                                        <div className='flex justify-between'>
                                                                                            <div className='input-bg h-[60px] w-[86%] mt-2 flex items-center 
                                                                                                text-[12px] gap-2 cursor-pointer px-6'
                                                                                                style={{ borderRadius: '3px' }}>

                                                                                                {
                                                                                                    menteeAllList && menteeAllList.slice(0, 6).map((popupfield, index) => {
                                                                                                        console.log('popupfield', popupfield)
                                                                                                        return (
                                                                                                            <>
                                                                                                                <p className='flex items-center gap-1'>
                                                                                                                    <p className='flex items-center px-3 py-3' style={{
                                                                                                                        background: 'rgba(223, 237, 255, 1)', borderRadius: '50%',

                                                                                                                    }}></p>
                                                                                                                    {


                                                                                                                        `${popupfield.full_name}`
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
                                                                                            <input {...register(field.name, field.inputRules)}
                                                                                                type={field.fieldtype}
                                                                                                className="w-full hidden border-none px-3 py-[0.32rem] leading-[2.15] input-bg focus:border-none focus-visible:border-none 
                                                                                                focus-visible:outline-none text-[14px] h-[60px]"
                                                                                                placeholder={field.placeholder}
                                                                                                style={{
                                                                                                    color: "#232323",
                                                                                                    borderRadius: '3px'
                                                                                                }}
                                                                                                aria-invalid={!!errors[field.name]}
                                                                                            />
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

                                                                                    field.type === 'link' ?

                                                                                        <div className='flex justify-between'>
                                                                                            <div className='input-bg h-[60px] w-full mt-2 flex items-center 
                                                                                                             text-[12px] gap-2 cursor-pointer px-6'
                                                                                                style={{ borderRadius: '3px' }}>

                                                                                                {
                                                                                                    programdetails.certifications && programdetails.certifications.map((certification, index) => {
                                                                                                        return (
                                                                                                            <p className='underline'>
                                                                                                                {
                                                                                                                    certification.name
                                                                                                                }
                                                                                                            </p>
                                                                                                        )
                                                                                                    })
                                                                                                }

                                                                                                {
                                                                                                    programdetails.learning_materials && programdetails.learning_materials.map((certification, index) => {
                                                                                                        return (
                                                                                                            <p className='underline'>
                                                                                                                {
                                                                                                                    certification.name
                                                                                                                }
                                                                                                            </p>
                                                                                                        )
                                                                                                    })
                                                                                                }

                                                                                                {/* {
                                                                                                    menteeAllList && menteeAllList?.length > 6 &&

                                                                                                    <p className='flex items-center gap-1'>
                                                                                                        <p className='text-white flex items-center px-2 py-1' style={{
                                                                                                            background: 'rgb(29, 91, 191)', borderRadius: '50%',

                                                                                                        }}>{menteeAllList.length - 6}</p>
                                                                                                        Others</p>

                                                                                                } */}


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
                                        <Button btnName='Cancel' btnCls="w-[13%]" btnCategory="secondary" onClick={() => navigate('/assign-task/1')} />
                                        <Button btnType="submit" btnName='Create Task for Mentees' btnCategory="primary" />
                                    </div>
                                </form>
                                <MuiModal modalSize='lg' modalOpen={addMenteeModal} title="Select Mentees" modalClose={() => setMentalModal(false)}>
                                    <DataTable rows={programMenteeList} columns={updatedMemberColumn} footerAction={footerAction} footerComponent={CustomFooterStatusComponent}
                                        selectedAllRows={menteeAllList} />
                                </MuiModal>

                                <MuiModal modalOpen={taskSuccess} modalClose={() => setTaskSuccess(false)} noheader>
                                    <div className='px-5 py-1 flex justify-center items-center'>
                                        <div className='flex justify-center items-center flex-col gap-5 py-10 px-20 mt-20 mb-20'
                                            style={{ background: 'linear-gradient(101.69deg, #1D5BBF -94.42%, #00AEBD 107.97%)', borderRadius: '10px' }}>
                                            <img src={SuccessTik} alt="SuccessTik" />
                                            <p className='text-white text-[12px]'>Successfully task assigned to Mentees</p>
                                        </div>

                                    </div>
                                </MuiModal>
                            </div>
                        </div>
                    </div>

                    : null
            }


        </div >
    )

}
