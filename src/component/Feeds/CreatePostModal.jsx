import React, { useEffect } from 'react'
import MuiModal from '../../shared/Modal'
import Tooltip from '../../shared/Tooltip'
import UserIcon from '../../assets/images/user.jpg'
import CancelIcon from '../../assets/images/cancel-colour1x.png'
import ArrowDown from '../../assets/icons/arrowDownDark.svg'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'

export default function CreatePostModal({ formData, open, handleClose, handleVisibilty, handlePostData }) {
    const { data } = useSelector(state => state.userInfo)
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm();

    useEffect(() => {
        reset()
    }, [])

    const onSubmit = (data) => {
        handlePostData(data)
    }


    return (
        <MuiModal modalOpen={open} modalClose={handleClose} noheader>
            <div className="title flex justify-between py-3 px-4 border-b-2 items-center">
                <div className="flex gap-4 create-post cursor-pointer" onClick={handleVisibilty}>
                    <img className='user-image' src={UserIcon} alt="UserIcon" />
                    <div>
                        <div className='flex gap-3 items-center'>
                            <p>{data?.first_name}{' '}{data?.last_name}</p>
                            <img className='pt-1' src={ArrowDown} alt="ArrowDown" />
                        </div>
                        <p className='text-[12px]'>{formData.visibility === 'anyone' ? 'Anyone' : formData.visibility === 'connections' ? 'Connection' : ''} </p>
                    </div>
                </div>
                <div className="flex gap-20 items-center">
                    <Tooltip title="Cancel">
                        <img className='cursor-pointer' onClick={handleClose} src={CancelIcon} alt="CancelIcon" />
                    </Tooltip>
                </div>
            </div>


            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='py-3'>
                    <textarea {...register('content', { required: "This field is required" })}
                        id="message" rows="4" className={`block p-2.5 input-bg w-full text-sm text-gray-900  border
                                                                   focus-visible:outline-none focus-visible:border-none`}
                        placeholder={'What do you want to talk  about?'}
                    ></textarea>
                </div>
                {errors['content'] && (
                    <p className="error" role="alert">
                        {errors['content'].message}
                    </p>
                )}

                <div className='flex justify-end gap-5 items-center pt-5 pb-10'>

                    <button
                        type='submit'
                        className='text-white py-2 px-7 w-[20%]'
                        style={{ background: 'linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)', borderRadius: '3px' }}>
                        Post
                    </button>
                </div>
            </form>

        </MuiModal>

    )
}
