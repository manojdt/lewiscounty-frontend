import React from 'react'
import { useNavigate } from "react-router-dom";
import { Button } from '../../shared';
import { useForm } from "react-hook-form";

const StepComponenRender = ({ fields, currentStep, handleNextStep, handlePreviousStep, stepData }) => {
    const navigate = useNavigate();
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm();

    const onSubmit = (data) => {
        handleNextStep(data)
        console.log(data)
        reset()
    }

    return (
        <>
            <div className="form-container">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-wrap gap-4">
                        {
                            fields.map((field, index) => {
                                return (
                                    <div className={`relative mb-6 ${field.size ? 'width-49' : 'w-full'}`} key={index}>
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
                                                        <textarea id="message" rows="4" className="block p-2.5 input-bg w-full text-sm text-gray-900  rounded-lg border
                                                                   focus:visible:outline-none focus:visible:border-none" placeholder="Write your thoughts here..."
                                                            {...register(field.name, field.inputRules)}></textarea>
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
                                                            null
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="flex gap-6 justify-center align-middle">
                        {currentStep === 1 && <Button btnName='Cancel' btnCategory="secondary" onClick={() => navigate('/login-type')} />}
                        {currentStep > 1 && <Button btnName='Back' btnCategory="secondary" onClick={handlePreviousStep} />}
                        <Button btnType="submit" btnName='Next' btnCategory="primary" />
                    </div>
                </form>
            </div>
        </>
    )
}

export default StepComponenRender;