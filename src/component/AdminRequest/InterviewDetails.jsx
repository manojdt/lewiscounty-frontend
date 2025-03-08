import React from 'react'
import { EquipmentFormFields } from '../formFields/formFields';
import { Button } from "../../shared";

const InterviewDetails = () => {
    const fields = [
   
        {
            type: "date",
            label: "Select date and time",
            placeholder: "Select date and time",
            isRequired: false,
            col:12,
            key: "date",
            isDisable: false,

        },
        {
            type: "textbox",
            label: "Location",
            placeholder: "Search Location",
            isRequired: false,
            col: 12,
            key: "location",
            isDisable: false

        },

        {
          type: "textarea",
          label: "Description",
          isRequired: false,
          col: 12,
          key: "interview_description",
        },

    ]
  return (
    <div>
        <EquipmentFormFields fields={fields}/>
        <div className='flex justify-center my-7'>
        <Button btnCategory='primary' btnType='submit' btnName={'Confirm and send mail'} />
        </div>
       
      
    </div>
  )
}

export default InterviewDetails
