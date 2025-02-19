import React, { useEffect, useState } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardCard from "../../../shared/Card/DashboardCard";
import { pipeUrls, programActionStatus } from "../../../utils/constant";
import { Button } from "../../../shared";
import DataTable from "../../../shared/DataGrid";
import { mentorTaskColumns, mentorTaskListColumns } from "../../../mock";
import ViewIcon from "../../../assets/images/view1x.png";
import CloseIcon from "../../../assets/icons/closeIcon.svg";
import SearchIcon from "../../../assets/icons/search.svg";
import MoreIcon from "../../../assets/icons/moreIcon.svg";
import { useDispatch, useSelector } from "react-redux";
import { getMenteeTaskfromMentor } from "../../../services/task";
import {
  Backdrop,
  CircularProgress,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import { fileNameFromUrl, fileNameString, formatTableNullValues } from "../../../utils";
import dayjs from "dayjs";
import EditIcon from "../../../assets/icons/editIcon.svg";
import moment from "moment";

const MentorTask = () => {
  const [activeTaskMenu, setActiveTaskMenu] = useState("my-task");
  const [activeCategoryMenu, setActiveCategoryMenu] = useState("");
  const [activeTab, setActiveTab] = useState("all_programs");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [seletedItem, setSelectedItem] = useState({});
  const [taskFilesPopup, setTaskFilesPopup] = useState({
    modal: false,
    files: [],
  });
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    menteeTask,
    loading: menteeTaskLoading,
    status,
  } = useSelector((state) => state.tasks);
  const [formattedMenteeTask, setFormattedMenteeTask] = React.useState([])

  React.useEffect(()=>{
    if(menteeTask?.results){
      const formattedRowData = formatTableNullValues(menteeTask?.results)
      setFormattedMenteeTask(formattedRowData)
    }
  },[menteeTask])
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });

  const taskList = [
    {
      name: "My Task",
      key: "my-task",
    },
    {
      name: "Mentee Task",
      key: "mentee-task",
    },
  ];

  const Category = [
    {
      name: "Teaching",
      key: "teaching",
      count: "02",
    },
    {
      name: "Social",
      key: "social",
      count: "10",
    },
    {
      name: "Category 1",
      key: "category1",
      count: "04",
    },
    {
      name: "Category 2",
      key: "category2",
      count: "20",
    },
  ];

  const tabs = [
    {
      name: "All Programs",
      key: "all_programs",
    },
    {
      name: "Ongoing  Programs",
      key: "ongoing_programs",
    },
    {
      name: "Completed Programs",
      key: "completed_programs",
    },
    {
      name: "Abort Programs",
      key: "abort_programs",
    },
  ];

  const handleTab = (key) => {
    setActiveTab(key);
    setPaginationModel({
      page: 0,
      pageSize: 10,
    });
  };

  const handleNavigateDetails = (program) => {
    let baseUrl = pipeUrls.programdetails;
    if (Object.keys(program).length) {
      if (program.status === programActionStatus.yettostart)
        baseUrl = pipeUrls.assigntask;
      if (program.status === programActionStatus.assigned)
        baseUrl = pipeUrls.startprogram;
      if (program.status === programActionStatus.inprogress)
        baseUrl = pipeUrls.startprogram;
      navigate(`${baseUrl}/${program.id}`);
    }
  };

  const handleBookmark = (program) => {
    console.log("program", program);
  };

  const handleClick = (event, data) => {
    setSelectedItem(data);
    setAnchorEl(event.currentTarget);
  };

  const handleSearch = (search) => {
    searchParams.set("search", search);
    setSearchParams(searchParams);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const programs = [
    {
      id: 2,
      program_name: "React Bootcamp Demo",
      session_count: "10",
      description: "Description about program",
      course_level: "beginner",
      start_date: "2024-07-07T09:33:03Z",
      end_date: "2024-07-12T09:33:03Z",
      max_mentee_count: 10,
      group_chat_requirement: false,
      individual_chat_requirement: false,
      venue: "USA",
      about_program: "About program",
      image:
        "http://mentor-backend.dataterrain-dev.net/media/sponsor_logo/lap_J6Ea08I.jpg",
      image_url:
        "http://mentor-backend.dataterrain-dev.net/media/sponsor_logo/lap_J6Ea08I.jpg",
      benefits: "Benefits",
      testimonial_types: "blog",
      mentor_id: null,
      duration: 6,
      mentor_manager_id: null,
      status: "completed",
      created_at: "2024-07-06T09:34:32.419883Z",
      created_by: 4,
      approved_by: null,
      is_approve: false,
      is_bookmark: false,
      skills: [
        {
          id: 1,
          name: "Western",
          desc: "Music sample text",
          category: 5,
        },
      ],
      categories: [
        {
          id: 1,
          name: "Music",
        },
      ],
      certifications: [
        {
          id: 1,
          name: "Carnatic",
          certificate_link: "http://www.sample.com",
          certificate_description: "THis is sample certificate for music",
          issue_date: "2024-07-05",
          category: 3,
        },
      ],
      members: [
        {
          id: 4,
          first_name: "Subramaniyan",
          last_name: "T",
          email: "subramaniyan@dataterrain.com",
        },
      ],
      learning_materials: [
        {
          id: 1,
          category: 5,
          name: "Music Learning Material",
          material_type: "video",
          material_size: 742478,
          material_details:
            "This is sample learning video for development purpose",
          file: "http://mentor-backend.dataterrain-dev.net/media/learning_materials/avi_video.avi",
          file_url: "/media/learning_materials/avi_video.avi",
        },
      ],
      mentor_name: null,
    },
    {
      id: 11,
      program_name: "ss",
      session_count: "10",
      description: "sss",
      course_level: "beginner",
      start_date: "2024-07-31T13:16:44.809000Z",
      end_date: "2024-06-05T13:16:44.809000Z",
      max_mentee_count: 5,
      group_chat_requirement: true,
      individual_chat_requirement: true,
      venue: "11111",
      about_program: "ss",
      image:
        "http://mentor-backend.dataterrain-dev.net/media/sponsor_logo/Screenshot_15.png",
      image_url:
        "http://mentor-backend.dataterrain-dev.net/media/sponsor_logo/Screenshot_15.png",
      benefits: "ssss",
      testimonial_types: "blog",
      mentor_id: null,
      duration: -55,
      mentor_manager_id: null,
      status: "inprogress",
      created_at: "2024-07-08T13:18:26.736326Z",
      created_by: 8,
      approved_by: null,
      is_approve: false,
      is_bookmark: false,
      skills: [
        {
          id: 3,
          name: "Boxing",
          desc: "This is sample boxing description",
          category: 3,
        },
      ],
      categories: [
        {
          id: 1,
          name: "Music",
        },
      ],
      certifications: [
        {
          id: 1,
          name: "Carnatic",
          certificate_link: "http://www.sample.com",
          certificate_description: "THis is sample certificate for music",
          issue_date: "2024-07-05",
          category: 3,
        },
      ],
      members: [
        {
          id: 3,
          first_name: "Murugesh",
          last_name: "Sekar",
          email: "murugesh@dataterrain.com",
        },
        {
          id: 8,
          first_name: "Subash",
          last_name: "A",
          email: "subash@dataterrain.com",
        },
        {
          id: 10,
          first_name: "Stephen",
          last_name: "Johnson",
          email: "stephen@email.com",
        },
        {
          id: 12,
          first_name: "Karthikeyan",
          last_name: "D",
          email: "marketing@dataterrain.com",
        },
        {
          id: 13,
          first_name: "Dillli",
          last_name: "Rathnam",
          email: "dilli@dataterrain.com",
        },
        {
          id: 9,
          first_name: "Subramaniyan",
          last_name: "T",
          email: "tsubramaniyan2@gmail.com",
        },
        {
          id: 5,
          first_name: "Krishna",
          last_name: "M",
          email: "menteeuser@gmail.com",
        },
        {
          id: 6,
          first_name: "Karthik",
          last_name: "Subbaraj",
          email: "menteeuser1@gmail.com",
        },
        {
          id: 11,
          first_name: "Test",
          last_name: "User",
          email: "testuser@gmail.com",
        },
        {
          id: 14,
          first_name: "Sanjeev",
          last_name: "Kumar",
          email: "sanjeevkumar@email.com",
        },
        {
          id: 2,
          first_name: "Madhan",
          last_name: "K",
          email: "krishshajahan7@gmail.com",
        },
        {
          id: 4,
          first_name: "Subramaniyan",
          last_name: "T",
          email: "subramaniyan@dataterrain.com",
        },
        {
          id: 7,
          first_name: "karthick",
          last_name: "A",
          email: "karthick@gmail.com",
        },
        {
          id: 1,
          first_name: "",
          last_name: "",
          email: "admin@gmail.com",
        },
      ],
      learning_materials: [
        {
          id: 3,
          category: 2,
          name: "Action Learning Material",
          material_type: "document",
          material_size: 1139524,
          material_details: "This is sample text for Action material",
          file: "http://mentor-backend.dataterrain-dev.net/media/learning_materials/AWS_Certified_SysOps_Administrator_-_Associate_certificate.pdf",
          file_url:
            "/media/learning_materials/AWS_Certified_SysOps_Administrator_-_Associate_certificate.pdf",
        },
        {
          id: 6,
          category: 5,
          name: "ER Diagram Screenshot1",
          material_type: "document",
          material_size: 39246,
          material_details: "Details about the Mentor Mentee project",
          file: "http://mentor-backend.dataterrain-dev.net/media/learning_materials/Pngtreeinstagram_icon_instagram_logo_3584852.png",
          file_url:
            "/media/learning_materials/Pngtreeinstagram_icon_instagram_logo_3584852.png",
        },
        {
          id: 5,
          category: 5,
          name: "Spiritual Learning MAterial",
          material_type: "document",
          material_size: 558428,
          material_details: "Sample text for Spiritual Learning Material",
          file: "http://mentor-backend.dataterrain-dev.net/media/learning_materials/lap.jpg",
          file_url: "/media/learning_materials/lap.jpg",
        },
        {
          id: 4,
          category: 2,
          name: "Adventure Learning Material",
          material_type: "document",
          material_size: 269,
          material_details: "This is sample text for adventure",
          file: "http://mentor-backend.dataterrain-dev.net/media/learning_materials/lap_QIA9XEi.jpg",
          file_url: "/media/learning_materials/lap_QIA9XEi.jpg",
        },
        {
          id: 2,
          category: 2,
          name: "Sports Learning Material",
          material_type: "document",
          material_size: 558428,
          material_details: "This is sample text for sports learning material",
          file: "http://mentor-backend.dataterrain-dev.net/media/learning_materials/lap_6ajYWax.jpg",
          file_url: "/media/learning_materials/lap_6ajYWax.jpg",
        },
        {
          id: 1,
          category: 5,
          name: "Music Learning Material",
          material_type: "video",
          material_size: 742478,
          material_details:
            "This is sample learning video for development purpose",
          file: "http://mentor-backend.dataterrain-dev.net/media/learning_materials/avi_video.avi",
          file_url: "/media/learning_materials/avi_video.avi",
        },
      ],
      mentor_name: null,
    },
  ];

  const handleFileLink = (files) => {
    setTaskFilesPopup({ modal: true, files: files });
  };

  const mentorTaskColumn = [
    ...mentorTaskListColumns,
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      id: 0,
      renderCell: (params) => {
        return (
          <div>
            {params?.row?.assign_task_created_at
              ? moment(params?.row?.assign_task_created_at).format("MM-DD-YYYY")
              : "..."}
          </div>
        );
      },
    },
    {
      field: "due_date",
      headerName: "Due Date",
      flex: 1,
      id: 0,
      renderCell: (params) => {
        return (
          <div>
            {params?.row?.due_date
              ? dayjs(params.row.due_date).format("MM-DD-YYYY")
              : "..."}
          </div>
        );
      },
    },
    // {
    //   field: 'file_by',
    //   headerName: 'Link',
    //   flex: 1,
    //   id: 2,
    //   renderCell: (params) => {
    //     if (params.row.files && params.row.files.length) {
    //       const files = fileNameString(params.row.files);
    //       return (
    //         <>
    //           {
    //             <div className='flex  items-center'>
    //               <a
    //                 className='underline pr-3'
    //                 href={params.row.files[0].files}
    //                 target='_blank'
    //                 style={{ color: 'rgba(24, 40, 61, 1)' }}
    //                 title={files.fullName}
    //               >
    //                 {files.filename}
    //               </a>
    //               {files.remainingCount > 0 && (
    //                 <span
    //                   style={{
    //                     background: 'rgb(217, 228, 242)',
    //                     color: 'rgb(29, 91, 191)',
    //                     borderRadius: '50%',
    //                     fontWeight: 'bold',
    //                     width: '35px',
    //                     height: '35px',
    //                     marginTop: '4px',
    //                     display: 'flex',
    //                     justifyContent: 'center',
    //                     alignItems: 'center',
    //                   }}
    //                   className='cursor-pointer'
    //                   onClick={() => handleFileLink(params.row.files)}
    //                 >
    //                   + {files.remainingCount}
    //                 </span>
    //               )}
    //             </div>
    //           }
    //         </>
    //       );
    //     }
    //     return <></>;
    //   },
    // },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      id: 4,
      renderCell: (params) => {
        return (
          <>
            <div
              className="cursor-pointer flex items-center h-full"
              onClick={(e) => handleClick(e, params.row)}
            >
              <img src={MoreIcon} alt="ViewIcon" />
            </div>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem
                onClick={() =>
                  navigate(`/mentor-tasks-details/${seletedItem.id}`)
                }
                className="!text-[12px]"
              >
                <img
                  src={ViewIcon}
                  alt="ViewIcon"
                  field={params.id}
                  className="pr-3 w-[30px]"
                />
                View
              </MenuItem>
              {seletedItem?.editable && (
                <>
                  <MenuItem
                    onClick={() => handleEditTask()}
                    className="!text-[12px]"
                  >
                    <img
                      src={EditIcon}
                      alt="EditIcon"
                      field={params.id}
                      className="pr-3 w-[30px]"
                    />
                    Edit Task
                  </MenuItem>
                </>
              )}
            </Menu>
          </>
        );
      },
    },
  ];

  const alltaskList = [
    {
      name: "All Task",
      key: "all",
    },
    {
      name: "New Task",
      key: "newtask",
    },
    {
      name: "Pending Task",
      key: "pending",
    },
    {
      name: "Ongoing Task",
      key: "ongoing",
    },
    {
      name: "Waiting Task",
      key: "waiting_for_approval",
    },
    {
      name: "Rejected Task",
      key: "rejected",
    },
    {
      name: "Completed Task",
      key: "completed",
    },
  ];

  const handleTaskMenu = (key) => {
    setActiveTaskMenu(key);
    if (key === "mentee-task") {
      navigate(`${pipeUrls.mentortask}?type=menteetask`);
    }
  };

  const handleMenteeTaskFilterTab = (value) => {
    let queryString = `?status=${value}`;
    if (searchParams.get("type") === "menteetask") {
      queryString += `&type=${searchParams.get("type")}`;
    }
    navigate(`${pipeUrls.mentortask}${queryString}`);
  };

  useEffect(() => {
    navigate(`${pipeUrls.mentortask}?type=menteetask`);
  }, []);

  useEffect(() => {
    let query = {
      page: paginationModel?.page + 1,
      limit: paginationModel?.pageSize,
    };

    const statusQuery = searchParams.has("status")
      ? searchParams.get("status")
      : "";
    if (statusQuery !== "") {
      query.status = statusQuery;
    }

    const searchQuery = searchParams.has("search")
      ? searchParams.get("search")
      : "";
    if (searchQuery !== "") {
      query.search = searchQuery;
    }

    if (Object.keys(query).length) {
      dispatch(getMenteeTaskfromMentor(query));
    }
  }, [searchParams, paginationModel]);

  const handleEditTask = () => {
    const keysToExclude = [
      "results",
      "count",
      "next",
      "total_pages",
      "previous",
      "next",
      "page_size",
      "current_page",
    ];

    const data = Object.fromEntries(
      Object.entries(seletedItem).filter(
        ([key]) => !keysToExclude.includes(key)
      )
    );

    const constructedData = {
      ...data,

      program_category_name: seletedItem?.category_name,
      program_name: seletedItem?.prgrame_name,
      program_startdate: seletedItem?.start_date,
      program_enddate: seletedItem?.end_date,
      task_name: seletedItem?.task_name,
      reference_link: seletedItem?.reference_links,
      task_details: seletedItem?.task_details,
      due_date: seletedItem?.due_date,
      assign_task_id: seletedItem?.id,
      list_mentees: seletedItem?.mentees_added_to_program,
      program_id: seletedItem?.program_id,
      program_duration: seletedItem?.duration,
      category_id: seletedItem?.category_id,
      mentor_id: seletedItem?.mentor_id,
      mentor_name: seletedItem?.mentor_name,
      task_id: seletedItem?.id,
      state_date: seletedItem?.start_date,
    };

    navigate(`/assign-mentees/?type=edit`, {
      state: {
        data: constructedData,
      },
    });
  };

  return (
    <div className="mentor-task px:2 sm:px-2 md:px-4 lg:px-8">
      {/* Backdrop Popup */}
      {taskFilesPopup.modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-md shadow-md">
            <div className="border border-blue-500 rounded-md">
              <div className="flex justify-between items-center px-4 py-2 border-b border-blue-500">
                <p className="text-blue-500 font-medium">Reference Link View</p>
                <button
                  onClick={() => setTaskFilesPopup({ modal: false, files: [] })}
                >
                  <img src={CloseIcon} alt="Close" className="cursor-pointer" />
                </button>
              </div>
              <ul className="py-2 px-4 space-y-2">
                {taskFilesPopup.files.map((file, index) => (
                  <li key={index}>
                    <a
                      href={file.files}
                      target="_blank"
                      className="text-blue-700 underline hover:text-blue-900"
                    >
                      {fileNameFromUrl(file.files)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-3 sm:p-2 md:p-2 lg:p-5 xl:p-5 rounded-lg shadow-sm border border-gray-300">
        <div className="flex flex-wrap items-center justify-between mb-4">
          <h1 className="text-xl mb-2 sm:mb-2 md:mb-2 lg:mb-0 xl:mb-0 font-semibold text-gray-800">Mentees Tasks</h1>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-2 border border-blue-500 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Search here..."
                onChange={(e) => handleSearch(e.target.value)}
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <img src={SearchIcon} alt="Search" />
              </div>
            </div>

            <Button
              btnType="button"
              btnCls="w-[150px]"
              btnName={"Create Task"}
              btnCategory="primary"
              onClick={() => navigate("/assign-mentees?type=new")}
            />
          </div>
        </div>

        {/* Loader */}
        {menteeTaskLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="flex items-center">
              <CircularProgress color="inherit" />
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Sidebar (if needed) */}
          {/* <div className="hidden md:block col-span-1 lg:col-span-1">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h4 className="text-blue-500 font-medium mb-2">Task</h4>
              <ul className="space-y-2">
                {taskList.map((menu, index) => (
                  <li key={index}>
                    <div
                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                        activeTaskMenu === menu.key ? "bg-blue-100" : ""
                      }`}
                      onClick={() => handleTaskMenu(menu.key)}
                    >
                      <span className="text-sm text-gray-800">{menu.name}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-4 mt-4 rounded-lg shadow-md">
              <h4 className="text-blue-500 font-medium mb-2">Category</h4>
              <ul className="space-y-2">
                {Category.map((menu, index) => (
                  <li key={index}>
                    <div
                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                        activeCategoryMenu === menu.key ? "bg-blue-100" : ""
                      }`}
                      onClick={() => setActiveCategoryMenu(menu.key)}
                    >
                      <span className="text-sm text-gray-800">{menu.name}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div> */}

          {/* Main Content */}
          <div className="col-span-5">
            {activeTaskMenu === "my-task1" ? (
              <>
                {/* Tabs */}
                <div className="border-b border-gray-300 mb-4">
                  <ul className="flex space-x-4">
                    {tabs.map((tab) => (
                      <li
                        key={tab.key}
                        className={`cursor-pointer pb-2 ${
                          activeTab === tab.key
                            ? "text-blue-500 border-b-2 border-blue-500"
                            : "text-gray-500"
                        }`}
                        onClick={() => handleTab(tab.key)}
                      >
                        {tab.name}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Dashboard Card */}
                <DashboardCard
                  title="All Programs"
                  viewpage="/programs?type=yettostart"
                  handleNavigateDetails={handleNavigateDetails}
                  handleBookmark={handleBookmark}
                  programs={programs}
                />
              </>
            ) : (
              <DataTable
                rows={formattedMenteeTask ?? []}
                columns={mentorTaskColumn}
                hideCheckbox
                rowCount={menteeTask?.count}
                paginationModel={paginationModel}
                setPaginationModel={setPaginationModel}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorTask;
