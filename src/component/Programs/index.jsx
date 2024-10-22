import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Backdrop, CircularProgress, IconButton, Menu, MenuItem } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

import Card from '../../shared/Card';
import ProgramCard from '../../shared/Card/ProgramCard';
import SearchIcon from '../../assets/icons/search.svg';
import CalendarIcon from '../../assets/images/calender_1x.png';
import GridViewIcon from '../../assets/icons/gridviewIcon.svg';
import ListViewIcon from '../../assets/icons/listviewIcon.svg';
import MoreIcon from '../../assets/icons/moreIcon.svg';
import ViewIcon from '../../assets/images/view1x.png';

import { pipeUrls, programActionStatus, programMenus, programStatus, statusAction } from '../../utils/constant';
import { getMenteeProgramCount, getMenteePrograms, getProgramCounts, getUserPrograms, updateProgram } from '../../services/userprograms';
import DataTable from '../../shared/DataGrid';
import { programListColumns } from '../../utils/tableFields';


export default function Programs() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams();

    const [programsList, setProgramsList] = useState([])
    const [programMenusList, setProgramMenusList] = useState([])
    const [programView, setProgramView] = useState('grid');
    const [seletedItem, setSelectedItem] = useState({})
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const userInfo = useSelector(state => state.userInfo)
    const userprograms = useSelector(state => state.userPrograms)

    const role = userInfo.data.role || ''

    const filterType = searchParams.get("type");
    const isBookmark = searchParams.get("is_bookmark");

    const handleBookmark = (program) => {
        dispatch(updateProgram({ id: program.id, is_bookmark: !program.is_bookmark }))
    }

    const handleNavigation = (programdetails) => {
        let baseUrl = pipeUrls.programdetails
        if (Object.keys(programdetails).length) {
            if (role === 'mentor' && programdetails.status !== 'completed') {
                if (programdetails.status === programActionStatus.yettostart) baseUrl = pipeUrls.startprogram
                if (programdetails.status === programActionStatus.inprogress) baseUrl = pipeUrls.startprogram
            }
            if (role === 'mentee' && filterType === 'yettostart') {
                navigate(`/mentee-document-upload/${programdetails.id}`)
            } else {
                navigate(`${baseUrl}/${programdetails.id}`)
            }
        }
    }

    const handleViewChange = () => {
        setProgramView(programView === 'grid' ? 'list' : 'grid')
    }

    const handleMoreClick = (event, data) => {
        setSelectedItem(data)
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const programTableFields = [
        ...programListColumns,
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            id: 0,
            renderCell: (params) => {
                return <>
                    <div className='cursor-pointer flex items-center h-full' onClick={(e) => handleMoreClick(e, params.row)}>
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
                        <MenuItem onClick={(e) => handleNavigation(seletedItem)} className='!text-[12px]'>
                            <img src={ViewIcon} alt="ViewIcon" className='pr-3 w-[30px]' />
                            View
                        </MenuItem>
                    </Menu>
                </>
            },
        },

    ]

    const handlePagination = (action) => {
        let query = {}
        const filterType = searchParams.get("type");
        const isBookmark = searchParams.get("is_bookmark");
        if (filterType && filterType !== '') {
            query = { type: 'status', value: filterType }
        }

        if (isBookmark && isBookmark !== '') {
            query = { type: 'is_bookmark', value: isBookmark }
        }

        
        if (action === 'prev') {
            query = { ...query, page: 'page', number: userprograms.current_page - 1 }
        }

        if (action === 'next') {
            query = { ...query, page: 'page', number: userprograms.current_page + 1 }
        }

        if (role === 'mentee') {
            dispatch(getMenteePrograms(query))
        }
        if (role === 'mentor') dispatch(getUserPrograms(query));
    }


    useEffect(() => {
        const listPrograms = programMenus('program').filter(programs => programs.for.includes(role));

        const totalCount = role === 'mentor' ? userprograms.statusCounts : userprograms.programsCounts

        const programMenu = [...listPrograms].map(menu => {

            if (menu.status === 'all') {
                return { ...menu, count: role === 'mentor' ? userprograms.totalPrograms : totalCount?.allprogram }
            }
            // Mentor Response Count
            if (role === 'mentor' && statusAction.includes(menu.status)) {
                return { ...menu, count: totalCount[menu.mentorStatus] }
            }

            // Mentee Response Count
            if (role === 'mentee') {
                return { ...menu, count: totalCount[menu.menteeStatus] }
            }

            return menu
        })
        setProgramMenusList(programMenu)
    }, [userprograms.statusCounts, userprograms.programsCounts])

    useEffect(() => {
        const filterType = searchParams.get("type");
        const isBookmark = searchParams.get("is_bookmark");

        let query = {}

        if (filterType && filterType !== '') {
            query = { type: 'status', value: filterType }
        }

        if (isBookmark && isBookmark !== '') {
            query = { type: 'is_bookmark', value: isBookmark }
        }

        if (role === 'mentee') {
            dispatch(getMenteePrograms(query))
        }
        if (role === 'mentor') dispatch(getUserPrograms(query));

    }, [searchParams, role])

    useEffect(() => {
        if (userprograms.status === programStatus.bookmarked) {

            let query = {}
            const filterType = searchParams.get("type");
            const isBookmark = searchParams.get("is_bookmark");
            if (filterType && filterType !== '') {
                query = { type: 'status', value: filterType }
            }

            if (isBookmark && isBookmark !== '') {
                query = { type: 'is_bookmark', value: isBookmark }
            }

            if (role === 'mentee') dispatch(getMenteePrograms(query))
            if (role === 'mentor') dispatch(getUserPrograms(query))
        }
    }, [userprograms.status])

    useEffect(() => {
        if (userprograms.status === programStatus.load) {
            let loadProgram = []
            if (filterType === null && isBookmark === null) {
                loadProgram = userprograms.allprograms
            }

            if (isBookmark !== null && isBookmark !== '') {
                loadProgram = userprograms.bookmarked
            }

            if (filterType !== null && filterType !== '') {
                if (filterType === 'planned') {
                    loadProgram = userprograms.yettojoin;
                } else {
                    loadProgram = userprograms[filterType]
                }
            }
            setProgramsList(loadProgram)
        }
    }, [userprograms])

    useEffect(() => {
        if (role === 'mentor') dispatch(getProgramCounts())
        if (role === 'mentee') dispatch(getMenteeProgramCount())
    }, [role])

    return (
        <div className="dashboard-content px-8 mt-10">
            <div className='flex justify-between items-center mb-8'>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={userprograms.loading}
                >
                    {
                        userprograms.loading ?
                            <CircularProgress color="inherit" />
                            : null
                    }
                </Backdrop>
                <div> Programs </div>
                {
                    userInfo && userInfo.data && (userInfo.data.role === 'mentor' || userInfo.data.role === 'admin') &&
                    <div>
                        <button onClick={() => navigate('/create-programs')} className='text-[13px] px-4 py-4'
                            style={{ background: '#1D5BBF', color: '#fff', borderRadius: '6px' }}>Create New Program</button>
                    </div>
                }
            </div>

            <div className="grid grid-cols-5 gap-3">
                <div className="row-span-3 flex flex-col gap-8">
                    <Card cardTitle={'Programs'} cardContent={programMenusList} />
                </div>

                <div className="col-span-4">
                    <div style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
                        <div className="title flex justify-between py-3 px-4 border-b-2 items-center">
                            <div className="flex gap-4">
                                <div>
                                    {programMenusList.find(menu => menu.status === searchParams.get("type"))?.name ||
                                        (searchParams.get("type") === 'planned' && 'Planned Programs') ||
                                        (searchParams.get("is_bookmark") ? 'Bookmarked Programs' : 'All Programs')}
                                </div>
                                <img src={programView === 'grid' ? ListViewIcon : GridViewIcon} className='cursor-pointer' alt="viewicon" onClick={handleViewChange} />

                            </div>
                            <div className="flex gap-8 items-center">
                                <div className="relative">
                                    <input type="text" id="search-navbar" className="block w-full p-2 text-sm text-gray-900 border-none"
                                        placeholder="Search here..." style={{
                                            border: '1px solid rgba(29, 91, 191, 1)',
                                            height: '40px',
                                            width: '345px'
                                        }} />
                                    <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
                                        <img src={SearchIcon} className='w-[15px]' alt='SearchIcon' />
                                    </div>
                                </div>
                                {/* <img src={SearchIcon} alt="statistics" /> */}
                                <p className="text-[12px] py-2 pl-5 pr-4 flex gap-4" style={{ background: 'rgba(223, 237, 255, 1)', borderRadius: '5px' }}>
                                    <img src={CalendarIcon} alt="CalendarIcon" />
                                    <select className='focus:outline-none' style={{ background: 'rgba(223, 237, 255, 1)', border: 'none' }}>
                                        <option>Day</option>
                                        <option>Month</option>
                                    </select>
                                </p>
                            </div>

                        </div>
                        {
                            programView === 'grid' &&

                            <>
                                <ProgramCard
                                    title="Planned Programs"
                                    viewpage="/programs?type=yettojoin"
                                    handleNavigateDetails={handleNavigation}
                                    handleBookmark={handleBookmark}
                                    programs={programsList}
                                    noTitle
                                />

                                {
                                    userprograms.total_pages > 1 &&

                                    <div className='flex items-center justify-end pb-6 pr-9'>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <span
                                                style={{
                                                    border: '1px solid rgba(9, 19, 22, 1)', display: 'flex', width: '36px', height: '37px', justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                {userprograms?.current_page}</span> of <span className='pl-1'>{userprograms?.total_pages}
                                            </span>
                                        </div>

                                        <IconButton onClick={() => handlePagination('prev')} disabled={userprograms.current_page === 1}>
                                            <div style={{ background: '#D9E4F2', padding: '0 7px 4px', borderRadius: '2px' }}>
                                                <KeyboardArrowLeft />
                                            </div>
                                        </IconButton>
                                        <IconButton onClick={() => handlePagination('next')} disabled={userprograms.current_page === userprograms.total_pages}>
                                            <div style={{ background: '#D9E4F2', padding: '0 7px 4px', borderRadius: '2px' }}>
                                                <KeyboardArrowRight />
                                            </div>
                                        </IconButton>
                                    </div>
                                }

                            </>
                        }
                        {
                            programView === 'list' &&
                            <div className='py-6 px-6'>
                                <DataTable rows={programsList} columns={programTableFields} hideFooter={!programsList.length} />
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
