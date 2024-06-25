import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AssignMenteesFields } from '../../../utils/formFields'
import CalendarIcon from '../../../assets/images/calender_1x.png'
import HTMLIcon from '../../../assets/images/html1x.png'
import TextIcon from "../../../assets/images/text1x.png";

import { useForm } from 'react-hook-form';
import { Button } from '../../../shared';
import MuiModal from '../../../shared/Modal';
import MuiTable from '../../../shared/Table';
import { assignMenteeColumns, assignMenteeRows } from '../../../mock';
import DataTable from '../../../shared/DataGrid';
import SuccessTik from '../../../assets/images/blue_tik1x.png';



export default function AssignMentees() {
    const navigate = useNavigate()
    const [addMenteeModal, setMentalModal] = useState(false)
    const [taskSuccess, setTaskSuccess] = useState(false)

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm();

    const onSubmit = (data) => {
        console.log(data)
        // reset()
    }

    const handleAddMentee = () => {
        setMentalModal(true)
    }

    const footerAction = (key) => {
        setMentalModal(false)
    }

    useEffect(() => {
        if (taskSuccess) {
            setTimeout(() => {
                setTaskSuccess(false)
                navigate('/start-program-request/1')
            }, [2000])
        }
    }, [taskSuccess])

    const CustomFooterStatusComponent = () => {
        return (
            <div className='flex gap-6 justify-center items-center py-4'>
            <button onClick={() => console.log('cancel')} className='py-3 px-6 w-[16%]' style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '3px', color: 'rgba(29, 91, 191, 1)' }}>Cancel</button>
            <button onClick={() => console.log('add')} className='text-white py-3 px-6 w-[16%]' style={{ background: 'linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)', borderRadius: '3px' }}>Add Mentees</button>
        </div>
        );
    }

    console.log('addMenteeModal', addMenteeModal)

    return (
        <div className="px-9 my-6 grid">
            <div className='grid mb-10' style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)', borderRadius: '5px' }}>
                <div className='breadcrum'>
                    <nav className="flex px-7 pt-6 pb-5 mx-2 border-b-2 justify-between" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                            <li className="inline-flex items-center">
                                <a href="#" className="inline-flex items-center text-sm font-medium" style={{ color: 'rgba(89, 117, 162, 1)' }}>
                                    Program
                                </a>
                                <svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                                </svg>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <a href="#" className="ms-1 text-sm font-medium" style={{ color: 'rgba(89, 117, 162, 1)' }}>
                                        Planned Program </a>
                                    <svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                                    </svg>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <a href="#" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">
                                        Assign Task to Mentees </a>
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
                                    AssignMenteesFields.map((field, index) => {
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
                                                                    className="w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg h-11 
                                                            focus:border-none focus-visible:border-none focus-visible:outline-none text-[14px] h-[60px]"
                                                                    placeholder={field.placeholder}
                                                                    style={{
                                                                        color: "#232323",
                                                                        borderRadius: '3px'
                                                                    }}
                                                                >
                                                                    <option value="">Select</option>
                                                                    {
                                                                        field.options.map((option, index) => <option value={option.key} key={index}> {option.value} </option>)
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
                                                                        // <Calendar value={date} onChange={(e) => setDate(e.value)} dateFormat="dd/mm/yy" />
                                                                        <>
                                                                            <div className='relative'>
                                                                                <input {...register(field.name, field.inputRules)}
                                                                                    type={'text'}
                                                                                    className="w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg 
                                                                                focus:border-none focus-visible:border-none 
                                                                                focus-visible:outline-none text-[14px] h-[60px]"
                                                                                    placeholder={field.placeholder}
                                                                                    style={{
                                                                                        color: "#232323",
                                                                                        borderRadius: '3px'
                                                                                    }}
                                                                                    aria-invalid={!!errors[field.name]} />
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
                                                                            <div className='flex justify-between'>
                                                                                <div className='input-bg h-[60px] w-[86%] mt-2 flex items-center 
                                                                                         text-[12px] gap-2 cursor-pointer px-6'
                                                                                    style={{ borderRadius: '3px' }}>
                                                                                    <p className='flex items-center gap-1'>
                                                                                        <p className='flex items-center px-3 py-3' style={{
                                                                                            background: 'rgba(223, 237, 255, 1)', borderRadius: '50%',

                                                                                        }}></p>
                                                                                        John Doe
                                                                                    </p>
                                                                                    <p className='flex items-center gap-1'>
                                                                                        <p className='flex items-center px-3 py-3' style={{
                                                                                            background: 'rgba(223, 237, 255, 1)', borderRadius: '50%',

                                                                                        }}></p>
                                                                                        John Doe
                                                                                    </p>
                                                                                    <p className='flex items-center gap-1'>
                                                                                        <p className='flex items-center px-3 py-3' style={{
                                                                                            background: 'rgba(223, 237, 255, 1)', borderRadius: '50%',

                                                                                        }}></p>
                                                                                        John Doe
                                                                                    </p>
                                                                                    <p className='flex items-center gap-1'>
                                                                                        <p className='flex items-center px-3 py-3' style={{
                                                                                            background: 'rgba(223, 237, 255, 1)', borderRadius: '50%',

                                                                                        }}></p>
                                                                                        John Doe
                                                                                    </p>
                                                                                    <p className='flex items-center gap-1'>
                                                                                        <p className='flex items-center px-3 py-3' style={{
                                                                                            background: 'rgba(223, 237, 255, 1)', borderRadius: '50%',

                                                                                        }}></p>
                                                                                        John Doe
                                                                                    </p>
                                                                                    <p className='flex items-center gap-1'>
                                                                                        <p className='text-white flex items-center px-2 py-1' style={{
                                                                                            background: 'rgb(29, 91, 191)', borderRadius: '50%',

                                                                                        }}>15</p>
                                                                                        Others</p>
                                                                                </div>
                                                                                <button type='button' className='h-[60px] mt-2 w-[13%] text-[14px]'
                                                                                    style={{ border: '1px dotted rgba(29, 91, 191, 1)' }}
                                                                                    onClick={handleAddMentee}>
                                                                                    Add Mentees
                                                                                </button>
                                                                            </div>
                                                                            :
                                                                            field.type === 'editor' ?
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
                                <Button btnType="button" onClick={() => setTaskSuccess(true)} btnName='Create Task from Mentees' btnCategory="primary" />
                            </div>
                        </form>
                        <MuiModal modalSize='lg' modalOpen={addMenteeModal} title="Select Mentees" modalClose={() => setMentalModal(false)}>
                            <DataTable rows={assignMenteeRows} columns={assignMenteeColumns} footerAction={footerAction} footerComponent={CustomFooterStatusComponent} />
                        </MuiModal>

                        <MuiModal modalOpen={taskSuccess} modalClose={() => setTaskSuccess(false)} noheader>
                            <div className='px-5 py-1 flex justify-center items-center'>
                                <div className='flex justify-center items-center flex-col gap-5 py-10 px-20 mt-20 mb-20'
                                    style={{ background: 'linear-gradient(101.69deg, #1D5BBF -94.42%, #00AEBD 107.97%)', borderRadius: '10px' }}>
                                    <img src={SuccessTik} alt="SuccessTik" />
                                    <p className='text-white text-[12px]'>Successfully Assign to task from Mentees</p>
                                </div>

                            </div>
                        </MuiModal>
                    </div>
                </div>
            </div>


        </div >
    )

}
