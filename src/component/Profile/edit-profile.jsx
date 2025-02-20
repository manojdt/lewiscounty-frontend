import React, { useEffect, useRef, useState } from "react";
import { Button } from "../../shared";
import ProfileImagePencilIcon from "../../assets/icons/profile-image-pencil-icon.svg";
import ProfileImageIcon from "../../assets/icons/profile-image-icon.svg";

import {
  getUserProfile,
  updateLocalProfileInfo,
  updateProfile,
  updateProfileImage,
} from "../../services/profile";
import { useDispatch, useSelector } from "react-redux";
import { profileStatus, user } from "../../utils/constant";
import Accordian from "../../shared/Accordian";
import PersonalInfoSection from "./section-edit/personal-info-section";
import { FormProvider, useForm } from "react-hook-form";
import FormContextProvider from "./form-context-provider";
import { components } from "react-select";
import ProfessionalBakgroundSection from "./section-edit/ProfessionalBakgroundSection";
import EducationalBackgroundSection from "./section-edit/EducationalBackgroundSection";
import AreaOfExpertiseSection from "./section-edit/AreaOfExpertiseSection";
import MentorshipExperienceSection from "./section-edit/MentorshipExperienceSection";
import DocumentUploadSection from "./section-edit/DocumentUploadSection";
import MentorshipPreferenceSection from "./section-edit/MentorshipPreferenceSection";
import GoalsAndExpectatonsSection from "./section-edit/GoalsAndExpectatonsSection";
import AvailabilityAndCommitmentSection from "./section-edit/AvailabilityAndCommitmentSection";
import AdditionalInformationSection from "./section-edit/AdditionalInformationSection";
import ArrowDown from "../../assets/icons/blue-arrow-down.svg";
import CurrentStatusSection from "./section-edit/MenteeCurrentStatusSection";
import MenteeCurrentStatusSection from "./section-edit/MenteeCurrentStatusSection";
import MenteeExpectionAndGoalsSection from "./section-edit/MenteeExpectionAndGoalsSection";
import MenteeSkillandInterestsSection from "./section-edit/MenteeSkillandInterestsSection";
import MenteeCareerAcademicGoalsSection from "./section-edit/MenteeCareerAcademicGoalsSection";
import MenteeMentoringPreferencesSection from "./section-edit/MenteeMentoringPreferencesSection";
import MenteeAvailabilitySection from "./section-edit/MenteeAvailabilitySection";
import MenteeDetailedCareerAcademicGoalsSection from "./section-edit/MenteeDetailedCareerAcademicGoalsSection";
import MenteeChallengesAndObstaclesSection from "./section-edit/MenteeChallengesAndObstaclesSection";
import MenteeMentoringExperienceSection from "./section-edit/MenteeMentoringExperienceSection";
import MenteeLearningSylePreferencesSection from "./section-edit/MenteeLearningSylePreferencesSection";
import MenteeNetworkingProfessionalDevelopementSection from "./section-edit/MenteeNetworkingProfessionalDevelopementSection";
import MenteePersonalDevelopmentSection from "./section-edit/MenteePersonalDevelopmentSection";
import MenteeMentoringRelationshipDynamicsSection from "./section-edit/MenteeMentoringRelationshipDynamicsSection";
import MenteeLongTermVisionSection from "./section-edit/MenteeLongTermVisionSection";
import { roleBasedSections } from "./MyProfile";
import dayjs from "dayjs";

