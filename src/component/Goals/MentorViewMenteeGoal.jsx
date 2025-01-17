import React from 'react'
import ViewGoal from './ViewGoal'
import { useSearchParams } from 'react-router-dom';

export default function MentorViewMenteeGoal() {
      const [searchParams] = useSearchParams();
      const breadcrumbsType = searchParams.get("breadcrumbsType") || "";
  return (
    <ViewGoal type="mentor" headTreeList={breadcrumbsType}/>
  )
}
