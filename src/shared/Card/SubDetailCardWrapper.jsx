const SubDetailCardWrapper = ({title, children, onViewAll }) => {
    return (
      <div className="p-6 bg-gray-100 rounded">
        <div className="flex justify-between border-b border-blue-100 items-center pb-3 mb-6">
          <h2 className="text-md font-semibold">{title}</h2>
          <button 
            onClick={onViewAll}
            className="text-blue-600 hover:text-blue-700 bg-blue-100 font-medium"
          >
            View All
          </button>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children}
        </div>
      </div>
    );
  };

  export default SubDetailCardWrapper