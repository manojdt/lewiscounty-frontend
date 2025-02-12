// src/component/ScrollToTop.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = ({ children }) => {
  const location = useLocation();
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
    //   behavior: 'smooth'
    });
  };

  useEffect(() => {
    // Scroll on route changes
    scrollToTop();
    // console.log("location",location)
    // console.log("location.pathname",location.pathname)
    // console.log("location.search",location.search)
  }, [location.pathname, location.search]);

  return children;
};

export default ScrollToTop;