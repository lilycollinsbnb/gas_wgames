import dynamic from 'next/dynamic'

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })

interface VideoPlayerProps {
  videoUrl: string
  playing?: boolean
  muted?: boolean
  type?: 'youtube' | 'mp4'
}

const VideoPlayer = ({
  videoUrl,
  playing = false,
  muted = true,
  type = 'youtube'
}: VideoPlayerProps) => {
  const config = {
    youtube: {
      playerVars: { loop: 1 }
    }
  }

  return (
    <div className="relative w-full aspect-video">
      <ReactPlayer
        url={videoUrl}
        width="100%"
        height="100%"
        playing={playing}
        muted={muted}
        loop
        controls
        config={type === 'youtube' ? config : undefined}
      />
    </div>
  )
}

export default VideoPlayer
