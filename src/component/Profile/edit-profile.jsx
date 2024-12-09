import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../../shared';
import ProfileImagePencilIcon from '../../assets/icons/profile-image-pencil-icon.svg';
import ProfileImageIcon from '../../assets/icons/profile-image-icon.svg';

import {
  getUserProfile,
  updateLocalProfileInfo,
  updateProfile,
  updateProfileImage,
} from '../../services/profile';
import { useDispatch, useSelector } from 'react-redux';
import { profileStatus } from '../../utils/constant';
import Accordian from '../../shared/Accordian';
import PersonalInfoSection from './section-edit/personal-info-section';
import { FormProvider, useForm } from 'react-hook-form';
import FormContextProvider from './form-context-provider';
import { components } from 'react-select';
import ProfessionalBakgroundSection from './section-edit/ProfessionalBakgroundSection';
import EducationalBackgroundSection from './section-edit/EducationalBackgroundSection';
import AreaOfExpertiseSection from './section-edit/AreaOfExpertiseSection';
import MentorshipExperienceSection from './section-edit/MentorshipExperienceSection';
import DocumentUploadSection from './section-edit/DocumentUploadSection';
import MentorshipPreferenceSection from './section-edit/MentorshipPreferenceSection';
import GoalsAndExpectatonsSection from './section-edit/GoalsAndExpectatonsSection';
import AvailabilityAndCommitmentSection from './section-edit/AvailabilityAndCommitmentSection';
import AdditionalInformationSection from './section-edit/AdditionalInformationSection';
import ArrowDown from '../../assets/icons/blue-arrow-down.svg';

const EditProfile = ({ setEditMode }) => {
  const dispatch = useDispatch();
  const [showAll, setShowAll] = useState(false);
  const contentRef = useRef(null);

  const profileSection = [
    { title: 'Personal Information', component: <PersonalInfoSection /> },
    {
      title: 'Professional Bakground',
      component: <ProfessionalBakgroundSection />,
    },
    {
      title: 'Educational Background',
      component: <EducationalBackgroundSection />,
    },
    { title: 'Area of expertise', component: <AreaOfExpertiseSection /> },
    {
      title: 'Mentorship Experience ',
      component: <MentorshipExperienceSection />,
    },
    { title: 'Document upload', component: <DocumentUploadSection /> },
    {
      title: 'Mentorship Preference',
      component: <MentorshipPreferenceSection />,
    },
    {
      title: 'Goals and Expectatons',
      component: <GoalsAndExpectatonsSection />,
    },
    {
      title: 'Availability and Commitment',
      component: <AvailabilityAndCommitmentSection />,
    },
    {
      title: 'Additional Information',
      component: <AdditionalInformationSection />,
    },
  ];

  const visibleSections = showAll ? profileSection : profileSection.slice(0, 2);

  const { profile, loading, status } = useSelector(
    (state) => state.profileInfo
  );

  const loadUserProfile = () => {
    dispatch(getUserProfile());
  };

  const uploadUserImage = (e) => {
    if (e.target.files && e.target.files[0]) {
      let bodyFormData = new FormData();
      bodyFormData.append('profile_image', e.target.files[0]);
      dispatch(updateProfileImage(bodyFormData)).then(() => loadUserProfile());
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  useEffect(() => {
    if (status === profileStatus.update) {
      setTimeout(() => {
        setEditMode(false);
        loadUserProfile();
      }, 3000);
    }
  }, [status]);

  const onSubmit = (data) => {
    if (data) {
      dispatch(
        updateProfile({
          // ...data,
          documents: data.documents,
          phone_number: data?.phone_number || '',
          secondary_phone_number: data?.secondary_phone_number || '',
          job_title: data?.job_title || '',
          current_employer: data?.current_employer || '',
          industry_type: data?.industry_type || '',
          linked_in: data?.linked_in || '',
          highest_degree: data?.highest_degree || '',
          field_of_study: data?.field_of_study || '',
          areas_of_expertise: data?.areas_of_expertise || '', // Update based on correct field name
          confident_areas_of_expertise:
            data?.confident_areas_of_expertise || '',
          prev_mentorship: data?.prev_mentorship || false,
          mentor_exp_desc: data?.mentor_exp_desc || '',
          interested_mentee_type: data?.interested_mentee_type || '',
          communication_mode: data?.communication_mode || '',
          availability_frequency: data?.availability_frequency || '',
          mentorship_achievement: data?.mentorship_achievement || '',
          mentor_expectations: data?.mentor_expectations || '',
          max_mentee_count: data?.max_mentee_count || null,
          pref_mentorship_duration: data?.pref_mentorship_duration || '',
          additional_info: data?.additional_info || '',
          address: data?.address || '',
          location: data?.location || '',
          social_media: data?.social_media || '',
          reviewandrating: data?.reviewandrating || false,
          years_of_experience: data?.years_of_experience || '',
          gender: data?.gender || '',
        })
      );
    }
  };

  return (
    <FormContextProvider onSubmit={onSubmit} initialValues={profile}>
      <div className='border p-12 rounded-lg'>
        <div className='flex items-center  justify-between'>
          <div className='py-4 relative w-[12%]'>
            <div className='upload-profile'>
              <label
                className='w-[40%] pb-3 rounded-lg text-white text-[14px] cursor-pointer'
                style={{
                  border: 'none',
                }}
              >
                <img
                  src={profile?.image || ProfileImageIcon}
                  style={{ borderRadius: '50%', height: '143px' }}
                  alt='ProfileImageIcon'
                />
                <img
                  src={ProfileImagePencilIcon}
                  className='absolute top-[50%] left-2 cursor-pointer'
                  alt='ProfileImagePencilIcon'
                />

                <input type='file' class='hidden' onChange={uploadUserImage} />
              </label>
            </div>
          </div>
          <div className='space-x-4'>
            <Button
              btnName='Cancel'
              btnCls='w-[140px]'
              btnStyle={{
                border: '1px solid rgba(29, 91, 191, 1)',
                color: 'rgba(29, 91, 191, 1)',
              }}
              btnCategory='secondary'
              onClick={() => setEditMode(false)}
            />
            <Button
              btnType='submit'
              btnName='Save Changes'
              btnCls={'w-[160px]'}
            />
          </div>
        </div>

        <div
          ref={contentRef}
          style={{
            maxHeight: showAll
              ? `${contentRef.current.scrollHeight}px`
              : '875px',
            overflow: 'hidden',
            transition: 'max-height 0.3s ease',
          }}
        >
          {profileSection.map((section, index) => (
            <Accordian key={index} title={section.title} defaultValue={true}>
              {section.component}
            </Accordian>
          ))}
        </div>

        <div
          className='underline mt-3 flex items-center gap-2 text-blue-500 font-semibold text-lg cursor-pointer'
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'View less' : 'View more'}
          <img
            className={`mt-1 transition-all duration-300 ${
              showAll ? 'rotate-180' : ''
            }`}
            src={ArrowDown}
            alt=''
          />
        </div>
      </div>
    </FormContextProvider>
  );
};

export default EditProfile;
