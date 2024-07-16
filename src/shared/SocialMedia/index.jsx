import React, { useCallback, useRef } from 'react'
import {
    LoginSocialGoogle,
} from "reactjs-social-login";

import { userAccountLogin } from "../../services/loginInfo";

import GoogleIcon from '../../assets/images/google1x.png';
import FacebookIcon from '../../assets/images/facebook1x.png';
import InstagramIcon from '../../assets/images/instagram1x.png';
import { useDispatch } from 'react-redux';

export default function SocialMediaLogin({ view = 'vertical' }) {

    const dispatch = useDispatch();

    const googleRef = useRef();

    const onLoginStart = useCallback(() => {
        // alert("login start");
    }, []);

    const onLoginSuccess = (data) => {
        if (data && Object.keys(data).length && data.hasOwnProperty('name') && data.hasOwnProperty('email')) {
            let l = { first_name: data.name, last_name: data.name, email: data.email, auth_type: 'google' }
            const f = data.name.split(" ")
            l = { ...l, first_name: f[0], last_name: f[0] }
            if (f.length > 1) {
                l = { ...l, first_name: f[0], last_name: f[1] }
            }
            dispatch(userAccountLogin(l))
        }
    }

    const onLogoutFailure = useCallback(() => {
        alert("logout fail");
    }, []);

    const onLogoutSuccess = useCallback(() => {
        alert("logout success");
    }, []);



    return (
        <div className={`flex gap-10 ${view === 'vertical' ? 'flex-col justify-center' : ''}`}>
            {
                view === 'vertical' ?
                    <>
                        <LoginSocialGoogle
                            client_id={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                            onLogoutFailure={onLogoutFailure}
                            onLoginStart={onLoginStart}
                            onLogoutSuccess={onLogoutSuccess}
                            scope="openid profile email"
                            onResolve={(e) => {
                                console.log(e)
                                onLoginSuccess(e.data)
                            }}
                            onReject={(err) => {
                                console.log("hbhbdhd", err);
                            }}
                        >
                            <div className="cursor-pointer px-6 py-3 flex justify-center items-center gap-3" style={{ border: '0.5px solid rgba(62, 62, 62, 1)', borderRadius: '6px' }}>
                                <img src={GoogleIcon} className='w-[30px]' alt='GoogleIcon' />
                                <p>Continue With Google</p>
                            </div>
                        </LoginSocialGoogle>

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
                        <LoginSocialGoogle
                            ref={googleRef}
                            client_id={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}
                            onLogoutFailure={onLogoutFailure}
                            onLoginStart={onLoginStart}
                            onLogoutSuccess={onLogoutSuccess}
                            onResolve={({ provider, data }) => {
                                console.log(data, "data");
                                console.log(provider, "provider");
                            }}
                            onReject={(err) => {
                                console.log("hbhbdhd", err);
                            }}
                        >
                            <div className="cursor-pointer px-6 py-3" style={{ border: '0.5px solid rgba(62, 62, 62, 1)', borderRadius: '6px' }}>
                                <img src={GoogleIcon} alt='GoogleIcon' />
                            </div>
                        </LoginSocialGoogle>
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
