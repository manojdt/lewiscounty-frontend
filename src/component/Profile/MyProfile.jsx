import React, { useEffect, useRef, useState } from 'react';
import {
  useSearchParams,
} from "react-router-dom";
import ProfileIcon from '../../assets/icons/profile-icon.svg';
import SecurityIcon from '../../assets/icons/security-icon.svg';
import PermissionIcon from '../../assets/icons/permission-icon.svg';
import SecurityIconblue from '../../assets/icons/security-icon-black.svg';
import PermissionIconblue from '../../assets/icons/permission-icon-black.svg';
import ProfileIconblack from '../../assets/icons/profile-icon-black.svg';
import ProfileTab from './tabs/ProfileTab';
import PermissionTab from './tabs/PermissionTab';
import SecurityTab from './tabs/SecurityTab';
import EditProfile from './edit-profile';
// import {
//   requestPageBreadcrumbs,
//   navbarProfile,
// } from "../Breadcrumbs/BreadcrumbsCommonData";
// import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";


export const roleBasedSections = {
  mentor: [
    'Personal Information',
    'Professional Background',
    'Educational Background',
    'Areas of Expertise',
    'Mentorship Experience',
    'Documents upload',
    'Mentorship Preference',
    'Goals',
    'Availability and Commitment',
    'Additional Information',
  ],
  mentee: [
    'Personal Information',
    'Current Status',
    'Skills and Interests',
    'Goals',
    'Documents upload',
    'Career/Academic Goals',
    'Mentoring Preferences',
    'Availability',
    'Detailed Career/academic Goals',
    'Challenges and Obstacles',
    'Mentoring Experience',
    'Learning style & Preferences',
    'Networking & Professional Developement',
    'Personal Development',
    'Mentoring Relationship Dynamics',
    'Long-term Vision',
    'Additional Information',
  ],
  admin: ['Personal Information'],
};

export default function MyProfile() {
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [contentHeights, setContentHeights] = useState([]);
  const contentRefs = useRef([]);
  const [searchParams] = useSearchParams();
  const breadcrumbsType = searchParams.get("breadcrumbsType") || "";  
  const [breadcrumbsArray, setBreadcrumbsArray] = useState([]);

  const tabs = [
    {
      label: 'Profile',
      icon: ProfileIcon,
      iconblack: ProfileIconblack,
      content: <ProfileTab setEditMode={() => setEditMode(true)} />,
    },
    {
      label: 'Manage Password',
      iconblack: SecurityIcon,
      icon: SecurityIconblue,
      content: <SecurityTab />,
    },
    // {
    //   label: 'Permissions',
    //   iconblack: PermissionIcon,
    //   icon: PermissionIconblue,
    //   content: <PermissionTab />,
    // },
  ];
  // const handleBreadcrumbs = (key) => {
  //   const navbar_Profile = navbarProfile();
  //   switch (key) {
  //     case requestPageBreadcrumbs.navbarProfile:
  //       setBreadcrumbsArray(navbar_Profile);
  //       break;
  //     case "discussion":
  //       break;
  //     default:
  //       break;
  //   }
  // };
  // useEffect(() => {
  //   if (breadcrumbsType) {
  //     handleBreadcrumbs(breadcrumbsType);
  //   }
  // }, [breadcrumbsType]);
  return (
    <div className='profile-container'>
      {/* <div className="pb-3">
        {breadcrumbsType && <Breadcrumbs items={breadcrumbsArray} />}
      </div> */}
      <div className='flex justify-between items-center mb-6'>
        <p className='text-color text-2xl font-semibold'>
          {editMode ? 'Edit Profile' : tabs[activeTab]?.label}
        </p>
      </div>
      {!editMode ? (
        <div className='border rounded-xl bg-white lg:grid lg:grid-cols-5 flex flex-col'>
        {/* Sidebar */}
        <div className='lg:grid lg:col-span-1 lg:border-r lg:pl-6 lg:py-10 overflow-x-auto'>
          <div className='flex lg:flex-col gap-1 p-2 lg:p-0'>
            {tabs.map((tab, index) => (
              <div
                key={index}
                className={`p-2 lg:p-4 font-semibold lg:pl-6 flex items-center lg:items-start cursor-pointer gap-2 lg:gap-4 whitespace-nowrap transition-all duration-300 ease-in-out ${
                  activeTab === index
                    ? 'text-blue-500 bg-[#F0F5FF] lg:border-r-4 lg:rounded-tl-lg lg:rounded-bl-lg border-blue-500'
                    : 'text-gray-500 hover:text-blue-500'
                }`}
                onClick={() => setActiveTab(index)}
              >
                <img src={activeTab === index?tab.icon:tab.iconblack} alt='' className='w-5 h-5 lg:w-auto lg:h-auto' />
                <span className='text-sm lg:text-base'>{tab.label}</span>
              </div>
            ))}
          </div>
        </div>
      
        {/* Tab Content */}
        <div className='lg:grid lg:col-span-4 p-4 lg:p-12 overflow-hidden'>
          <div className='relative'>{tabs[activeTab].content}</div>
        </div>
      </div>
      ) : (
        <EditProfile setEditMode={setEditMode} />
      )}
    </div>
  );
}
