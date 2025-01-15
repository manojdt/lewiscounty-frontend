import React from 'react'
import DashboardCard from '../../../shared/Card/DashboardCard'
import ViewAllIcon from '../../../assets/icons/viewAll.svg'
import CreateIcon from '../../../assets/icons/createNewProgram.svg'
// import { useDispatch } from 'react-redux'
// import { getallMyProgram } from '../../../services/programInfo'

export default function DashboardPrograms() {
    // const dispatch = useDispatch()
    // const [programData, setProgramData] = React.useState({})
    const handleNavigateDetails = () => {
        console.log('handleNavigateDetails')
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

    // React.useEffect(()=>{
    //     const payload = {
    //         limit: 5,
    //         page: 1,
    //         status: "yettojoin"
    //     }
    //     dispatch(getallMyProgram(payload)).then((res)=>{
    //         // console.log("res ====>", res)
    //         setProgramData(res?.payload)
    //     })
    // },[])

    // getallMyProgram
    return (
        <DashboardCard
            title="Planned Programs"
            viewpage="/programs?type=yettojoin"
            handleNavigateDetails={handleNavigateDetails}
            handleBookmark={handleBookmark}
            programs={[]}
            height='315px'
            action={actionItem}
        />
    )
}
