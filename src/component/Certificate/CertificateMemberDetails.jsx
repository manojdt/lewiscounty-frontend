import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Cancel from "../../assets/images/cancel-colour1x.png";
import ArrowRightIcon from "../../assets/icons/arrowRightColor.svg";
import api from '../../services/api'
import DataTable from '../../shared/DataGrid';
import { certificateMenberColumns } from '../../utils/tableFields'
import { resultColor, resultText } from '../../utils/constant'


export default function CertificateMemberDetails() {
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
    let certificateColumn = [
        ...certificateMenberColumns,
        {
            field: 'mark',
            headerName: 'Total Over All Mark',
            flex: 1,
            id: 1,
            renderCell: (params) => {
              
                return <></>
            }
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            id: 2,
            renderCell: (params) => {
                console.log('paramsppppp', params)
                return <>
                    <div className='cursor-pointer flex items-center h-full relative'>
                        <span className='w-[80px] flex justify-center h-[30px] px-3'
                            style={{
                                background: resultColor[params.row.status]?.bg || '', lineHeight: '30px',
                                borderRadius: '3px', width: '110px', height: '34px', color: resultColor[params.row.status]?.color || '',
                                fontSize: '12px'
                            }}
                        > {resultText[params.row.status]}</span>
                    </div>
                </>
            }
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            id: 4,
            renderCell: (params) => {
                return <>

                </>
            }

        },
    ]

    return (
        <div className="px-8 mt-10 pb-5">
            <div
                className="px-3 py-5"
                style={{ boxShadow: "4px 4px 25px 0px rgba(0, 0, 0, 0.15)" }}
            >


                <div className="flex justify-between px-5 pb-4 mb-8 items-center border-b-2">
                    <div className="flex gap-5 items-center text-[14px]">
                        <p style={{ color: "rgba(89, 117, 162, 1)", fontWeight: 500 }}>
                            Generate Certificates Request
                        </p>
                        <img src={ArrowRightIcon} alt="ArrowRightIcon" />
                        <p>View Member List</p>
                    </div>
                    <div
                        className="cursor-pointer"
                        onClick={() => navigate("/all-request?type=member_join_request")}
                    >
                        <img src={Cancel} alt="link" className="w-[20px] h[10px]" />
                    </div>
                </div>
                <DataTable rows={certificateDetails || []} columns={certificateColumn} hideFooter />
            </div>
        </div>
    )
}
