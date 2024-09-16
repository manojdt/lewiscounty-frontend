import React from 'react'
import DashboardCard from '../../../shared/Card/DashboardCard'
import ViewAllIcon from '../../../assets/icons/viewAll.svg'
import CreateIcon from '../../../assets/icons/createNewProgram.svg'

export default function DashboardPrograms() {
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
