import React, { useCallback, useRef, useState } from 'react'
import {
    LoginSocialGoogle,
} from "reactjs-social-login";

import GoogleIcon from '../../assets/images/google1x.png';
import FacebookIcon from '../../assets/images/facebook1x.png';
import InstagramIcon from '../../assets/images/instagram1x.png';

export default function SocialMediaLogin({ view = 'vertical' }) {

    const [provider, setProvider] = useState('');
    const [profile, setProfile] = useState();

    const googleRef = useRef();

    const onLoginStart = useCallback(() => {
        alert("login start");
    }, []);

    const onLoginSuccess = (data) => {
        fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${data.access_token}`, {
            headers: {
                Authorization: `Bearer ${data.access_token}`,
                Accept: 'application/json'
            }
        })
        .then((res) => {
            setProfile(res.data);
        })
        .catch((err) => console.log(err));
        // if (data && Object.keys(data).length && data.hasOwnProperty('name')) {
        //     let l = { first_name: '', last_name: '', auth_type: 'google' }
        //     const f = data.name.split(" ")
        //     l = { ...l, first_name: f[0], last_name: f[0] }
        //     if (f.length > 1) {
        //         l = { ...l, first_name: f[0], last_name: f[1] }
        //     }
        // }
    }

    const onLogoutFailure = useCallback(() => {
        alert("logout fail");
    }, []);

    const onLogoutSuccess = useCallback(() => {
        alert("logout success");
    }, []);

    const REDIRECT_URI =
        'http://localhost:3000/login';

    console.log('provider', provider, profile)


    return (
        <div className={`flex gap-10 ${view === 'vertical' ? 'flex-col justify-center' : ''}`}>
            {
                view === 'vertical' ?
                    <>

                        {/* <LoginSocialGoogle
                            client_id={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                            onLoginStart={onLoginStart}
                            redirect_uri={REDIRECT_URI}
                            scope="openid profile email"
                            discoveryDocs="claims_supported"
                            access_type="offline"
                            onResolve={({ provider, data }) => {
                                console.log('data', data)
                                setProvider(provider);
                                setProfile(data);
                            }}
                            onReject={err => {
                                console.log(err);
                            }}
                        >
                            <div className="cursor-pointer px-6 py-3 flex justify-center items-center gap-3" style={{ border: '0.5px solid rgba(62, 62, 62, 1)', borderRadius: '6px' }}>
                                <img src={GoogleIcon} className='w-[30px]' alt='GoogleIcon' />
                                <p>Continue With Google</p>
                            </div>
                        </LoginSocialGoogle> */}

                        <LoginSocialGoogle
                            ref={googleRef}
                            client_id={'636958171152-9t04iuqj24dvbsooc9rkgl38o5uudirv.apps.googleusercontent.com'}
                            onLogoutFailure={onLogoutFailure}
                            onLoginStart={onLoginStart}
                            onLogoutSuccess={onLogoutSuccess}
                            fetch_basic_profile
                            onResolve={(e) => {
                                console.log(e)
                                console.log('googleRef', googleRef)
                                onLoginSuccess(e.data)
                                console.log(e.data, "data");
                                console.log(e.provider, "provider");
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

                        {/* <div className="cursor-pointer px-6 py-3 flex justify-center items-center gap-3" style={{ border: '0.5px solid rgba(62, 62, 62, 1)', borderRadius: '6px' }}>
                            <img src={GoogleIcon} className='w-[30px]' alt='GoogleIcon' />
                            <p>Continue With Google</p>
                        </div> */}
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
