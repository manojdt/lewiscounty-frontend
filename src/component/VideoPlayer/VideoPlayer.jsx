// import { useState, useRef, useEffect } from "react";
// import VideoFile from "./5 Minute Timer.mp4"

// const VideoPlayer = () => {
//     const videoRef = useRef(null);
//     const [isPaused, setIsPaused] = useState(false);
//     const [clickCount, setClickCount] = useState(0);
//     const [resumeTimes, setResumeTimes] = useState([]);

//     useEffect(() => {
//         debugger
//         const video = videoRef.current;
//         if (!video) return;

//         const handleTimeUpdate = () => {
//             if (video.currentTime >= video.dataset.nextPauseTime) {
//                 video.pause();
//                 setIsPaused(true);
//             }
//         };

//         const handleVideoEnd = () => {
//             alert(`You have completed the video. Total button clicks: ${clickCount}`);
//         };

//         video.dataset.nextPauseTime = 30; // First pause at 2 mins
//         video.addEventListener("timeupdate", handleTimeUpdate);
//         video.addEventListener("ended", handleVideoEnd);

//         return () => {
//             video.removeEventListener("timeupdate", handleTimeUpdate);
//             video.removeEventListener("ended", handleVideoEnd);
//         };
//     }, [clickCount]);

//     //   const handleContinue = () => {
//     //     const video = videoRef.current;
//     //     if (!video) return;

//     //     setClickCount(prev => prev + 1);
//     //     setResumeTimes(prev => [...prev, video.currentTime]);

//     //     // Set next pause time
//     //     video.dataset.nextPauseTime = video.currentTime + 30;
//     //     setIsPaused(false);
//     //     video.play();
//     //   };

//     const handleContinue = () => {
//         debugger
//         const video = videoRef.current;
//         if (!video) return;

//         // Save resume time and increase click count
//         setClickCount(prev => prev + 1);
//         setResumeTimes(prev => [...prev, video.currentTime]);

//         // Update the next pause time before playing
//         video.dataset.nextPauseTime = (video.currentTime + 30).toString();

//         setIsPaused(false);

//         // Ensure the video plays immediately
//         video.play().catch(error => console.error("Video playback failed:", error));
//     };

//     return (
//         <div style={{ textAlign: "center", marginTop: "20px" }}>
//             <video ref={videoRef} width="600" controls>
//                 <source src={VideoFile} type="video/mp4" />
//                 Your browser does not support the video tag.
//             </video>

//             {isPaused && (
//                 <button onClick={handleContinue} style={{ display: "block", margin: "10px auto" }}>
//                     Continue Watching
//                 </button>
//             )}

//             <p>Click Count: {clickCount}</p>
//             <p>Resume Times: {resumeTimes.map(time => time.toFixed(2)).join(", ")}</p>
//         </div>
//     );
// };

// export default VideoPlayer;



import { useState, useRef, useEffect } from "react";
import VideoFile from "./5 Minute Timer.mp4"
import { Backdrop, } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Button } from "../../shared";
// import { useUpdateVideoWatchedMutation } from "../../features/videoPlayer/videoPlayer.service";


