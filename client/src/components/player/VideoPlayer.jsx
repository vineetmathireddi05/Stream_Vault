import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player/lazy';
import { ArrowLeft, Maximize, Minimize, Pause, Play, Volume2, VolumeX } from 'lucide-react';

export default function VideoPlayer({ url, title, onBack, onProgress }) {
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const hideTimer = useRef(null);

  useEffect(() => {
    const onFs = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  const resetHideTimer = () => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 3000);
  };

  useEffect(() => () => hideTimer.current && clearTimeout(hideTimer.current), []);

  const toggleFullscreen = () => {
    if (!fullscreen) containerRef.current?.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  const handleSeek = (e) => {
    const value = Number(e.target.value);
    setPlayed(value);
    playerRef.current?.seekTo(value, 'fraction');
  };

  const handleProgress = ({ played, playedSeconds }) => {
    setPlayed(played);
    onProgress?.({ playedSeconds, duration });
  };

  const fmt = (s) => {
    if (!Number.isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={resetHideTimer}
      onMouseLeave={() => setShowControls(false)}
      className="relative w-full h-screen bg-black"
    >
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={playing}
        muted={muted}
        width="100%"
        height="100%"
        onDuration={setDuration}
        onProgress={handleProgress}
        config={{ youtube: { playerVars: { modestbranding: 1, rel: 0 } } }}
      />

      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute top-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-b from-black/80 to-transparent flex items-center gap-4">
          <button
            onClick={onBack}
            aria-label="Back"
            className="p-2 rounded-full bg-black/50 hover:bg-black/80 transition"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-display text-xl md:text-2xl tracking-wider">{title}</h1>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/90 to-transparent">
          <input
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={played}
            onChange={handleSeek}
            className="w-full accent-primary cursor-pointer"
            aria-label="Seek"
          />
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? 'Pause' : 'Play'}
                className="p-2 rounded-full bg-white/10 hover:bg-white/25 transition"
              >
                {playing ? <Pause size={20} /> : <Play size={20} className="fill-current" />}
              </button>
              <button
                onClick={() => setMuted((m) => !m)}
                aria-label={muted ? 'Unmute' : 'Mute'}
                className="p-2 rounded-full bg-white/10 hover:bg-white/25 transition"
              >
                {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <span className="text-sm text-white/80 tabular-nums">
                {fmt(played * duration)} / {fmt(duration)}
              </span>
            </div>
            <button
              onClick={toggleFullscreen}
              aria-label="Fullscreen"
              className="p-2 rounded-full bg-white/10 hover:bg-white/25 transition"
            >
              {fullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
