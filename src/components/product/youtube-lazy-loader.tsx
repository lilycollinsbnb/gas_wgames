import dynamic from 'next/dynamic';
import { useState, useEffect, useRef } from 'react';
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

interface LazyLoadYouTubeProps {
    videoUrl: string;
    playing?: boolean | undefined;
    muted?: boolean | undefined;
}

const LazyLoadYouTube = ({ videoUrl, playing, muted }: LazyLoadYouTubeProps) => {
  const [isInView, setIsInView] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.disconnect();
      }
    });

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={videoRef} className="relative w-full">
      {isInView && (
        <ReactPlayer
          url={videoUrl}
          className="react-player"
          width="100%"
          height="100%"
          playing={playing}
          muted={muted}
          loop={true}
          config={{
            youtube: {
              // enable loop
              playerVars: { loop: 1},
            },
          }}
        />
      )}
    </div>
  );
};

export default LazyLoadYouTube;
