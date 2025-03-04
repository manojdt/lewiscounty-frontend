import React from 'react'
import { topMentorListcolumns, topProgramListColumns } from '../../../utils/tableFields';
import api from "../../../services/api";
import DataTable from '../../../shared/DataGrid';
import { useNavigate } from 'react-router-dom';
import EyeIcon from '../../../assets/icons/eye-icon.svg';
import { requestPageBreadcrumbs } from "../../Breadcrumbs/BreadcrumbsCommonData";

const TopMentorsDataTable = () => {
    const [isLoading, setLoading] = React.useState(false)
    const [topMentors, setTopMentorList] = React.useState([]);
    //   const [paginationModel1, setPaginationModel1] = React.useState({
    //     page: 0,
    //     pageSize: 5,
    //   });
    const navigate = useNavigate()
    const getTopMentors = async () => {
        const topMentor = await api.get("rating/top_mentor");
        if (topMentor.status === 200 && topMentor.data?.results) {
            setTopMentorList(topMentor.data);
        }
    };
    React.useEffect(() => {
        getTopMentors();
    }, [])


    const fields = [...topMentorListcolumns,
    {
        field: 'action',
        headerName: 'View',
        flex: 1,
        id: 4,
        renderCell: (params) => {
          const onEyeIconClick = () =>{
             navigate(`/mentor-details/${params?.row?.id}?fromType=topmentor&breadcrumbsType=${requestPageBreadcrumbs.dashboardtopmentor || requestPageBreadcrumbs.dashboardtopmentor}`)
          }
            return <>
                <div className='cursor-pointer flex items-center justify-start h-full relative' onClick={onEyeIconClick}>

                    <img className='w-[18px] h-[18px]' src={EyeIcon} alt='EyeIcon'></img>
                </div>
            </>
        }
    }
    ];
    return (
        <div>
            <div className="title flex justify-between py-3 px-4 border-b-2">
                <div className="flex gap-4">
                    <div
                        className="card-dash"
                        style={{
                            background: "linear-gradient(180deg, #00B1C0 0%, #005DC6 100%)",
                        }}
                    ></div>
                    <h4>Top Mentors</h4>
                </div>
                {
                    <p
                        className="leading-8 cursor-pointer text-[12px] px-2"
                        style={{
                            background: "rgba(217, 228, 242, 1)",
                            color: "rgba(29, 91, 191, 1)",
                            borderRadius: "6px",
                        }}
                        onClick={() => navigate('/mentors?req=topmentor')}
                    >
                        View All
                    </p>
                }
            </div>
            <div className='p-5'>
                <DataTable
                    loading={isLoading}
                    rows={topMentors?.results || []}
                    columns={fields}
                    hideCheckbox
                    rowCount={topMentors?.count}
                    hideFooter={true}
                    height = {350}
                // paginationModel={paginationModel1}
                // setPaginationModel={setPaginationModel1}
                />
            </div>


        </div>
    )
}

export default TopMentorsDataTable
