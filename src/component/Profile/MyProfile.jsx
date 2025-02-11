import React, { useEffect, useRef, useState } from 'react';
import ProfileIcon from '../../assets/icons/profile-icon.svg';
import SecurityIcon from '../../assets/icons/security-icon.svg';
import PermissionIcon from '../../assets/icons/permission-icon.svg';
import ProfileTab from './tabs/ProfileTab';
import PermissionTab from './tabs/PermissionTab';
import SecurityTab from './tabs/SecurityTab';
import EditProfile from './edit-profile';

export const roleBasedSections = {
  mentor: [
    'Personal Information',
    'Professional Background',
    'Educational Background',
    'Area of expertise',
    'Mentorship Experience',
    'Document upload',
    'Mentorship Preference',
    'Goals and Expections',
    'Availability and Commitment',
    'Additional Information',
  ],
  mentee: [
    'Personal Information',
    'Current Status',
    'Skill and Interests',
    'Expectation and goals',
    'Document upload',
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

  const tabs = [
    {
      label: 'Profile',
      icon: ProfileIcon,
      content: <ProfileTab setEditMode={() => setEditMode(true)} />,
    },
    {
      label: 'Security',
      icon: SecurityIcon,
      content: <SecurityTab />,
    },
    {
      label: 'Permissions',
      icon: PermissionIcon,
      content: <PermissionTab />,
    },
  ];

  return (
    <div className='profile-container'>
      <div className='flex justify-between items-center mb-6'>
        <p className='text-color text-2xl font-semibold'>
          {editMode ? 'Edit Profile' : 'Settings'}
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
                <img src={tab.icon} alt='' className='w-5 h-5 lg:w-auto lg:h-auto' />
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
