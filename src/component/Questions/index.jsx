import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { useNavigate, useSearchParams } from "react-router-dom";

import SuccessTik from '../../assets/images/blue_tik1x.png';
import { Navbar, Stepper } from '../../shared';
import { MenteeStepsList, StepsList, userStatus } from '../../utils/constant';
import { StepFormFields, Stepname, MenteeStepname, MenteeStepFormFields } from "../../utils/formFields";
import StepComponenRender from "./StepComponentRender";

import { updateInfo, updateMenteeQuestions, updateQuestions } from "../../services/loginInfo";
import SuccessIcon from "../../assets/images/Success_tic1x.png"
import MuiModal from "../../shared/Modal";
import ToastNotification from "../../shared/Toast";
import api from "../../services/api";

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
  const [errorNot, setErrorNot] = useState(false)
  const [searchParams] = useSearchParams();
  const [customLoading, setCustomLoading] = useState(false)

  const role = userInfo.data.role || ''

  const submitQuestionsData = (apiData) => {
    if (role === 'mentee') {
      const menteeApiData = {
        ...apiData,
        gender: apiData.gender ? Array.isArray(apiData.gender) ? apiData.gender[0] : apiData.gender : null,
        dob: new Date(apiData.dob).toISOString().split('T')[0],
        phone_number: apiData.phone_number
      }
      dispatch(updateMenteeQuestions(menteeApiData))
    }
    else {

      const mentorApiData = {
        ...apiData,
        gender: apiData.gender ? Array.isArray(apiData.gender) ? apiData.gender[0] : apiData.gender : null,
        phone_number: apiData.phone_number
      }
      dispatch(updateQuestions(mentorApiData))
    }

  }
  const handleSkip = () => {
    const { first_name, email, ...apiData } = { ...stepData, prev_mentorship: stepData.prev_mentorship === "true" }
    const combinedData = { ...stepData };
    const res = handleSubmit(combinedData);
    if (!res) {
      submitQuestionsData(apiData)
    }
  }
  const validateRequiredFields = (fields, data) => {
    const missingFields = fields
      .filter(field => field.inputRules?.required)
      .filter(field => {
        const value = data[field.name];
        return !value || (typeof value === 'string' && value.trim() === ""); // Check if it's missing or empty
      });

    if (missingFields.length > 0) {
      return missingFields.map(field => ({
        name: field.name,
        message: field.inputRules.required,
      }));
    }

    return [];
  };

  const handleSubmit = (combinedData) => {
    const allFields = formFields.flat(); // Flatten all fields for validation
    const errorMessages = validateRequiredFields(allFields, combinedData);
    const phoneField = allFields.find(field => field.name === 'phone_number');
    const phoneNumber = combinedData['phone_number'];


    if (phoneField && phoneNumber) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(phoneNumber)) {
        errorMessages.push({
          name: 'phone_number',
          message: 'Phone number must be exactly 10 digits.',
        });
      }
    }
    if (errorMessages.length > 0) {
      // Redirect to the first error field
      const firstErrorField = errorMessages[0]; // Get the first error field
      const fieldIndex = allFields.findIndex(field => field.name === firstErrorField?.name); // Find its index
      if (fieldIndex !== -1) {
        const currentField = allFields[fieldIndex];
        // Find the step index for the first error field
        const stepIndex = formFields.findIndex(step => step.includes(currentField));
        if (stepIndex !== -1) {
          // Set the current step to the step containing the first error field
          setCurrentStep(stepIndex + 1); // Adjust for 0-based index
        }
      }
      setErrorNot(true)
      return true
    }
    return false // Prevent submission if there are errors
  };

  const handleNextStep = (data) => {
    const combinedData = { ...stepData, ...data };


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
      const res = handleSubmit(combinedData);
      if (!res) {
        submitQuestionsData(apiData)
      }
    }
    else setCurrentStep(currentStep + 1)
    setBtnTypeAction({ back: false, next: true })
  }

  const menteeNavigate = async () => {
    let url = searchParams.get("program_id") && searchParams.get("program_id") !== '' ? `/program-details/${searchParams.get("program_id")}` : '/programs'

    if (searchParams.get("program_id") && searchParams.get("program_id") !== '' && searchParams.get("program_id") !== null) {
      setCustomLoading(true)
      const joinProgramAction = await api.post('join_program', { id: searchParams.get("program_id") });
      if (joinProgramAction.status === 200 && joinProgramAction.data) {
        setCustomLoading(false)
        navigate(url)
      }
    } else {
      navigate(url)
    }

  }

  const handleUserRedirect = () => {
    if (role === 'mentee') {
      menteeNavigate()
    }

    if (role === 'mentor') {
      navigate('/dashboard')
    }
  }

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        dispatch(updateInfo())
        setLoading(false)
        setRedirect(true)
      }, [2000])
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

    if (userInfo.status === userStatus.pending) {
      setTimeout(() => {
        setRedirect(true)
      }, [3000])
    }

    if (userInfo.data && Object.keys(userInfo.data).length && userInfo.data.hasOwnProperty('userinfo')) {
      if (userInfo.data.userinfo?.approve_status !== 'accept' || userInfo.data?.is_registered === true) {
        if (userInfo.status === userStatus.questions) {
          setLoading(true)
        } else {
          handleUserRedirect()
        }
      }
    }
  }, [userInfo])

  useEffect(() => {
    if (redirect) {
      setTimeout(() => {
        if (role === 'mentee') {
          menteeNavigate()
        } else {
          navigate('/logout')
        }
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

  const handleStepClick = (stepNumber) => {
    const updatedSteps = allStepList.map((step, index) => {
      // Set the clicked step to "In-Progress"
      if (index === stepNumber - 1) {
        return { ...step, status: 'In-Progress' };
      }
      // Retain "Completed" status for steps before the clicked step
      if (index < stepNumber - 1 && step.status === 'Completed') {
        return { ...step, status: 'Completed' };
      }
      // Set other steps after the clicked step to an empty status
      return { ...step, status: '' };
    });

    setAllStepList(updatedSteps);
    setCurrentStep(stepNumber);
    // setBtnTypeAction({ back: stepNumber > 1, next: stepNumber < formFields.length });
  };

  useEffect(() => {
    if (errorNot) {
      setTimeout(() => {
        setErrorNot(false)
      }, 3000)

    }
  }, [errorNot])

  return (
    <>
      <Navbar />
      <div className="px-9">
        <div className="flex justify-between items-center">
          <h2 className="text-xl text-left py-8" style={{ color: 'rgba(24, 40, 61, 1)', fontWeight: 500 }}>
            {/* Fill the Question and Answer */}
          </h2>
          {
            ((role === 'mentor' && currentStep >= 2) || (role === 'mentee' && currentStep > 1)) &&
            <p style={{ color: '#1D5BBF', textDecoration: 'underline', fontWeight: 'bold', cursor: 'pointer' }} onClick={handleSkip}>Skip</p>
          }

        </div>
        {
          errorNot &&

          <ToastNotification openToaster={errorNot} message={'Please fill all mandatory fields'} handleClose={() => setErrorNot(false)} toastType={'error'} />

        }
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={userInfo.loading || customLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        <MuiModal modalOpen={loading || userInfo.status === userStatus.pending} modalClose={() => setLoading(false)} noheader>
          <div className='px-5 py-1 flex justify-center items-center'>
            <div className='flex justify-center items-center flex-col gap-5 py-10 px-20 mt-20 mb-20'
              style={{ background: 'linear-gradient(101.69deg, #1D5BBF -94.42%, #00AEBD 107.97%)', borderRadius: '10px' }}>
              <img src={SuccessTik} alt="SuccessTik" />
              <p className='text-white text-[12px]'>

                {role === 'mentee' ?

                  (redirect ? 'We are redirecting to programs page' :
                    'Questions submitted Successfully')

                  : (redirect ? 'We are redirecting to login page' : 'Questions submitted Successfully. Please wait for admin approval')}
              </p>
            </div>

          </div>
        </MuiModal>

        <div style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)' }}>
          <div className="steps pl-24 pr-28" style={{ boxShadow: '4px 4px 15px 0px rgba(0, 0, 0, 0.1)' }}>
            <Stepper steps={allStepList} currentStep={currentStep} handleStepClick={handleStepClick} btnTypeAction={btnTypeAction} />
          </div>
          {
            (formFields.length && formFields[currentStep - 1]) ?
              <StepComponenRender
                key={currentStep}
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
