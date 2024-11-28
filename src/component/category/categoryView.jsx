import { Backdrop, Box, CircularProgress, Stack, Tab, Tabs, Typography } from "@mui/material";
import React from "react";
import SearchIcon from '../../assets/icons/search.svg';
import { categoryViewMentees, categoryViewMentors, categoryViewProgram } from "../../mock";
import StarIcon from '../../assets/icons/goldStar.svg'
import { requestStatusColor, requestStatusText } from "../../utils/constant";
import DataTable from "../../shared/DataGrid";
import { useDispatch, useSelector } from "react-redux";
import { getCategoryView } from "../../services/category";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowRight from "../../assets/icons/breadCrumbsArrow.svg"

const CategoryView = () => {
    const { viewData, loading } = useSelector((state) => state.category)
    const dispatch = useDispatch()
    const state = useLocation()?.state
    const navigate = useNavigate()
    const [value, setValue] = React.useState('mentor');
    const [search, setSearch] = React.useState("")
    const [paginationModel, setPaginationModel] = React.useState({
        page: 0,
        pageSize: 10,
    });

    const handleGetTableData = (searchText = search) => {
        const payload = {
            page: paginationModel?.page + 1,
            limit: paginationModel?.pageSize,
            id: state?.id,
            search: searchText,
            type: value
        }
        dispatch(getCategoryView(payload))
    }

    React.useEffect(() => {
        handleGetTableData()
    }, [paginationModel, value])

    const handleSearch = (searchText) => {
        setSearch(searchText)
        handleGetTableData(searchText)
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const tabFields = [
        {
            count: 58,
            title: "Mentors",
            value: "mentor"
        },
        {
            count: 58,
            title: "Mentees",
            value: "mentee"
        },
        {
            count: 58,
            title: "Program Lists",
            value: "program"
        }
    ]

    const MentorsColumns = [
        ...categoryViewMentors,
        {
            field: 'ratings',
            headerName: 'Ratings',
            flex: 1,
            id: 3,
            renderCell: (params) => {
                return <div className='flex gap-2 items-center'> <img src={StarIcon} alt="StarIcon" /> {params?.row?.average_rating === 0 ? 3 : params?.row?.average_rating}</div>
            }
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            id: 5,
            renderCell: (params) => {
                return <>
                    <div className='cursor-pointer flex items-center h-full relative'>

                        <span className='w-[80px] flex justify-center h-[30px] px-7'
                            style={{
                                background: requestStatusColor[params?.row?.approve_status]?.bgColor, lineHeight: '30px',
                                borderRadius: '3px', width: '110px', height: '34px', color: requestStatusColor?.[params?.row?.approve_status]?.color
                            }}>
                            {requestStatusText?.[params?.row?.approve_status]}
                        </span>
                    </div>
                </>
            }
        }
    ]

    const MenteesColumns = [
        ...categoryViewMentees,
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            id: 5,
            renderCell: (params) => {
                return <>
                    <div className='cursor-pointer flex items-center h-full relative'>

                        <span className='w-[80px] flex justify-center h-[30px] px-7'
                            style={{
                                background: requestStatusColor[params?.row?.approve_status]?.bgColor, lineHeight: '30px',
                                borderRadius: '3px', width: '110px', height: '34px', color: requestStatusColor?.[params?.row?.approve_status]?.color
                            }}>
                            {requestStatusText?.[params?.row?.approve_status]}
                        </span>
                    </div>
                </>
            }
        }
    ]

    const columns = {
        mentor: MentorsColumns,
        mentee: MenteesColumns,
        program: categoryViewProgram
    }

    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            

            <Box p={4}>
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
                <Typography className="text-[#5975A2] text-[16px] cursor-pointer" sx={{fontWeight: 500}} onClick={()=> navigate(-1)}>Category</Typography>
                <img src={ArrowRight} />
                <Typography className="text-[#18283D] text-[16px]" sx={{fontWeight: 500}}>View Teaching Category</Typography>
            </Stack>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="wrapped label tabs example"
                    style={{ borderBottom: "1px soild #1D5BBF" }}
                    sx={{
                        "& .MuiTabs-indicator": {
                            height: "5px",
                            background: "#1D5BBF",
                            borderRadius: "12px 12px 0px 0px"
                        }
                    }}
                >
                    {
                        tabFields?.map((e) => {
                            return (
                                <Tab
                                    className="w-[250px]"
                                    value={e?.value}
                                    label={
                                        <Stack alignItems={"center"} spacing={1}>
                                            <Typography className={`${e?.value === value ? 'bg-[#EEF5FF]' : 'bg-[#D6D6D6]'} 
                                        p-[4px] text-[${e?.value === value ? '#1D5BBF' : '#18283D'}] 
                                        rounded-[2px] text-[16px]`}>{e?.count}</Typography>

                                            <Typography className={`text-[16px] text-[${e?.value === value ? '#1D5BBF' : '#18283D'}] 
                                        capitalize`} sx={{ fontWeight: 500 }}>{e?.title}</Typography>
                                        </Stack>
                                    }

                                />
                            )
                        })
                    }
                </Tabs>

                <Box className={"border border-[#DBE0E5] bg-[#FFFFFF] rounded-[10px] mt-[20px]"} p={3}>
                    <Stack direction={"row"} width={"100%"} justifyContent={"end"}>
                        <div>
                            <div className="relative">
                                <input type="text" id="search-navbar"
                                    className="block w-full p-2 text-sm text-gray-900 border border-[#E6E6E6] rounded-[3px]"
                                    placeholder="Search here..." style={{
                                        height: '41px',
                                        width: '345px'
                                    }}
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)} />
                                <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
                                    <img src={SearchIcon} alt='SearchIcon' />
                                </div>
                            </div>

                        </div>
                    </Stack>

                    <Box mt={3}>
                        <DataTable rows={viewData?.results ?? []} columns={columns[value]} hideCheckbox
                            rowCount={viewData?.count}
                            paginationModel={paginationModel} setPaginationModel={setPaginationModel} />
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default CategoryView