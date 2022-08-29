const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");
let stream;
let recorder;

const handleStop = () => {
    startBtn.innerHTML = "Start recording";
    startBtn.removeEventListener("click", handleStop);
    startBtn.addEventListener("click", handleStart);

    recorder.stop();
}

const handleStart = () => {
    startBtn.innerText = "Stop recording";
    startBtn.removeEventListener("click", handleStart);
    startBtn.addEventListener("click", handleStop);
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (event) => {
        const video = URL.createObjectURL(event.data);
        console.log(video);
    }
    recorder.start();

}
const init = async () => {
    stream = await navigator.mediaDevices.getUserMedia(
        {
            audio: false, 
            video: {width: 200, height: 100}
        }
    );
    video.srcObject = stream;
    video.play(); 
}

init();
startBtn.addEventListener("click", handleStart);