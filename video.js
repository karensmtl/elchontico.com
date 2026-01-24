const video = document.getElementById("main-player");
const overlay = document.getElementById("mute-overlay");
const playPauseBtn = document.getElementById("playPauseBtn");
const progressBar = document.getElementById("progressBar");
const volumeSlider = document.getElementById("volumeSlider");
const volumeBtn = document.getElementById("volumeBtn");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

const mainSource = video.querySelector("source");

function enableSound() {
    video.muted = false;
    video.volume = 1;
    overlay.style.display = "none";
    video.play();
}

function togglePlayPause() {
    if (video.paused) {
        video.play();
        playPauseBtn.textContent = "⏸️";
        return;
    }

    video.pause();
    playPauseBtn.textContent = "►";
}

function skipTime(seconds) {
    video.currentTime = Math.max(0, video.currentTime + seconds);
}

function toggleMute() {
    video.muted = !video.muted;
    updateVolumeIcon();
}

function updateVolumeIcon() {
    if (video.muted || video.volume === 0) {
        volumeBtn.textContent = "🔇";
        return;
    }

    if (video.volume < 0.5) {
        volumeBtn.textContent = "🔉";
        return;
    }

    volumeBtn.textContent = "🔊";
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        video.requestFullscreen().catch(() => {});
        return;
    }

    document.exitFullscreen().catch(() => {});
}

function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return "0:00";
    }

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

function setMainVideo(src) {
    if (!src) {
        return;
    }

    mainSource.src = src;
    video.load();
    video.currentTime = 0;

    video.muted = true;
    overlay.style.display = "flex";
    updateVolumeIcon();

    video.play().catch(() => {});
}

function swapWithSecondary(secondaryVideo) {
    const secondarySource = secondaryVideo.querySelector("source");
    if (!secondarySource || !secondarySource.src) {
        return;
    }

    const temp = mainSource.src;
    setMainVideo(secondarySource.src);

    secondarySource.src = temp;
    secondaryVideo.pause();
    secondaryVideo.currentTime = 0;
    secondaryVideo.load();
}

function bindSecondaryVideos() {
    const secondaryVideos = document.querySelectorAll(".secondary-video");

    secondaryVideos.forEach((secondaryVideo) => {
        secondaryVideo.addEventListener("click", () => swapWithSecondary(secondaryVideo));
        secondaryVideo.style.cursor = "pointer";
    });
}

video.addEventListener("timeupdate", () => {
    if (!Number.isFinite(video.duration) || video.duration === 0) {
        progressBar.value = 0;
        currentTimeEl.textContent = formatTime(video.currentTime);
        return;
    }

    progressBar.value = (video.currentTime / video.duration) * 100;
    currentTimeEl.textContent = formatTime(video.currentTime);
});

video.addEventListener("loadedmetadata", () => {
    durationEl.textContent = formatTime(video.duration);
});

progressBar.addEventListener("input", () => {
    if (!Number.isFinite(video.duration) || video.duration === 0) {
        return;
    }

    video.currentTime = (progressBar.value / 100) * video.duration;
});

volumeSlider.addEventListener("input", () => {
    video.volume = volumeSlider.value / 100;
    video.muted = false;
    updateVolumeIcon();
});

window.addEventListener("load", () => {
    video.play().catch(() => {});
    updateVolumeIcon();
    bindSecondaryVideos();
});

const savedTheme = localStorage.getItem("theme") || "dark";
body.setAttribute("data-theme", savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener("click", () => {
    const currentTheme = body.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
}
