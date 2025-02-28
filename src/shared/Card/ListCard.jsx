import React from "react";
import { capitalizeEachWord, user } from "../../utils/constant";

export default function ListCard({
  title = "",
  viewall = false,
  handleViewall,
  items = [],
  onItemClick,
  programCount
}) {
  const handleClickItem = (key) => {
    onItemClick && onItemClick(key);
  };
  return (
    <div
      className="h-[350px]"
      // style={{
      //   boxShadow: "4px 4px 25px 0px rgba(0, 0, 0, 0.05)",
      //   borderRadius: "10px",
      // }}
    >
      <div className="title flex justify-between py-3 px-4 border-b-2">
      <div className="flex gap-4">
          <div
            className="card-dash"
            style={{
              background: "linear-gradient(180deg, #00B1C0 0%, #005DC6 100%)",
            }}
          ></div>
          <h4>{title}</h4>
        </div>
        {viewall && (
          <p
            className="leading-8 cursor-pointer text-[12px] px-2"
            style={{
              background: "rgba(217, 228, 242, 1)",
              color: "rgba(29, 91, 191, 1)",
              borderRadius: "6px",
            }}
            onClick={handleViewall}
          >
            View All
          </p>
        )}
      </div>
      <ul className="flex gap-1 p-4 md:p-0 mt-7 font-medium">
      <li className="">{programCount}</li>
        {items.map((menu, index) => (
        
          <li className="" key={index}>
            <>
              {menu.role !== user.admin && (
                <div
                  className="flex flex-col justify-between py-2 pr-4 rounded cursor-pointer menu-content"
                  onClick={() => handleClickItem(menu)}
                  aria-current="page"
                >
                
                  <div className="w-[140px] h-[140px] rounded-[12px] flex items-center justify-center" 
                     style={{background:menu.role==='mentor'?'#C9F7F5':'#EEE5FF'}}>
                  <span className="text-[38px] font-semibold">
                    {menu.count}
                  </span>
                  </div>
                  <span className="text-sm max-lg:text-[40px] font-semibold flex items-center justify-center p-5">
                    {`${capitalizeEachWord(menu.role)}s`}
                  </span>
                </div>
              )}
            </>
          </li>
        ))}
       
      </ul>
    </div>
  );
}
