import React, { useState } from 'react';
import ProfileIcon from '../../assets/icons/profile-icon.svg';
import SecurityIcon from '../../assets/icons/security-icon.svg';
import PermissionIcon from '../../assets/icons/permission-icon.svg';
import ProfileTab from './tabs/ProfileTab';
import PermissionTab from './tabs/PermissionTab';
import SecurityTab from './tabs/SecurityTab';
import EditProfile from './edit-profile';

export default function MyProfile() {
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const tabs = [
    {
      label: 'Home',
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
      <div className='flex justify-between items-center mb-8'>
        <div className='text-color font-medium !text-[20px]'>
          {editMode ? 'Edit Profile' : 'Profile'}
        </div>
      </div>
      {!editMode ? (
        <div className='border grid grid-cols-5 rounded-xl'>
          <div className='grid col-span-1 border-r pl-6 py-10'>
            <div className='flex flex-col gap-1'>
              {tabs.map((tab, index) => (
                <div
                  key={index}
                  className={`p-4 font-semibold pl-6 flex items-start cursor-pointer gap-4 ${
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
          <div className='grid col-span-4'>
            <div className='p-12'>
              {tabs[activeTab] && (
                <div className='text-sm text-gray-700'>
                  {tabs[activeTab].content}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <EditProfile setEditMode={setEditMode} />
      )}
    </div>
  );
}

// <form onSubmit={handleSubmit(onSubmit)}>
//         <div
//           className='profile-content py-8 px-14'
//           style={{
//             border: '1px solid rgba(219, 224, 229, 1)',
//             background: 'rgba(255, 255, 255, 1)',
//           }}
//         >
//           <div className='flex justify-between items-center mb-8'>
//             <div className='text-color font-medium'>
//               {/* Profile Picture */}
//             </div>
//             <div>
//               {!editMode ? (
//                 <Button
//                   onClick={handleEditMode}
//                   btnType='button'
//                   btnName='Edit'
//                   btnCls={'w-[140px]'}
//                 />
//               ) : (
//                 <Button
//                   btnType='submit'
//                   btnName='Save Changes'
//                   btnCls={'w-[170px]'}
//                 />
//               )}
//             </div>
//           </div>

//           <div className='py-4 relative w-[12%]'>
//             <div className='upload-profile'>
//               <label
//                 className='w-[40%] pb-3 rounded-lg text-white text-[14px] cursor-pointer'
//                 style={{
//                   border: 'none',
//                 }}
//               >
//                 <img
//                   src={profile?.image || ProfileImageIcon}
//                   style={{ borderRadius: '50%', height: '143px' }}
//                   alt='ProfileImageIcon'
//                 />
//                 <img
//                   src={ProfileImagePencilIcon}
//                   className='absolute top-[50%] left-2 cursor-pointer'
//                   alt='ProfileImagePencilIcon'
//                 />

//                 <input type='file' class='hidden' onChange={uploadUserImage} />
//               </label>
//             </div>
//           </div>

//           <div className='grid grid-cols-6 gap-3 mt-12'>
//             {ProfileFields.map((profilefield, index) => (
//               <div className='col-span-2' key={index}>
//                 <div className='mb-5'>
//                   <label
//                     className='block tracking-wide  text-xs mb-2'
//                     style={{ color: 'rgba(116, 116, 116, 1)' }}
//                   >
//                     {profilefield.label}
//                     {editMode && (
//                       <span style={{ color: 'red' }}>
//                         {profilefield?.inputRules?.required ? '*' : ''}
//                       </span>
//                     )}
//                   </label>
//                   {editMode ? (
//                     <>
//                       <input
//                         {...register(
//                           profilefield.name,
//                           profilefield.inputRules
//                         )}
//                         type={profilefield.fieldtype}
//                         className='w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg focus:border-none focus-visible:border-none
//                                                                     focus-visible:outline-none text-[14px] h-[60px]'
//                         placeholder={profilefield.placeholder}
//                         style={{
//                           color: '#232323',
//                           borderRadius: '3px',

//                           paddingLeft: '10px',
//                         }}
//                         disabled={profilefield.disabled}
//                         aria-invalid={!!errors[profilefield.name]}
//                       />
//                       {errors[profilefield.name] && (
//                         <p className='error' role='alert'>
//                           {errors[profilefield.name].message}
//                         </p>
//                       )}
//                     </>
//                   ) : (
//                     <p className='text-[14px]'>
//                       {getValues(profilefield.name)}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </form>
