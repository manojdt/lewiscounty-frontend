import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const Breadcrumbs = ({ items }) => {
  const navigate = useNavigate();
  console.log(items,items.path,"items")
  return (
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index === 0 ? (
              // First item
              <button
                onClick={() => item.onClick ? item.onClick() : navigate(item.path)}
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                {item.icon && (
                  <span className="mr-2">{item.icon}</span>
                )}
                {item.label}
              </button>
            ) : (
              // Other items
              <div className="flex items-center">
               <svg
                    className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                {item.onClick || item.path ? (
                  <button
                    onClick={() => item.onClick ? item.onClick() : navigate(item.path)}
                    className={`ml-1 text-sm font-medium ${
                        index === items.length - 1
                          ? 'text-gray-900 hover:text-black'
                          : 'text-blue-600 hover:text-blue-700'
                      } cursor-pointer`}
                  >
                    {item.label}
                  </button>
                ) : (
                  <span  className={`ml-1 text-sm font-medium ${
                    index === items.length - 1
                      ? 'text-gray-900'
                      : 'text-blue-600'
                  }`}>
                    {item.label}
                  </span>
                )}
              </div>
            )}
          </li>
        ))}
      </ol>
  );
};


export default Breadcrumbs;