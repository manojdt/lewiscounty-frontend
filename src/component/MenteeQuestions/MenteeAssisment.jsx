import React, { useState } from 'react';

const MenteeAssessment = () => {
  const [currentPage, setCurrentPage] = useState(0);
  
  const pages = [
    {
      title: "Mentee Assessment",
      subtitle: "Strengths, Needs and Cultural Discovery",
      content: null,
      showNext: true,
      showPrev: false,
      showFinish: false
    },
    {
      title: "Mentee Assessment",
      subtitle: "Strengths, Needs and Cultural Discovery",
      selectedItem: "Mission Statement",
      menuItems: ["Mission Statement", "Vision Statement", "Values"],
      content: (
        <div className="text-left">
          <p className="text-gray-700">
            Our mission is to inspire youth through meaningful relationships to make positive choices that will build resiliency, encourage growth, and enable them to pursue a successful future.
          </p>
        </div>
      ),
      showNext: true,
      showPrev: true,
      showFinish: false
    },
    {
      title: "Mentee Assessment",
      subtitle: "Strengths, Needs and Cultural Discovery",
      selectedItem: "Vision Statement",
      menuItems: ["Mission Statement", "Vision Statement", "Values"],
      content: (
        <div className="text-left">
          <p className="text-gray-700">
            Our vision is a Lewis County where every youth is supported, encouraged and empowered to reach their full potential through purposeful connections with caring adults.
          </p>
        </div>
      ),
      showNext: true,
      showPrev: true,
      showFinish: false
    },
    {
      title: "Mentee Assessment",
      subtitle: "Strengths, Needs and Cultural Discovery",
      selectedItem: "Values",
      menuItems: ["Mission Statement", "Vision Statement", "Values"],
      content: (
        <div className="text-left">
          <p className="text-gray-700 mb-4">
            <span className="font-bold bg-gradient-to-r from-[#00AEBD] to-[#1D5BBF] text-transparent bg-clip-text">Relationship</span> - It is through purposeful relationships that youth are supported, challenged and empowered.
          </p>
          <p className="text-gray-700 mb-4">
            <span className="font-bold bg-gradient-to-r from-[#00AEBD] to-[#1D5BBF] text-transparent bg-clip-text">Trust</span> - The mentor/Mentee relationship is built on mutual trust and continues to encourage trust which in turn encourages participants to put trust in others. <span className="bg-gradient-to-r from-[#00AEBD] to-[#1D5BBF] text-transparent bg-clip-text font-medium">Support - I'm here for you.</span>
          </p>
          <p className="text-gray-700 mb-4">
            <span className="font-bold bg-gradient-to-r from-[#00AEBD] to-[#1D5BBF] text-transparent bg-clip-text">Resiliency</span> - Youth need skills to build strength and stamina to handle what they have experienced and what will yet come their way. <span className="bg-gradient-to-r from-[#00AEBD] to-[#1D5BBF] text-transparent bg-clip-text font-medium">Create a growth mindset.</span>
          </p>
          <p className="text-gray-700 mb-4">
            <span className="font-bold bg-gradient-to-r from-[#00AEBD] to-[#1D5BBF] text-transparent bg-clip-text">Inspiration</span> - Mentors/Mentee's will focus on personal growth, increased resiliency and development through positive relationships. <span className="bg-gradient-to-r from-[#00AEBD] to-[#1D5BBF] text-transparent bg-clip-text font-medium">Encouragement - You got this!</span>
          </p>
          <p className="text-gray-700 mb-4">
            <span className="font-bold bg-gradient-to-r from-[#00AEBD] to-[#1D5BBF] text-transparent bg-clip-text">Growth</span> - Mentored youth will develop healthier lifestyles and positive relationships. Youth that receive mentoring as are more likely to attend school, have better grades and less delinquent behaviors. <span className="bg-gradient-to-r from-[#00AEBD] to-[#1D5BBF] text-transparent bg-clip-text font-medium">What are areas of growth for you? How can I help you pursue your interests? Empower - Here is what you can do.</span>
          </p>
        </div>
      ),
      showNext: false,
      showPrev: true,
      showFinish: true
    }
  ];
  
  // Function to handle next page navigation
  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };
  
  // Function to handle previous page navigation
  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };
  
  // Function to handle direct page navigation
  const goToPage = (pageIndex) => {
    if (pageIndex >= 0 && pageIndex < pages.length) {
      setCurrentPage(pageIndex);
    }
  };
  
  const currentPageData = pages[currentPage];
  
  return (
    <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-auto overflow-hidden">
      <div className="p-8 pb-16 relative min-h-screen">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00AEBD] to-[#1D5BBF] text-transparent bg-clip-text mb-2">{currentPageData.title}</h1>
        <h2 className="text-gray-500 mb-8">{currentPageData.subtitle}</h2>
        
        <div className="flex">
          {currentPageData.menuItems && (
            <div className="w-1/3">
              <ul>
                {currentPageData.menuItems.map((item, index) => {
                  // Calculate the actual page index for the menu item
                  const pageIndex = index + 1; // Menu items start from page 1
                  return (
                    <li 
                      key={index} 
                      className="mb-3 flex items-start text-right cursor-pointer"
                      onClick={() => goToPage(pageIndex)}
                    >
                      <span 
                        className={`w-2 h-2 rounded-full mt-1.5 mr-2 ${item === currentPageData.selectedItem ? 'bg-teal-500' : 'bg-teal-200'}`}
                      ></span>
                      <span 
                        className={item === currentPageData.selectedItem ? 'bg-gradient-to-r from-[#00AEBD] to-[#1D5BBF] text-transparent bg-clip-text' : 'bg-gradient-to-r from-[#00AEBD] to-[#1D5BBF] text-transparent bg-clip-text text-[12px]'}
                      >
                        {item}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          
          <div className={currentPageData.menuItems ? "w-2/3" : "w-full"}>
            {currentPageData.content}
          </div>
        </div>
        
        <div className="absolute bottom-8 right-8 flex items-center">
          {currentPageData.showPrev && (
            <button 
              onClick={handlePrev}
              className="flex items-center text-blue-500 mr-4 hover:underline"
            >
              <span className="mr-1">←</span> Prev
            </button>
          )}
          
          {currentPageData.showNext && (
            <button 
              onClick={handleNext}
              className="flex items-center text-blue-500 hover:underline"
            >
              Next <span className="ml-1">→</span>
            </button>
          )}
          
          {currentPageData.showFinish && (
            <button 
              className="flex items-center text-blue-500 hover:underline"
            >
              Finish <span className="ml-1">→</span>
            </button>
          )}
        </div>
        
        {/* Background circle decoration */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <div className="w-full h-64 bg-blue-100 rounded-full opacity-10"></div>
        </div>
      </div>
    </div>
  );
};

export default MenteeAssessment;