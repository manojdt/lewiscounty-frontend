import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { programActionStatus } from '../../utils/constant';

export default function Card({ cardTitle, cardContent, cardFilter = [], cardCountColor = '#000' }) {
    console.log('filter', cardFilter)
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();
    console.log('searchParams.get("type")', searchParams.get("type"))
    return (
        <div className="pb-3" style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
            <div className="title flex justify-between py-3 px-4 border-b-2">
                <h4 className="text-base">{cardTitle}</h4>
                {cardFilter.length ?
                    <p className="text-sm leading-8">
                        <select className='focus:outline-none py-1' style={{ background: 'rgba(217, 228, 242, 1)', border: 'none' }}>
                            {
                                cardFilter.map((filter, index) =>
                                    <option key={index}>{filter.name}</option>
                                )
                            }
                        </select>
                    </p>
                    :
                    null
                }
            </div>
            <ul className="flex flex-col gap-4 p-4 md:p-0 mt-4 font-medium">
                {
                    cardContent.map((menu, index) => <li className="" key={index}>
                        <div onClick={() => menu.page ? navigate(menu.page) : undefined} className={`flex justify-between py-2 px-6 rounded cursor-pointer menu-content 
                        ${searchParams.get("type") === menu.status || (searchParams.get("is_bookmark") !== null && menu.status === programActionStatus.bookmark) ||  (searchParams.get("type") === null && searchParams.get("is_bookmark") === null && menu.status === 'all') ? 'active' : ''}`} aria-current="page">
                            <span className="text-sm">{menu.name}</span>
                            <span className="text-base" style={{ color: cardCountColor }}>{menu.count}</span>
                        </div>
                    </li>)
                }
            </ul>
        </div>
    )
}
