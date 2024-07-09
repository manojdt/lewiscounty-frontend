import React from 'react'
import GoogleIcon from '../../assets/images/google1x.png';
import FacebookIcon from '../../assets/images/facebook1x.png';
import InstagramIcon from '../../assets/images/instagram1x.png';

export default function SocialMediaLogin({ view = 'vertical' }) {
    return (
        <div className={`flex gap-10 ${view === 'vertical' ? 'flex-col justify-center': ''}`}>
            {
                view === 'vertical' ?
                    <>
                        <div className="cursor-pointer px-6 py-3 flex justify-center items-center gap-3" style={{ border: '0.5px solid rgba(62, 62, 62, 1)', borderRadius: '6px' }}>
                            <img src={GoogleIcon} className='w-[30px]' alt='GoogleIcon' />
                            <p>Continue With Google</p>
                        </div>
                        <div className="cursor-pointer px-6 py-3 flex justify-center items-center gap-3" style={{ border: '0.5px solid rgba(62, 62, 62, 1)', borderRadius: '6px' }}>
                            <img src={InstagramIcon} alt='InstagramIcon' />
                            <p>Continue With Instagram</p>
                        </div>
                        <div className="cursor-pointer px-6 py-3 flex justify-center items-center gap-3" style={{ border: '0.5px solid rgba(62, 62, 62, 1)', borderRadius: '6px' }}>
                            <img src={FacebookIcon} alt='FacebookIcon' />
                            <p>Continue With Facebook</p>
                        </div>
                    </>
                    :

                    <>
                        <div className="cursor-pointer px-6 py-3" style={{ border: '0.5px solid rgba(62, 62, 62, 1)', borderRadius: '6px' }}>
                            <img src={GoogleIcon} alt='GoogleIcon' />
                        </div>
                        <div className="cursor-pointer px-6 py-3" style={{ border: '0.5px solid rgba(62, 62, 62, 1)', borderRadius: '6px' }}>
                            <img src={InstagramIcon} alt='InstagramIcon' />
                        </div>
                        <div className="cursor-pointer px-6 py-3" style={{ border: '0.5px solid rgba(62, 62, 62, 1)', borderRadius: '6px' }}>
                            <img src={FacebookIcon} alt='FacebookIcon' />
                        </div>
                    </>
            }

        </div>
    )
}
