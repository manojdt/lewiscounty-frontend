import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Calendar } from 'primereact/calendar';

import { Button } from '../../../shared';

import CalendarIcon from '../../../assets/images/calender_1x.png'
import HTMLIcon from '../../../assets/images/html1x.png'
import LocationIcon from '../../../assets/images/Location1x.png'
import PlusIcon from '../../../assets/images/plus_temp.png'


import "primereact/resources/themes/lara-light-cyan/theme.css";

const ProgramSteps = ({ stepFields, currentStep, handleNextStep, handlePreviousStep, currentStepData, stepData, handleAction, totalSteps }) => {
    const navigate = useNavigate();
    const [dateFormat, setDateFormat] = useState({})
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset, 
    } = useForm();

    const onSubmit = (data) => {
        handleNextStep(data)
        console.log(data)
        reset()
    }

    useEffect(() => {
        if (currentStepData !== undefined && Object.keys(currentStepData).length) {
            reset(currentStepData)
        }
    }, [])

    useEffect(() => {
        const fName = [];
        const f = {}
        stepFields.forEach(step => fName.push(step.name))
        for (const field in stepData) {
            if(fName.includes(field)) f[field] = stepData[field]
        }
        reset(f)
    }, [stepFields, stepData])

    console.log('currentStepData', currentStepData)

    return (
        <>
            <div className="py-9">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-wrap gap-4">
                        {
                            stepFields.map((field, index) => {
                                const dateField = field.type === 'date' ? register(field.name, field.inputRules) : undefined
                                console.log('dateField', dateField)
                                return (
                                    <div className={`relative mb-6 ${field.width}`} key={index}>
                                        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor={field.label}>
                                            {field.label}
                                        </label>
                                        {
                                            field.type === 'input' ?
                                                <div className='relative'>
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
                                                    {
                                                        field.icon && field.icon === 'location' &&
                                                        <img className='absolute top-4 right-4' src={LocationIcon} alt="LocationIcon" />
                                                    }

                                                    {
                                                        field.icon && field.icon === 'add' &&
                                                        <img className='absolute top-4 right-4 cursor-pointer' onClick={() => handleAction(field.name)} src={PlusIcon} alt="PlusIcon" />
                                                    }

                                                    {errors[field.name] && (
                                                        <p className="error" role="alert">
                                                            {errors[field.name].message}
                                                        </p>
                                                    )}
                                                </div>
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

                                                                <div className='relative'>
                                                                    {/* <Calendar value={date} onChange={(e) => setDate(e.value)} showTime hourFormat="12" /> */}
                                                                    <Calendar
                                                                        className='calendar-control'
                                                                        {...register(field.name, field.inputRules)}
                                                                        value={dateFormat[field.name]}
                                                                        onChange={(e) => {
                                                                            console.log('dateField123', dateField)
                                                                            dateField.onChange(e)
                                                                            setDateFormat({ ...dateFormat, [field.name]: e.value })
                                                                        }}
                                                                        showTime
                                                                        hourFormat="12"
                                                                        dateFormat="dd/mm/yy"
                                                                    />
                                                                    <img className='absolute top-5 right-2' src={CalendarIcon} alt="CalendarIcon" />
                                                                    {/* <div className='relative'>
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
                                                                    </div> */}
                                                                    {errors[field.name] && (
                                                                        <p className="error" role="alert">
                                                                            {errors[field.name].message}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                :
                                                                field.type === 'htmlbuilder' ?
                                                                    <div className='input-bg h-[282px] mt-6 flex items-center justify-center text-[12px] flex-col gap-2 cursor-pointer' style={{ borderRadius: '3px' }}>
                                                                        <img src={HTMLIcon} alt="HTMLIcon" />
                                                                        <span >{field.text}</span>
                                                                    </div>
                                                                    :
                                                                    field.type === 'file' ?
                                                                        <div className="flex items-center justify-center w-full">
                                                                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                                                    </svg>
                                                                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">
                                                                                        Add Logo/Image</span>
                                                                                    </p>
                                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                                        (200*200 Pixels)
                                                                                    </p>
                                                                                </div>
                                                                                <input id="dropzone-file" type="file" {...register(field.name, field.inputRules)} className="hidden" />
                                                                            </label>
                                                                        </div>
                                                                        :
                                                                        null
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="flex gap-6 justify-center align-middle">
                        {currentStep === 1 && <Button btnName='Cancel' btnCategory="secondary" onClick={() => navigate('/programs')} />}
                        {currentStep > 1 && <Button btnName='Back' btnCategory="secondary" onClick={handlePreviousStep} />}
                        <Button btnType="submit" btnName={currentStep === totalSteps ? 'Submit' : 'Next'} btnCategory="primary" />
                    </div>
                </form>
            </div>
        </>
    )
}

export default ProgramSteps;