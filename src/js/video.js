// Helpers

function turnIntoMinutes(timeDuration) {
    let time = timeDuration;
    let hours = Math.floor(time / 60 / 60);
    let min = Math.floor(time / 60) - (hours * 60);
    let sec = Math.floor(time % 60);

    return `${min}:${sec.toString().padStart(2, '0')}`
}

// Components

let responseFromServer = [
    {
        src: 'https://data-1.utreon.com/v/Yz/Fm/ZG/9zhRztOLp2Y/9zhRztOLp2Y_original.mp4',
        id: 1
    },

    {
        src: 'https://data-1.utreon.com/v/N2/Nk/Nz/AHS5Q7fxSvu/AHS5Q7fxSvu_original.mp4',
        id: 2
    },

    {
        src: 'https://data-1.utreon.com/v/Yj/A1/ZT/S832EgU6QQa/S832EgU6QQa_original.mp4',
        id: 3
    }
]

class Video {
    constructor(props) {
        this.src = props.src;
        this.id = props.id;
        this.videoContent = null;
    }

    play() {
        this.videoContent.play();
    }

    pause() {
        this.videoContent.pause();
    }

    mute() {
        this.videoContent.muted = true;
    }

    unmute() {
        this.videoContent.muted = false;
    }
}

// Business Logic

function getVideoPLayerTemplate(props) {
    return `
        <div class="video__player swiper-slide" data-id="${props.id}">
          <video class="video video-${props.id}" data-id="${props.id}" src="${props.src}"></video>
          <div class="video__wrapper">
            <div class="video__controller">
              <img class="video__playPause" data-id="${props.id}" src="src/images/play.png">
              <div class="video__duration video__duration-${props.id}" data-id="${props.id}">0:00</div>
              <div class="video__current-duration video__current-duration-${props.id}" data-id="${props.id}">0:00</div>
              <img class="video__volume" data-id="${props.id}" src="src/images/volume.png">
            </div>
            <div class="video__line-wrapper" data-id="${props.id}">
              <div class="video__line video__line-${props.id}" data-id="${props.id}">
              <div class="video__current-line video__current-line-${props.id}" data-id="${props.id}"></div>
              </div>
            </div>
          </div>
        </div>
    `
}

const videos = [];

function renderVideos(element, dataVideos) {
    const container = document.querySelector(element);

    dataVideos.forEach(item => {
        videos.push(new Video(item));
    })

    videos.forEach(item => {
        container.innerHTML += getVideoPLayerTemplate(item);
    })
}

renderVideos('.swiper-wrapper', responseFromServer);

let swiperContainer = document.querySelector('.swiper-wrapper');

swiperContainer.addEventListener('click', handleVideo);

let number = 0;

function handleVideo(event) {
    let target = event.target;

    if (target.hasAttribute('data-id')) {
        number++
        let id = target.getAttribute('data-id');

        let video = document.querySelector(`.video-${id}`);
        let videoElement = videos.find(item => item.id === parseInt(id));

        if (number === 1) {
            addContentToVideoClasses()
        }

        switch (target.className) {
            case 'video__playPause':
                playOrPauseVideo(videoElement, video, target);
                break;
            case 'video__volume':
                setVolume(videoElement, video, target);
                break;
        }
    }
}

function addContentToVideoClasses() {
    for (let i = 1; i <= videos.length; i++) {
        videos[i-1].videoContent = document.querySelector(`.video-${i}`)
    }
}

function playOrPauseVideo(videoElement, video, button) {
    if (video.paused) {
        videoElement.play();
        button.src = 'src/images/pause.png';
    } else {
        videoElement.pause();
        button.src = 'src/images/play.png';
    }
}

function setVolume(videoElement, video, button) {
    if (video.muted) {
        videoElement.unmute();
        button.src = 'src/images/volume.png';
    } else {
        videoElement.mute();
        button.src = 'src/images/volume-muted.png';
    }
}

function setDuration() {
    videos.forEach(item => {
        let video = document.querySelector(`.video-${item.id}`);
        let duration = document.querySelector(`.video__duration-${item.id}`);

        duration.innerHTML = turnIntoMinutes(video.duration);
    })
}

function setCurrentDuration() {
    videos.forEach(item => {
        let video = document.querySelector(`.video-${item.id}`);
        let currentDuration = document.querySelector(`.video__current-duration-${item.id}`);
        let currentLine = document.querySelector(`.video__current-line-${item.id}`);
        let percent = (video.currentTime / video.duration) * 100;

        currentLine.style.width = `${percent}%`;
        currentDuration.innerHTML = turnIntoMinutes(video.currentTime);
    })
}

const allVideos = document.querySelectorAll('.video');

allVideos.forEach(item => {
    item.addEventListener('canplay', setDuration);
    item.addEventListener('timeupdate', setCurrentDuration);
})

swiperContainer.addEventListener('click', handleLine);

function handleLine(event) {
    let target = event.target;

    if (target.classList.contains('video__line') || target.classList.contains('video__current-line')) {
        videos.forEach(item => {
            let video = document.querySelector(`.video-${item.id}`);
            let id = target.getAttribute('data-id');

            if (video.getAttribute('data-id') === id) {
                let videoLine = document.querySelector(`.video__line-${id}`);
                let width = videoLine.clientWidth;
                let clickX = event.offsetX;
                let duration = video.duration;

                video.currentTime = (clickX / width) * duration;
            }
        })
    }
}