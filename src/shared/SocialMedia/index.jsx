import React from 'react'
import GoogleIcon from '../../assets/images/google1x.png';
// import InstagramIcon from '../../assets/images/instagram_1x.png';
import FacebookIcon from '../../assets/images/facebook1x.png';
import InstagramIcon from '../../assets/images/instagram1x.png';


export default function SocialMediaLogin() {
    return (
        <div className="flex gap-10">
            <div className="cursor-pointer px-6 py-3" style={{ border: '0.5px solid rgba(62, 62, 62, 1)', borderRadius: '6px' }}>
                <img src={GoogleIcon} alt='GoogleIcon' />
            </div>
            <div className="cursor-pointer px-6 py-3" style={{ border: '0.5px solid rgba(62, 62, 62, 1)', borderRadius: '6px' }}>
                <img src={InstagramIcon} alt='InstagramIcon' />
            </div>
            <div className="cursor-pointer px-6 py-3" style={{ border: '0.5px solid rgba(62, 62, 62, 1)', borderRadius: '6px' }}>
                <img src={FacebookIcon} alt='FacebookIcon' />
            </div>
        </div>
    )
}
