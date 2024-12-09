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
import CurrentStatusSection from './section-edit/MenteeCurrentStatusSection';
import MenteeCurrentStatusSection from './section-edit/MenteeCurrentStatusSection';
import MenteeExpectionAndGoalsSection from './section-edit/MenteeExpectionAndGoalsSection';
import MenteeSkillandInterestsSection from './section-edit/MenteeSkillandInterestsSection';
import MenteeCareerAcademicGoalsSection from './section-edit/MenteeCareerAcademicGoalsSection';
import MenteeMentoringPreferencesSection from './section-edit/MenteeMentoringPreferencesSection';
import MenteeAvailabilitySection from './section-edit/MenteeAvailabilitySection';
import MenteeDetailedCareerAcademicGoalsSection from './section-edit/MenteeDetailedCareerAcademicGoalsSection';
import MenteeChallengesAndObstaclesSection from './section-edit/MenteeChallengesAndObstaclesSection';
import MenteeMentoringExperienceSection from './section-edit/MenteeMentoringExperienceSection';
import MenteeLearningSylePreferencesSection from './section-edit/MenteeLearningSylePreferencesSection';
import MenteeNetworkingProfessionalDevelopementSection from './section-edit/MenteeNetworkingProfessionalDevelopementSection';
import MenteePersonalDevelopmentSection from './section-edit/MenteePersonalDevelopmentSection';
import MenteeMentoringRelationshipDynamicsSection from './section-edit/MenteeMentoringRelationshipDynamicsSection';
import MenteeLongTermVisionSection from './section-edit/MenteeLongTermVisionSection';
import { roleBasedSections } from './MyProfile';

const EditProfile = ({ setEditMode }) => {
  const dispatch = useDispatch();
  const [showAll, setShowAll] = useState(false);
  const [removeFiles, setRemoveFiles] = useState([]);
  const contentRef = useRef(null);
  const userInfo = useSelector((state) => state.userInfo);
  const userRole = userInfo?.data?.role;

  const allProfileSections = [
    { title: 'Personal Information', component: <PersonalInfoSection /> },
    {
      title: 'Current Status',
      component: <MenteeCurrentStatusSection />,
    },
    {
      title: 'Skill and Interests',
      component: <MenteeSkillandInterestsSection />,
    },
    {
      title: 'Expectation and goals',
      component: <MenteeExpectionAndGoalsSection />,
    },
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
      title: 'Mentorship Experience',
      component: <MentorshipExperienceSection />,
    },
    {
      title: 'Document upload',
      component: <DocumentUploadSection setRemoveFiles={setRemoveFiles} />,
    },
    {
      title: 'Career/Academic Goals',
      component: <MenteeCareerAcademicGoalsSection />,
    },
    {
      title: 'Mentoring Preferences',
      component: <MenteeMentoringPreferencesSection />,
    },
    {
      title: 'Availability',
      component: <MenteeAvailabilitySection />,
    },
    {
      title: 'Detailed Career/academic Goals',
      component: <MenteeDetailedCareerAcademicGoalsSection />,
    },
    {
      title: 'Challenges and Obstacles',
      component: <MenteeChallengesAndObstaclesSection />,
    },
    {
      title: 'Mentoring Experience',
      component: <MenteeMentoringExperienceSection />,
    },
    {
      title: 'Learning style & Preferences',
      component: <MenteeLearningSylePreferencesSection />,
    },
    {
      title: 'Networking & Professional Developement',
      component: <MenteeNetworkingProfessionalDevelopementSection />,
    },
    {
      title: 'Personal Development',
      component: <MenteePersonalDevelopmentSection />,
    },
    {
      title: 'Mentoring Relationship Dynamics',
      component: <MenteeMentoringRelationshipDynamicsSection />,
    },
    {
      title: 'Long-term Vision',
      component: <MenteeLongTermVisionSection />,
    },
    // ----
    {
      title: 'Mentorship Preference',
      component: <MentorshipPreferenceSection />,
    },
    {
      title: 'Goals and Expections',
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

  const profileSection = allProfileSections.filter((section) =>
    roleBasedSections[userRole]?.includes(section.title)
  );

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
    const formData = new FormData();

    // Add documents to FormData (assumes documents is a file or array of files)
    if (data.documents) {
      if (Array.isArray(data.documents)) {
        data.documents.forEach((file, index) => {
          formData.append(`documents`, file);
        });
      } else {
        formData.append('documents', data.documents);
      }
    }

    // Add other fields to FormData
    formData.append('phone_number', data.phone_number || '');
    formData.append(
      'secondary_phone_number',
      data.secondary_phone_number || ''
    );
    formData.append('job_title', data.job_title || '');
    formData.append('current_employer', data.current_employer || '');
    formData.append('industry_type', data.industry_type || '');
    formData.append('linked_in', data.linked_in || '');
    formData.append('highest_degree', data.highest_degree || '');
    formData.append('field_of_study', data.field_of_study || '');
    formData.append('areas_of_expertise', data.areas_of_expertise || '');
    formData.append(
      'confident_areas_of_expertise',
      data.confident_areas_of_expertise || ''
    );
    formData.append('prev_mentorship', data.prev_mentorship || false);
    formData.append('mentor_exp_desc', data.mentor_exp_desc || '');
    formData.append(
      'interested_mentee_type',
      data.interested_mentee_type || ''
    );
    formData.append('communication_mode', data.communication_mode || '');
    formData.append(
      'availability_frequency',
      data.availability_frequency || ''
    );
    formData.append(
      'mentorship_achievement',
      data.mentorship_achievement || ''
    );
    formData.append('mentor_expectations', data.mentor_expectations || '');
    formData.append('max_mentee_count', data.max_mentee_count || null);
    formData.append(
      'pref_mentorship_duration',
      data.pref_mentorship_duration || ''
    );
    formData.append('additional_info', data.additional_info || '');
    formData.append('address', data.address || '');
    formData.append('location', data.location || '');
    formData.append('social_media', data.social_media || '');
    formData.append('reviewandrating', data.reviewandrating || false);
    formData.append('years_of_experience', data.years_of_experience || '');
    formData.append('gender', data.gender || '');
    formData.append('files_to_remove', removeFiles || []);
    // if (removeFiles && Array.isArray(removeFiles)) {
    //   removeFiles.forEach((id) => {
    //     formData.append('files_to_remove[]', id); // Ensure each ID is appended
    //   });
    // }

    // Dispatch the form data
    console.log(formData);
    dispatch(updateProfile(formData));
  };

  return (
    <FormContextProvider onSubmit={onSubmit} initialValues={profile}>
      <div className='border px-12 py-6 rounded-lg'>
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
              : '825px',
            overflow: 'hidden',
            transition: 'max-height 0.5s ease',
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
