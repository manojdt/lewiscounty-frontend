import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import EditIcon from '../../assets/icons/editIcon.svg';
import SuccessTik from '../../assets/images/blue_tik1x.png';
import CancelIcon from '../../assets/images/cancel1x.png'
import FilterIcon from '../../assets/icons/Filter.svg';
import UserImage from "../../assets/icons/user-icon.svg";
import MoreIcon from '../../assets/icons/moreIcon.svg'
import BookmarkedIcon from '../../assets/icons/Bookmarked.svg'
import BookmarkedColorIcon from '../../assets/images/bookmarked-colour1x.png'
import CalenderIcon from '../../assets/icons/Calender.svg';
import StarColorIcon from '../../assets/icons/starColor.svg';
import UploadIcon from "../../assets/images/image_1x.png"
import DeleteIcon from "../../assets/images/delete_1x.png"
import { ProgramStatusInCard } from '../../utils/constant';
import MuiModal from '../Modal';
import { Button } from '../Button';
import { updateProgramImage } from '../../services/userprograms';
import { Backdrop, CircularProgress } from '@mui/material';



export default function ProgramCard({ title, viewpage, handleNavigateDetails, handleBookmark, programs, height, action = [], noTitle = false, loadProgram }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [anchorEl, setAnchorEl] = useState(null);
    const [programImage, setProgramImage] = useState(null)
    const [hoverIndex, setHoverIndex] = useState({ image: null, desc: null })
    const [programUploadAction, setProgramUploadAction] = useState({ loading: false, imageModal: false, successModal: false, error: '', selectedProgram: {} })

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        setError,
        setValue,
        getValues
    } = useForm();

    const open = Boolean(anchorEl);
    const userInfo = useSelector(state => state.userInfo)
    const role = userInfo.data.role

    const statusNotShow = ['yettoapprove', 'yettojoin', 'yettostart', 'draft', 'new_program_request_rejected', 'start_request_submitted']

    const programImageRestirct = ['yettoapprove', 'draft', 'cancelled', 'completed']

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseModal = () => {
        setProgramUploadAction({ loading: false, imageModal: false, successModal: false, error: '', selectedProgram: {} })
    }

    const handleProgramImageUpdate = (programInfo) => {
        setProgramUploadAction({ ...programUploadAction, imageModal: true, selectedProgram: programInfo })
    }

    const handleProgramImageSubmit = (data) => {
        setProgramUploadAction({ ...programUploadAction, loading: true })
        let bodyFormData = new FormData();
        bodyFormData.append('program_id', programUploadAction.selectedProgram.id)
        bodyFormData.append('program_image', programImage[0])
        dispatch(updateProgramImage(bodyFormData)).then(() => {
            loadProgram && loadProgram()
            setProgramUploadAction({ loading: false, imageModal: false, successModal: true, error: '', selectedProgram: {} })
            setProgramImage(null)
            reset()
        })
    }

    const handleDeleteImage = () => {
        setValue('program_image', '')
        setProgramImage(null)
    }

    const imageField = register('program_image', { required: 'This field is required' })

    useEffect(() => {
        if (programUploadAction.successModal) {
            setTimeout(() => {
                handleCloseModal()
            }, 3000)
        }
    }, [programUploadAction.successModal])

    return (

        <div className='main-program' style={{ boxShadow: noTitle ? 'none' : '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
            {
                !noTitle &&

                <div className="title flex justify-between py-3 px-4 border-b-2 items-center">
                    <div className="flex gap-4">
                        <div className="card-dash" style={{ background: 'linear-gradient(180deg, #00B1C0 0%, #005DC6 100%)' }} ></div>
                        <h4>{title}</h4>
                        <img src={FilterIcon} alt="statistics" />
                    </div>
                    {
                        programs && programs.length ?

                            <p className="text-[12px] py-2 px-2 cursor-pointer" style={{
                                background: 'rgba(217, 228, 242, 1)', color: 'rgba(29, 91, 191, 1)', borderRadius: '3px'
                            }}
                                onClick={() => navigate(viewpage)}
                            >View All</p>

                            : null
                    }

                    {
                        action && action.length ?
                            <>
                                <div className='cursor-pointer flex items-center h-full' onClick={(e) => handleClick(e)}>
                                    <img src={MoreIcon} alt='MoreIcon' />
                                </div>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                >

                                    {
                                        action.map((act, i) =>
                                            <MenuItem key={i} onClick={() => navigate(act.url)} className='!text-[12px]'>
                                                {act.icon && <img src={act.icon} alt="Icon" className='pr-3 w-[30px]' />}
                                                {act.name}
                                            </MenuItem>
                                        )
                                    }
                                </Menu>
                            </>

                            : null

                    }

                </div>
            }


            <div className="py-3 px-3 ">
                <div className="flex flex-wrap">
                    {
                        programs && programs.length ?

                            programs.map((currentProgram, index) => {
                                let startDate = ''
                                if (currentProgram.start_date !== '') {
                                    startDate = new Date(currentProgram.start_date).toISOString().substring(0, 10).split("-")
                                }
                                const actualStartDate = startDate.length ? `${startDate[2]}/${startDate[1]}/${startDate[0]}` : ''

                                return (
                                    <div key={index} className={`curated-programs program-container flex gap-1 items-center py-5 px-5 w-[33%]`}
                                        style={{
                                            ...currentProgram.status === 'yettoapprove' ? {
                                                opacity: '0.5',
                                                pointerEvents: 'none',
                                                cursor: 'not-allowed',
                                            }
                                                :
                                                {}
                                        }}
                                    >
                                        <div className="w-full" style={{ boxShadow: '4px 4px 15px 0px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
                                            <div className="py-6 px-7 border-b-2 relative">
                                                <div className="h-full relative" style={{ borderRadius: '10px' }}>
                                                    <img className="object-cover w-full h-[150px] cursor-pointer" src={currentProgram.program_image} alt="Program Logo"
                                                        onMouseEnter={() => setHoverIndex({ ...hoverIndex, image: index })} onMouseLeave={() => setHoverIndex({ ...hoverIndex, image: null })}
                                                    />
                                                    {
                                                        (currentProgram.program_edit && !programImageRestirct.includes(currentProgram.status)) &&

                                                        <div className={`absolute top-2 left-3 cursor-pointer  ${hoverIndex.image === index ? 'show' : 'hidden'}`} style={{ background: '#fff', borderRadius: '50%', padding: '13px 15px' }}
                                                            onClick={() => handleProgramImageUpdate(currentProgram)} onMouseEnter={() => setHoverIndex({ ...hoverIndex, image: index })} onMouseLeave={() => setHoverIndex({ ...hoverIndex, image: null })}
                                                        >
                                                            <img className="h-[25px] w-[22px]" src={EditIcon} alt="EditIcon" />
                                                        </div>
                                                    }
                                                    <div className='absolute top-2 right-0' style={{ background: '#fff', borderRadius: '50%', padding: '14px 17px' }}>
                                                        <img className="cursor-pointer"
                                                            onClick={() => handleBookmark(currentProgram)}
                                                            src={currentProgram.bookmark ? BookmarkedColorIcon : BookmarkedIcon} alt="BookmarkedIcon" />
                                                    </div>
                                                </div>

                                                <div className='flex justify-between py-4'>
                                                    <h4 className="text-[16px]" title={currentProgram.program_name} style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '180px' }}>
                                                        {currentProgram.program_name}
                                                    </h4>
                                                    {
                                                        currentProgram.categories.length > 0 &&
                                                        <p className="py-1 px-1 text-[12px] text-center rounded-3xl w-[90px]"
                                                            style={{ border: '1px solid rgba(238, 238, 238, 1)' }}>{currentProgram?.categories[0]?.name}</p>
                                                    }
                                                </div>
                                                <div className='cursor-pointer flex justify-between'
                                                    onClick={() => navigate(`/update-program/${currentProgram.id}`)}
                                                onMouseOver={() => setHoverIndex({ ...hoverIndex, desc: index })} onMouseLeave={() => setHoverIndex({ ...hoverIndex, desc: null })}>

                                                    <span className="text-[12px] line-clamp-2 ">{currentProgram.description}</span>
                                                    {
                                                        (currentProgram.program_edit && !programImageRestirct.includes(currentProgram.status)) &&
                                                        <img className={`h-[18px] w-[15px] ${hoverIndex.desc === index ? 'show' : 'hidden'}`} src={EditIcon} alt="EditIcon" />
                                                    }
                                                </div>
                                                <div className='flex gap-2 items-center py-3 text-[12px]'>
                                                    <img src={StarColorIcon} alt="StarColorIcon" />
                                                    <span>4.6</span>
                                                    <span style={{ borderRight: '1px solid #18283D' }}></span>
                                                    <img className="w-6 h-6 rounded-full shadow-lg object-cover" src={UserImage} alt="User logo" />
                                                    <span style={{
                                                        textOverflow: 'ellipsis', overflow: 'hidden',
                                                        width: '215px', whiteSpace: 'nowrap'
                                                    }}>Instructor : {currentProgram?.mentor_name}</span>
                                                </div>
                                                <div className='flex justify-center pt-2'>

                                                    {
                                                        currentProgram.status === 'yettoapprove' || currentProgram.status === 'draft' ?

                                                            <button className={`text-white text-[12px] py-3 ${currentProgram.status === 'draft' ? 'w-[110px]' : 'w-[170px]'}`}
                                                                onClick={() => currentProgram.status === 'draft' ? navigate(`/update-program/${currentProgram.id}`) : undefined}
                                                                style={{ background: currentProgram.status === 'yettoapprove' ? '#76818E' : 'rgba(29, 91, 191, 1)', borderRadius: '5px' }}>
                                                                {currentProgram.status === 'draft' ? 'Continue' : 'Waiting for approval'}

                                                            </button>
                                                            :

                                                            <button className="text-white text-[12px] py-3 w-[140px]"
                                                                onClick={() => handleNavigateDetails(currentProgram)}
                                                                style={{ background: 'rgba(29, 91, 191, 1)', borderRadius: '5px' }}>View Details</button>
                                                    }
                                                </div>

                                            </div>


                                            <div className="flex justify-between pb-3 mx-4 my-4 items-center">
                                                <div className="program-time-info flex text-[12px] gap-4 items-center">
                                                    <img src={CalenderIcon} alt="CalendarImage" />
                                                    <span className='program-date'>{actualStartDate}</span>
                                                    <div
                                                        className="w-[6px] h-[6px]  mx-[-1px]  flex items-center justify-center">
                                                        <span className="w-[6px] h-[6px]  rounded-full" style={{ background: 'rgba(0, 0, 0, 1)' }}></span>
                                                    </div>

                                                    <span className='program-time'>{'10 A.M'}</span>
                                                </div>

                                                {
                                                    !statusNotShow.includes(currentProgram.status) ?

                                                        <div className="text-[12px] px-2 py-2" style={{
                                                            background: `${ProgramStatusInCard[currentProgram.status]?.bg}`,
                                                            color: `${ProgramStatusInCard[currentProgram.status]?.color}`, borderRadius: '3px'
                                                        }}>
                                                            {ProgramStatusInCard[currentProgram.status]?.text}
                                                        </div>

                                                        :

                                                        <div className="posted-tim text-[12px] px-2 py-2" style={{ background: 'rgba(241, 241, 241, 1)', borderRadius: '3px' }}>{'10 Mins ago'}</div>


                                                }

                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            )
                            : <div>No Programs found</div>
                    }

                </div>
            </div>



            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => 999999 }}
                open={programUploadAction.loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            {/* Image Modal  */}
            <MuiModal modalSize='md' modalOpen={programUploadAction.imageModal} modalClose={handleCloseModal} noheader>

                <div className='px-5 py-5'>
                    <div className='flex justify-center flex-col gap-5  mt-4 mb-4'
                        style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '10px', }}>
                        <div className='flex justify-between px-3 py-4 items-center' style={{ borderBottom: '1px solid rgba(29, 91, 191, 1)' }}>
                            <p className='text-[18px]' style={{ color: 'rgba(0, 0, 0, 1)' }}>Upload Program Image </p>
                            <img className='cursor-pointer' onClick={handleCloseModal} src={CancelIcon} alt="CancelIcon" />
                        </div>

                        <div className='px-5'>
                            {
                                programUploadAction.error !== '' ? <p className="error" role="alert">{programUploadAction.error}</p> : null
                            }

                            <form onSubmit={handleSubmit(handleProgramImageSubmit)}>
                                <div className='relative pb-8'>
                                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                                        Attachment
                                    </label>

                                    <div className='relative'>
                                        <>
                                            <div className="flex items-center justify-center w-full">
                                                <label className="flex flex-col items-center justify-center w-full h-64 border-2
                                                                                 border-gray-300 border-dashed cursor-pointer
                                                                                  bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100
                                                                                   dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                        </svg>
                                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">
                                                            Upload Program Logo/Image(jpg,png)</span>
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            (200*200 Pixels)
                                                        </p>
                                                    </div>
                                                    <input id={'program_image'} type="file"
                                                        {...imageField}

                                                        onChange={(e) => {
                                                            imageField.onChange(e);
                                                            if (e.target.files && e.target.files[0]) {
                                                                let types = ['image/png', 'image/jpeg']
                                                                if (types.includes(e.target.files[0].type)) {
                                                                    setProgramImage(e.target.files);
                                                                } else {
                                                                    setError(['progran_image'], 'Invalid file type')
                                                                }
                                                            }
                                                        }}
                                                        className="hidden" />
                                                </label>

                                            </div>
                                            {getValues('program_image')?.length > 0 &&
                                                <>
                                                    <div className='text-[14px] pt-5' style={{ color: 'rgba(0, 0, 0, 1)' }}>Uploaded Image</div>

                                                    <div className='flex justify-between items-center w-[30%] mt-5 px-4 py-4'
                                                        style={{ border: '1px solid rgba(29, 91, 191, 0.5)', borderRadius: '3px' }}>
                                                        <div className='flex w-[80%] gap-3 items-center'>
                                                            <img src={UploadIcon} alt="altlogo" />
                                                            <span className='text-[12px]'> {getValues('program_image') && getValues('program_image')[0]?.name}</span>
                                                        </div>
                                                        <img className='w-[30px] cursor-pointer' onClick={() => handleDeleteImage()} src={DeleteIcon} alt="DeleteIcon" />
                                                    </div>
                                                </>
                                            }
                                            {errors['program_image'] && (
                                                <p className="error" role="alert">
                                                    {errors['program_image'].message}
                                                </p>
                                            )}
                                        </>
                                    </div>
                                </div>

                                <div className='flex justify-center gap-5 items-center pt-5 pb-10'>
                                    <Button btnName='Cancel' btnCls="w-[18%]" btnCategory="secondary" onClick={handleCloseModal} />
                                    <button
                                        type='submit'
                                        className='text-white py-3 px-7 w-[18%]'
                                        style={{ background: 'linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)', borderRadius: '3px' }}>
                                        Submit
                                    </button>
                                </div>
                            </form>

                        </div>


                    </div>

                </div>
            </MuiModal>


            <MuiModal modalOpen={programUploadAction.successModal} modalClose={handleCloseModal} noheader>
                <div className='px-5 py-1 flex justify-center items-center'>
                    <div className='flex justify-center items-center flex-col gap-5 py-10 px-20 mt-20 mb-20'
                        style={{ background: 'linear-gradient(101.69deg, #1D5BBF -94.42%, #00AEBD 107.97%)', borderRadius: '10px' }}>
                        <img src={SuccessTik} alt="SuccessTik" />
                        <p className='text-white text-[12px]'>Program Image Updated successfully</p>
                    </div>

                </div>
            </MuiModal>

        </div>

    )
}
