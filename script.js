console.log("Welcome to Resonance Hub");
// initializing all the required variables
let songIndex = 0;
let audioElement = new Audio('1.mp3');
let masterPlay = document.getElementById('masterPlay'); // used to control play button
let myProgressBar = document.getElementById('myProgressbar'); // used to control the progress bar that's present in the bottom through a percentage counter
let gif = document.getElementById('gif'); // used to control when the gif appears
let masterSongName = document.getElementById('masterSongName'); // used to control the name of the song that appears at the bottom when it's playing
let songItems = Array.from(document.getElementsByClassName('songItem'));
let isLooping = false; // used for loop option in the webpage

let songs = [
    { songName: "Na Ready", filepath: "1.mp3", coverpath: "leo.png" },
    { songName: "Pathala Pathala", filepath: "2.mp3", coverpath: "pathuthu-pathuthu.png" },
    { songName: "Badass", filepath: "3.mp3", coverpath: "badass.png" },
    { songName: "Vikram Title Track", filepath: "4.mp3", coverpath: "vikram.png" },
    { songName: "Amar Theme", filepath: "5.mp3", coverpath: "amar.png" },
    { songName: "Sandhanam Theme", filepath: "6.mp3", coverpath: "vj.png" },
    { songName: "Rolex Theme", filepath: "7.mp3", coverpath: "rolex.png" },
    { songName: "Lokiverse", filepath: "8.mp3", coverpath: "lcu.jpg" },
    { songName: "Glimpse of Harold Das", filepath: "9.mp3", coverpath: "Glimpse-of-Harold-Das.png" },
    { songName: "Lokiverse 2.0", filepath: "10.mp3", coverpath: "lcuverse.png" },
];

// Displaying the list of song names along with their corresponding images
songItems.forEach((element, i) => {
    element.getElementsByTagName("img")[0].src = songs[i].coverpath;
    element.getElementsByClassName("songName")[0].innerText = songs[i].songName;
});

// Handle play/pause click
masterPlay.addEventListener('click', () => {
    if (audioElement.paused || audioElement.ended) {
        // if the song is paused or has ended -> it has to start playing now
        audioElement.play();
        gif.style.opacity = 1;
    } else {
        // if the song is playing -> it has to be paused now
        audioElement.pause();
        gif.style.opacity = 0;
    }

    // Update main button and selected song's button
    updateButtons(!audioElement.paused);
});

// Function to update main button and individual play buttons
function updateButtons(isPlaying) {
    const playPauseClass = isPlaying ? 'fa-circle-pause' : 'fa-circle-play';

    // Update main button
    masterPlay.classList.remove('fa-circle-play', 'fa-circle-pause');
    masterPlay.classList.add(playPauseClass);

    // Update individual play button for the selected song
    const selectedSongButton = document.getElementById(songIndex.toString());
    if (selectedSongButton) {
        selectedSongButton.classList.remove('fa-circle-play', 'fa-circle-pause');
        selectedSongButton.classList.add(playPauseClass);
    }
}

// Response for the Events
audioElement.addEventListener('timeupdate', () => {
    // here, progress periodically updates itself, and it contains the % value of the song that has completed playing
    progress = parseInt((audioElement.currentTime / audioElement.duration) * 100);
    myProgressBar.value = progress;

    // Update total time completed and total time
    document.getElementById('totalTimeCompleted').innerText = formatTime(audioElement.currentTime);
    document.getElementById('totalTime').innerText = formatTime(audioElement.duration);
});

audioElement.addEventListener('ended', () => {
    // Automatically move to the next song when the current song ends
    if (!isLooping) {
        document.getElementById('next').click(); // Simulate a click on the next button
    }
});

// Function to format time in MM:SS format
function formatTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return minutes + ':' + seconds;
}

myProgressBar.addEventListener('change', () => {
    // whenever the progressbar's value change, there is a subsequent change in the audio as well !!
    audioElement.currentTime = (myProgressBar.value * audioElement.duration / 100); // /100 is done to get the exact time value instead of the percentage
});

const makeAllPlays = () => {
    // this function is used to modify the play/pause button that's present in the selected song from the list
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((element) => {
        element.classList.remove('fa-circle-pause');
        element.classList.add('fa-circle-play');
    });
};

Array.from(document.getElementsByClassName('songItemPlay')).forEach((element, index) => {
    element.addEventListener('click', (e) => {
        makeAllPlays();
        songIndex = parseInt(e.target.id);
        const isPaused = audioElement.paused;

        if (isPaused || audioElement.ended) {
            // If paused or ended, start playing
            e.target.classList.remove('fa-circle-play');
            e.target.classList.add('fa-circle-pause');
            audioElement.src = songs[songIndex].filepath;
            masterSongName.innerText = songs[songIndex].songName;
            if (audioElement.currentTime === 0) {
                audioElement.play();
            } else {
                // If not at the beginning, continue playing
                audioElement.play();
            }
            updateButtons(true);
            gif.style.opacity = 1;
        } else {
            // If playing, pause
            e.target.classList.remove('fa-circle-pause');
            e.target.classList.add('fa-circle-play');
            audioElement.pause();
            updateButtons(false);
            gif.style.opacity = 0;
        }
    });
});

document.getElementById('previous').addEventListener('click', () => {
    // used to make the back button move to the previous song 
    if (songIndex <= 0) {
        songIndex = songs.length - 1;
    } else {
        songIndex -= 1;
    }
    updateIndividualPlayButton();
});

document.getElementById('next').addEventListener('click', () => {
    // used to make the next button move to the next song 
    if (songIndex >= songs.length - 1) {
        songIndex = 0;
    } else {
        songIndex += 1;
    }
    updateIndividualPlayButton();
});

audioElement.addEventListener('ended', () => {
    // Automatically move to the next song when the current song ends
    if (!isLooping) {
        document.getElementById('next').click(); // Simulate a click on the next button
    }
});

document.getElementById('reply').addEventListener('click', () => {
    // Toggle looping behavior
    isLooping = !isLooping;

    if (isLooping) {
        // Enable looping for the current song
        audioElement.loop = true;
        audioElement.play();
        masterPlay.classList.remove('fa-circle-play');
        masterPlay.classList.add('fa-circle-pause');
        // Change replay button color
        document.getElementById('reply').style.color = 'cyan';
    } else {
        // Disable looping for the current song
        audioElement.loop = false;
        // Change replay button color
        document.getElementById('reply').style.color = 'white';
    }
});

// Update individual play button for the current song
function updateIndividualPlayButton() {
    const selectedSongButton = document.getElementById(songIndex.toString());
    if (selectedSongButton) {
        makeAllPlays();
        selectedSongButton.classList.remove('fa-circle-play');
        selectedSongButton.classList.add('fa-circle-pause');
        audioElement.src = songs[songIndex].filepath;
        masterSongName.innerText = songs[songIndex].songName;
        if (audioElement.currentTime === 0) {
            audioElement.play();
        } else {
            // If not at the beginning, continue playing
            audioElement.play();
        }
        updateButtons(true);
        gif.style.opacity = 1;
    }
}