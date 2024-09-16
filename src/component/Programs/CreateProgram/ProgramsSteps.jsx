import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Calendar } from 'primereact/calendar';

import { Button } from '../../../shared';

import CalendarIcon from '../../../assets/images/calender_1x.png'
import HTMLIcon from '../../../assets/images/html1x.png'
import LocationIcon from '../../../assets/images/Location1x.png'
import PlusIcon from '../../../assets/images/plus_temp.png'
import UploadIcon from "../../../assets/images/image_1x.png"
import DeleteIcon from "../../../assets/images/delete_1x.png"


import "primereact/resources/themes/lara-light-cyan/theme.css";
import Tooltip from '../../../shared/Tooltip';


const ProgramSteps = ({ stepFields, currentStep, handleNextStep, handlePreviousStep, currentStepData, stepData, handleAction, totalSteps, fetchCategoryData }) => {
    const navigate = useNavigate();
    const [dateFormat, setDateFormat] = useState({})
    const [formData, setFormData] = useState({})
    const [logoImage, setLogoImage] = useState('')
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        getFieldState,
        getValues,
        setError,
        setValue
    } = useForm();

    const fieldState = getValues("planned_start_date")

    const onSubmit = (data) => {
        console.log('Form Submit', data)
        const stData = { ...formData, [currentStep]: { ...formData[currentStep], ...data } }
        setFormData(stData)
        handleNextStep(data, stData)
        // console.log(data)
        reset()
    }

    // useEffect(() => {
    //     console.log('State Data', fieldState)
    // },[fieldState])

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
            if (fName.includes(field)) f[field] = stepData[field]
        }
        console.log('f', f)
        // console.log('fName', fName)
        // console.log('stepFields', stepFields)
        // console.log('stepData', stepData)
        console.log('getvalues', getValues())
        // console.log('f', f)
        // if(Object.keys(f).length !== 1) reset(f)

        if (currentStep === 1) {
            f.start_date = dateFormat.start_date
            f.end_date = dateFormat.end_date
        }
        const p = { ...getValues(), ...f }

        console.log('TTTTTTT', p)
        // if (f.hasOwnProperty('learning_materials')) {
        //     reset(p)
        // } else {




        reset(f)
        // }
    }, [stepFields])

    console.log('formData', formData)


    function getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height
        };
    }

    // console.log('currentStepData', currentStepData)

    // console.log('stepFields', stepFields)


    const handleDeleteImage = () => {
        setValue('image', '')
        setLogoImage('')
    }
    // console.log('stepData steps', stepData)

    console.log('Images', getValues('image'))

    return (
        <>
            <div className="py-9">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-wrap gap-4">
                        {
                            stepFields.map((field, index) => {
                                const dateField = field.type === 'date' ? register(field.name, field.inputRules) : undefined
                                const imageField = field.type === 'file' ? register(field.name, field.inputRules) : undefined
                                const dropdownimageField = field.type === 'dropdown' ? register(field.name, field.inputRules) : undefined
                                // console.log('dateField', dateField)
                                return (
                                    <div className={`relative mb-6  ${getWindowDimensions().width <= 1536 && field.width === 'width-82' ? 'w-[81%]' : field.width}`} key={index}>
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

                                                        <Tooltip title={field.placeholder}>
                                                            <img className='absolute cursor-pointer top-4 right-4' onClick={() => handleAction(field.name)}
                                                                src={PlusIcon} alt="PlusIcon" />
                                                        </Tooltip>

                                                    }

                                                    {errors[field.name] && (
                                                        <p className="error" role="alert">
                                                            {errors[field.name].message}
                                                        </p>
                                                    )}
                                                </div>
                                                :
                                                field.type === 'popup-input' ?
                                                    <div className='relative'>
                                                        <div className='input-bg h-[60px] w-full mt-2 flex items-center 
                                                                                         text-[12px] gap-2 cursor-pointer px-6'
                                                            style={{ borderRadius: '3px' }}
                                                            onClick={() => handleAction(field.name)}
                                                            >

                                                            {
                                                                field?.value && field.value.slice(0, 6).map((popupfield, index) => {
                                                                    return (

                                                                        <>
                                                                            <p className='flex items-center gap-1'>
                                                                                <p className='flex items-center px-3 py-3' style={{
                                                                                    background: 'rgba(223, 237, 255, 1)', borderRadius: '50%',

                                                                                }}></p>
                                                                                {
                                                                                    popupfield.name ||

                                                                                    `${popupfield.first_name} ${popupfield.last_name}`
                                                                                    ||

                                                                                     `${popupfield.full_name}`
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
                                                        {
                                                            field.icon && field.icon === 'add' &&
                                                            <Tooltip title={field.placeholder}>
                                                                <img className='absolute top-4 right-4 cursor-pointer' 
                                                                    onClick={() => handleAction(field.name)} src={PlusIcon} alt="PlusIcon" />
                                                            </Tooltip>
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
                                                                // {...register(field.name, field.inputRules)}
                                                                {...dropdownimageField}
                                                                className="w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg 
                                                            focus:border-none focus-visible:border-none focus-visible:outline-none text-[14px] h-[60px]"
                                                                placeholder={field.placeholder}
                                                                style={{
                                                                    color: "#232323",
                                                                    borderRadius: '3px',
                                                                    borderRight: '16px solid transparent'
                                                                }}
                                                                onChange={(e) => {
                                                                    // console.log('dateField123', dateField)
                                                                    dropdownimageField.onChange(e)
                                                                    if (field.name === 'category') fetchCategoryData(e.target.value)
                                                                }}
                                                            >
                                                                <option value="">Select</option>
                                                                {
                                                                    field.options.map((option, index) => <option value={option.key || option.id} key={index}> {option.value || option.name} </option>)
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
                                                                <textarea id="message" rows="4" className={`block p-2.5 input-bg w-full text-sm text-gray-900  border
                                                                   focus-visible:outline-none focus-visible:border-none ${field.width === 'width-82' ? 'h-[282px]' : ''}`}
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
                                                                            className='calendar-control input-bg'
                                                                            {...dateField}
                                                                            value={dateFormat[field.name]}
                                                                            onChange={(e) => {
                                                                                // console.log('dateField123', dateField)
                                                                                dateField.onChange(e)
                                                                                setDateFormat({ ...dateFormat, [field.name]: e.value })
                                                                            }}
                                                                            {...field.name === 'start_date' ? { minDate : new Date()} : {}}
                                                                            {...field.name === 'end_date' ? { minDate : getValues('start_date')} : {}}
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
                                                                            <>
                                                                                <div className="flex items-center justify-center w-full">
                                                                                    <label htmlFor="dropzone-file"
                                                                                        className="flex flex-col items-center justify-center w-full h-64 border-2
                                                                                 border-gray-300 border-dashed cursor-pointer
                                                                                  bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100
                                                                                   dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
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
                                                                                        <input id="dropzone-file" type="file" {...imageField}

                                                                                            onChange={(e) => {
                                                                                                imageField.onChange(e);
                                                                                                console.log(e)
                                                                                                if (e.target.files && e.target.files[0]) {
                                                                                                    console.log(e.target.files[0])
                                                                                                    let types = ['image/png', 'image/jpeg']
                                                                                                    console.log(e.target.files[0].type)
                                                                                                    if (types.includes(e.target.files[0].type)) {
                                                                                                        setLogoImage(URL.createObjectURL(e.target.files[0]));
                                                                                                    } else {
                                                                                                        setError([field.name], 'Invalid file type')
                                                                                                    }
                                                                                                }
                                                                                            }}
                                                                                            className="hidden" />
                                                                                    </label>

                                                                                </div>
                                                                                {logoImage !== '' &&
                                                                                    <>
                                                                                        <div className='text-[14px] pt-5' style={{ color: 'rgba(0, 0, 0, 1)' }}>Uploaded Image</div>

                                                                                        <div className='flex justify-between items-center w-[30%] mt-5 px-4 py-4'
                                                                                            style={{ border: '1px solid rgba(29, 91, 191, 0.5)', borderRadius: '3px' }}>
                                                                                            <div className='flex w-[80%] gap-3 items-center'>
                                                                                                <img src={UploadIcon} alt="altlogo" />
                                                                                                <span className='text-[12px]'> {getValues('image') && getValues('image')[0]?.name}</span>
                                                                                            </div>
                                                                                            <img className='w-[30px] cursor-pointer' onClick={handleDeleteImage} src={DeleteIcon} alt="DeleteIcon" />
                                                                                        </div>

                                                                                        {/* <img src={logoImage} alt="altlogo" /> */}

                                                                                    </>
                                                                                }
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
                    <div className="flex gap-6 justify-center align-middle">
                        {currentStep === 1 && <Button btnName='Cancel' btnCategory="secondary" onClick={() => navigate('/programs')} />}
                        {currentStep > 1 && <Button btnName='Back' btnCategory="secondary" onClick={handlePreviousStep} />}
                        <Button btnType="button" btnStyle={{background:'rgba(197, 197, 197, 1)', color: '#000'}} btnCls="w-[150px]" btnName={'Save as Draft'} btnCategory="primary" />
                        <Button btnType="submit" btnCls="w-[100px]" btnName={currentStep === totalSteps ? 'Submit' : 'Next'} btnCategory="primary" />
                    </div>
                </form>
            </div>
        </>
    )
}

export default ProgramSteps;