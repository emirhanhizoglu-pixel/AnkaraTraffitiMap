import { useEffect, useRef, useState } from "react";

import loaderAnimation from "../assets/loader_anim.webm";

const IDLE_START = 5.5;
const IDLE_END = 6.5;

function LoadingScreen({ mapReady, onComplete }) {

    const videoRef = useRef(null);
    const phaseRef = useRef("intro");
    const idleLoopsRef = useRef(0);

    const [phase, setPhase] = useState("intro");

    const setLoadingPhase = nextPhase => {

        phaseRef.current = nextPhase;
        setPhase(nextPhase);

    };

    const startExit = () => {

        const video = videoRef.current;

        if (!video || phaseRef.current === "exit") return;

        setLoadingPhase("exit");
        video.currentTime = IDLE_END;
        video.play().catch(() => {});

    };

    useEffect(() => {

        if (
            mapReady &&
            phaseRef.current === "idle" &&
            idleLoopsRef.current >= 2
        ) {

            startExit();

        }

    }, [mapReady]);

    const handleTimeUpdate = () => {

        const video = videoRef.current;

        if (!video) return;

        if (
            phaseRef.current === "intro" &&
            video.currentTime >= IDLE_START
        ) {

            setLoadingPhase("idle");
            video.currentTime = IDLE_START;

            return;

        }

        if (
            phaseRef.current === "idle" &&
            video.currentTime >= IDLE_END
        ) {

            idleLoopsRef.current += 1;

            if (mapReady && idleLoopsRef.current >= 2) {

                startExit();
                return;

            }

            video.currentTime = IDLE_START;
            video.play().catch(() => {});

        }

    };

    return (

        <div
            className={`loading-screen loading-screen--${phase}`}
            aria-busy="true"
            aria-label={
                phase === "idle"
                    ? "Preparing the archive"
                    : "Loading Traffiti"
            }
        >

            <video
                ref={videoRef}
                className="loading-screen__video"
                src={loaderAnimation}
                autoPlay
                muted
                playsInline
                preload="auto"
                onTimeUpdate={handleTimeUpdate}
                onEnded={onComplete}
                onError={onComplete}
            />

        </div>

    );

}

export default LoadingScreen;
