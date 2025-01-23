import React from 'react'
import DashboardCard from '../../../shared/Card/DashboardCard'
import ViewAllIcon from '../../../assets/icons/viewAll.svg'
import CreateIcon from '../../../assets/icons/createNewProgram.svg'
import { pipeUrls } from '../../../utils/constant'
import { useNavigate } from 'react-router-dom'
import { requestPageBreadcrumbs } from '../../Breadcrumbs/BreadcrumbsCommonData'
import { useDispatch } from 'react-redux'
import { getallMyProgram } from '../../../services/programInfo'
import { getUserPrograms } from '../../../services/userprograms'
import ProgramCard from '../../../shared/Card/ProgramCard'

export default function DashboardPrograms() {
    const dispatch = useDispatch()
    const [programData, setProgramData] = React.useState({})
      const navigate = useNavigate();
    const handleNavigateDetails = (program) => {
          let baseUrl = pipeUrls.programdetails;
            if (Object.keys(program).length) {
              navigate(`${baseUrl}/${program.id}?breadcrumbsType=${requestPageBreadcrumbs.dashboardPrograms}`);
            }
    }

    const handleBookmark = () => {
        console.log('handleBookmark')
    }

    const actionItem = [
        {
            name: 'View All',
            icon : ViewAllIcon,
            url: ''
        },
        {
            name: 'Create New',
            icon : CreateIcon,
            url: '/create-programs'
        },
    ]

    React.useEffect(()=>{
        const payload = {
            limit: 6,
            page: 1,
            status: "yettojoin"
        }
        dispatch(getallMyProgram(payload)).then((res)=>{
            // console.log("res ====>", res)
            setProgramData(res?.payload)
        })
    },[])

    // const getPrograms = () => {
    //     let query = {};
    //     const filterType = searchParams.get("type");
    //     const isBookmark = searchParams.get("is_bookmark");
    //     const categoryFilter = searchParams.get("category_id");
    //     if (filterType && filterType !== "") {
    //       query = { type: "status", value: filterType };
    //     }
    
    //     if (isBookmark && isBookmark !== "") {
    //       query = { type: "is_bookmark", value: isBookmark };
    //     }
    
    //     if (categoryFilter && categoryFilter !== "") {
    //       query.category_id = categoryFilter;
    //     }
    //     dispatch(getUserPrograms(query));
    //   };

    // getallMyProgram
    return (
        // <DashboardCard
        //     title="Planned Programs"
        //     viewpage="/programs?type=yettojoin"
        //     handleNavigateDetails={handleNavigateDetails}
        //     handleBookmark={handleBookmark}
        //     programs={programData?.programs ?? []}
        //     height='315px'
        //     action={actionItem}
        // />

        <ProgramCard
                  title="Active Programs"
                  viewpage="/programs?type=yettojoin"
                  handleNavigateDetails={handleNavigateDetails}
                  handleBookmark={handleBookmark}
                  programs={programData?.programs ?? []}
                //   loadProgram={getPrograms}
                />
    )
}
