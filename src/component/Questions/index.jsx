import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { useNavigate } from "react-router-dom";

import SuccessTik from '../../assets/images/blue_tik1x.png';
import { Navbar, Stepper } from '../../shared';
import { MenteeStepsList, StepsList, userStatus } from '../../utils/constant';
import { StepFormFields, Stepname, MenteeStepname, MenteeStepFormFields } from "../../utils/formFields";
import StepComponenRender from "./StepComponentRender";

import { updateInfo, updateMenteeQuestions, updateQuestions } from "../../services/loginInfo";
import SuccessIcon from "../../assets/images/Success_tic1x.png"
import MuiModal from "../../shared/Modal";

export const Questions = () => {
  const navigate = useNavigate();
  const userInfo = useSelector(state => state.userInfo)
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1)
  const [allStepList, setAllStepList] = useState([])
  const [formFields, setFormFields] = useState([])
  const [stepData, setStepData] = useState({})
  const [btnTypeAction, setBtnTypeAction] = useState({ back: false, next: false })
  const [loading, setLoading] = useState(false)
  const [stepName, setStepName] = useState([])
  const [redirect, setRedirect] = useState(false)

  const role = userInfo.data.role || ''


  const submitQuestionsData = (apiData) => {
    if (role === 'mentee') {
      const menteeApiData = {
        ...apiData,
        gender: apiData.gender[0],
        dob: new Date(apiData.dob).toISOString().split('T')[0],
        phone_number: apiData.phone_number
      }
      dispatch(updateMenteeQuestions(menteeApiData))
    }
    else {

      const mentorApiData = {
        ...apiData,
        gender: apiData.gender[0],
        phone_number: apiData.phone_number
      }
      dispatch(updateQuestions(mentorApiData))
    }

  }
  const handleSkip = () => {
    const { first_name, email, ...apiData } = { ...stepData, prev_mentorship: stepData.prev_mentorship === "true" }
    submitQuestionsData(apiData)
  }

  const handleNextStep = (data) => {
    const activeSteps = allStepList.map(step => {
      if (step.key === stepName[currentStep - 1]) return { ...step, status: 'Completed' }
      if (step.key === stepName[currentStep]) return { ...step, status: 'In-Progress' }
      return step
    })
    const fieldData = { ...stepData, ...data }
    setStepData(fieldData)
    setAllStepList(activeSteps)
    if (formFields.length === currentStep) {
      const { first_name, email, ...apiData } = { ...fieldData, prev_mentorship: stepData.prev_mentorship === "true" }
      submitQuestionsData(apiData)
    }
    else setCurrentStep(currentStep + 1)
    setBtnTypeAction({ back: false, next: true })
  }

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        dispatch(updateInfo())
        setLoading(false)
      }, [3000])
    }
  }, [loading])

  useEffect(() => {
    if (userInfo && userInfo.data && Object.keys(userInfo.data).length && currentStep === 1) {
      setStepData({
        ...stepData,
        [role === 'mentee' ? 'full_name' : 'first_name']: userInfo.data.first_name,
        email: userInfo.data.email
      })
    }

    if (!userInfo.loading && Object.keys(userInfo.data).length && userInfo.data.is_registered && userInfo.status === userStatus.questions) {
      setLoading(true)
    }

    if (userInfo.status === userStatus.pending) {
      setTimeout(() => {
        setRedirect(true)
      }, [3000])
    }


  }, [userInfo])

  useEffect(() => {
    if (redirect) {
      setTimeout(() => {
        navigate('/logout')
      }, [3000])
    }
  }, [redirect])


  const handlePreviousStep = (data) => {
    const activeSteps = allStepList.map(step => {
      if (step.key === stepName[currentStep - 1]) return { ...step, status: '' }
      if (step.key === stepName[currentStep - 2]) return { ...step, status: 'In-Progress' }
      return step
    })
    setStepData({ ...stepData, ...data })
    setCurrentStep(currentStep - 1)
    setBtnTypeAction({ back: true, next: false })
  }


  useEffect(() => {
    if (role === 'mentee') {
      setAllStepList(MenteeStepsList)
      setFormFields(MenteeStepFormFields)
      setStepName(MenteeStepname)
    }
    else {
      setAllStepList(StepsList)
      setFormFields(StepFormFields)
      setStepName(Stepname)
    }
  }, [role])


  return (
    <>
      <Navbar />
      <div className="px-9">
        <div className="flex justify-between items-center">
          <h2 className="text-xl text-left py-8" style={{ color: 'rgba(24, 40, 61, 1)', fontWeight: 500 }}>
            Fill the Question and Answer
          </h2>
          {
            ((role === 'mentor' && currentStep >= 3) || (role === 'mentee' && currentStep > 1)) &&
            <p style={{color:'#1D5BBF', textDecoration:'underline', fontWeight:'bold', cursor: 'pointer'}} onClick={handleSkip}>Skip</p>
          }
          
        </div>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={userInfo.loading || userInfo.status === userStatus.login}

        >
          {
            userInfo.status === userStatus.login ?
              <div className="w-2/6 bg-white flex flex-col gap-4 h-[330px] justify-center items-center">
                <img src={SuccessIcon} alt="VerifyIcon" />
                <span style={{ color: '#232323', fontWeight: 600 }}>Login  Successful!</span>
              </div>
              :
              <CircularProgress color="inherit" />
          }

        </Backdrop>

        <MuiModal modalOpen={loading || userInfo.status === userStatus.pending} modalClose={() => setLoading(false)} noheader>
          <div className='px-5 py-1 flex justify-center items-center'>
            <div className='flex justify-center items-center flex-col gap-5 py-10 px-20 mt-20 mb-20'
              style={{ background: 'linear-gradient(101.69deg, #1D5BBF -94.42%, #00AEBD 107.97%)', borderRadius: '10px' }}>
              <img src={SuccessTik} alt="SuccessTik" />
              <p className='text-white text-[12px]'>{redirect ? 'We are redirecting to login page' : 'Questions submitted Successfully. Please wait for admin approval'}</p>
            </div>

          </div>
        </MuiModal>

        <div style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)' }}>
          <div className="steps pl-24 pr-28" style={{ boxShadow: '4px 4px 15px 0px rgba(0, 0, 0, 0.1)' }}>
            <Stepper steps={allStepList} currentStep={currentStep} btnTypeAction={btnTypeAction} />
          </div>
          {
            (formFields.length && formFields[currentStep - 1]) ?
              <StepComponenRender
                stepData={stepData}
                stepName={stepName[currentStep - 1]}
                stepFields={formFields[currentStep - 1]}
                currentStep={currentStep}
                handleNextStep={handleNextStep}
                handlePreviousStep={handlePreviousStep}
                totalSteps={formFields.length}
              />
              : null
          }

        </div>
      </div>
    </>
  );
};
