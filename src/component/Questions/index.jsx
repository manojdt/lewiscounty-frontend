import React, { useState } from "react";
import { Navbar, Stepper } from '../../shared';
import { StepsList } from '../../utils/constant';
import { StepFormFields, Stepname } from "../../utils/formFields";
import StepComponenRender from "./StepComponentRender";
import { useNavigate } from "react-router-dom";

export const Questions = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1)
  const [stepData, setStepData] = useState({})

  const handleNextStep = (data) => {
    setStepData({ ...stepData, [Stepname[currentStep - 1]]: data })
    if (StepFormFields.length === currentStep) {
      console.log('Submit')
      navigate("/dashboard");
    }
    else setCurrentStep(currentStep + 1)
  }

  console.log('stepData', stepData)

  const handlePreviousStep = () => setCurrentStep(currentStep - 1)

  return (
    <>
      <Navbar />
      <div className="px-9">
        <h2 className="text-xl text-left py-8">
          Fill the Question and Answer
        </h2>

        <div style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)' }}>
          <div className="steps pl-24 pr-28" style={{ boxShadow: '4px 4px 15px 0px rgba(0, 0, 0, 0.1)' }}>
            <Stepper steps={StepsList} currentStep={currentStep} />
          </div>
          <StepComponenRender
            stepData={stepData}
            fields={StepFormFields[currentStep - 1]}
            currentStep={currentStep}
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep} />
        </div>
      </div>
    </>
  );
};
