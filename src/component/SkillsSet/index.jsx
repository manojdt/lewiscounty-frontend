import React, { useEffect, useState } from 'react'
import ArrowRightIcon from '../../assets/icons/arroRight.svg'
import ArrowLeftIcon from '../../assets/icons/arroLeft.svg'
import ProgramStartIcon from '../../assets/icons/ProgramStart.svg'
import { Button } from '../../shared'
import MuiModal from '../../shared/Modal'
import { useNavigate } from 'react-router-dom'
import { Backdrop, CircularProgress } from '@mui/material'

export default function SkillsSet() {
    const navigate = useNavigate()
    const [activeTask, setActiveTask] = useState(0)
    const [loading, setLoading] = useState(false)
    const [startProgramModal, setProgramModal] = useState(false)
    const skills = [
        {
            skill: 'Skills 1'
        },
        {
            skill: 'Skills 2'
        },
        {
            skill: 'Skills 3'
        },
        {
            skill: 'Skills 4'
        },
    ]

    const handleTaskNavigation = (key) => {
        if (key === 'next' && activeTask !== skills.length - 1) {
            setActiveTask(activeTask + 1)
        }

        if (key === 'prev' && activeTask > 0) {
            setActiveTask(activeTask - 1)
        }
    }

    const handleAttendProgram = () => {
        setProgramModal(false)
    }

    const handleSubmitTask = () => {
        setLoading(true)

    }

    useEffect(() => {
        if (loading) {
            setTimeout(() => {
                navigate('/submit-task-program/5')
            }, [3000])
        }
    }, [loading])

    return (
        <div className='skills-set'>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}

            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <MuiModal modalOpen={startProgramModal} modalClose={() => setProgramModal(false)} noheader>
                <div className='px-5 py-1 flex justify-center items-center'>
                    <div className='flex justify-center items-center flex-col gap-5 py-10 px-20 mt-3 mb-20'
                    >
                        <h3 style={{ color: 'rgba(24, 40, 61, 1)', fontSize: '18px', fontWeight: 600 }}>Hey! Your Teaching Program Started</h3>
                        <img src={ProgramStartIcon} className='py-5 mb-10' alt="ProgramStartIcon" />
                        <Button btnName="Attend this program" onClick={handleAttendProgram} />
                    </div>

                </div>
            </MuiModal>
            <div className='skills-title'>
                <img src={ArrowLeftIcon} className='cursor-pointer' disabled={activeTask === 0} alt="ArrowLeftIcon" onClick={() => handleTaskNavigation('prev')} />
                <p>Skill Task</p>
                <img src={ArrowRightIcon} className='cursor-pointer' disabled={activeTask === skills.length - 1} alt="ArrowRightIcon" onClick={() => handleTaskNavigation('next')} />
            </div>
            {
                skills.map((skil, index) => <div className={`skills-list ${index === activeTask ? 'show' : 'hidden'}`} key={index}>{skil.skill}</div>)
            }
            <div className='action-btn'>
                {
                    activeTask === 1 ? <Button btnName="Submit skill Task" onClick={handleSubmitTask} />

                        : <Button btnName="Start Task" onClick={() => setProgramModal(true)} />

                }


            </div>
        </div>
    )
}
