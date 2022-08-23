const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");

// global variable volumeValue
let volumeValue = 0.5;
// to control the video volume
video.volume = volumeValue;

const handlePlayClick = (e) => {
    //if the video is playing, pause it
    if (video.paused) {
        video.play();
    }
    else {
        video.pause();
    }
    playBtn.innerText = video.paused ? "Play" : "Pause";
    //else play the video
}


const handleMute = (e) => {
    if (video.muted) {
        video.muted = false;
    }
    else {
        video.muted = true;
    }
    muteBtn.innerText = video.muted ? "Unmute" : "Mute";
    // if video is unmuted, go back to current volume
    volumeRange.value = video.muted ? "0" : volumeValue;
}

const handleVolumeChange = (event) => {
    //current volume => event.target.value
    const {target: {value}} = event;
    if (video.muted) {
        video.muted = false;
        muteBtn.innerText = "Mute";
    }

    //change the global variable "volumeValue" value
    volumeValue = value;
    //change the volume of the video
    video.volume = value;

   
}

const formatTime = (seconds) => new Date(seconds * 1000).toISOString().substring(14, 19);

const handleLoadedMetadata = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);
}

const handleTimeUpdate = () => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
}

const handleTimelineChange = (event) => {
    const {
        target: { value }
    } = event;
    video.currentTime = value;
}

const handleFullScreen = () => {
    const fullscreen = document.fullscreenElement
    if (fullscreen) {
        document.exitFullscreen();
        fullScreenBtn.innerText = "Enter fullscreen";
    }
    else {
        videoContainer.requestFullscreen();
        fullScreenBtn.innerText = "Exit fullscreen";
    }
    
}

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata); 
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);