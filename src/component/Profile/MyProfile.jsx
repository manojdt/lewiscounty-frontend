import React, { useEffect, useState } from 'react'
import { Button } from '../../shared'
import { useNavigate } from 'react-router-dom'


import ProfileEditIcon from '../../assets/icons/profile-edit-icon.svg'
import ProfileImageIcon from '../../assets/icons/profile-image-icon.svg'
import ProfileImagePencilIcon from '../../assets/icons/profile-image-pencil-icon.svg'
import { getUserProfile, updateProfileImage } from '../../services/profile'
import { useDispatch, useSelector } from 'react-redux'
import { Backdrop, CircularProgress } from '@mui/material'
import { useForm } from 'react-hook-form'
import { ProfileFields } from '../../utils/formFields'

export default function MyProfile() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [editMode, setEditMode] = useState(false)
  const userData = useSelector((state) => state.userInfo);
  const { profile, loading } = useSelector(state => state.profileInfo);
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    getValues,
    setValue
  } = useForm();


  const uploadUserImage = (e) => {
    if (e.target.files && e.target.files[0]) {
      let bodyFormData = new FormData();
      bodyFormData.append('profile_image', e.target.files[0]);
      dispatch(updateProfileImage(bodyFormData)).then(() => dispatch(getUserProfile()))
    }
  }

  const handleEditMode = () => {
    setEditMode(true)
    reset({
      
    })
  }

  const onSubmit = (data) => {

  }

  useEffect(() => {
    dispatch(getUserProfile())
  }, [])

  return (
    <div className="profile-container">

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />

      </Backdrop>

      <div className='flex justify-between items-center mb-8'>
        <div className='text-color font-medium' >
          Profile
        </div>
      </div>

      <div className='profile-content py-8 px-14' style={{ border: '1px solid rgba(219, 224, 229, 1)', background: 'rgba(255, 255, 255, 1)' }}>
        <div className='flex justify-between items-center mb-8'>
          <div className='text-color font-medium' >
            Profile Picture
          </div>
          <div>
            {
              !editMode ?
              <Button onClick={handleEditMode} btnName="Edit" btnCls={'w-[140px]'} />
              :
              <Button onClick={handleEditMode} btnName="Save Changes" btnCls={'w-[170px]'} />
            }
           
          </div>
        </div>


        <div className='py-4 relative'>
          <div className='upload-profile'>

            <label className="w-[40%]  pb-3 
                             rounded-lg text-white text-[14px] cursor-pointer" style={{

                border: 'none'
              }}>
              <img src={profile?.image || ProfileImageIcon} style={{ borderRadius: '50%', height: '143px' }} alt="ProfileImageIcon" />
              <img src={ProfileImagePencilIcon} className='absolute top-[50%] left-2 cursor-pointer' alt="ProfileImagePencilIcon" />

              <input type='file' class="hidden" onChange={uploadUserImage} />
            </label>
          </div>


        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid grid-cols-6 mt-12'>
            {
              ProfileFields.map((profilefield, index) =>
                <div className='col-span-2' key={index}>
                  <div className='mb-5'>
                    <label className="block tracking-wide  text-xs mb-2" style={{ color: 'rgba(116, 116, 116, 1)' }}>
                      {profilefield.label}
                    </label>
                    {
                      editMode ?
                        <input {...register(profilefield.name, profilefield.inputRules)}
                          type={profilefield.fieldtype}
                          className="w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg focus:border-none focus-visible:border-none 
                                                                    focus-visible:outline-none text-[14px] h-[60px]"
                          placeholder={profilefield.placeholder}
                          style={{
                            color: "#232323",
                            borderRadius: '3px',

                            paddingLeft: profilefield.name === 'phone_number' ? '76px' : '10px'
                          }}

                          disabled={profilefield.disabled}
                          aria-invalid={!!errors[profilefield.name]}
                        />
                        :
                        <p className="text-[14px]">{userData?.data?.first_name}</p>
                    }


                  </div>
                </div>

              )
            }

            {/* <div className='col-span-2'>
              <div className='mb-5'>
                <label className="block tracking-wide text-gray-700 text-xs mb-2" style={{ color: 'rgba(116, 116, 116, 1)' }}>
                  Last Name
                </label>
                <p className="text-[14px]">{userData?.data?.last_name}</p>
              </div>
            </div>
            <div className='col-span-2'>
              <div className='mb-5'>
                <label className="block tracking-wide text-gray-700 text-xs mb-2" style={{ color: 'rgba(116, 116, 116, 1)' }}>
                  Primary Phone Number
                </label>
                <p className="text-[14px]">{profile?.phone_no}</p>
              </div>
            </div>
            <div className='col-span-2'>
              <div className='mb-5'>
                <label className="block tracking-wide text-gray-700 text-xs mb-2" style={{ color: 'rgba(116, 116, 116, 1)' }}>
                  Secondary Contact Number
                </label>
                <p className="text-[14px]">{profile?.phone_no}</p>
              </div>
            </div>
            <div className='col-span-2'>
              <div className='mb-5'>
                <label className="block tracking-wide text-gray-700 text-xs mb-2" style={{ color: 'rgba(116, 116, 116, 1)' }}>
                  Email
                </label>
                <p className="text-[14px]">{profile?.email}</p>
              </div>
            </div>
            <div className='col-span-2'>
              <div className='mb-5'>
                <label className="block tracking-wide text-gray-700 text-xs mb-2" style={{ color: 'rgba(116, 116, 116, 1)' }}>
                  Address
                </label>
                <p className="text-[14px]">{profile?.location}</p>
              </div>
            </div>
            <div className='col-span-6'>
              <div className='mb-5'>
                <label className="block tracking-wide text-gray-700 text-xs mb-2" style={{ color: 'rgba(116, 116, 116, 1)' }}>
                  Professional Bio
                </label>
                <p className="text-[14px]">{profile?.professional_bio}</p>
              </div>
            </div> */}
          </div>

        </form>


      </div>

    </div>
  )
}
