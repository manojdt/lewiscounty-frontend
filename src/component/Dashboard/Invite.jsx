import React from 'react'
import { Button } from '../../shared';
import InviteFriendsIcon from '../../assets/icons/Invite-friends.svg'

export default function Invite() {
    return (
        <div className="pb-3" style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
            <div className="flex py-6 px-6 justify-evenly gap-4">
                <div className="flex h-[50px] text-center px-4" style={{ background: 'rgba(238, 245, 255, 1)' }}>
                    <img src={InviteFriendsIcon} alt="user icon" />
                </div>

                <div>
                    <p className="text-sm">Invite to your friends</p>
                    <p className="text-sm">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                </div>
            </div>
            <div className="text-center">
                <Button btnCls="!px-12 !py-3" btnName='Invite' btnCategory="primary" onClick={() => console.log('Invite')} />
            </div>
        </div>
    )
}
