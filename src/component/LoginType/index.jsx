import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { updateUserRole } from "../../services/loginInfo";
import { userStatus } from "../../utils/constant";
import bg_image from "../../assets/images/role-selection-screen-bg.svg";

export const LoginType = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userInfo = useSelector(state => state.userInfo);
    const [loginType, setLoginType] = useState('');
    const [error, setError] = useState(false)

    const role = userInfo.data.role || ''

    const handleSubmit = () => {
        if (loginType === '') setError(true)
        if (loginType !== '') {
            setError(false)
            dispatch(updateUserRole({ role: loginType }))
        }
    };


    useEffect(() => {
        if (role !== 'mentee') {
            if (!userInfo.loading && userInfo.status === userStatus.role) {
                navigate("/questions")
            }

            if (userInfo?.data?.role && userInfo?.data?.role !== 'fresher') {
                if (userInfo.data.is_registered) { navigate('/dashboard') }
                else navigate('/questions')
            }
        }

        if(role === 'mentee'){
            navigate('/programs')   
        }
    }, [userInfo])


    return (
        <div className="h-full" >
            <div className="flex flex-wrap h-full">
                <div className="w-full">
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={userInfo.loading}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                    <div className="block bg-white shadow-lg h-full" style={{background: `url(${bg_image}) center / cover `}}>
                        <div className="g-0 flex justify-center items-center h-full">
                            <div className="px-4 md:px-0 lg:w-4/6 flex justify-center items-center">
                                <div className="w-9/12">
                                    <div className="text-center">
                                        <div className="flex justify-center items-center">
                                            
                                            <h4 className="mt-1 pl-3 pb-1 text-xl font-semibold logoColor">
                                                MyLogo
                                            </h4>
                                        </div>

                                        <h3 className="mb-6 mt-6 pb-8 text-2xl font-semibold defaultTextColor">
                                            Who would you like to continue as ?
                                        </h3>
                                    </div>

                                    <form>
                                        <div className="pb-8">
                                            <div className="flex justify-center gap-10 ">
                                                <div className="relative mb-6">
                                                    <div>
                                                        <label className={`flex flex-row p-10 cursor-pointer ${loginType === 'mentor' ? "activeTypeBg" : "nonActiveTypeBg"}`}
                                                        >
                                                            <input type="radio" name="radio" checked={loginType === 'mentor'} onChange={() => setLoginType('mentor')} />
                                                            <span className="font-semibold text-base pl-2">Mentor</span>

                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="relative mb-6">
                                                    <div>
                                                        <label className={`flex flex-row p-10 cursor-pointer ${loginType === 'mentee' ? "activeTypeBg" : "nonActiveTypeBg"}`}
                                                        >
                                                            <input type="radio" name="radio" checked={loginType === 'mentee'} onChange={() => setLoginType('mentee')} />
                                                            <span className="font-semibold text-base pl-2">Mentee</span>

                                                        </label>
                                                    </div>
                                                </div>

                                            </div>

                                            {error && (
                                                <p className="error" role="alert">
                                                    Please Select type
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-center lg:text-left flex justify-center">
                                            <button
                                                type="button"
                                                className="inline-block rounded px-7 pb-3 pt-3 text-sm font-medium text-white w-44"
                                                data-twe-ripple-init
                                                data-twe-ripple-color="light"
                                                style={{
                                                    background:
                                                        "linear-gradient(to right, #00AEBD, #1D5BBF)",
                                                }}
                                                onClick={handleSubmit}
                                            >
                                                Let's get started
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
