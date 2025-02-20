import React from "react";
import UserIcon from "../../assets/icons/user-icon.svg";

const MentorCardView = ({ 
  mentors, 
  onViewProfile, 
  onFollow, 
  loading,
  paginationModel,
  setPaginationModel,
  totalCount 
}) => {
  const totalPages = Math.ceil(totalCount / paginationModel.pageSize);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPaginationModel({
        ...paginationModel,
        page: newPage
      });
    }
  };

  return (
    <div className="flex flex-col">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        {mentors?.map((mentor) => (
          <div
            key={mentor.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-200"
          >
            <div className="p-3">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-gray-200 overflow-hidden">
                  <img
                    src={mentor?.profile_image || UserIcon}
                    className="w-18 h-18"
                    style={{ width: "3.8rem", height: "3.8rem" }}
                    alt="user"
                  />
                </div>

                <div className="flex flex-col justify-start pt-1">
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900">
                      {mentor.first_name} {mentor.last_name}
                    </h3>
                    <p className="text-sm pt-1">{mentor.job_title}</p>
                  </div>
                  <div>
                    <div
                      onClick={() => onViewProfile(mentor)}
                      className="py-2 text-sm font-medium rounded-md transition-colors text-blue-600 underline cursor-pointer"
                    >
                      View Profile
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="flex items-center">
          <p className="text-sm text-gray-700">
            Showing{' '}
            <span className="font-medium">
              {paginationModel.page * paginationModel.pageSize + 1}
            </span>
            {' '}to{' '}
            <span className="font-medium">
              {Math.min((paginationModel.page + 1) * paginationModel.pageSize, totalCount)}
            </span>
            {' '}of{' '}
            <span className="font-medium">{totalCount}</span>
            {' '}results
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(paginationModel.page - 1)}
            disabled={paginationModel.page === 0}
            className={`px-3 py-1 rounded border ${
              paginationModel.page === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-blue-600 hover:bg-blue-50'
            }`}
          >
            Previous
          </button>
          
          <button
            onClick={() => handlePageChange(paginationModel.page + 1)}
            disabled={paginationModel.page >= totalPages - 1}
            className={`px-3 py-1 rounded border ${
              paginationModel.page >= totalPages - 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-blue-600 hover:bg-blue-50'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorCardView;