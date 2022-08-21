const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");

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
    // if (video.volume === 0) {
    //     muteBtn.innerText = "Unmute";
    // }
    // else {
    //     muteBtn.innerText = "Mute";
    // }
    //change the global variable "volumeValue" value
    volumeValue = value;
    //change the volume of the video
    video.volume = value;

   
}


playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
