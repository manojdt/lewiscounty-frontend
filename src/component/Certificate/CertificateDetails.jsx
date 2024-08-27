import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Backdrop, CircularProgress } from '@mui/material'
import CancelIcon from '../../assets/images/cancel-colour1x.png'
import Tooltip from '../../shared/Tooltip'
import api from '../../services/api'


export default function CertificateDetails() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();
    const [certificateDetails, setCertificateDetails] = useState(<></>)
    const [loading, setLoading] = useState(true)

    const programId = searchParams.get("program_id");
    const certificateId = searchParams.get("certificate_id");

    const getCertificateDetails = async () => {
        const query = `?program_id=${programId}&certificate_id=${certificateId}&action=view`;
        const certificateAction = await api.get(`/mentee_program/certifications/download/${query}`);
        if (certificateAction.status === 200 && certificateAction.data) {
            setCertificateDetails(certificateAction.data)
        }
        setLoading(false)
    }

    useEffect(() => {
        if (programId && programId !== '' && certificateId && certificateId !== '') {
            getCertificateDetails();
        }
    }, [programId])


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


                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>


                <div className='flex flex-col gap-3 items-center py-10 px-40'>

                    <div dangerouslySetInnerHTML={{ __html: certificateDetails }}></div>

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
