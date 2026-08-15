import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import axios from 'axios';
import { FaSpotify } from 'react-icons/fa';
import { SiYoutubemusic } from 'react-icons/si';
import './App.css'; 

function App() {
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  );
  const playerRef = useRef(null);

  // Live Clock Update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch songs
  useEffect(() => {
    axios.get('https://durga-puja-songs-backend.onrender.com/api/songs')
      .then(response => setSongs(response.data))
      .catch(error => console.error('Error fetching songs:', error));
  }, []);

  // Update Progress Bar automatically while playing
  useEffect(() => {
    let interval;
    if (isPlaying && playerRef.current) {
      interval = setInterval(() => {
        const time = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();
        if (duration > 0) {
          setProgress((time / duration) * 100);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSongIndex]);

  const onReady = (event) => {
    playerRef.current = event.target;
  };

  const togglePlay = () => {
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  // Skip to next track
  const nextSong = () => {
    if (currentSongIndex < songs.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
      setProgress(0);
      setIsPlaying(true);
    }
  };

  // Go to previous track
  const prevSong = () => {
    if (currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1);
      setProgress(0);
      setIsPlaying(true);
    }
  };

  // Click on progress bar to seek
  const handleProgressClick = (e) => {
    if (!playerRef.current) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - bounds.left;
    const percentage = clickX / bounds.width;
    
    const duration = playerRef.current.getDuration();
    if (duration > 0) {
      const newTime = percentage * duration;
      playerRef.current.seekTo(newTime, true);
      setProgress(percentage * 100);
    }
  };

  if (songs.length === 0) return <div className="loading">Loading songs...</div>;

  const currentSong = songs[currentSongIndex];

  const opts = {
    height: '0',
    width: '0',
    playerVars: { autoplay: 1, controls: 0, disablekb: 1, modestbranding: 1 },
  };

  return (
    <div className="background-container">
      
      {/* Top Navigation Bar */}
      <header className="top-nav">
        <div className="nav-group">
          <span className="pill-badge">{currentTime}</span>
          <span className="pill-badge online-badge">
            <span className="pulse-dot"></span> online
          </span>
        </div>

        <div className="nav-group">
          <a href="#" className="pill-btn">About</a>
          <a href="#" className="pill-btn">FAQ</a>
          <a href="#" className="pill-btn">
            <FaSpotify color="#1DB954" size={18} /> Spotify
          </a>
          <a href="#" className="pill-btn">
            <SiYoutubemusic color="#ff0000" size={18} /> YT Music
          </a>
        </div>
      </header>

      {/* Hidden YouTube Player */}
      <div style={{ display: 'none' }}>
        <YouTube videoId={currentSong.youtube_id} opts={opts} onReady={onReady} onEnd={nextSong} />
      </div>

      {/* Player UI */}
      <div className="player-ui">
        <img src={currentSong.cover_image_url || 'https://via.placeholder.com/80'} alt="cover" className="cover-art" />
        <div className="song-details">
          <h2>{currentSong.title}</h2>
          <p>{currentSong.artist}</p>
          
          {/* Responsive Progress Bar */}
          <div className="progress-bar-container" onClick={handleProgressClick} style={{ cursor: 'pointer' }}>
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        
        <div className="controls">
          {/* Wired up the prevSong function */}
          <button className="icon-btn" onClick={prevSong}>⏮</button>
          <button className="play-btn" onClick={togglePlay}>{isPlaying ? '⏸' : '▶'}</button>
          <button className="icon-btn" onClick={nextSong}>⏭</button>
        </div>
      </div>
    </div>
  );
}

export default App;