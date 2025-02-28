import { useState, useEffect } from 'react';

// Custom hook to handle window resizing and return width based on screen size
const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getInputWidth = () => {
    if (windowWidth < 600) {
      return '100%'; // For small screens
    } else if (windowWidth < 1024) {
      return '100%'; // For medium screens
    } else {
      return '430px'; // For large screens
    }
  };

  return getInputWidth();
};

export default useWindowWidth;
