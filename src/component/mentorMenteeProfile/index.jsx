import { Backdrop, Box, Button as Btn, CircularProgress, Divider, Grid, Link, Stack, Typography } from '@mui/material'
import React from 'react'
import ThreeDotIcon from "../../assets/icons/threeDots.svg"
import ProfileImageIcon from '../../assets/icons/profile-image-icon.svg'
import { Button } from '../../shared'
import { followBtnText, MentorMenteeProfileViewList } from '../../utils/constant'
import ConnectIcon from '../../assets/images/Connectpop1x.png'
import { useDispatch, useSelector } from 'react-redux'
import { getProfileInfo, mentorAcceptReq, updateUserList } from '../../services/userList'
import { useLocation, useNavigate } from 'react-router-dom'
import SuccessTik from '../../assets/images/blue_tik1x.png';

const MentorMenteeProfile = () => {
    const [activity, setActivity] = React.useState({
        bool: false,
        type: ""
    })

    const dispatch = useDispatch()
    const state = useLocation()?.state
    const navigate = useNavigate()

    const { profile } = useSelector(state => state.profileInfo)
    const { status, userDetails, loading } = useSelector(state => state.userList)
    const [createMeetingLoading, setCreateMeetingLoading] = React.useState(false)

    const statusStyle = {
        rejected: "text-[16px] w-[140px] h-[40px] flex items-center justify-center !text-[#E0382D] border border-[#E0382D] rounded-[3px]",
        connected: "text-[16px] w-[140px] h-[40px] flex items-center justify-center !text-[#1D5BBF] border border-[#1D5BBF] rounded-[3px]",
    }

    React.useEffect(() => {
        if (state?.user_id !== '') {
            dispatch(getProfileInfo({ id: state?.user_id, follow_id: state?.row_id }));
        }
    }, [state?.user_id])


    const handleFollowMentee = () => {
        const payload = {
            follow_id: state?.row_id,
            status: activity?.type
        }

        dispatch(mentorAcceptReq(payload))
    }

    React.useEffect(() => {
        dispatch(updateUserList({ status: '' }))
        if (status === "done") {
            setActivity(false)
            setCreateMeetingLoading(true)
            setTimeout(() => {
                setCreateMeetingLoading(false)
                dispatch(updateUserList({ status: '' }))
                dispatch(getProfileInfo({ id: state?.user_id, follow_id: state?.row_id }))
            }, [2000])
        }
    }, [status])


    return (
        <>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Stack direction={"row"} alignItems={"center"} spacing={2} ml={"32px"} mt={"16px"}>
                <Typography className='text-[14px] text-[#5975A2] cursor-pointer'
                    onClick={() => navigate("/mentees", { state: { type: "new_req_mentee" } })}>New Request Mentee</Typography>
                <Typography>{">"}</Typography>
                <Typography className='text-[14px] text-[#18283D]'>Mentee Profile</Typography>
            </Stack>

            <div className='border border-[#DBE0E5] rounded-[6px] bg-[#fff] m-[32px] p-[32px]'>
                <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                    <div className='text-[#353F4F] text-[24px] font-medium' >
                        Profile Picture
                    </div>
                    <Box className={"h-[40px] w-[40px] rounded-[6px] bg-[#DFEDFF] flex items-center justify-center"}>
                        <img src={ThreeDotIcon} />
                    </Box>
                </Stack>
                <Divider className='pt-4 pb-4'></Divider>

                <Box className={"mt-[40px]"}>
                    <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                        <div className='py-4 relative w-[12%]'>
                            <div className='upload-profile'>
                                <label className="w-[40%] pb-3 rounded-lg text-white text-[14px] cursor-pointer" style={{
                                    border: 'none'
                                }}>
                                    <img src={profile?.image ?? ProfileImageIcon} style={{ borderRadius: '50%', height: '143px' }} alt="ProfileImageIcon" />
                                    <div src={""} className='absolute top-[50%] left-2 cursor-pointer' alt="ProfileImagePencilIcon" />
                                </label>
                            </div>
                        </div>

                        {
                            userDetails?.request_status === "new" &&
                            <Stack direction={"row"} alignItems={"center"} spacing={3}>
                                <Btn variant='outlined' disableElevation className="text-[16px] !text-[#E0382D] w-[140px] h-[43px] hover:bg-[transparent]"
                                    style={{ border: "1px solid #E0382D", textTransform: "capitalize" }}
                                    onClick={() => setActivity({
                                        bool: true,
                                        type: "reject"
                                    })}>{"Reject"}</Btn>
                                <Button onClick={() => setActivity({
                                    bool: true,
                                    type: "accept"
                                })} btnType="button" btnName="Connect" btnCls={'w-[140px]'} />
                            </Stack>
                        }

                        {userDetails?.request_status === "cancel" &&
                            <Typography className={statusStyle["rejected"]}>Rejected</Typography>}
                        {userDetails?.request_status === "accept" &&
                            <Typography className={statusStyle["connected"]}>Connected</Typography>}
                    </Stack>

                    <Grid container spacing={4}>
                        {
                            MentorMenteeProfileViewList?.map((e) => {
                                return (
                                    <Grid item xs={e?.grid}>
                                        <Stack>
                                            <label className="block tracking-wide  text-xs mb-2" style={{ color: 'rgba(116, 116, 116, 1)' }}>
                                                {e.label}
                                            </label>
                                            {
                                                e?.value === "documents" ?
                                                    <Stack direction={"row"} alignItems={"center"} spacing={2}>
                                                        {
                                                            userDetails?.documents?.map((doc) => {
                                                                return (
                                                                    <Link href="#" variant="body2" className={"text-[18px]"}>
                                                                        {doc?.file_display_name}
                                                                    </Link>
                                                                )
                                                            })
                                                        }
                                                    </Stack> : <p className="text-[14px]">{userDetails?.[e?.value] ?? "-"}</p>
                                            }
                                        </Stack>
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
                </Box>
            </div>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={activity?.bool}
            >
                <div className="popup-content w-2/6 bg-white flex flex-col gap-2 h-[330px] justify-center items-center">
                    <img src={ConnectIcon} alt="ConnectIcon" />
                    <span style={{ color: '#232323', fontWeight: 600, fontSize: '24px' }}>
                        {activity?.type === 'reject' ? "Reject" : "Connect"}
                    </span>

                    <div className='py-5'>
                        <p style={{ color: 'rgba(24, 40, 61, 1)', fontWeight: 600, fontSize: '18px' }}>Are you sure you want to
                            <span> {activity?.type === 'reject' ? "reject" : "connect"} </span>
                            Mentee?</p>
                    </div>
                    <div className='flex justify-center'>
                        <div className="flex gap-6 justify-center align-middle">
                            <Button btnName='Cancel' btnCategory="secondary" onClick={() => setActivity(false)} />
                            <Button btnType="button" btnCls="w-[110px] !bg-[#E0382D]" btnName={activity?.type === 'reject' ? "Reject" : "Connect"}
                                btnCategory={activity?.type === "reject" ? "secondary" : "primary"}
                                onClick={() => handleFollowMentee()}
                            />
                        </div>
                    </div>
                </div>

            </Backdrop>


            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={createMeetingLoading}
                onClick={() => setCreateMeetingLoading(false)}
            >
                <div className='px-5 py-1 flex justify-center items-center'>
                    <div className='flex justify-center items-center flex-col gap-5 py-10 px-20 mt-20 mb-20'
                        style={{ background: 'linear-gradient(101.69deg, #1D5BBF -94.42%, #00AEBD 107.97%)', borderRadius: '10px' }}>
                        <img src={SuccessTik} alt="SuccessTik" />
                        <p className='text-white text-[12px]'>{followBtnText[userDetails?.is_follow]} is Successfully</p>
                    </div>

                </div>
            </Backdrop>
        </>
    )
}

export default MentorMenteeProfile