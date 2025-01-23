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
        <div className='border grid grid-cols-5 rounded-xl bg-white'>
          {/* Sidebar */}
          <div className='grid col-span-1 border-r pl-6 py-10'>
            <div className='flex flex-col gap-1'>
              {tabs.map((tab, index) => (
                <div
                  key={index}
                  className={`p-4 font-semibold pl-6 flex items-start cursor-pointer gap-4 transition-all duration-300 ease-in-out ${
                    activeTab === index
                      ? 'text-blue-500 bg-[#F0F5FF] border-r-4 rounded-tl-lg rounded-bl-lg border-blue-500'
                      : 'text-gray-500 hover:text-blue-500'
                  }`}
                  onClick={() => setActiveTab(index)}
                >
                  <img src={tab.icon} alt='' />
                  {tab.label}
                </div>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className='grid col-span-4 p-12 overflow-hidden'>
            <div className='relative'>{tabs[activeTab].content}</div>
          </div>
        </div>
      ) : (
        <EditProfile setEditMode={setEditMode} />
      )}
    </div>
  );
}
