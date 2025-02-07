import React, { useEffect, useState } from 'react';
import { Button } from '../../shared';
import InviteFriendsIcon from '../../assets/icons/Invite-friends.svg';
import LinkIcon from '../../assets/images/link1x.png';
import LinkedInIcon from '../../assets/images/linked-in1x.png';
import FacebookOutlineIcon from '../../assets/images/facebook-outline1x.png';
import TwitterIcon from '../../assets/images/twitter1x.png';
import SuccessTik from '../../assets/images/blue_tik1x.png';
import MuiModal from '../../shared/Modal';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import { Backdrop, CircularProgress } from '@mui/material';
import ToastNotification from '../../shared/Toast';

export default function Invite() {
    // Combined state management
    const [state, setState] = useState({
        inviteModal: false,
        loading: false,
        success: false,
        message: '',
        showToast: false,
        toastType: 'success'
    });

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm();

    // Handle toast timeout
    useEffect(() => {
        if (state.showToast) {
            const timer = setTimeout(() => {
                setState(prev => ({ ...prev, showToast: false }));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [state.showToast]);

    // Handle success modal timeout
    useEffect(() => {
        let timer;
        if (state.success) {
            timer = setTimeout(() => {
                setState(prev => ({
                    ...prev,
                    success: false
                }));
            }, 3000);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [state.success]);

    // Email validation function
    const validateEmails = (emailString) => {
        if (!emailString) return false;
        const emails = emailString.split(',').map(email => email.trim());
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emails.every(email => emailRegex.test(email));
    };

    // Copy URL handler
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(process.env.REACT_APP_SITE_URL);
            setState(prev => ({
                ...prev,
                showToast: true,
                message: 'Invite URL copied!',
                toastType: 'success'
            }));
        } catch (err) {
            setState(prev => ({
                ...prev,
                showToast: true,
                message: 'Failed to copy URL',
                toastType: 'error'
            }));
        }
    };

    // Form submission handler
    const onSubmit = async (data) => {
        try {
            setState(prev => ({ ...prev, loading: true }));

            const emails = data.recipients
                .split(',')
                .map(email => email.trim())
                .filter(email => email.length > 0);

            const payload = {
                link: process.env.REACT_APP_SITE_URL,
                share_type: 'mail',
                recipients: emails
            };

            const response = await api.post("invite/invite", payload);
            
            if (response.status === 200) {
                reset();
                setState(prev => ({
                    ...prev,
                    loading: false,
                    inviteModal: false,  // Close the invite modal
                    success: true,       // Show success backdrop
                    message: 'Invitation sent successfully',
                    showToast: true,
                    toastType: 'success'
                }));
            }
        } catch (error) {
            setState(prev => ({
                ...prev,
                loading: false,
                showToast: true,
                message: 'Failed to send invitations',
                toastType: 'error'
            }));
        }
    };

    // Social media sharing configuration
    const getSocialMediaOptions = () => {
        const encodedUrl = encodeURIComponent(process.env.REACT_APP_SITE_URL);
        const title = encodeURIComponent("Join me on this platform!");
        const description = encodeURIComponent("I'd like to invite you to join this platform.");
        const hashtags = encodeURIComponent("community,social");

        return [
            {
                name: 'linkedIn',
                icon: LinkedInIcon,
                url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${description}&title=${title}`
            },
            {
                name: 'facebook',
                icon: FacebookOutlineIcon,
                url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${description}`
            },
            {
                name: 'twitter',
                icon: TwitterIcon,
                url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${title}&hashtags=${hashtags}`
            }
        ];
    };

    const handleSocialShare = (url) => {
        window.open(url, '_blank', 'width=600,height=600,left=400,top=100');
    };

    const socialMediaOptions = getSocialMediaOptions();

    return (
        <div className="pb-3 mt-3" style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
            {/* Header Section */}
            <div className="flex py-6 px-6 justify-evenly gap-4">
                <div className="flex h-[25px] text-center px-4" style={{ background: 'rgba(238, 245, 255, 1)' }}>
                    <img src={InviteFriendsIcon} alt="invite friends" />
                </div>
                <div className='flex items-center justify-center'>
                    <p className="text-[14px]">Invite friends</p>
                </div>
            </div>

            {/* Invite Button */}
            <div className="text-center">
                <Button 
                    btnCls="!px-12 !py-3" 
                    btnName='Invite' 
                    btnCategory="primary" 
                    onClick={() => setState(prev => ({ ...prev, inviteModal: true }))} 
                />
            </div>

            {/* Toast Notification */}
            {state.showToast && (
                <ToastNotification
                    openToaster={state.showToast}
                    message={state.message}
                    handleClose={() => setState(prev => ({ ...prev, showToast: false }))}
                    toastType={state.toastType}
                />
            )}

            {/* Loading Backdrop */}
            <Backdrop
                sx={{ zIndex: (theme) => 999999 }}
                open={state.loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            {/* Invite Modal */}
            <MuiModal 
                modalOpen={state.inviteModal} 
                modalClose={() => setState(prev => ({ ...prev, inviteModal: false }))} 
                noheader
            >
                <div className='px-5 py-1 flex justify-center items-center' style={{ border: '1px solid rgba(29, 91, 191, 1)' }}>
                    <div className='flex justify-center items-center flex-col gap-8 py-10 px-20 mt-5'>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* URL Field */}
                            <div className="flex flex-wrap gap-4">
                                <div className="relative mb-6 w-full">
                                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                                        URL
                                    </label>
                                    <div className='relative input-bg w-full'>
                                        <input 
                                            className='input-bg text-[12px] h-[60px] w-full px-5'
                                            value={process.env.REACT_APP_SITE_URL} 
                                            disabled 
                                        />
                                    </div>
                                </div>

                                {/* Email Recipients Field */}
                                <div className="relative mb-6 w-full">
                                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                                        Invite Recipients (comma-separated emails)
                                    </label>
                                    <textarea
                                        rows="4"
                                        className="block p-2.5 input-bg w-full text-sm text-gray-900 rounded-lg border focus:outline-none"
                                        placeholder="email1@example.com, email2@example.com"
                                        {...register('recipients', {
                                            required: "Please enter at least one email address",
                                            validate: {
                                                validEmails: value => validateEmails(value) || "Please enter valid email addresses"
                                            }
                                        })}
                                    />
                                    {errors.recipients && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.recipients.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Share Options */}
                            <div className='flex gap-7 justify-center mb-8'>
                                <img 
                                    className='cursor-pointer' 
                                    src={LinkIcon} 
                                    alt="Copy link" 
                                    onClick={handleCopy} 
                                />
                                {socialMediaOptions.map((option) => (
                                    <img
                                        key={option.name}
                                        className='cursor-pointer'
                                        src={option.icon}
                                        alt={option.name}
                                        onClick={() => handleSocialShare(option.url)}
                                    />
                                ))}
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-center">
                                <Button 
                                    btnType="submit" 
                                    btnName='Send Invites' 
                                    btnCategory="primary"
                                    disabled={state.loading}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </MuiModal>

            {/* Success Modal */}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={state.success}
            >
                <div className='px-5 py-1 flex justify-center items-center'>
                    <div className='flex justify-center items-center flex-col gap-[2.25rem] py-[4rem] px-[3rem] mt-20 mb-20'
                        style={{ background: '#fff', borderRadius: '10px' }}>
                        <img src={SuccessTik} alt="Success" />
                        <p className='text-[16px] font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#1D5BBF] to-[#00AEBD]'
                            style={{ fontWeight: 600 }}>
                            Your invitation is successfully sent
                        </p>
                    </div>
                </div>
            </Backdrop>
        </div>
    );
}