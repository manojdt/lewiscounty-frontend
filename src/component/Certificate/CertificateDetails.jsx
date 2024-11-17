import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import CancelIcon from "../../assets/images/cancel-colour1x.png";
import Tooltip from "../../shared/Tooltip";
import api from "../../services/api";
import { Button } from "../../shared";

export default function CertificateDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [certificateDetails, setCertificateDetails] = useState(<></>);
  const [loading, setLoading] = useState(true);

  const getCertificateDetails = async () => {
    const res = searchParams.get("mentee_id");
    const resId = res ? `&mentee_id=${res}` : "";
    const certificateAction = await api.get(
      `mentee_program/certifications/download?id=${id}&action=view${resId}`
    );
    if (certificateAction.status === 200 && certificateAction.data) {
      setCertificateDetails(certificateAction.data);
    }
    setLoading(false);
  };
  const downloadAsPDF = () => {
    // Create a hidden iframe
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.top = "-10000px";
    document.body.appendChild(iframe);

    // Write the certificate HTML to the iframe
    iframe.contentDocument.open();
    iframe.contentDocument.write(certificateDetails);
    iframe.contentDocument.close();

    // Wait for the content to load, then print the iframe content
    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();

      // Clean up the iframe after printing
      document.body.removeChild(iframe);
    };
  };

  const handleDownload = () => {
    const input = document.getElementById("certificate-content");
    setLoading(true);
    console.log('input',input)
    html2canvas(input, {  }).then((canvas) => {
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 190; // Set your desired width
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("certificate.pdf");
      setLoading(false);
    });
  };

  useEffect(() => {
    if (id) {
      getCertificateDetails();
    }
  }, []);

  return (
    <div className="dashboard-content px-8 mt-10 mb-7">
      <div
        style={{
          boxShadow: "4px 4px 25px 0px rgba(0, 0, 0, 0.05)",
          borderRadius: "10px",
        }}
      >
        <div className="title flex justify-between py-3 px-4 border-b-2 items-center">
          <div className="flex gap-4">
            <h4>Certificates</h4>
          </div>
          <div className="flex gap-20 items-center">
            <Tooltip title="Cancel">
              <img
                className="cursor-pointer"
                onClick={() => navigate("/certificates")}
                src={CancelIcon}
                alt="CancelIcon"
              />
            </Tooltip>
          </div>
        </div>

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        <div className="flex flex-col gap-3 items-center py-10 px-40">
          <div
            id="certificate-content"
            dangerouslySetInnerHTML={{ __html: certificateDetails }}
          ></div>

          <div className="flex gap-4 mb-3 mt-3">
            <Button
              btnType="button"
              btnCls="w-[100px]"
              onClick={() => navigate("/certificates")}
              btnName="Close"
              btnCategory="secondary"
            />

            <Button
              btnType="button"
              btnCls="w-[130px]"
              onClick={() => handleDownload()}
              btnName="Download"
              btnCategory="primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
