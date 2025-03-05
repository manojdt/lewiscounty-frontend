import { OverlayPanel } from 'primereact/overlaypanel'
import React from 'react'

const SearchModal = ({searchBar,isLoading,addressFieldData,onSearchOptionClick}) => {

  return (
  
        <OverlayPanel
        ref={searchBar}
        id="fields-overlay"
        style={{
          width: "350px",
          top: "63px !important",
          height: "200px",
          overflow: "auto",
        }}
        className={isLoading ? "custom-overlay" : ""}>
            {!!addressFieldData?.length &&
                        !isLoading &&
                        addressFieldData?.map((item) => {
                          return (
                            <div
                              key={item.id}
                              className=" flex cursor-pointer"
                              style={{ height: "50px" }}
                             onClick={() => onSearchOptionClick(item)}
                            >
                              <div className="pr-1">{item.city},</div>
                              <div className="pr-1">{item.state_code},</div>
                              <div>{item.zip_code}</div>
                            </div>
                          );
                        })}
                      {isLoading && <div className="loader"></div>}
</OverlayPanel>
    
  
  )
}

export default SearchModal
