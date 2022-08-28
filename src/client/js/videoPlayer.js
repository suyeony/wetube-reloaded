const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");
// global variable volumeValue
let volumeValue = 0.5;
// to control the video volume
video.volume = volumeValue;

let controlsTimeout = null;
let controlsMovementTimeout = null;

const handlePlayClick = (e) => {
    //if the video is playing, pause it
    if (video.paused) {
        video.play();
    }
     //else play the video
    else {
        video.pause();
    }
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
   
}


const handleMute = (e) => {
    if (video.muted) {
        video.muted = false;
    }
    else {
        video.muted = true;
    }
    //muteBtn.innerText = video.muted ? "Unmute" : "Mute";
    muteBtnIcon.classList = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
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
        fullScreenIcon.classList = "fas fa-expand";
       
    }
    else {
        videoContainer.requestFullscreen();
        fullScreenIcon.classList = "fas fa-compress";
    }
    
}

const hideContols = () =>  videoControls.classList.remove("showing"); 

const handleMouseMove = () => {
    if (controlsTimeout) {
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    // This timeout is for checking mouse movement
    if (controlsMovementTimeout) {
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }

    videoControls.classList.add("showing");
    // if I move a mouse, cancel the old timeout and create new one
    controlsMovementTimeout = setTimeout(hideContols, 3000)

    // if I stop moving a mouse, then timeout won't be stopped
}

const handleMouseLeave = () => {
    controlsTimeout = setTimeout(hideContols, 3000)
    
}

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadeddata", handleLoadedMetadata); 
video.addEventListener("timeupdate", handleTimeUpdate);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
