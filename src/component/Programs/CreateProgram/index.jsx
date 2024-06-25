import React, { useEffect, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import CancelIcon from '../../../assets/images/cancel-colour1x.png'
import SuccessTik from '../../../assets/images/blue_tik1x.png';
import SearchIcon from '../../../assets/images/search1x.png';


import ProgramSteps from './ProgramsSteps'
import { ProgramTabs, ProgramFields } from '../../../utils/formFields'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { createProgram, updateAllPrograms } from '../../../services/programInfo'
import MuiModal from '../../../shared/Modal'
import { CertificateColumns, MaterialColumns, SkillsColumns, assignMenteeColumns, assignMenteeRows, certificateRows, createMaterialsRows, createSkillsRows } from '../../../mock';
import DataTable from '../../../shared/DataGrid';

export default function CreatePrograms() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState({ create: false, success: false })
    const { programDetails, allPrograms } = useSelector(state => state.programInfo)
    const [actionTab, setActiveTab] = useState('program_information')
    const [currentStep, setCurrentStep] = useState(1)
    const [stepData, setStepData] = useState({})
    const [actionModal, setActionModal] = useState('')

    const handleTab = (key) => {
        const tabIndex = ProgramTabs.findIndex(tab => tab.key === key)
        console.log(tabIndex)
        // setCurrentStep(tabIndex + 1)
        setActiveTab(key)
    }

    const handleNextStep = (data) => {
        // setStepData({ ...stepData, [ProgramTabs[currentStep - 1].key]: data })
        console.log('Next step')
        // const fieldData = { ...stepData, ...data }
        // setStepData(fieldData)
        // if (ProgramFields.length === currentStep) {
        //     console.log('Submit', stepData)
        //     const updateProgram = [...allPrograms, fieldData]
        //     //   navigate("/dashboard");
        //     setLoading({ ...loading, create: true })
        //     dispatch(updateAllPrograms(updateProgram))
        // }
        // else {
        //     setCurrentStep(currentStep + 1)
        //     console.log('llll', ProgramTabs[currentStep])
        //     setActiveTab(ProgramTabs[currentStep].key)
        // }
    }

    console.log('stepData', stepData)

    console.log('stepData[actionTab]', actionTab, stepData[ProgramTabs[currentStep - 1].key])

    const handlePreviousStep = () => setCurrentStep(currentStep - 1)

    const handleAction = (key) => {
        setActionModal(key)

    }

    const footerComponent = () => {
        return (
            <div className='flex gap-6 justify-center items-center py-4'>
                <button onClick={() => setActionModal('')} className='py-3 px-6 w-[16%]'
                    style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '3px', color: 'rgba(29, 91, 191, 1)' }}>Cancel</button>
                <button onClick={() => setActionModal('')}
                    className='text-white py-3 px-6 w-[16%]'
                    style={{ background: 'linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)', borderRadius: '3px' }}>Add Material</button>
            </div>)
    }

    const skillsFooterComponent = () => {
        return (
            <div className='flex gap-6 justify-center items-center py-4'>
                <button onClick={() => setActionModal('')} className='py-3 px-6 w-[16%]'
                    style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '3px', color: 'rgba(29, 91, 191, 1)' }}>Cancel</button>
                <button onClick={() => setActionModal('')}
                    className='text-white py-3 px-6 w-[16%]'
                    style={{ background: 'linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)', borderRadius: '3px' }}>Add Skills</button>
            </div>)
    }

    const certificateFooterComponent = () => {
        return (
            <div className='flex gap-6 justify-center items-center py-4'>
                <button onClick={() => setActionModal('')} className='py-3 px-6 w-[16%]'
                    style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '3px', color: 'rgba(29, 91, 191, 1)' }}>Cancel</button>
                <button onClick={() => setActionModal('')}
                    className='text-white py-3 px-6 w-[16%]'
                    style={{ background: 'linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)', borderRadius: '3px' }}>Add Certificate</button>
            </div>)
    }

    const memberFooterComponent = () => {
        return (
            <div className='flex gap-6 justify-center items-center py-4'>
                <button onClick={() => setActionModal('')} className='py-3 px-6 w-[16%]'
                    style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '3px', color: 'rgba(29, 91, 191, 1)' }}>Cancel</button>
                <button onClick={() => setActionModal('')}
                    className='text-white py-3 px-6 w-[16%]'
                    style={{ background: 'linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)', borderRadius: '3px' }}>Add Members</button>
            </div>)
    }

    useEffect(() => {
        if (loading.success) {
            setTimeout(() => {
                setLoading({ create: false, success: false })
                if (allPrograms && allPrograms.length) {
                    navigate('/dashboard')
                }
            }, [3000])

        }
    }, [loading])

    useEffect(() => {
        if (allPrograms && allPrograms.length && loading.create) {
            setTimeout(() => {
                setLoading({ create: false, success: true })
            }, [3000])
        }
    }, [allPrograms])


    console.log('actionModal', actionModal)

    return (
        <div className="dashboard-content px-8 mt-10">
            <div style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
                <div className="title flex justify-between py-3 px-4 border-b-2 items-center">
                    <div className="flex gap-4">
                        <h4>Create New Program  Request</h4>
                    </div>
                    <div className="flex gap-20 items-center">
                        <img className='cursor-pointer' onClick={() => navigate('/programs')} src={CancelIcon} alt="MoreIcon" />
                    </div>
                </div>

                <MuiModal modalOpen={loading.success} modalClose={() => setLoading({ create: false, success: false })} noheader>
                    <div className='px-5 py-1 flex justify-center items-center'>
                        <div className='flex justify-center items-center flex-col gap-5 py-10 px-20 mt-20 mb-20'
                            style={{ background: 'linear-gradient(101.69deg, #1D5BBF -94.42%, #00AEBD 107.97%)', borderRadius: '10px' }}>
                            <img src={SuccessTik} alt="SuccessTik" />
                            <p className='text-white text-[12px]'>Requested Successfully</p>
                        </div>

                    </div>
                </MuiModal>

                <MuiModal modalSize='lg' modalOpen={actionModal !== ''} modalClose={() => setActionModal('')} noheader>
                    <div className='relative'>
                        <input className='input-bg w-full h-[60px] px-5 mb-4 text-[14px]' style={{ borderRadius: '50px', }}
                            placeholder='Search learning materials name' />
                        <img className='absolute top-4 right-7' src={SearchIcon} alt="SearchIcon" />
                    </div>
                    {
                        actionModal === 'learning_materials' ?

                            <DataTable rows={createMaterialsRows} columns={MaterialColumns} footerAction={() => setActionModal('')}
                                footerComponent={footerComponent} />
                            : actionModal === 'skills' ?

                                <DataTable rows={createSkillsRows} columns={SkillsColumns} footerAction={() => setActionModal('')}
                                    footerComponent={skillsFooterComponent} />
                                :
                                actionModal === 'certificates' ?

                                    <DataTable rows={certificateRows} columns={CertificateColumns} footerAction={() => setActionModal('')}
                                        footerComponent={certificateFooterComponent} />
                                    : actionModal === 'members' ?

                                        <DataTable rows={createMaterialsRows} columns={MaterialColumns} footerAction={() => setActionModal('')}
                                            footerComponent={memberFooterComponent} />
                                        : null

                    }

                </MuiModal>

                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loading.create}

                >
                    {
                        loading.create ?
                            <CircularProgress color="inherit" />
                            : null
                    }

                </Backdrop>
                <div className='px-8 py-4'>
                    <div className='flex gap-3'>
                        {
                            ProgramTabs.map((actionBtn, index) =>
                                <button key={index} className='px-5 py-4 text-[14px]' style={{
                                    background: actionTab === actionBtn.key ? 'linear-gradient(97.86deg, #005DC6 -15.07%, #00B1C0 112.47%)' :
                                        'rgba(249, 249, 249, 1)',
                                    color: actionTab === actionBtn.key ? '#fff' : '#000',
                                    borderRadius: '3px'
                                }}
                                    onClick={() => handleTab(actionBtn.key)}
                                >{actionBtn.name}</button>
                            )
                        }
                    </div>
                    <ProgramSteps
                        stepData={stepData}
                        currentStepData={stepData[ProgramTabs[currentStep - 1].key]}
                        stepFields={ProgramFields[currentStep - 1]}
                        currentStep={currentStep}
                        handleNextStep={handleNextStep}
                        handlePreviousStep={handlePreviousStep}
                        handleAction={handleAction}
                        totalSteps={ProgramFields.length}
                    />

                </div>
            </div>
        </div>
    )
}
