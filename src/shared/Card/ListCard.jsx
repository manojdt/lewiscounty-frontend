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
      className=""
      style={{
        boxShadow: "4px 4px 25px 0px rgba(0, 0, 0, 0.05)",
        borderRadius: "10px",
      }}
    >
      <div className="title flex justify-between py-3 px-4 border-b-2">
        <h4 className="text-base">{title}</h4>
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
      <ul className="flex flex-col gap-1 p-4 md:p-0 mt-4 font-medium">
      <li className="">{programCount}</li>
        {items.map((menu, index) => (
          <li className="" key={index}>
            <>
              {menu.role !== user.admin && (
                <div
                  className="flex justify-between py-2 px-6 rounded cursor-pointer menu-content"
                  onClick={() => handleClickItem(menu)}
                  aria-current="page"
                >
                  <span className="text-sm max-lg:text-[12px]">
                    {capitalizeEachWord(menu.role)}
                  </span>
                  <span className="text-base max-lg:text-[12px]">
                    {menu.count}
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
