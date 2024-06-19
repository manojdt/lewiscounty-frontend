import React, { useState } from 'react'
import MoreIcon from '../../../assets/icons/moreIcon.svg'
import ProgramSteps from './ProgramsSteps'
import { ProgramTabs, ProgramFields } from '../../../utils/formFields'

export default function CreatePrograms() {
    const [actionTab, setActiveTab] = useState('program_information')
    const [currentStep, setCurrentStep] = useState(1)
    const [stepData, setStepData] = useState({})

    const handleTab = (key) => {
        const tabIndex = ProgramTabs.findIndex(tab => tab.key === key)
        console.log(tabIndex)
        setCurrentStep(tabIndex + 1)
        setActiveTab(key)
    }

    const handleNextStep = (data) => {
        setStepData({ ...stepData, [ProgramTabs[currentStep - 1].key]: data })
        if (ProgramFields.length === currentStep) {
            console.log('Submit', stepData)
            //   navigate("/dashboard");
        }
        else {
            setCurrentStep(currentStep + 1)
            console.log('llll', ProgramTabs[currentStep])
            setActiveTab(ProgramTabs[currentStep].key)
        }
    }

    console.log('stepData', stepData)

    console.log('stepData[actionTab]', actionTab, stepData[ProgramTabs[currentStep - 1].key])

    const handlePreviousStep = () => setCurrentStep(currentStep - 1)

    return (
        <div className="dashboard-content px-8 mt-10">
            <div style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
                <div className="title flex justify-between py-3 px-4 border-b-2 items-center">
                    <div className="flex gap-4">
                        <h4>Create New Program  Request</h4>
                    </div>
                    <div className="flex gap-20 items-center">
                        <img src={MoreIcon} alt="MoreIcon" />
                    </div>
                </div>
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
                        fields={ProgramFields[currentStep - 1]}
                        currentStep={currentStep}
                        handleNextStep={handleNextStep}
                        handlePreviousStep={handlePreviousStep} />

                </div>
            </div>
        </div>
    )
}
