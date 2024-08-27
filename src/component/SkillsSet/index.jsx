import React, { useEffect, useState } from 'react'
import ArrowRightIcon from '../../assets/icons/arroRight.svg'
import ArrowLeftIcon from '../../assets/icons/arroLeft.svg'
import ProgramStartIcon from '../../assets/icons/ProgramStart.svg'
import SuccessTik from '../../assets/images/blue_tik1x.png';
import { Button } from '../../shared'
import MuiModal from '../../shared/Modal'
import { useNavigate } from 'react-router-dom'
import { Backdrop, CircularProgress } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserProgramInfo } from '../../services/userprograms'
import api from '../../services/api';
import { TaskAllStatus } from '../../utils/constant';


export default function SkillsSet({ programdetails }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [activeTask, setActiveTask] = useState(0)
    const [loading, setLoading] = useState(false)
    const [startProgramModal, setProgramModal] = useState(false)
    const [allTask, setAllTask] = useState([])
    const [successModal, setSuccessModal] = useState({ loading: false, success: false })


    const [activeTaskDetails, setActiveTaskDetails] = useState({})

    const handleTaskNavigation = (key) => {
        if (key === 'next' && activeTask !== allTask.length - 1) {
            setActiveTaskDetails(allTask[activeTask + 1])
            setActiveTask(activeTask + 1)
        }

        if (key === 'prev' && activeTask > 0) {
            setActiveTaskDetails(allTask[activeTask - 1])
            setActiveTask(activeTask - 1)
        }
    }

    const handleAttendProgram = () => {
        setProgramModal(false)
    }

    const handleSubmitTask = () => {
        setLoading(true)

    }


    const handleTaskAction = async () => {
        if (activeTaskDetails.status === TaskAllStatus.yettostart || activeTaskDetails.status === TaskAllStatus.newtask ||

            activeTaskDetails.status === TaskAllStatus.pending
        ) {
            setSuccessModal({ loading: true, success: false })
            const startTask = await api.patch('program_task_assign/task_start', { task_id: activeTaskDetails.assign_task.id });
            if (startTask.status === 200 && startTask.data) {
                setSuccessModal({ loading: false, success: true })
                setTimeout(() => {
                    dispatch(updateUserProgramInfo({ status: '' }))
                    setSuccessModal({ loading: false, success: false })
                    navigate(`/submit-task-program/${startTask.data.task_id}`)
                }, [2000])
            }
        }
        else {
            navigate(`/submit-task-program/${activeTaskDetails.assign_task.id}`)
        }
    }

    useEffect(() => {
        if (programdetails.task && programdetails.task.length) {
            setActiveTaskDetails(programdetails.task[0])
            setAllTask(programdetails.task)
        }
    }, [programdetails])

    useEffect(() => {
        if (loading) {
            setTimeout(() => {
                navigate('/submit-task-program/5')
            }, [3000])
        }
    }, [loading])

    return (
        <>
            {
                allTask.length ?

                    <div className='skills-set'>
                        <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={loading || successModal.loading}

                        >
                            <CircularProgress color="inherit" />
                        </Backdrop>

                        <MuiModal modalOpen={successModal.success} modalClose={() => setSuccessModal({ loading: false, success: false })} noheader>
                            <div className='px-5 py-1 flex justify-center items-center'>
                                <div className='flex justify-center items-center flex-col gap-5 py-10 px-20 mt-20 mb-20'
                                    style={{ background: 'linear-gradient(101.69deg, #1D5BBF -94.42%, #00AEBD 107.97%)', borderRadius: '10px' }}>
                                    <img src={SuccessTik} alt="SuccessTik" />
                                    <p className='text-white text-[12px]'>Successfully task is started</p>
                                </div>

                            </div>
                        </MuiModal>


                        <MuiModal modalOpen={startProgramModal} modalClose={() => setProgramModal(false)} noheader>
                            <div className='px-5 py-1 flex justify-center items-center'>
                                <div className='flex justify-center items-center flex-col gap-5 py-10 px-20 mt-3 mb-20'
                                >
                                    <h3 style={{ color: 'rgba(24, 40, 61, 1)', fontSize: '18px', fontWeight: 600 }}>Hey! Your {programdetails.program_name} is Started</h3>
                                    <img src={ProgramStartIcon} className='py-5 mb-10' alt="ProgramStartIcon" />
                                    <Button btnName="Attend this program" onClick={handleAttendProgram} />
                                </div>

                            </div>
                        </MuiModal>
                        <div className='skills-title' style={{ justifyContent: allTask.length === 1 ? 'center' : 'space-between' }}>
                            {
                                allTask.length > 1 &&
                                <img src={ArrowLeftIcon} className='cursor-pointer' style={{ visibility: activeTask === 0 ? 'hidden' : 'visible' }} disabled={activeTask === 0} alt="ArrowLeftIcon" onClick={() => handleTaskNavigation('prev')} />
                            }

                            <p>{activeTaskDetails.assign_task.task_name}</p>
                            {
                                allTask.length > 1 &&

                                <img src={ArrowRightIcon} className='cursor-pointer' style={{ visibility: activeTask === allTask.length - 1 ? 'hidden' : 'visible' }} disabled={activeTask === allTask.length - 1} alt="ArrowRightIcon" onClick={() => handleTaskNavigation('next')} />
                            }

                        </div>

                        <div className={`skills-list`}>{activeTaskDetails.assign_task.task_name}</div>

                        <div className='action-btn'>

                            <Button btnName={activeTaskDetails.status === TaskAllStatus.start ? 'Submit Task' :
                                (activeTaskDetails.status === TaskAllStatus.yettostart || activeTaskDetails.status === TaskAllStatus.newtask
                                    || activeTaskDetails.status === TaskAllStatus.pending
                                ) ? 'Start Task' : 'View Task'} onClick={handleTaskAction} />


                        </div>
                    </div>

                    : null
            }
        </>

    )
}
