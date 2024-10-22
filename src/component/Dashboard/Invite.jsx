import React, { useEffect, useState } from 'react'
import { Button } from '../../shared';
import InviteFriendsIcon from '../../assets/icons/Invite-friends.svg'
import LinkIcon from '../../assets/images/link1x.png';
import LinkedInIcon from '../../assets/images/linked-in1x.png';
import InstagramIcon from '../../assets/images/instagram_1x.png';
import SuccessTik from '../../assets/images/blue_tik1x.png';
import FacebookOutlineIcon from '../../assets/images/facebook-outline1x.png';
import TwitterIcon from '../..//assets/images/twitter1x.png';
import MuiModal from '../../shared/Modal';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import { Backdrop, CircularProgress } from '@mui/material';

export default function Invite() {
    const [inviteModal, setInviteModal] = useState({ open: false, loading: false, success: false })

    const handleCloseInviteModal = () => {
        setInviteModal({ open: false, loading: false, success: false })
    }

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm();

    const onSubmit = async (data) => {
        const email = data.recipients.split(',');
        const payload = {
            "link": process.env.REACT_APP_SITE_URL,
            "share_type": "mail",
            "recipients": email
        }
        setInviteModal({ ...inviteModal, loading: true })
        const invitePeople = await api.post("invite/invite", payload);
        if (invitePeople.status === 200) {
            reset()
            setInviteModal({ ...inviteModal, open: false, loading: false, success: true })
        }
    }

    useEffect(() => {
        if (inviteModal.success) {
            setTimeout(() => {
                handleCloseInviteModal()
            }, 3000)

        }
    }, [inviteModal.success])

    return (
        <div className="pb-3" style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
            <div className="flex py-6 px-6 justify-evenly gap-4">
                <div className="flex h-[50px] text-center px-4" style={{ background: 'rgba(238, 245, 255, 1)' }}>
                    <img src={InviteFriendsIcon} alt="user icon" />
                </div>

                <div>
                    <p className="text-sm">Invite to your friends</p>
                    <p className="text-sm">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                </div>
            </div>
            <div className="text-center">
                <Button btnCls="!px-12 !py-3" btnName='Invite' btnCategory="primary" onClick={() => setInviteModal({...inviteModal, open: true})} />
            </div>

            <Backdrop
                sx={{ zIndex: (theme) => 999999 }}
                open={inviteModal.loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>


            <MuiModal modalOpen={inviteModal.open} modalClose={handleCloseInviteModal} noheader>
                <div className='px-5 py-1 flex justify-center items-center' style={{ border: '1px solid rgba(29, 91, 191, 1)' }}>
                    <div className='flex justify-center items-center flex-col gap-8 py-10 px-20 mt-5'
                    >
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex flex-wrap gap-4">

                                <div className={`relative mb-6 w-[48%]`} >
                                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                                        URL
                                    </label>

                                    <div className='relative input-bg'>
                                        <input className='input-bg text-[12px] h-[60px] w-[396px] px-5' style={{ borderRadius: '27px' }}
                                            value={process.env.REACT_APP_SITE_URL} />
                                    </div>
                                </div>


                                <div className={`relative mb-6 w-full`} >
                                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                        Invite Recipients
                                    </label>
                                    <textarea id="message" rows="4" className={`block p-2.5 input-bg w-full text-sm text-gray-900  rounded-lg border
                                            focus:visible:outline-none focus:visible:border-none}`}
                                        placeholder={''}
                                        {...register('recipients', { required: "This field is required" })}></textarea>

                                    {errors['recipients'] && (
                                        <p className="error" role="alert">
                                            {errors['recipients'].message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className='flex gap-7'>
                                <img className='cursor-pointer' src={LinkIcon} alt="LinkIcon" />
                                <img className='cursor-pointer' src={LinkedInIcon} alt="LinkedInIcon" />
                                <img className='cursor-pointer' src={InstagramIcon} alt="InstagramIcon" />
                                <img className='cursor-pointer' src={FacebookOutlineIcon} alt="FacebookOutlineIcon" />
                                <img className='cursor-pointer' src={TwitterIcon} alt="TwitterIcon" />
                            </div>

                            <div className="flex  justify-center align-middle pt-8">
                                <Button btnType="submit" btnName='Submit' btnCategory="primary" />
                            </div>
                        </form>
                    </div>

                </div>
            </MuiModal>


            <MuiModal modalOpen={inviteModal.success} modalClose={handleCloseInviteModal} noheader>
                <div className='px-5 py-1 flex justify-center items-center'>
                    <div className='flex justify-center items-center flex-col gap-5 py-10 px-20 mt-20 mb-20'
                        style={{ background: 'linear-gradient(101.69deg, #1D5BBF -94.42%, #00AEBD 107.97%)', borderRadius: '10px' }}>
                        <img src={SuccessTik} alt="SuccessTik" />
                        <p className='text-white text-[12px]'>Your invitation is successfully sent</p>
                    </div>
                </div>
            </MuiModal>


        </div>
    )
}
