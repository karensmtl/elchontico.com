// ============ DATA DE VIDEOS ============
const videosData = [
    {
        id: 1,
        title: "Chontico - Transmisión en Vivo",
        date: "2025-01-27",
        dateLabel: "EN VIVO AHORA",
        category: "hoy",
        videoSrc: "LIVE_STREAM", // Marcador especial para el stream en vivo
        thumbnail: "img/live-thumb.jpg",
        duration: "EN VIVO",
        isLive: true
    },
    {
        id: 2,
        title: "SORTEO DÍA MARTES 27 DE ENERO",
        date: "2026-01-27",
        dateLabel: "Hoy",
        category: "hoy",
        videoSrc: "img/27dia.mp4",
        thumbnail: "img/portadadía.PNG",
        duration: "01:30"
    },
    {
        id: 3,
        title: "SORTEO NOCHE LUNES 26 DE ENERO",
        date: "2025-01-25",
        dateLabel: "Hace 2 días",
        category: "semana",
        videoSrc: "img/26n.mp4",
        thumbnail: "img/portadaNOCHE.PNG",
        duration: "01:30"
    },
    {
        id: 4,
        title: "SORTEO DÍA LUNES 26 DE ENERO",
        date: "2025-01-24",
        dateLabel: "Hace 3 días",
        category: "semana",
        videoSrc: "img/26dia.mp4",
        thumbnail: "img/portadadía.PNG",
        duration: "01:30"
    },
    {
        id: 5,
        title: "SORTEO NOCHE DOMINGO 25 DE ENERO",
        date: "2025-01-23",
        dateLabel: "Hace 4 días",
        category: "semana",
        videoSrc: "img/25 noche.mp4",
        thumbnail: "img/portadaNOCHE.PNG",
        duration: "01:30"
    },
  


];

// ============ CONFIGURACIÓN HLS ============
const streamUrl = "https://streaming.totalmedios.com.co/live/chontico/index.m3u8";

// ============ ELEMENTOS DEL DOM ============
const mainVideo = document.getElementById('chontico-player');
const playOverlay = document.getElementById('playOverlay');
const videoTitle = document.getElementById('videoTitle');
const videoDate = document.getElementById('videoDate');
const videoList = document.getElementById('videoList');
const videoGrid = document.getElementById('videoGrid');
const searchInput = document.getElementById('searchInput');
const themeToggle = document.getElementById('theme-toggle');
const audioBtnOverlay = document.getElementById('audioBtnOverlay');
const activateAudioBtn = document.getElementById('activateAudioBtn');
const pdfModal = document.getElementById('pdfModal');
const closeModal = document.getElementById('closeModal');
const verTodosResultados = document.getElementById('verTodosResultados');
const resultadosLink = document.getElementById('resultadosLink');

let currentVideoIndex = 0;
let filteredVideos = [...videosData];
let hls = null;
let isLiveStreamActive = true;

// ============ INICIALIZACIÓN ============
document.addEventListener('DOMContentLoaded', () => {
    initializeLiveStream();
    renderSidebarVideos();
    renderVideoGrid(videosData);
    setupEventListeners();
    setupAudioHandling();
});

// ============ INICIALIZAR STREAM EN VIVO HLS ============
function initializeLiveStream() {
    if (Hls.isSupported()) {
        hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
        });
        
        hls.loadSource(streamUrl);
        hls.attachMedia(mainVideo);
        
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
            console.log('Stream cargado correctamente');
            playLiveStream();
        });
        
        hls.on(Hls.Events.ERROR, function(event, data) {
            console.error('Error en HLS:', data);
            if (data.fatal) {
                switch(data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        console.log('Error de red, intentando recuperar...');
                        hls.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        console.log('Error de media, intentando recuperar...');
                        hls.recoverMediaError();
                        break;
                    default:
                        console.log('Error fatal, reiniciando stream...');
                        hls.destroy();
                        setTimeout(initializeLiveStream, 3000);
                        break;
                }
            }
        });
    } else if (mainVideo.canPlayType('application/vnd.apple.mpegurl')) {
        // Soporte nativo en Safari
        mainVideo.src = streamUrl;
        mainVideo.addEventListener('loadedmetadata', function() {
            playLiveStream();
        });
    } else {
        console.error('HLS no soportado en este navegador');
        alert('Tu navegador no soporta transmisión en vivo. Por favor usa Chrome, Firefox o Safari.');
    }
    
    currentVideoIndex = 0;
    isLiveStreamActive = true;
    updateActiveSidebarVideo(0);
}

// ============ REPRODUCIR STREAM EN VIVO ============
function playLiveStream() {
    mainVideo.muted = false;
    mainVideo.play().then(() => {
        playOverlay.classList.add('hidden');
        audioBtnOverlay.classList.remove('show');
    }).catch((error) => {
        console.log('Reproducción automática bloqueada:', error);
        mainVideo.muted = true;
        mainVideo.play();
        audioBtnOverlay.classList.add('show');
    });
}

// ============ CARGA DE VIDEO GRABADO ============
function loadRecordedVideo(index) {
    currentVideoIndex = index;
    const video = videosData[index];
    
    // Si es el stream en vivo, reiniciar HLS
    if (video.videoSrc === "LIVE_STREAM") {
        if (hls) {
            hls.destroy();
        }
        initializeLiveStream();
        isLiveStreamActive = true;
    } else {
        // Destruir HLS y cargar video grabado
        if (hls) {
            hls.destroy();
            hls = null;
        }
        
        isLiveStreamActive = false;
        mainVideo.src = video.videoSrc;
        videoTitle.textContent = video.title;
        videoDate.textContent = video.dateLabel;
        
        // Mostrar overlay de play
        playOverlay.classList.remove('hidden');
    }
    
    // Marcar video activo en sidebar
    updateActiveSidebarVideo(index);
}

