import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Calendar } from 'primereact/calendar';
import { Button } from '../../shared';
import { useForm } from "react-hook-form";
import CalendarIcon from '../../assets/images/calender_1x.png'

const StepComponenRender = ({ stepFields, currentStep, handleNextStep, handlePreviousStep, stepData, stepName,refForm, totalSteps }) => {
    const navigate = useNavigate();
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        getValues,
    } = useForm();

    const [dateFormat, setDateFormat] = useState({})
    const [checkBoxValue, setCheckBoxValue] = useState('')

    const onSubmit = (data) => {
        handleNextStep(data)
        reset()
    }

    const previousStep = () => {
        const { first_name, email, ...rest } = getValues()
        handlePreviousStep(rest)
    }

    const handleCheckbox = (e) => {
        const value = e.target.value;
        if (value === true) {
            register('mentor_exp_desc', {
                required: "This field is required",
            })
        } else {
            register('mentor_exp_desc', {
                required: false,
            })
        }
        setCheckBoxValue(e.target.value)
    }

    const handleRadioBox = (e) => {
        const value = e.target.value;
        if (value === 'true') {
            register('mentor_exp_desc', {
                required: "This field is required",
            })
        } else {
            register('mentor_exp_desc', {
                required: false,
            })
        }
        setCheckBoxValue(e.target.value)
    }

    useEffect(() => {
        const fName = [];
        const f = {}
        stepFields.forEach(step => fName.push(step.name))
        for (const field in stepData) {
            if (fName.includes(field)) f[field] = stepData[field]
        }
        reset(f)
    }, [stepFields, stepData])


    return (
        <>
            <div className="form-container">
                <form ref={refForm} onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-wrap gap-4">
                        {
                            stepFields.map((field, index) => {
                                const checkbox = field.type === 'checkbox' ? register(field.name, field.inputRules) : undefined
                                const radiobox = field.type === 'radio' ? register(field.name, field.inputRules) : undefined
                                const dateField = field.type === 'date' ? register(field.name, field.inputRules) : undefined
                                return (
                                    <div className={`relative mb-6 ${field.size ? 'width-49' : 'w-full'}`} key={index}>
                                        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor={field.label}>
                                            {field.label} <span style={{color: 'red'}}>{field?.inputRules?.required ? '*' : ''}</span>
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
                                                        }}
                                                        disabled={field.disable ? field.disable : false}
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
                                                                borderRight: '16px solid transparent'
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
                                                    field.type === 'date' ?

                                                        <div className='relative'>
                                                            <Calendar
                                                                className='calendar-control input-bg'
                                                                {...dateField}
                                                                value={dateFormat[field.name]}
                                                                onChange={(e) => {
                                                                    dateField.onChange(e)
                                                                    setDateFormat({ ...dateFormat, [field.name]: e.value })
                                                                }}

                                                                hourFormat="12"
                                                                dateFormat="dd/mm/yy"
                                                            />
                                                            <img className='absolute top-5 right-2' src={CalendarIcon} alt="CalendarIcon" />
                                                            {errors[field.name] && (
                                                                <p className="error" role="alert">
                                                                    {errors[field.name].message}
                                                                </p>
                                                            )}
                                                        </div>
                                                        :

                                                        field.type === 'textbox' ?
                                                            <textarea id="message" rows="4" className="block p-2.5 input-bg w-full text-sm text-gray-900  rounded-lg border
                                                                   focus:visible:outline-none focus:visible:border-none" placeholder="Write your thoughts here..."
                                                                {...register(field.name, field.inputRules)}></textarea>
                                                            :
                                                            field.type === 'radio' ?
                                                                <>
                                                                    <div className="flex items-center me-4">
                                                                        {
                                                                            field.options.map((option, index) => {
                                                                                return (
                                                                                    <div className="flex items-center me-4" key={index}>
                                                                                        <input type="radio" className="w-4 h-4 text-blue-600 bg-gray-100
                                                                                    border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 
                                                                                    dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700
                                                                                    dark:border-gray-600"
                                                                                            {...radiobox}
                                                                                            onChange={e => {
                                                                                                radiobox.onChange(e);
                                                                                                handleRadioBox(e);
                                                                                            }}
                                                                                            value={option.key}
                                                                                        />
                                                                                        <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{option.value}</label>
                                                                                    </div>
                                                                                )
                                                                            }
                                                                            )
                                                                        }


                                                                    </div>
                                                                    {errors[field.name] && (
                                                                        <p className="error" role="alert">
                                                                            {errors[field.name].message}
                                                                        </p>
                                                                    )}
                                                                </>
                                                                :
                                                                field.type === 'checkbox' ?
                                                                    <>
                                                                        <div className="flex items-center me-4">
                                                                            {
                                                                                field.options.map((option, index) => {
                                                                                    return (
                                                                                        <div className="flex items-center me-4" key={index}>
                                                                                            <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100
                                                                                    border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 
                                                                                    dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700
                                                                                    dark:border-gray-600"
                                                                                                {...checkbox}
                                                                                                onChange={e => {
                                                                                                    checkbox.onChange(e);
                                                                                                    handleCheckbox(e);
                                                                                                }}
                                                                                                value={option.key}
                                                                                                checked={checkBoxValue === option.key}
                                                                                            />
                                                                                            <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{option.value}</label>
                                                                                        </div>
                                                                                    )
                                                                                }
                                                                                )
                                                                            }


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
                    <div className="flex gap-6 justify-center align-middle">
                        {currentStep === 1 && <Button btnName='Cancel' btnCategory="secondary" onClick={() => navigate('/login-type')} />}
                        {currentStep > 1 && <Button btnName='Back' btnCategory="secondary" onClick={previousStep} />}
                        <Button btnType="submit" btnCls="w-[100px]" btnName={currentStep === totalSteps ? 'Submit' : 'Next'} btnCategory="primary" />
                    </div>
                </form>
            </div>
        </>
    )
}

export default StepComponenRender;