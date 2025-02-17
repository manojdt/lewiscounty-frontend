import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material';
import { useWindowSize } from '../../utils/windowResize';

const SlideDotStyleWrapper = styled('div')`
  .custom-dots {
    position: absolute;
    width: 100%;
    top: 5rem;
  }

  /* Custom styles for dots */
  .custom-dots li {
    display: inline-block;
    margin: 0;
  }

  .custom-dots .slick-active .dot {
    width: 26px;
    height: 6px;
    border-radius: 8px;
    background-color: white;
    opacity: 1;
  }

  .custom-dots .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: white;
    opacity: 0.7;
    min-width: auto;
    transition: width 250ms ease 0s;
    &::before {
      color: transparent;
    }
  }

  .custom-dots .dot:hover {
    opacity: 1;
  }
`;
const AuthLayout = () => {
  // React Slick slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    appendDots: (dots) => (
      <SlideDotStyleWrapper>
        <ul className='custom-dots flex justify-center gap-x-3'>{dots}</ul>
      </SlideDotStyleWrapper>
    ),
    customPaging: (i) => (
      <button className='dot w-3 h-3 rounded-full bg-white opacity-70 hover:opacity-100 transition-all duration-300'></button>
    ),
  };

  const { width } = useWindowSize();

  // Welcome slider content
  const slides = [
    {
      title: 'Welcome',
      subtitle: 'Mentoring Management Application',
      description:
        'Turn mentor matches into success stories. Simple tools, powerful outcomes, lasting connections',
    },
    {
      title: 'Welcome',
      subtitle: 'Mentoring Management Application',
      description:
        'Your all-in-one mentoring solution. Smart matching, easy tracking, meaningful outcomes',
    },
    {
      title: 'Welcome',
      subtitle: 'Mentoring Management Application',
      description:
        'Empower mentors, inspire growth. Your complete solution for building impactful relationships',
    },
  ];

  return (
    <div className='flex h-screen overflow-hidden'>
      {/* Left Section */}
      {width > 1024 && <div
        className='w-3/5 flex items-center justify-center'
        style={{
          background:
            'linear-gradient(134.63deg, #1D5BBF 0.94%, #00AEBD 98.69%)',
        }}
      >
        <div className='w-4/5'>
          <Slider {...sliderSettings}>
            {slides.map((slide, index) => (
              <div key={index} className='text-white'>
                <h1 className='text-4xl mb-4'>{slide.title}</h1>
                <h2 className='text-4xl font-semibold mb-2'>
                  {slide.subtitle}
                </h2>
                <p className='text-md'>{slide.description}</p>
              </div>
            ))}
          </Slider>
        </div>
      </div>}
      
      <div className='w-full overflow-y-auto py-20 max-lg:py-2'>
        <Outlet />
      </div>
    </div>
  );
};

export { AuthLayout };