const EditProfile = ({ setEditMode }) => {
  const dispatch = useDispatch();
  const [showAll, setShowAll] = useState(false);
  const [removeFiles, setRemoveFiles] = useState([]);
  const contentRef = useRef(null);
  const userInfo = useSelector((state) => state.userInfo);
  const userRole = userInfo?.data?.role;

  const allProfileSections = [
    { title: "Personal Information", component: <PersonalInfoSection /> },
    {
      title: "Current Status",
      component: <MenteeCurrentStatusSection />,
    },
    {
      title: "Skills and Interests",
      component: <MenteeSkillandInterestsSection />,
    },
    {
      title: "Goals",
      component: <MenteeExpectionAndGoalsSection />,
    },
    {
      title: "Professional Background",
      component: <ProfessionalBakgroundSection />,
    },
    {
      title: "Educational Background",
      component: <EducationalBackgroundSection />,
    },
    { title: "Areas of Expertise", component: <AreaOfExpertiseSection /> },
    {
      title: "Mentorship Experience",
      component: <MentorshipExperienceSection />,
    },
    {
      title: "Documents upload",
      component: <DocumentUploadSection setRemoveFiles={setRemoveFiles} />,
    },
    {
      title: "Career/Academic Goals",
      component: <MenteeCareerAcademicGoalsSection />,
    },
    {
      title: "Mentoring Preferences",
      component: <MenteeMentoringPreferencesSection />,
    },
    {
      title: "Availability",
      component: <MenteeAvailabilitySection />,
    },
    {
      title: "Detailed Career/academic Goals",
      component: <MenteeDetailedCareerAcademicGoalsSection />,
    },
    {
      title: "Challenges and Obstacles",
      component: <MenteeChallengesAndObstaclesSection />,
    },
    {
      title: "Mentoring Experience",
      component: <MenteeMentoringExperienceSection />,
    },
    {
      title: "Learning style & Preferences",
      component: <MenteeLearningSylePreferencesSection />,
    },
    {
      title: "Networking & Professional Developement",
      component: <MenteeNetworkingProfessionalDevelopementSection />,
    },
    {
      title: "Personal Development",
      component: <MenteePersonalDevelopmentSection />,
    },
    {
      title: "Mentoring Relationship Dynamics",
      component: <MenteeMentoringRelationshipDynamicsSection />,
    },
    {
      title: "Long-term Vision",
      component: <MenteeLongTermVisionSection />,
    },
    // ----
    {
      title: "Mentorship Preference",
      component: <MentorshipPreferenceSection />,
    },
    {
      title: "Goals",
      component: <GoalsAndExpectatonsSection />,
    },
    {
      title: "Availability and Commitment",
      component: <AvailabilityAndCommitmentSection />,
    },
    {
      title: "Additional Information",
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
  const methods = useForm({
    defaultValues: profile
  });
  const { setValue } = methods;
  const uploadUserImage =async (e) => {
    if (e.target.files && e.target.files[0]) {
      let bodyFormData = new FormData();
      bodyFormData.append("profile_image", e.target.files[0]);
      try {
        const response = await dispatch(updateProfileImage(bodyFormData)).unwrap();
        // Only update the image in the form state
        // console.log(response,"res")
        setValue('image', response.profile_image); // Adjust the field name based on your form structure
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  useEffect(() => {
    if (status === profileStatus.update) {
      // setTimeout(() => {
      setEditMode(false);
      loadUserProfile();
      // }, 3000);
    }
  }, [status]);

  const onSubmit = (data) => {
    const formData = new FormData();

    // Add documents to FormData (assumes documents is a file or array of files)

    if (userRole === user.mentee) {
      const selectedFields = [
        "full_name",
        "first_name",
        "last_name",
        "email",
        "phone_number",
        "secondary_phone_number",
        // 'dob',
        "gender",
        "location",
        "current_education",
        "career_goals",
        "gain_skills",
        "fields_of_interest",
        "expectations_of_future",
        "specialization_study",
        "work_experience",
        "extra_curricular_activities",
        "mentoring_expectations",
        "mentor_meet_frequency",
        "mentor_communication_method",
        "strongest_skills",
        "areas_of_improvement",
        "related_hobbies_interests",
        "expectations_mentoring_relationship",
        "goals_from_mentorship",
        "mentee_thoughts_mentor",
        "days_times_for_meetings",
        "available_for_virtual_meeting",
        "inspiration_for_current_field",
        "projects_research_topics",
        "dreams_career_path",
        "preferred_companies_to_work",
        "current_challenges_faced",
        "obstacles_encountered",
        "handle_setbacks",
        "past_mentoring_exp",
        "values_from_past_mentoring_exp",
        "mentoring_relationship_expectations",
        "feedback_preference",
        "learning_style_preference",
        "structured_sessions_preference",
        "networking_opportunities_prefs",
        "assistance_req",
        "professional_resources_prefs",
        "develop_skills_quality_prefs",
        "personal_challenges_overcoming",
        "stress_management_methods",
        "mentor_qualities",
        "interested_mentoring_activities",
        "measures_mentoring_relationship",
        "mentor_guidance_from_distance",
        "long_term_aspirations",
        "plans_giveback_community",
        "legacy_from_life",
        "additional_information",
        "request_need_mentor_to_know",
        "linked_in",
        "socila_media",
        "professional_bio",
        "address",
      ];

      selectedFields.forEach((field) => {
        if (data[field]) {
          formData.append(field, data[field]);
        }
      });

      formData.append("dob", data.dob ? dayjs(data.dob).format("YYYY-MM-DD") : "");

      if (data.documents) {
        if (Array.isArray(data.documents)) {
          data.documents.forEach((file, index) => {
            formData.append(`documents`, file);
          });
        } else {
          formData.append("documents", data.documents);
        }
      }

      formData.append("files_to_remove", removeFiles || []);

      return dispatch(updateProfile(formData));
    } else if (userRole === user.mentor) {
      if (data.documents) {
        if (Array.isArray(data.documents)) {
          data.documents.forEach((file, index) => {
            formData.append(`documents`, file);
          });
        } else {
          formData.append("documents", data.documents);
        }
      }

      formData.append("first_name", data.first_name || "");
      formData.append("last_name", data.last_name || "");
      formData.append("phone_number", data.phone_number || "");
      formData.append(
        "secondary_phone_number",
        data.secondary_phone_number || ""
      );
      formData.append("professional_bio", data.professional_bio || "");

      formData.append("job_title", data.job_title || "");
      formData.append("current_employer", data.current_employer || "");
      formData.append("industry_type", data.industry_type || "");
      formData.append("linked_in", data.linked_in || "");
      formData.append("highest_degree", data.highest_degree || "");
      formData.append("field_of_study", data.field_of_study || "");
      formData.append("institution_name", data.institution_name || "");
      formData.append("institution_location", data.institution_location || "");

      formData.append("areas_of_expertise", data.areas_of_expertise || "");
      formData.append(
        "confident_areas_of_expertise",
        data.confident_areas_of_expertise || ""
      );
      formData.append("prev_mentorship", data.prev_mentorship || false);
      formData.append("mentor_exp_desc", data.mentor_exp_desc || "");
      formData.append(
        "interested_mentee_type",
        data.interested_mentee_type || ""
      );
      formData.append("communication_mode", data.communication_mode || "");
      formData.append(
        "availability_frequency",
        data.availability_frequency || ""
      );
      formData.append(
        "mentorship_achievement",
        data.mentorship_achievement || ""
      );
      formData.append("mentor_expectations", data.mentor_expectations || "");
      formData.append("expectations_mentoring_relationship", data.expectations_mentoring_relationship || "");
      formData.append("goals_from_mentorship", data.goals_from_mentorship || "");
      formData.append("mentee_thoughts_mentor", data.mentee_thoughts_mentor || "");
      formData.append("max_mentee_count", data.max_mentee_count || null);
      formData.append(
        "pref_mentorship_duration",
        data.pref_mentorship_duration || ""
      );
      formData.append("additional_info", data.additional_info || "");
      formData.append("address", data.address || "");
      formData.append("location", data.location || "");
      formData.append("social_media", data.social_media || "");
      formData.append("reviewandrating", data.reviewandrating || false);
      formData.append("years_of_experience", data.years_of_experience || "");
      formData.append("gender", data.gender || "");
      formData.append("files_to_remove", removeFiles || []);

      console.log("formData", formData);

      return dispatch(updateProfile(formData));
    } else if (userRole === user.admin) {
      const adminFields = [
        "first_name",
        "last_name",
        "email",
        "phone_number",
        "secondary_phone_number",
        "gender",
        "location",
        "linked_in",
        "professional_bio",
        "address",
      ];
      adminFields.forEach((field) => {
        if (data[field]) {
          formData.append(field, data[field]);
        }
      });

      return dispatch(updateProfile(formData));
    }
  };

  return (
    <FormContextProvider onSubmit={onSubmit} initialValues={profile}>
      <div className='border px-4 sm:px-4 md:px-8 lg:px-12 xl:px-12 py-6 rounded-lg bg-white'>

        <div className='flex flex-col sm:flex-row items-center gap-6 sm:justify-between'>
  {/* Profile Image Section */}
  <div className='relative w-full sm:w-[50%] md:w-[30%] lg:w-[12%]'>
    <div className='upload-profile'>
      <label className='relative block aspect-square w-32 sm:w-36 md:w-40 cursor-pointer mx-auto sm:mx-0'>
        <img
          src={methods.watch('image') || ProfileImageIcon}
          className='w-full h-full rounded-full object-cover'
          alt='ProfileImageIcon'
        />
        <img
          src={ProfileImagePencilIcon}
          className='absolute top-1/2 left-2 w-6 h-6 transform -translate-y-1/2 cursor-pointer'
          alt='ProfileImagePencilIcon'
        />
        <input 
          type='file' 
          className='hidden' 
          onChange={uploadUserImage} 
        />
      </label>
    </div>
  </div>

  {/* Buttons Section */}
  <div className='flex flex-col sm:flex-row gap-4 sm:space-x-4 w-full sm:w-auto'>
    <div className="flex justify-center mb-5">
    <Button
              btnName='Cancel'
              btnCls='w-[140px]'
              btnStyle={{
                border: "1px solid rgba(29, 91, 191, 1)",
                color: "rgba(29, 91, 191, 1)",
              }}
              btnCategory='secondary'
              onClick={() => setEditMode(false)}
            />
            <Button
              btnType='submit'
              btnName={`${loading ? "Saving..." : "Save Changes"}`}
              btnCls={"w-[160px]"}
            />
    </div>
  
  </div>
</div>

        <div
          ref={contentRef}
          style={{
            maxHeight: showAll
              ? `${contentRef.current.scrollHeight}px`
              : "w-[100%]",
            overflow: "hidden",
            transition: "max-height 0.5s ease",
          }}
        >
          {profileSection.map((section, index) => (
            <Accordian key={index} title={section.title} defaultValue={true}>
              {section.component}
            </Accordian>
          ))}
        </div>

        {userRole !== user.admin && (
          <div
            className='underline mt-3 flex items-center gap-2 text-blue-500 font-semibold text-lg cursor-pointer'
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "View less" : "View more"}
            <img
              className={`mt-1 transition-all duration-300 ${
                showAll ? "rotate-180" : ""
              }`}
              src={ArrowDown}
              alt=''
            />
          </div>
        )}
      </div>
    </FormContextProvider>
  );
};

export default EditProfile;
