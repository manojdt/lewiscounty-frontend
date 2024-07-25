import React, { useEffect, useState } from 'react'
import CancelIcon from '../../assets/images/cancel1x.png'
import CalendarIcon from '../../assets/images/calender_1x.png'
import MuiModal from '../../shared/Modal';
import { useForm } from 'react-hook-form';
import { Calendar } from 'primereact/calendar';
import { Button } from '../../shared';
import { useDispatch, useSelector } from 'react-redux';
import { createGoal } from '../../services/goalsInfo';


export default function CreateGoal({ open, handleCloseModal }) {
    const [dateFormat, setDateFormat] = useState({})
    const dispatch = useDispatch()


    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm();

    const onSubmit = (data) => {
        console.log(data)   
        const apiData = {
            ...data,
            start_date :  new Date(data.start_date).toISOString().split('T')[0],
            period : parseInt(data.period)
        }
        console.log('ap', apiData)
        dispatch(createGoal(data))
        // reset()
    }

    const handleClose = () => {
        handleCloseModal()
    }

    useEffect(() => {

    },[])


    console.log('errors', errors)


    const dateField = register('start_date', { required: "This field is required" })
    return (
        <div>

            <MuiModal modalSize='lg' modalOpen={open} modalClose={handleClose} noheader>
                <div className='px-5 py-5'>
                    <div className='flex justify-center flex-col gap-5  mt-4 mb-4'
                        style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '10px', }}>
                        <div className='flex justify-between px-3 py-4 items-center' style={{ borderBottom: '1px solid rgba(29, 91, 191, 1)' }}>
                            <p className='text-[18px]' style={{ color: 'rgba(0, 0, 0, 1)' }}>Create Goal </p>
                            <img className='cursor-pointer' onClick={handleClose} src={CancelIcon} alt="CancelIcon" />
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className='px-5'>
                                <div className='relative pb-8'>
                                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                                        Create New Goal
                                    </label>

                                    <div className='relative'>
                                        <input
                                            {...register('goal_name', {
                                                required: "This field is required",
                                            })}
                                            type="text"
                                            className="w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg focus:border-none focus-visible:border-none 
                                                            focus-visible:outline-none text-[14px] h-[60px]"
                                            placeholder={''}
                                            style={{
                                                color: "#232323",
                                                borderRadius: '3px'
                                            }}
                                        />
                                    </div>
                                    {errors['goal_name'] && (
                                        <p className="error" role="alert">
                                            {errors['goal_name'].message}
                                        </p>
                                    )}
                                </div>

                                <div className='relative pb-8'>
                                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                                        Goal Designation
                                    </label>

                                    <div className='relative'>
                                        <input
                                            {...register('goal_designation', { required: "This field is required" })}
                                            type="text"
                                            className="w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg focus:border-none focus-visible:border-none 
                                                            focus-visible:outline-none text-[14px] h-[60px]"
                                            placeholder={''}
                                            style={{
                                                color: "#232323",
                                                borderRadius: '3px'
                                            }}
                                        />
                                    </div>
                                    {errors['goal_designation'] && (
                                        <p className="error" role="alert">
                                            {errors['goal_designation'].message}
                                        </p>
                                    )}
                                </div>


                                <div className='relative pb-8'>
                                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                                        Start Date
                                    </label>
                                    <div className='relative'>
                                        <Calendar
                                            className='calendar-control input-bg'
                                            {...dateField}
                                            value={dateFormat['start_date']}
                                            onChange={(e) => {
                                                // console.log('dateField123', dateField)
                                                dateField.onChange(e)
                                                setDateFormat({ ...dateFormat, start_date: e.value })
                                            }}

                                            hourFormat="12"
                                            dateFormat="dd/mm/yy"
                                        />
                                        <img className='absolute top-5 right-2' src={CalendarIcon} alt="CalendarIcon" />
                                    </div>
                                    {errors['start_date'] && (
                                        <p className="error" role="alert">
                                            {errors['start_date'].message}
                                        </p>
                                    )}
                                </div>


                                <div className='relative pb-8'>
                                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                                        Period
                                    </label>

                                    <div className='relative'>
                                        <>
                                            <select
                                                {...register('period', { required: "This field is required" })}
                                                className="w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg h-11 
                                                            focus:border-none focus-visible:border-none focus-visible:outline-none text-[14px] h-[60px]"
                                                placeholder={'Select Period'}
                                                style={{
                                                    color: "#232323",
                                                    borderRight: '16px solid transparent'
                                                }}
                                            >
                                                <option value="">Select</option>
                                                <option value="1">Period 1</option>
                                                <option value="2">Period 2</option>

                                            </select>
                                            {errors['period'] && (
                                                <p className="error" role="alert">
                                                    {errors['period'].message}
                                                </p>
                                            )}
                                        </>
                                    </div>
                                </div>



                                <div className='relative pb-8'>
                                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                                        Goals Description
                                    </label>

                                    <div className='relative'>
                                        <textarea {...register('goals_desc', { required: "This field is required" })}
                                            id="message" rows="4" className={`block p-2.5 input-bg w-full text-sm text-gray-900  border
                                                                   focus-visible:outline-none focus-visible:border-none`}
                                            placeholder={''}
                                        ></textarea>
                                        {errors['goals_desc'] && (
                                            <p className="error" role="alert">
                                                {errors['goals_desc'].message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className='flex justify-center gap-5 items-center pt-5 pb-10'>
                                    <Button btnName='Cancel' btnCls="w-[18%]" btnCategory="secondary" onClick={handleClose} />
                                    <button
                                        type='submit'
                                        className='text-white py-3 px-7 w-[18%]'
                                        style={{ background: 'linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)', borderRadius: '3px' }}>Create</button>
                                </div>

                            </div>
                        </form>

                    </div>

                </div>
            </MuiModal>
        </div>
    )
}
