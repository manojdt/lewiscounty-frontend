import React, { useCallback, useRef } from 'react'
import {
    LoginSocialGoogle,
} from "reactjs-social-login";

import { userAccountLogin } from "../../services/loginInfo";

import GoogleIcon from '../../assets/images/google1x.png';
import FacebookIcon from '../../assets/images/facebook1x.png';
import InstagramIcon from '../../assets/images/instagram1x.png';
import { useDispatch } from 'react-redux';
import { Button } from '@mui/material';

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
        <div className={`flex gap-7 ${view === 'vertical' ? 'flex-col justify-center' : ''}`}>
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
                                onLoginSuccess(e.data)
                            }}
                            onReject={(err) => {
                                console.log("hbhbdhd", err);
                            }}
                        >
                            <Button fullWidth color='inherit' size='large' variant="outlined" startIcon={<img src={GoogleIcon} className='w-[20px]' alt='GoogleIcon' />}>
                                Continue With Google
                            </Button>
                        </LoginSocialGoogle>

                        <Button fullWidth color='inherit' size='large' variant="outlined" startIcon={<img src={InstagramIcon} className='w-[20px]' alt='InstagramIcon' />}>
                            Continue with Instagram
                        </Button>
                        <Button fullWidth color='inherit' size='large' variant="outlined" startIcon={<img src={FacebookIcon} className='w-[20px]' alt='FacebookIcon' />}>
                            Continue with Facebook
                        </Button>
                    </>
                    :

                    <>
                        <LoginSocialGoogle
                            ref={googleRef}
                            client_id={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                            onLogoutFailure={onLogoutFailure}
                            onLoginStart={onLoginStart}
                            onLogoutSuccess={onLogoutSuccess}
                            scope="openid profile email"
                            onResolve={(e) => {
                                onLoginSuccess(e.data)
                            }}
                            onReject={(err) => {
                                console.log("hbhbdhd", err);
                            }}
                        >
                            <Button fullWidth color='inherit' size='large' variant="outlined" startIcon={<img src={GoogleIcon} className='w-[20px]' alt='GoogleIcon' />}>
                                Continue With Google
                            </Button>
                        </LoginSocialGoogle>
                        <Button fullWidth color='inherit' size='large' variant="outlined" startIcon={<img src={InstagramIcon} className='w-[20px]' alt='InstagramIcon' />}>
                            Continue with Instagram
                        </Button>
                        <Button fullWidth color='inherit' size='large' variant="outlined" startIcon={<img src={FacebookIcon} className='w-[20px]' alt='FacebookIcon' />}>
                            Continue with Facebook
                        </Button>
                    </>
            }

        </div>
    )
}
