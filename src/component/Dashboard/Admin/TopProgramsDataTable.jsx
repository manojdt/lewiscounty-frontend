import React, { useState } from 'react'
import DataTable from '../../../shared/DataGrid'
import { topProgramListColumns } from '../../../utils/tableFields'
import protectedApi from "../../../services/api";
import { useNavigate } from 'react-router-dom';
import EyeIcon from '../../../assets/icons/eye-icon.svg';
import { user } from "../../../utils/constant";

const TopProgramsDataTable = ({role=''}) => {
  const [isLoading, setLoading] = useState(false)
  const [topPrograms, setTopPrograms] = useState([]);
  const [paginationModel1, setPaginationModel1] = React.useState({
    page: 0,
    pageSize: 5,
  });
  const navigate = useNavigate()
  const fetchTopPrograms = async () => {
    setLoading(true); // Set loading to true while fetching
    try {
      const response = await protectedApi.get("/rating/top_programs");
      setTopPrograms(response?.data);
    } catch (error) {
      console.error("Error fetching Top programs data:", error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };
  React.useEffect(() => {
    fetchTopPrograms();
  }, [])
  const fields = [...topProgramListColumns,
    {
      field: 'action',
      headerName: 'View',
      flex: 1,
      id: 4,
      renderCell: (params) => {
        const onEyeIconClick = () => {
          const roleparams =
              role === user.mentee ? "&topProgram=menteeprograms" : "";
          navigate(
              `/program-details/${params?.row?.program}?breadcrumbsType=dashboardProgramDetails${roleparams}`
          );
      
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
          <h4>Top Programs</h4>
        </div>
        {
          <p
            className="leading-8 cursor-pointer text-[12px] px-2"
            style={{
              background: "rgba(217, 228, 242, 1)",
              color: "rgba(29, 91, 191, 1)",
              borderRadius: "6px",
            }}
            onClick={()=>navigate('/programs')}
          >
            View All
          </p>
        }
      </div>
      <div className='p-5'>
      <DataTable
        loading={isLoading}
        rows={topPrograms?.results || []}
        columns={fields}
        hideCheckbox
        rowCount={topPrograms?.count}
        hideFooter = {true}
        height={350}
      // paginationModel={paginationModel1}
      // setPaginationModel={setPaginationModel1}
      />
      </div>

    </div>
  )
}

export default TopProgramsDataTable