const VideoPlayer = () => {
    const videoRef = useRef(null);
    const nextPauseTimeRef = useRef(30); // Store next pause time
    const [isPaused, setIsPaused] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [resumeTimes, setResumeTimes] = useState([]);
    const [isValid, setValid] = useState(false);
    const [showWatchAgain, setShowWatchAgain] = useState(false);
    //const [updateVideoWatched] = useUpdateVideoWatchedMutation();
    const navigate = useNavigate();
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            if (video.currentTime >= nextPauseTimeRef.current) {
                video.pause();
                setIsPaused(true);
            }
        };

        const handleVideoEnd = () => {
            setValid(true)
        };

        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("ended", handleVideoEnd);

        return () => {
            video.removeEventListener("timeupdate", handleTimeUpdate);
            video.removeEventListener("ended", handleVideoEnd);
        };
    }, []); // Only runs once (on mount)

    const handleContinue = () => {
        const video = videoRef.current;
        if (!video) return;

        // Save resume time and increase click count
        setClickCount(prev => prev + 1);
        setResumeTimes(prev => [...prev, video.currentTime]);

        // Update the next pause time (store it in useRef to avoid re-renders)
        nextPauseTimeRef.current = video.currentTime + 30;

        // Resume video playback
        setIsPaused(false);
        video.play().catch(error => console.error("Video playback failed:", error));
    };

    const onCancelClick = () => {
        setValid(prev => !prev)
        setShowWatchAgain(prev => !prev)
    }

    const handleNextStep = () => {
        const payload = {
            is_watched: true
        }

        // updateVideoWatched(payload).then((res) => {
        //     const resPayload = res?.data;
        //     if (resPayload?.data?.id) {
        //         navigate('/trainingProcess')
        //     }
        // })

    }

    const handleWatchAgain = () => {
        setShowWatchAgain(false);
        setIsPaused(false);  // Reset pause state
        nextPauseTimeRef.current = 30; // Re-enable pauses
    
        const video = videoRef.current;
        if (video) {
            video.currentTime = 0;
            video.play();
        }
    };

    return (
        // <div style={{ textAlign: "center", marginTop: "20px" }}>
        //     <div className="relative w-[600px]">
        //         <video ref={videoRef} width="600" controls
        //             controlsList="nofullscreen nodownload noremoteplayback nopictureinpicture noremoteplayback noplaybackrate">
        //             <source src={VideoFile} type="video/mp4" />
        //             Your browser does not support the video tag.
        //         </video>
        //         <Backdrop>
        //             <button onClick={handleContinue} style={{ margin: "10px auto" }}
        //                 className="absolute flex items-center justify-center top-[50%] left-[50%]">
        //                 Continue Watching
        //             </button>
        //         </Backdrop>
        //     </div>

        //     {isPaused && (
        //         <button onClick={handleContinue} style={{ display: "block", margin: "10px auto" }}>
        //             Continue Watching
        //         </button>
        //     )}

        //     <p>Click Count: {clickCount}</p>
        //     <p>Resume Times: {resumeTimes.map(time => time.toFixed(2)).join(", ")}</p>
        // </div>
        <div className="grid mb-10"
            style={{
                boxShadow: "4px 4px 25px 0px rgba(0, 0, 0, 0.15)",
                borderRadius: "5px",
                margin: '30px',
                background: '#fff'
            }}>
            <div className='flex justify-between px-7 pt-6 pb-5 mx-2 border-b-2 font-medium text-[25px] '>Orientation video</div>
            <div style={{ margin: '50px' }}>
                {/* <div className="relative mx-auto" style={{ position: "relative" }}> */}
                    <div className="relative mx-auto" style={{ maxWidth: "800px", width: "100%" }}>
                        <video ref={videoRef} width="100%" controls
                            style={{ maxHeight: "450px", objectFit: "contain" }}
                            controlsList="nofullscreen nodownload noremoteplayback nopictureinpicture noremoteplayback noplaybackrate">
                            <source src={VideoFile} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    

                    {isPaused && (
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(0, 0, 0, 0.7)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "column",
                            }}
                        >
                            <button
                                onClick={handleContinue}
                                style={{
                                    padding: "10px 20px",
                                    fontSize: "16px",
                                    backgroundColor: "transparent",
                                    border: "1px solid white",
                                    color: "white",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                            >
                                Continue Watching
                            </button>
                        </div>


                    )}

                    {showWatchAgain && (
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(0, 0, 0, 0.7)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "column",
                            }}
                        >
                            <button
                                onClick={handleWatchAgain}
                                style={{
                                    padding: "10px 20px",
                                    fontSize: "16px",
                                    backgroundColor: "transparent",
                                    border: "1px solid white",
                                    color: "white",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                            >
                                Watch again
                            </button>
                        </div>


                    )}
                </div>
                {/* 
            <p>Click Count: {clickCount}</p>
            <p>Resume Times: {resumeTimes.map(time => time.toFixed(2)).join(", ")}</p> */}
                {/* { isValid && <div className="!flex !justify-center !items-center">
            <EquipmentFormFields fields={fields} formData={formData} handleChange={updateState}/>
            </div>}
             */}


            </div>


            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isValid}
            >
                <div className="popup-content w-2/6 bg-white flex flex-col gap-2 h-[330px] justify-center items-center">

                    <div className="py-5">
                        <div className="flex flex-col items-center justify-center">
                            <span className="px-10 flex items-center justify-center"
                                style={{
                                    color: "rgba(24, 40, 61, 1)",
                                    fontWeight: 600,
                                    fontSize: "18px",

                                }}
                            >
                                Have you watched the video and understand
                            </span>
                            <span style={{
                                color: "rgba(24, 40, 61, 1)",
                                fontWeight: 600,
                                fontSize: "18px",

                            }}>the information provided ?</span>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <div className="flex gap-6 justify-center align-middle">
                            <Button
                                btnName="Cancel"
                                btnCategory="secondary"
                                onClick={onCancelClick}
                            />
                            <Button
                                btnType="button"
                                btnCls="w-[110px]"
                                btnName={"Yes"}
                                btnCategory="primary"
                                onClick={handleNextStep}
                            />
                        </div>
                    </div>
                </div>
            </Backdrop>
        </div>

    );
};

export default VideoPlayer;
