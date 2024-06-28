import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { ReactComponent as ArrowRight } from "../../assets/icons/arrowRight.svg";
import { ReactComponent as PreviousIcon } from "../../assets/icons/previousIcon.svg";
import { ReactComponent as NextIcon } from "../../assets/icons/nextIcon.svg";
import './stepper.css'

export const Stepper = ({ steps, currentStep = 0, btnTypeAction }) => {
  const [iconsVisibility, setIconsVisibility] = useState({ prevIcon: false, nextIcon: true })
  const slideLeft = () => {
    const slider = document.getElementById('slider');
    const scroll = slider.scrollLeft - 200;
    slider.scrollLeft = scroll;
    setIconsVisibility({ prevIcon: scroll > 0, nextIcon: true })
  };
  const slideRight = () => {
    const slider = document.getElementById('slider');
    const scroll = slider.scrollLeft + 300;
    slider.scrollLeft = scroll;
    setIconsVisibility({ prevIcon: true, nextIcon: slider.clientWidth - scroll > (getWindowDimensions().width <=1536 ? 10 : 500)  })
  };


  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }
  console.log(getWindowDimensions())

  useEffect(() => {
    const slider = document.getElementById('slider');
    if(btnTypeAction.next && currentStep > 3 ){
      const slideMove =  300
      const slider = document.getElementById('slider');
      const scroll = slider.scrollLeft + slideMove;
      slider.scrollLeft = scroll;
      setIconsVisibility({ prevIcon: true, nextIcon: slider.clientWidth - scroll > (getWindowDimensions().width <=1536 ? 10 : 500) })
    }
    if(btnTypeAction.back && currentStep >= 3){
      const slideMove = 400
      const slider = document.getElementById('slider');
      const scroll = slider.scrollLeft - slideMove;
      slider.scrollLeft = scroll;
      setIconsVisibility({ prevIcon: scroll > 0, nextIcon: true })
    }
    
  },[currentStep])

  return (
    <Box sx={{ width: '100%' }} className="relative">
      {
        iconsVisibility.prevIcon && <div className='previousIcon absolute cursor-pointer' onClick={slideLeft}> <PreviousIcon /></div>
      }
      <div
        id='slider'
        className='w-full h-full overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide no-scrollbar'
      >
        <ol
          className="flex items-center w-full p-3 space-x-2 text-sm font-medium text-center 
          text-gray-500 bg-white  rounded-lg shadow-sm 
          sm:text-base  sm:p-4 sm:space-x-4 
          rtl:space-x-reverse gap-12"
        >
          {
            steps.map((step, index) => {
              const currentIndex = parseInt(index)
              const fieldView = step.status === 'In-Progress' ? 'opacity-50' : 'opacity-100'
              return (
                <li className="flex flex-row items-center" style={{ color: `${currentStep >= currentIndex + 1 ? 'rgba(29, 91, 191, 1)' : '#000'}` }} key={index}>
                  <span className={`flex items-center justify-center w-5 h-5 me-2 text-sm border rounded-2xl px-4 py-4 ${fieldView}`}
                    style={{
                      background: `${currentStep >= currentIndex + 1 ? 'rgba(29, 91, 191, 1)' : 'rgba(217, 228, 242, 1)'}`,
                      color: `${currentStep >= currentIndex + 1 ? '#fff' : 'rgba(24, 40, 61, 1)'}`
                    }}
                  >
                    {index + 1}
                  </span>
                  <div className="flex flex-col text-left pr-4">
                    <div className={
                     `
                      ${step.status === 'In-Progress' ? 'opacity-50' : 'opacity-100'} 
                
                      font-medium`
                      }>{step.name}</div>
                    <div className={`text-xs ${fieldView}`}>{step.status}</div>
                  </div>
                  { currentIndex !== steps.length-1 ? <ArrowRight /> : null }
                </li>
              )
            })
          }
        </ol>
      </div>
      {
        iconsVisibility.nextIcon && <div className='nextIcon absolute cursor-pointer' onClick={slideRight}> <NextIcon />  </div>
      }

    </Box>
  );
}

