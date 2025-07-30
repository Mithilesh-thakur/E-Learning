// VideoPlayer.jsx
import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

// Import HLS quality plugins
import "videojs-contrib-quality-levels";
import "videojs-hls-quality-selector";

const VideoPlayer = ({ 
  src = "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8", 
  isHls = true, 
  onEnded, 
  onPlay, 
  onTimeUpdate 
}) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        fluid: true,
        responsive: true,
        sources: [{
          src,
          type: isHls ? "application/x-mpegURL" : "video/mp4",
        }],
      });

      // Enable quality selector only if HLS
      playerRef.current.ready(() => {
        if (isHls && playerRef.current.hlsQualitySelector) {
          playerRef.current.hlsQualitySelector({
            displayCurrentQuality: true,
            placement: 'bottom-left', // Options: top-right, bottom, etc.
          });
        }
      });

      // Optional event handlers
      if (onEnded) playerRef.current.on('ended', onEnded);
      if (onPlay) playerRef.current.on('play', onPlay);
      if (onTimeUpdate) playerRef.current.on('timeupdate', onTimeUpdate);
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [src, isHls, onEnded, onPlay, onTimeUpdate]);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-default-skin" />
    </div>
  );
};

export default VideoPlayer;