// ============ REPRODUCCIÓN DE VIDEO ============
function playVideo() {
    mainVideo.muted = false;
    mainVideo.play().then(() => {
        playOverlay.classList.add('hidden');
        audioBtnOverlay.classList.remove('show');
    }).catch((error) => {
        console.log('Error al reproducir:', error);
        mainVideo.muted = true;
        mainVideo.play();
        audioBtnOverlay.classList.add('show');
    });
}

// ============ MANEJO DE AUDIO ============
function setupAudioHandling() {
    // Activar audio con botón
    activateAudioBtn.addEventListener('click', () => {
        mainVideo.muted = false;
        audioBtnOverlay.classList.remove('show');
        if (mainVideo.paused) {
            mainVideo.play();
        }
    });
    
    // También con cualquier click en el documento
    document.addEventListener('click', function activateAudio() {
        if (mainVideo.muted) {
            mainVideo.muted = false;
            audioBtnOverlay.classList.remove('show');
        }
    }, { once: true });
}

// ============ RENDER SIDEBAR VIDEOS ============
function renderSidebarVideos() {
    videoList.innerHTML = '';
    
    videosData.forEach((video, index) => {
        const videoItem = document.createElement('div');
        videoItem.className = `video-item ${index === currentVideoIndex ? 'active' : ''}`;
        videoItem.onclick = () => {
            loadRecordedVideo(index);
            if (!video.isLive) {
                playVideo();
            }
        };
        
        // Para el video en vivo, mostrar indicador especial, para grabados usar imagen de portada
        const thumbContent = video.isLive ? 
            `<div class="live-thumb-indicator">
                <span class="live-pulse">🔴</span>
            </div>` :
            `<img src="${video.thumbnail}" alt="${video.title}" class="video-poster">`;
        
        videoItem.innerHTML = `
            <div class="video-thumb">
                ${thumbContent}
                <span class="video-duration" style="${video.isLive ? 'background: #ff4b2b;' : ''}">${video.duration}</span>
            </div>
            <div class="video-details">
                <h4>${video.title}</h4>
                <p>${video.dateLabel}</p>
            </div>
        `;
        
        videoList.appendChild(videoItem);
    });
}

function updateActiveSidebarVideo(index) {
    const items = document.querySelectorAll('.video-item');
    items.forEach((item, i) => {
        if (i === index) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// ============ RENDER VIDEO GRID ============
function renderVideoGrid(videos) {
    videoGrid.innerHTML = '';
    
    videos.forEach((video, index) => {
        const card = document.createElement('div');
        card.className = 'grid-video-card';
        card.onclick = () => {
            loadRecordedVideo(videosData.indexOf(video));
            if (!video.isLive) {
                playVideo();
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        
        // Contenido del thumbnail: indicador LIVE o imagen de portada
        const thumbContent = video.isLive ?
            `<div class="live-thumb-indicator large">
                <span class="live-pulse large">🔴</span>
                <span class="live-text">EN VIVO</span>
            </div>` :
            `<img src="${video.thumbnail}" alt="${video.title}" class="video-poster">`;
        
        card.innerHTML = `
            <div class="grid-video-thumb">
                ${thumbContent}
                ${video.isLive ? '<span class="video-duration" style="background: #ff4b2b;">EN VIVO</span>' : `<span class="video-duration">${video.duration}</span>`}
            </div>
            <div class="grid-video-content">
                <h4>${video.title}</h4>
                <p>${video.dateLabel}</p>
            </div>
        `;
        
        videoGrid.appendChild(card);
    });
}

// ============ FILTROS ============
function setupEventListeners() {
    // Play overlay click
    playOverlay.addEventListener('click', playVideo);
    
    // Filter tabs
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const filter = tab.dataset.filter;
            filterVideos(filter);
        });
    });
    
    // Search
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = videosData.filter(video => 
            video.title.toLowerCase().includes(searchTerm)
        );
        renderVideoGrid(filtered);
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('modo-claro');
    });
    
    // PDF Modal
    verTodosResultados.addEventListener('click', openPdfModal);
    resultadosLink.addEventListener('click', (e) => {
        e.preventDefault();
        openPdfModal();
    });
    closeModal.addEventListener('click', closePdfModal);
    
    // Cerrar modal al hacer click fuera
    pdfModal.addEventListener('click', (e) => {
        if (e.target === pdfModal) {
            closePdfModal();
        }
    });
}

function filterVideos(filter) {
    let filtered;
    
    switch(filter) {
        case 'hoy':
            filtered = videosData.filter(v => v.category === 'hoy');
            break;
        case 'semana':
            filtered = videosData.filter(v => v.category === 'hoy' || v.category === 'semana');
            break;
        case 'mes':
            filtered = videosData;
            break;
        default:
            filtered = videosData;
    }
    
    renderVideoGrid(filtered);
}

// ============ MODAL PDF ============
function openPdfModal() {
    const pdfUrl = 'resultados-chontico.pdf';
    document.getElementById('pdfViewer').src = pdfUrl;
    pdfModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closePdfModal() {
    pdfModal.classList.remove('show');
    document.body.style.overflow = 'auto';
    document.getElementById('pdfViewer').src = '';
}

// ============ CLEANUP AL CERRAR LA PÁGINA ============
window.addEventListener('beforeunload', () => {
    if (hls) {
        hls.destroy();
    }
});