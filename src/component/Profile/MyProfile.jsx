import React, { useEffect, useState } from 'react'
import { Button } from '../../shared'
import { useNavigate } from 'react-router-dom'

import SuccessTik from '../../assets/images/blue_tik1x.png';
import ProfileImageIcon from '../../assets/icons/profile-image-icon.svg'
import ProfileImagePencilIcon from '../../assets/icons/profile-image-pencil-icon.svg'
import { getUserProfile, updateLocalProfileInfo, updateProfile, updateProfileImage } from '../../services/profile'
import { useDispatch, useSelector } from 'react-redux'
import { Backdrop, CircularProgress, Link, Stack } from '@mui/material'
import { useForm } from 'react-hook-form'
import { ProfileFields } from '../../utils/formFields'
import { profileStatus } from '../../utils/constant'

export default function MyProfile() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [editMode, setEditMode] = useState(false)
  const userData = useSelector((state) => state.userInfo);
  const { profile, loading, status } = useSelector(state => state.profileInfo);
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    getValues,
    setValue
  } = useForm();


  const loadUserProfile = () => {
    dispatch(getUserProfile())
  }

  const uploadUserImage = (e) => {
    if (e.target.files && e.target.files[0]) {
      let bodyFormData = new FormData();
      bodyFormData.append('profile_image', e.target.files[0]);
      dispatch(updateProfileImage(bodyFormData)).then(() => loadUserProfile())
    }
  }

  const handleEditMode = (e) => {
    e.preventDefault()
    setEditMode(true)
  }

  const onSubmit = (data) => {
    const apiPayload = {
      phone_number: data.phone_number,
      secondary_phone_number: data.secondary_phone_number,
      location: data.location,
    }
    dispatch(updateProfile(apiPayload))

  }

  useEffect(() => {
    if (Object.keys(profile).length) {
      const name = profile?.name?.split(" ");
      reset({
        first_name: name[0] || '',
        last_name: name[1] || '',
        phone_number: profile?.phone_number,
        secondary_phone_number: profile?.secondary_phone_number || '',
        email: profile?.email,
        location: profile?.location
      });
    }
  }, [profile])

  useEffect(() => {
    loadUserProfile()
  }, [])

  useEffect(() => {
    if (status === profileStatus.update) {
      setTimeout(() => {
        setEditMode(false)
        loadUserProfile()
      }, 3000)
    }
  }, [status])

  return (
    <div className="profile-container">

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />

      </Backdrop>



      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={status === profileStatus.update}
      >
        <div className='px-5 py-1 flex justify-center items-center'>
          <div className='flex justify-center items-center flex-col gap-[2.25rem] py-[4rem] px-[3rem] mt-20 mb-20'
            style={{ background: '#fff', borderRadius: '10px' }}>
            <img src={SuccessTik} alt="SuccessTik" />
            <p className='text-[16px] font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#1D5BBF] to-[#00AEBD]'
              style={{
                fontWeight: 600
              }}
            >Profile updated Successfully</p>
          </div>

        </div>
      </Backdrop>

      <div className='flex justify-between items-center mb-8'>
        <div className='text-color font-medium !text-[20px]' >
          Profile
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='profile-content py-8 px-14' style={{ border: '1px solid rgba(219, 224, 229, 1)', background: 'rgba(255, 255, 255, 1)' }}>
          <div className='flex justify-between items-center mb-8'>
            <div className='text-color font-medium' >
              {/* Profile Picture */}
            </div>
            <div>
              {
                !editMode ?
                  <Button onClick={handleEditMode} btnType="button" btnName="Edit" btnCls={'w-[140px]'} />
                  :
                  <Button btnType="submit" btnName="Save Changes" btnCls={'w-[170px]'} />
              }

            </div>
          </div>

          <div className='py-4 relative w-[12%]'>
            <div className='upload-profile'>
              <label className="w-[40%] pb-3 rounded-lg text-white text-[14px] cursor-pointer" style={{
                border: 'none'
              }}>
                <img src={profile?.image || ProfileImageIcon} style={{ borderRadius: '50%', height: '143px' }} alt="ProfileImageIcon" />
                <img src={ProfileImagePencilIcon} className='absolute top-[50%] left-2 cursor-pointer' alt="ProfileImagePencilIcon" />

                <input type='file' class="hidden" onChange={uploadUserImage} />
              </label>
            </div>


          </div>

          <div className='grid grid-cols-6 gap-3 mt-12'>
            {
              ProfileFields.map((profilefield, index) =>
                <div className='col-span-2' key={index}>
                  <div className='mb-5'>
                    <label className="block tracking-wide  text-xs mb-2" style={{ color: 'rgba(116, 116, 116, 1)' }}>
                      {profilefield.label}{editMode && <span style={{ color: 'red' }}>{profilefield?.inputRules?.required ? '*' : ''}</span>}
                    </label>
                    {
                      editMode ?
                        <>
                          <input {...register(profilefield.name, profilefield.inputRules)}
                            type={profilefield.fieldtype}
                            className="w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg focus:border-none focus-visible:border-none 
                                                                    focus-visible:outline-none text-[14px] h-[60px]"
                            placeholder={profilefield.placeholder}
                            style={{
                              color: "#232323",
                              borderRadius: '3px',

                              paddingLeft: '10px'
                            }}

                            disabled={profilefield.disabled}
                            aria-invalid={!!errors[profilefield.name]}
                          />
                          {errors[profilefield.name] && (
                            <p className="error" role="alert">
                              {errors[profilefield.name].message}
                            </p>
                          )}
                        </>
                        :
                        <p className="text-[14px]">{getValues(profilefield.name)}</p>
                    }


                  </div>
                </div>

              )
            }
          </div>
            <div>
{profile?.documents?.length>0&&
          <Stack>
                      <label
                        className='block tracking-wide  text-xs mb-2'
                        style={{ color: 'rgba(116, 116, 116, 1)' }}
                      >
                        Documents
                      </label>
                    
                        <Stack
                          direction={'row'}
                          alignItems={'center'}
                          spacing={2}
                        >
                          {profile?.documents?.map((doc) => {
                            return (
                              <Link
                                target="_blank"
                                href={doc?.file}
                                variant='body2'
                                className={'text-[18px]'}
                              >
                                {doc?.file_display_name}
                              </Link>
                            );
                          })}
                        </Stack>
                    
                    </Stack>}
            </div>
        </div>
      </form>

    </div>
  )
}
