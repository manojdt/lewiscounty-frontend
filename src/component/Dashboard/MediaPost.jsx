import React from 'react'
import MediaIcon from '../../assets/icons/Media.svg'
import WriteArticlesIcon from '../../assets/icons/Write_Articles.svg'

export default function MediaPost() {
    return (
        <div style={{ boxShadow: '4px 4px 15px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }} className="bg-white py-8 px-8">
            <div>
                <input name="post" className="w-full h-[100px] py-3 px-3" style={{ border: '1px solid rgba(62, 62, 62, 0.75)', borderRadius: '48px' }}
                    placeholder="Start Post"
                />
            </div>
            <div className="flex justify-center pt-5 pb-5 gap-6 items-center">
                <div className="flex gap-4 items-center">
                    <img src={MediaIcon} alt="MediaIcon" />
                    <div>Media</div>
                </div>
                <div className="flex gap-4 items-center">
                    <img src={WriteArticlesIcon} alt="WriteArticlesIcon" />
                    <div>Write Articles</div>
                </div>
            </div>
        </div>
    )
}
