import React, { useEffect, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ReactPlayer from 'react-player';

import ProgramSteps from './ProgramsSteps'
import { ProgramTabs, ProgramFields } from '../../../utils/formFields'
import { updateNewPrograms, getAllCategories, getAllMaterials, getAllCertificates, getAllSkills, getAllMembers, createNewPrograms, editUpdateProgram, getProgramNameValidate } from '../../../services/programInfo'
import { CertificateColumns, MaterialColumns, MemberColumns, SkillsColumns } from '../../../mock';
import DataTable from '../../../shared/DataGrid';
import { programStatus } from '../../../utils/constant';
import MuiModal from '../../../shared/Modal'
import Tooltip from '../../../shared/Tooltip';

import CancelIcon from '../../../assets/images/cancel-colour1x.png'
import SuccessTik from '../../../assets/images/blue_tik1x.png';
import SearchIcon from '../../../assets/images/search1x.png';
import CertificateIcon from '../../../assets/images/dummy_certificate.png';
import SuccessIcon from "../../../assets/images/Success_tic1x.png"
import FailedIcon from "../../../assets/images/cancel3x.png"
import ToastNotification from '../../../shared/Toast';
import { getProgramDetails } from '../../../services/userprograms';

export default function CreatePrograms() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const params = useParams()
    const userInfo = useSelector(state => state.userInfo)
    const [loading, setLoading] = useState({ create: false, success: false })
    const { allPrograms, category, materials, certificate, skills, members, loading: apiLoading, status } = useSelector(state => state.programInfo)
    const { programdetails, loading: programLoading, status: userProgramStatus } = useSelector(state => state.userPrograms)
    const [currentStep, setCurrentStep] = useState(1)
    const [stepData, setStepData] = useState({})
    const [actionModal, setActionModal] = useState('')
    const [onBlureFunction,setOBlureFunction] = useState(false)
    const [programAllFields, setProgramAllFields] = useState(ProgramFields)
    const [formDetails, setFormDetails] = useState({ category: [], materials: [], skills: [], certificate: [], members: [] })
    const [logo, setLogo] = useState({})
    const [stepWiseData, setStepWiseData] = useState({})
    const [programApiStatus, setProgramApiStatus] = useState('')
    const [updateProgramInfo, setUpdateProgramInfo] = useState(false)

    const [viewDetails, setViewDetails] = useState({ material: false, skills: false, certificate: false })
    const [viewDetailsInfo, setViewDetailsInfo] = useState({ material: {}, skills: {}, certificate: {} })
    const [tabActionInfo, setTabActionInfo] = useState({ activeTab: 'program_information', error: false })

    const resetViewInfo = { material: false, skills: false, certificate: false }

    const role = userInfo.data.role || ''

    const handleTab = (key) => {
        const tabIndex = ProgramTabs.findIndex(tab => tab.key === key)
        // if (stepWiseData.hasOwnProperty(tabIndex + 1) || stepWiseData.hasOwnProperty(tabIndex)) {
        const nextIndex = tabIndex + 1
        setCurrentStep(nextIndex)
        setTabActionInfo({ ...tabActionInfo, activeTab: key })
        // }
    }
// const saveDraft = (data)=> {
//     let fieldData = {
//         ...stepData, ...data,
//     }
//     setStepData(fieldData)

// }
const onBlureFun = (data) => {
    setOBlureFunction(true)
    dispatch(getProgramNameValidate(data)).then((res) => {
        if (res?.meta?.requestStatus === "fulfilled") {
            if (!res?.payload?.is_available) {
                setOBlureFunction(false)
                // setTabActionInfo({ ...tabActionInfo, activeTab: ProgramTabs[currentStep].key })
            }
        }
    })
    setOBlureFunction(false)
}
    const handleNextStep = (data, stData) => {
        setStepWiseData(stData)
        let u = { ...data }
        let fieldData = {
            ...stepData, ...data,
        }
        setStepData(fieldData)

        if (currentStep === 1) {
            dispatch(getProgramNameValidate(data?.program_name)).then((res) => {
                if (res?.meta?.requestStatus === "fulfilled") {
                    if (!res?.payload?.is_available) {
                        setCurrentStep(currentStep + 1)
                        setTabActionInfo({ ...tabActionInfo, activeTab: ProgramTabs[currentStep].key })
                    }
                }
            })
        } else {
            if (ProgramFields.length === currentStep) {
                const answeredSteps = Object.keys(stepWiseData).length;
                if ((answeredSteps === currentStep - 1 && !stepWiseData.hasOwnProperty(currentStep)) || answeredSteps === ProgramFields.length) {
                    let bodyFormData = new FormData();

                    const fiel = ['learning_materials', 'skills', 'certificates', 'members']
                    fieldData.group_chat_requirement = fieldData.group_chat_requirement === 'true'
                    fieldData.individual_chat_requirement = fieldData.individual_chat_requirement === 'true'
                    fieldData.mentee_upload_certificates = fieldData.mentee_upload_certificates === 'true'
                    for (let a in fieldData) {
                        if (a === 'program_image' && logo.program_image) { bodyFormData.append(a, logo.program_image); }
                        if (a === 'image' && logo.image) { bodyFormData.append(a, logo.image); }
                        if (a === 'start_date' || a === 'end_date') { bodyFormData.append(a, new Date(fieldData[a]).toISOString()); }
                        else if (fiel.includes(a)) { bodyFormData.append(a, JSON.stringify(fieldData[a])) }
                        else bodyFormData.append(a, fieldData[a]);
                    }

                    let status = ''

                    if (fieldData.hasOwnProperty('status') && fieldData.status === 'draft') {
                        status = 'draft'
                    }


                    setProgramApiStatus(status)

                    if (params.id) {
                        if (programdetails.status === 'draft' && status !== 'draft') {
                            bodyFormData.append('status', 'create')
                        }
                        if (typeof fieldData?.program_image === 'string') {
                            bodyFormData.delete('program_image');
                        }
                        if (typeof fieldData?.image === 'string') {
                            bodyFormData.delete('image');
                        }

                        bodyFormData.append('program_id', params.id)
                        dispatch(editUpdateProgram(bodyFormData))
                    } else {
                        dispatch(createNewPrograms(bodyFormData))
                    }
                } else {
                    setTabActionInfo({ ...tabActionInfo, error: true })
                }
            }
            else {
                let allLogo = { ...logo }
                if (data.hasOwnProperty('image') && data?.image?.length) {
                    allLogo.image = data.image[0]
                }
                if (data.hasOwnProperty('program_image') && data?.program_image?.length) {
                    allLogo.program_image = data.program_image[0]

                }
                setLogo(allLogo)
                setCurrentStep(currentStep + 1)
                setTabActionInfo({ ...tabActionInfo, activeTab: ProgramTabs[currentStep].key })
            }
        }

    }


    const handlePreviousStep = () => {
        setCurrentStep(currentStep - 1)
        setTabActionInfo({ ...tabActionInfo, activeTab: ProgramTabs[currentStep - 2].key })
    }

    const handleAction = (key) => {
        setActionModal(key)
    }

    const updateFormFields = (key, value, currentStep) => {
        const currentStepFields = programAllFields[currentStep]
        const updatedFields = currentStepFields.map(field => {
            if (field.name === key) {
                return {
                    ...field,
                    value
                }
            }
            return field
        })


        const updateProgramFields = programAllFields.map((field, index) => {
            if (index === currentStep) {
                return updatedFields
            }
            return field
        })

        setProgramAllFields(updateProgramFields)
    }

    const handleAddPopupData = (key, value) => {
        if (value.length) {
            setStepData({ ...stepData, [key]: value })
            updateFormFields(key, value, currentStep - 1)
            setActionModal('')
        }
    }

    const footerComponent = (props) => {
        return (
            <div className='flex gap-6 justify-center items-center py-4'>
                <button onClick={() => setActionModal('')} className='py-3 px-6 w-[16%]'
                    style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '3px', color: 'rgba(29, 91, 191, 1)' }}>Cancel</button>
                <button onClick={() => handleAddPopupData('learning_materials', props.selectedRows)}
                    className='text-white py-3 px-6 w-[16%]'
                    style={{ background: 'linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)', borderRadius: '3px' }}>Add Material</button>
            </div>)
    }

    const skillsFooterComponent = (props) => {
        return (
            <div className='flex gap-6 justify-center items-center py-4'>
                <button onClick={() => setActionModal('')} className='py-3 px-6 w-[16%]'
                    style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '3px', color: 'rgba(29, 91, 191, 1)' }}>Cancel</button>
                <button onClick={() => handleAddPopupData('skills', props.selectedRows)}
                    className='text-white py-3 px-6 w-[16%]'
                    style={{ background: 'linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)', borderRadius: '3px' }}>Add Skills</button>
            </div>)
    }

    const certificateFooterComponent = (props) => {
        return (
            <div className='flex gap-6 justify-center items-center py-4'>
                <button onClick={() => setActionModal('')} className='py-3 px-6 w-[16%]'
                    style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '3px', color: 'rgba(29, 91, 191, 1)' }}>Cancel</button>
                <button onClick={() => handleAddPopupData('certificates', props.selectedRows)}
                    className='text-white py-3 px-6 w-[16%]'
                    style={{ background: 'linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)', borderRadius: '3px' }}>Add Certificate</button>
            </div>)
    }

    const memberFooterComponent = (props) => {
        return (
            <div className='flex gap-6 justify-center items-center py-4'>
                <button onClick={() => setActionModal('')} className='py-3 px-6 w-[16%]'
                    style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '3px', color: 'rgba(29, 91, 191, 1)' }}>Cancel</button>
                <button onClick={() => handleAddPopupData('members', props.selectedRows)}
                    className='text-white py-3 px-6 w-[16%]'
                    style={{ background: 'linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)', borderRadius: '3px' }}>Add Members</button>
            </div>)
    }

    const handleModalSearch = (field) => {
        switch (field.target.name) {
            case 'learning_materials':
                const material = [...materials].filter(material => material.name.toLowerCase().includes(field.target.value))
                setFormDetails({ ...formDetails, materials: material });
                break;
            case 'skills':
                const skill = [...skills].filter(skils => skils.name.toLowerCase().includes(field.target.value))
                setFormDetails({ ...formDetails, skills: skill });
                break;
            case 'certificates':
                const certificates = [...certificate].filter(certificate => certificate.name.toLowerCase().includes(field.target.value))
                setFormDetails({ ...formDetails, certificate: certificates });
                break;
            case 'members':
                const member = [...members].filter(member => member.first_name.toLowerCase().includes(field.target.value))
                setFormDetails({ ...formDetails, members: member });
                break;
            default:
                break;
        }
    }

    const fetchCategoryData = (categoryId) => {
        dispatch(getAllMaterials(categoryId))
        dispatch(getAllCertificates(categoryId))
        dispatch(getAllSkills(categoryId))
        dispatch(getAllMembers(categoryId))
    }

    const updatedMaterialColumn = [...MaterialColumns].map(mcol => {
        if (mcol.field === 'action') {
            return {
                ...mcol,
                renderCell: (params) => {
                    return <button style={{
                        background: 'rgb(29, 91, 191)',
                        color: 'rgb(255, 255, 255)',
                        padding: '2px 20px',
                        height: '32px',
                        margin: '9px 0px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '3px'
                    }}
                        onClick={() => {
                            setViewDetailsInfo({ ...viewDetailsInfo, material: params.row });
                            setViewDetails({ material: true, skills: false, certificate: false })
                        }}>View Details</button>;
                }
            }
        }
        return mcol
    })

    const updatedSkillColumn = [...SkillsColumns].map(mcol => {
        if (mcol.field === 'action') {
            return {
                ...mcol,
                renderCell: (params) => {
                    return <button style={{
                        background: 'rgb(29, 91, 191)',
                        color: 'rgb(255, 255, 255)',
                        padding: '2px 20px',
                        height: '32px',
                        margin: '9px 0px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '3px'
                    }}
                        onClick={() => {
                            setViewDetailsInfo({ ...viewDetailsInfo, skills: params.row });
                            setViewDetails({ material: false, skills: true, certificate: false })
                        }}>View Details</button>;
                }
            }
        }
        return mcol
    })

    const updatedCertificateColumn = [...CertificateColumns].map(mcol => {
        if (mcol.field === 'action') {
            return {
                ...mcol,
                renderCell: (params) => {
                    return <button style={{
                        background: 'rgb(29, 91, 191)',
                        color: 'rgb(255, 255, 255)',
                        padding: '2px 20px',
                        height: '32px',
                        margin: '9px 0px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '3px'
                    }}
                        onClick={() => {
                            setViewDetailsInfo({ ...viewDetailsInfo, certificate: params.row });
                            setViewDetails({ material: false, skills: false, certificate: true })
                        }}>View Details</button>;
                }
            }
        }
        return mcol
    })

    const handleClose = () => {
        setTabActionInfo({ ...tabActionInfo, error: false })
    }

    useEffect(() => {
        if (currentStep === 1) {
            const currentStepFields = programAllFields[currentStep - 1]
            const updatedFields = currentStepFields.map(field => {
                if (field.name === 'category') {
                    return {
                        ...field,
                        options: category
                    }
                }
                return field
            })

            const updateProgramFields = programAllFields.map((field, index) => {
                if (index === currentStep - 1) {
                    return updatedFields
                }
                return field
            })

            setProgramAllFields(updateProgramFields)
        }
        setFormDetails({ category: category, materials: materials, certificate: certificate, skills: skills, members: members })
    }, [category, materials, certificate, skills, members])

    useEffect(() => {
        if (loading.success) {
            setTimeout(() => {
                setLoading({ create: false, success: false })
                if (allPrograms && allPrograms.length) {
                    navigate(`/dashboard?type=${programStatus.yetToPlan}`)
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

    useEffect(() => {
        dispatch(getAllCategories())
    }, [])

    useEffect(() => {
        if (role === 'mentee') navigate('/programs')
    }, [role])

    useEffect(() => {
        if (role !== '') {
            const widthAdjustMentField1 = ['max_mentor_count', 'max_mentee_count', 'group_chat_requirement', 'individual_chat_requirement']
            const widthAdjustMentField2 = ['auto_approval', 'venue']
            const currentStepField = programAllFields[currentStep - 1].filter(curfields => curfields.for.includes(role))
            let updateField = currentStepField
            if (role === 'admin') {
                updateField = currentStepField.map(programfield => {
                    if (widthAdjustMentField1.includes(programfield.name)) {
                        return {
                            ...programfield,
                            width: 'w-[24%]'
                        }
                    }
                    if (widthAdjustMentField2.includes(programfield.name)) {
                        return {
                            ...programfield,
                            width: 'w-[49%]'
                        }
                    }
                    return programfield
                })
            }

            const fields = programAllFields.map((field, i) => {
                if (i === currentStep - 1) {
                    return updateField
                }
                return field
            })
            setProgramAllFields(fields)
        }
    }, [currentStep, role])

    useEffect(() => {
        if (status === programStatus.create || status === programStatus.exist || status === programStatus.error || status === programStatus.update) {
            setTimeout(() => {
                dispatch(updateNewPrograms({ status: '' }))
                if (status === programStatus.create || status === programStatus.update) navigate('/dashboard')
            }, [3000])
        }
    }, [status])

    useEffect(() => {
        if (tabActionInfo.error) {
            setTimeout(() => {
                setTabActionInfo({ ...tabActionInfo, error: false })
            }, 3000)

        }
    }, [tabActionInfo.error])

    useEffect(() => {
        if (Object.keys(programdetails).length && params.id !== '') {
            let stepListData = {}
            let data = {}

            programAllFields.forEach((field, index) => {
                let stepField = {}
                field.forEach((fl, i) => {
                    let currentField = fl.name
                    let currentFieldValue = programdetails[currentField]

                    if (currentField === 'category') {
                        currentFieldValue = programdetails.categories[0].id
                        fetchCategoryData(programdetails.categories[0].id)
                    }

                    if (currentField === 'start_date' || currentField === 'end_date') {
                        currentFieldValue = new Date(programdetails[currentField])
                    }

                    if (currentField === 'mentee_upload_certificates' || currentField === 'group_chat_requirement' || currentField === 'individual_chat_requirement') {
                        currentFieldValue = programdetails[currentField] ? 'true' : 'false'
                    }

                    if (currentField === 'certificates') {
                        currentFieldValue = programdetails['certifications']
                    }

                    if (currentField === 'testimonial_type') {
                        currentFieldValue = programdetails['testimonial_types']
                    }

                    if (currentField === 'program_image') {
                        currentFieldValue = programdetails['program_image']
                    }

                    stepField[currentField] = currentFieldValue
                })
                stepListData = { ...stepListData, [index]: stepField }
                data = { ...data, ...stepField }
            })

            setStepData(data)

            setTimeout(() => {
                setUpdateProgramInfo(false)
            }, 1000)

        }
    }, [programdetails])

    useEffect(() => {
        if (params.id) {
            setUpdateProgramInfo(true)
            dispatch(getProgramDetails(params.id))
        }
    }, [params])

    return (
        <div className="dashboard-content px-8 mt-10">
            <div style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
                <div className="title flex justify-between py-3 px-4 border-b-2 items-center">
                    <div className="flex gap-4">
                        <h4>{params.id ? 'Update Program' : 'Create New Program'}</h4>
                    </div>
                    <div className="flex gap-20 items-center">
                        <Tooltip title="Cancel">
                            <img className='cursor-pointer' onClick={() => navigate('/programs')} src={CancelIcon} alt="CancelIcon" />
                        </Tooltip>
                    </div>
                </div>

                {
                    tabActionInfo.error &&
                    <ToastNotification openToaster={tabActionInfo.error} message={'Please fill all mandatory fields'} handleClose={handleClose} toastType={'error'} />

                }

                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loading.create || onBlureFunction?!apiLoading:onBlureFunction || status === programStatus.create || status === programStatus.exist || status === programStatus.error
                        || programLoading || updateProgramInfo || status === programStatus.update
                    }
                >
                    {
                        loading.create || apiLoading || programLoading || updateProgramInfo ?
                            <CircularProgress color="inherit" />
                            : null
                    }

                    {
                        status === programStatus.create || status === programStatus.exist || status === programStatus.error || status === programStatus.update ?
                            <div className="w-2/6 bg-white flex flex-col gap-4 h-[330px] justify-center items-center">
                                <img src={status === programStatus.exist ? FailedIcon : (status === programStatus.create || status === programStatus.update) ? SuccessIcon : FailedIcon} alt="VerifyIcon" />
                                <span style={{ color: '#232323', fontWeight: 600 }}>
                                    {status === programStatus.exist ? 'Program already exist' : status === programStatus.error ? 'There is a Server Error. Please try again later' :
                                        `Program ${programApiStatus === 'draft' ? 'Drafed' : status === programStatus.update ? 'Updated' : 'Created'} Successfully!`}
                                </span>
                            </div>
                            : null
                    }
                </Backdrop>

                {
                    !updateProgramInfo &&

                    <div className='px-8 py-4'>
                        <div className='flex gap-3'>
                            {
                                ProgramTabs.map((actionBtn, index) =>
                                    <Tooltip title={actionBtn.name}>
                                        <button key={index} className='px-5 py-4 text-[14px]' style={{
                                            background: tabActionInfo.activeTab === actionBtn.key ? 'linear-gradient(97.86deg, #005DC6 -15.07%, #00B1C0 112.47%)' :
                                                'rgba(249, 249, 249, 1)',
                                            color: tabActionInfo.activeTab === actionBtn.key ? '#fff' : '#000',
                                            borderRadius: '3px'
                                        }}
                                            onClick={() => handleTab(actionBtn.key)}
                                        >{actionBtn.name}</button>
                                    </Tooltip>
                                )
                            }
                        </div>
                        <ProgramSteps
                            stepData={stepData}
                            currentStepData={stepData[ProgramTabs[currentStep - 1].key]}
                            stepFields={programAllFields[currentStep - 1]}
                            currentStep={currentStep}
                            handleNextStep={handleNextStep}
                            // handleSaveDraft={saveDraft}
                            onBlurFunction={onBlureFun}
                            handlePreviousStep={handlePreviousStep}
                            handleAction={handleAction}
                            totalSteps={programAllFields.length}
                            fetchCategoryData={fetchCategoryData}
                            programDetails={programdetails}
                        />
                    </div>
                }




                <MuiModal modalSize='lg' modalOpen={viewDetails.material} modalClose={() => { setViewDetails(resetViewInfo) }} noheader>
                    <div className='px-5 py-5'>
                        <div className='flex justify-center flex-col gap-5  mt-4 mb-4'
                            style={{ border: '1px solid rgba(217, 228, 242, 1)', borderRadius: '10px', }}>
                            <div className='flex justify-between px-3 py-4 items-center' style={{ background: 'rgba(217, 228, 242, 1)' }}>
                                <p className='text-[14px]' style={{ color: 'rgba(24, 40, 61, 1)' }}>{viewDetailsInfo.material?.name} </p>
                                <img className='cursor-pointer' onClick={() => setViewDetails(resetViewInfo)} src={CancelIcon} alt="CancelIcon" />
                            </div>
                            <div className='px-4 py-3'>
                                <p className='text-[12px] pb-6'>
                                    {viewDetailsInfo.material?.material_details}
                                </p>
                                {
                                    viewDetailsInfo.material.material_type === 'document' ?
                                        <a className='underline' href={viewDetailsInfo.material.file} target='_blank' >{viewDetailsInfo.material.name}</a>
                                        : null

                                }

                                {
                                    viewDetailsInfo.material.material_type === 'video' ?

                                        <ReactPlayer
                                            // onPlay={this.handlePlay()}
                                            // onPause={this.handlePause()}
                                            url={viewDetailsInfo.material.file} />
                                        // <video width="auto" height="auto" controls autoplay >
                                        //     <source src={viewDetailsInfo.material.file} type="video/ogg" />
                                        //     Your browser does not support the video tag.
                                        // </video>
                                        : null

                                }


                            </div>
                            <div className='flex justify-center items-center pt-5 pb-10'>
                                <button onClick={() => setViewDetails(resetViewInfo)}
                                    className='text-white py-3 px-7 w-[25%]'
                                    style={{ background: 'linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)', borderRadius: '3px' }}>Close</button>
                            </div>

                        </div>

                    </div>
                </MuiModal>

                <MuiModal modalSize='lg' modalOpen={viewDetails.skills} modalClose={() => setViewDetails(resetViewInfo)} noheader>
                    <div className='px-5 py-5'>
                        <div className='flex justify-center flex-col gap-5  mt-4 mb-4'
                            style={{ border: '1px solid rgba(217, 228, 242, 1)', borderRadius: '10px', }}>
                            <div className='flex justify-between px-3 py-4 items-center' style={{ background: 'rgba(217, 228, 242, 1)' }}>
                                <p className='text-[14px]' style={{ color: 'rgba(24, 40, 61, 1)' }}>{viewDetailsInfo.skills?.name}</p>
                                <img className='cursor-pointer' onClick={() => setViewDetails(resetViewInfo)} src={CancelIcon} alt="CancelIcon" />
                            </div>
                            <div className='px-4 py-3'>
                                <p className='text-[12px] pb-6'>
                                    {viewDetailsInfo.skills?.desc}
                                </p>
                            </div>
                            <div className='flex justify-center items-center pt-5 pb-10'>
                                <button onClick={() => setViewDetails(resetViewInfo)}
                                    className='text-white py-3 px-7 w-[25%]'
                                    style={{ background: 'linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)', borderRadius: '3px' }}>Close</button>
                            </div>
                        </div>
                    </div>
                </MuiModal>

                <MuiModal modalSize='lg' modalOpen={viewDetails.certificate} modalClose={() => setViewDetails(resetViewInfo)} noheader>
                    <div className='px-5 py-5'>
                        <div className='flex justify-center flex-col gap-5  mt-4 mb-4'
                            style={{ border: '1px solid rgba(217, 228, 242, 1)', borderRadius: '10px', }}>
                            <div className='flex justify-between px-3 py-4 items-center' style={{ background: 'rgba(217, 228, 242, 1)' }}>
                                <p className='text-[14px]' style={{ color: 'rgba(24, 40, 61, 1)' }}>{viewDetailsInfo.certificate?.name} </p>
                                <img className='cursor-pointer' onClick={() => setViewDetails(resetViewInfo)} src={CancelIcon} alt="CancelIcon" />
                            </div>
                            <div className='px-4 py-3'>
                                <p className='text-[12px] pb-6'>
                                    {viewDetailsInfo.certificate?.certificate_description}
                                </p>
                                <img className='w-full h-[500px]' src={CertificateIcon} alt="CertificateIcon" />
                                <p className='text-[12px] py-6'>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                                    ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
                                    in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </p>
                            </div>
                            <div className='flex justify-center items-center pt-5 pb-10'>
                                <button onClick={() => setViewDetails(resetViewInfo)}
                                    className='text-white py-3 px-7 w-[25%]'
                                    style={{ background: 'linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)', borderRadius: '3px' }}>Close</button>
                            </div>
                        </div>
                    </div>
                </MuiModal>

                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loading.success}
                >
                    <div className='px-5 py-1 flex justify-center items-center'>
                        <div className='flex justify-center items-center flex-col gap-[2.25rem] py-[4rem] px-[3rem] mt-20 mb-20'
                            style={{ background: '#fff', borderRadius: '10px' }}>
                            <img src={SuccessTik} alt="SuccessTik" />
                            <p className='text-[16px] font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#1D5BBF] to-[#00AEBD]'
                                style={{
                                    fontWeight: 600
                                }}
                            >Requested Successfully</p>
                        </div>

                    </div>

                </Backdrop>

                <MuiModal modalSize='lg' modalOpen={actionModal !== ''} modalClose={() => setActionModal('')} noheader>
                    <div className='relative'>
                        <input className='input-bg w-full h-[60px] px-5 mb-4 text-[14px]' style={{ borderRadius: '50px', }}
                            placeholder='Search' name={actionModal} onChange={(e) => handleModalSearch(e)} />
                        <img className='absolute top-4 right-7' src={SearchIcon} alt="SearchIcon" />
                    </div>
                    {
                        actionModal === 'learning_materials' ?

                            <DataTable rows={formDetails.materials} columns={updatedMaterialColumn} footerAction={() => setActionModal('')}
                                footerComponent={footerComponent} selectedAllRows={stepData?.learning_materials || []} />
                            : actionModal === 'skills' ?

                                <DataTable rows={formDetails.skills} columns={updatedSkillColumn} footerAction={() => setActionModal('')}
                                    footerComponent={skillsFooterComponent} selectedAllRows={stepData?.skills || []} />
                                :
                                actionModal === 'certificates' ?

                                    <DataTable rows={formDetails.certificate} columns={updatedCertificateColumn} footerAction={() => setActionModal('')}
                                        footerComponent={certificateFooterComponent} selectedAllRows={stepData?.certificates || []} />
                                    : actionModal === 'members' ?

                                        <DataTable rows={formDetails.members} columns={MemberColumns} footerAction={() => setActionModal('')}
                                            footerComponent={memberFooterComponent} selectedAllRows={stepData?.members || []} />
                                        : null

                    }

                </MuiModal>
            </div>
        </div>
    )
}
