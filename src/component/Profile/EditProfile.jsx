import React, { useEffect } from 'react'
import UserIcon from '../../assets/icons/MyProfileUser.svg'
import LocationIcon from '../../assets/images/Location1x.png'
import { Button } from '../../shared'
import { useForm } from 'react-hook-form';
import { EditProfileFields } from '../../utils/formFields';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function EditProfile() {
    const navigate = useNavigate()
    const { data } = useSelector(state => state.userInfo)
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        getValues,
        setValue
    } = useForm();

    useEffect(() => {
        if (Object.keys(data).length) {
            reset({
                name: `${data.first_name} ${data.last_name}` || '',
                position: '',
                about_bio: '',
                link: '',
                email: data.email || '',
                phone_number: '',
                location: '',
                address: '',
                logo: ''
            })
        }
    }, [data])

    const onSubmit = (data) => {
        console.log('Submit', data)
    }
    return (
        <div className='edit-profile-container px-9 py-9'>
            <div>
                Edit Profile
            </div>
            <div className='edit-profile-content'>
                <div className="grid grid-cols-8 gap-3">
                    <div className='col-span-2'>
                        <div className='upload-profile'>
                            <img src={UserIcon} alt="UserIcon" />
                            <Button btnName="Upload Profile" btnCls="w-[60%]" />
                        </div>
                    </div>

                    <div className='col-span-6'>
                        <div className='edit-profile-form'>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="flex flex-wrap gap-4">
                                    {
                                        EditProfileFields.map((field, index) => {
                                            return (
                                                <div className={`relative mb-6 ${field.width}`} key={index}>
                                                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor={field.label}>
                                                        {field.label}
                                                    </label>
                                                    {
                                                        field.type === 'input' ?
                                                            <>
                                                                {
                                                                    field.name === 'phone_number' &&

                                                                    <select className='absolute input-bg h-[60px] py-2 px-1'>
                                                                        <option>+91</option>
                                                                        <option>+91</option>
                                                                        <option>+91</option>
                                                                    </select>
                                                                }

                                                                <input {...register(field.name, field.inputRules)}
                                                                    type={field.fieldtype}
                                                                    className="w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg focus:border-none focus-visible:border-none 
                                                                    focus-visible:outline-none text-[14px] h-[60px]"
                                                                    placeholder={field.placeholder}
                                                                    style={{
                                                                        color: "#232323",
                                                                        borderRadius: '3px',

                                                                        paddingLeft: field.name === 'phone_number' ? '76px' : '10px'
                                                                    }}

                                                                    disabled={field.disabled}
                                                                    aria-invalid={!!errors[field.name]}
                                                                />

                                                                {
                                                                    field.icon && field.icon === 'location' &&
                                                                    <img className='absolute top-10 right-4' src={LocationIcon} alt="LocationIcon" />
                                                                }

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
                                                                field.type === 'logo' ?
                                                                    <>
                                                                        <div className="flex items-center space-x-2 relative">
                                                                            <label for="file-upload" className="cursor-pointer input-bg h-[60px] w-full">
                                                                                <div className='absolute cursor-pointer right-0 h-[60px] w-[150px] flex justify-center items-center' style={{ background: '#18283D', color: '#fff' }}>Upload logo</div>
                                                                                <input id="file-upload" type="file" className="sr-only" />
                                                                            </label>
                                                                            {errors[field.name] && (
                                                                                <p className="error" role="alert">
                                                                                    {errors[field.name].message}
                                                                                </p>
                                                                            )}
                                                                        </div>

                                                                    </>

                                                                    :
                                                                    null
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div className="flex gap-6 justify-center align-middle py-6">
                                    <Button btnName='Cancel' btnCls="w-[16%]" btnCategory="secondary" onClick={() => navigate('/my-profile')} />
                                    <Button btnType="submit" btnCls="w-[16%]" btnName='Update Profile' btnCategory="primary" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
