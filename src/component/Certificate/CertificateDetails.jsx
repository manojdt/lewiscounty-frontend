import React from 'react'
import CancelIcon from '../../assets/images/cancel-colour1x.png'
import SampleCertificate from '../../assets/images/sample-certificate.png'
import Tooltip from '../../shared/Tooltip'
import { useNavigate } from 'react-router-dom'


export default function CertificateDetails() {
    const navigate = useNavigate()
    return (
        <div className="dashboard-content px-8 mt-10 mb-7">
            <div style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
                <div className="title flex justify-between py-3 px-4 border-b-2 items-center">
                    <div className="flex gap-4">
                        <h4>Certificates</h4>
                    </div>
                    <div className="flex gap-20 items-center">
                        <Tooltip title="Cancel">
                            <img className='cursor-pointer' onClick={() => navigate('/certificates')} src={CancelIcon} alt="CancelIcon" />
                        </Tooltip>
                    </div>
                </div>

                <div className='flex flex-col gap-3 items-center py-10 px-40'>
                    <div className='w-full'>
                        <img src={SampleCertificate} className='w-full' alt="SampleCertificate" />
                    </div>
                    <div className='text-[14px]'>
                        <p className='py-6'>

                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

                        </p>

                        <p>

                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

                        </p>
                    </div>

                    <div className='mb-5'>
                        <button style={{
                            background: 'linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)', padding: '10px 30px', color: '#fff', width: '150px',
                            borderRadius: '3px'
                        }} onClick={() => navigate('/certificates')} >
                            Close
                        </button>
                    </div>
                </div>



            </div>
        </div>
    )
}
