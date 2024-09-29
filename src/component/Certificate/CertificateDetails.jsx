import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Backdrop, CircularProgress } from '@mui/material'
import CancelIcon from '../../assets/images/cancel-colour1x.png'
import Tooltip from '../../shared/Tooltip'
import api from '../../services/api'
import { Button } from '../../shared'


export default function CertificateDetails() {
    const navigate = useNavigate()
    const { id } = useParams();
    console.log(id, "location");
    const [certificateDetails, setCertificateDetails] = useState(<></>)
    const [loading, setLoading] = useState(true)


    // const certificateId = searchParams.get("certificate_id");
console.log(id)
    const getCertificateDetails = async () => {
        // const query = `?program_id=${programId}&certificate_id=${id}&action=view`;
        const certificateAction = await api.get(`mentee_program/certifications/download?id=${id}&action=view`);
        if (certificateAction.status === 200 && certificateAction.data) {
            console.log(certificateAction,"cerficate")
            setCertificateDetails(certificateAction.data)
        }
        setLoading(false)
    }
    const downloadAsPDF = () => {
        // Create a blob from the HTML content
        const blob = new Blob([certificateDetails], { type: 'application/pdf' });

        // Create a link element, use it to trigger the download, then remove it
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'certificate.pdf';

        // Append the link, trigger the click and remove the link from the DOM
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        if (id) {
            
            getCertificateDetails();
        }
    }, [])


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

                    <div className='flex gap-4 mb-3 mt-3'>
                        <Button btnType="button" btnCls="w-[100px]"  onClick={() => navigate('/certificates')} btnName='Close' btnCategory="secondary" />
                        
                        <Button btnType="button" btnCls="w-[130px]" onClick={()=>downloadAsPDF()} btnName='Download' btnCategory="primary" />
                    </div>
                </div>

            </div>
        </div>
    )
}
