// ============ DATA DE VIDEOS ============
const videosData = [
    {
        id: 1,
        title: "Chontico - Transmisión en Vivo",
        date: "2025-01-27",
        dateLabel: "EN VIVO AHORA",
        category: "hoy",
        videoSrc: "LIVE_STREAM",
        thumbnail: "img/live-thumb.jpg",
        duration: "EN VIVO",
        isLive: true
    },
     {
     id: 6,
        title: "SORTEO DÍA MIERCOLES 28 DE ENERO",
        date: "2026-01-27",
        dateLabel: "Hoy",
        category: "hoy",
        videoSrc: "img/28d.mp4",
        thumbnail: "img/portadadia.png",
        duration: "01:30"
    },

    {
        id: 5,
        title: "SORTEO NOCHE MARTES 27 DE ENERO",
        date: "2026-01-27",
        dateLabel: "ayer",
        category: "ayer",
        videoSrc: "img/27n.mp4",
        thumbnail: "img/portadanoche.png",
        duration: "01:30"
    },
    {
        id: 4,
        title: "SORTEO DÍA MARTES 27 DE ENERO",
        date: "2026-01-27",
        dateLabel: "ayer",
        category: "ayer",
        videoSrc: "img/27dia.mp4",
        thumbnail: "img/portadadia.png",
        duration: "01:30"
    },
    {
        id: 3,
        title: "SORTEO NOCHE LUNES 26 DE ENERO",
        date: "2025-01-25",
        dateLabel: "Hace 2 días",
        category: "semana",
        videoSrc: "img/26n.mp4",
        thumbnail: "img/portadanoche.png",
        duration: "01:30"
    },

];

// ============ CONFIGURACIÓN HLS ============
const streamUrl = "https://streaming.totalmedios.com.co/live/chontico/index.m3u8";

// Variables globales
let mainVideo, playOverlay, videoTitle, videoDate, videoList, videoGrid;
let searchInput, themeToggle, audioBtnOverlay, activateAudioBtn;
let pdfModal, closeModal, verTodosResultados, resultadosLink;
let currentVideoIndex = 0;
let filteredVideos = [...videosData];
let hls = null;
let isLiveStreamActive = true;

// ============ INICIALIZACIÓN ============
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando aplicación...');
    
    // Obtener elementos del DOM DESPUÉS de que cargue
    mainVideo = document.getElementById('chontico-player');
    playOverlay = document.getElementById('playOverlay');
    videoTitle = document.getElementById('videoTitle');
    videoDate = document.getElementById('videoDate');
    videoList = document.getElementById('videoList');
    videoGrid = document.getElementById('videoGrid');
    searchInput = document.getElementById('searchInput');
    themeToggle = document.getElementById('theme-toggle');
    audioBtnOverlay = document.getElementById('audioBtnOverlay');
    activateAudioBtn = document.getElementById('activateAudioBtn');
    pdfModal = document.getElementById('pdfModal');
    closeModal = document.getElementById('closeModal');
    verTodosResultados = document.getElementById('verTodosResultados');
    resultadosLink = document.getElementById('resultadosLink');
    
    // Verificar elementos críticos
    console.log('=== VERIFICACIÓN DE ELEMENTOS ===');
    console.log('mainVideo:', mainVideo ? '✅' : '❌');
    console.log('activateAudioBtn:', activateAudioBtn ? '✅' : '❌');
    console.log('audioBtnOverlay:', audioBtnOverlay ? '✅' : '❌');
    
    if (!activateAudioBtn) {
        console.error('❌ CRÍTICO: No se encontró el botón de audio!');
        return;
    }
    
    if (!audioBtnOverlay) {
        console.error('❌ CRÍTICO: No se encontró el overlay de audio!');
        return;
    }
    
    if (!mainVideo) {
        console.error('❌ CRÍTICO: No se encontró el video!');
        return;
    }
    
    // Inicializar aplicación
    setupAudioHandling(); // PRIMERO configurar el audio
    initializeLiveStream();
    renderSidebarVideos();
    renderVideoGrid(videosData);
    setupEventListeners();
    
    console.log('✅ Aplicación inicializada correctamente');
});

// ============ MANEJO DE AUDIO - PRIMERA PRIORIDAD ============
function setupAudioHandling() {
    console.log('🔧 Configurando manejo de audio...');
    
    if (!activateAudioBtn) {
        console.error('❌ No se puede configurar audio: botón no existe');
        return;
    }
    
    // MÉTODO 1: Click normal
    activateAudioBtn.onclick = function(e) {
        console.log('🔊 CLICK DETECTADO (onclick)');
        activarAudio(e);
    };
    
    // MÉTODO 2: addEventListener
    activateAudioBtn.addEventListener('click', function(e) {
        console.log('🔊 CLICK DETECTADO (addEventListener)');
        activarAudio(e);
    }, false);
    
    // MÉTODO 3: Mousedown (backup)
    activateAudioBtn.addEventListener('mousedown', function(e) {
        console.log('👆 MOUSEDOWN detectado');
        e.preventDefault();
        e.stopPropagation();
    }, false);
    
    // MÉTODO 4: Touch para móviles
    activateAudioBtn.addEventListener('touchstart', function(e) {
        console.log('📱 TOUCH detectado');
        activarAudio(e);
    }, false);
    
    // Click en el video también activa
    if (mainVideo) {
        mainVideo.addEventListener('click', function() {
            if (mainVideo.muted && audioBtnOverlay.classList.contains('show')) {
                console.log('🔊 Activando audio por click en video');
                mainVideo.muted = false;
                ocultarBotonAudio();
            }
        });
    }
    
    console.log('✅ Manejo de audio configurado');
}

// Función centralizada para activar audio
function activarAudio(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    console.log('🎵 === ACTIVANDO AUDIO ===');
    console.log('Estado antes - Muted:', mainVideo.muted);
    console.log('Estado antes - Paused:', mainVideo.paused);
    
    // Activar audio
    mainVideo.muted = false;
    mainVideo.volume = 1.0;
    
    console.log('Estado después - Muted:', mainVideo.muted);
    console.log('Estado después - Volume:', mainVideo.volume);
    
    // Ocultar botón
    ocultarBotonAudio();
    
    // Reproducir si está pausado
    if (mainVideo.paused) {
        mainVideo.play()
            .then(() => console.log('✅ Video reproduciendo con audio'))
            .catch(err => console.error('❌ Error al reproducir:', err));
    } else {
        console.log('✅ Audio activado (video ya estaba reproduciendo)');
    }
}

// Función para ocultar el botón de audio
function ocultarBotonAudio() {
    if (audioBtnOverlay) {
        audioBtnOverlay.classList.remove('show');
        audioBtnOverlay.style.display = 'none';
        console.log('👻 Botón de audio ocultado');
    }
}

// Función para mostrar el botón de audio
function mostrarBotonAudio() {
    if (audioBtnOverlay) {
        audioBtnOverlay.classList.add('show');
        audioBtnOverlay.style.display = 'block';
        console.log('👁️ Botón de audio mostrado');
    }
}

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
            console.log('📡 Stream cargado correctamente');
            playLiveStream();
        });
        
        hls.on(Hls.Events.ERROR, function(event, data) {
            console.error('❌ Error en HLS:', data);
            if (data.fatal) {
                switch(data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        console.log('🔄 Error de red, recuperando...');
                        hls.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        console.log('🔄 Error de media, recuperando...');
                        hls.recoverMediaError();
                        break;
                    default:
                        console.log('🔄 Error fatal, reiniciando...');
                        hls.destroy();
                        setTimeout(initializeLiveStream, 3000);
                        break;
                }
            }
        });
    } else if (mainVideo.canPlayType('application/vnd.apple.mpegurl')) {
        mainVideo.src = streamUrl;
        mainVideo.addEventListener('loadedmetadata', function() {
            playLiveStream();
        });
    } else {
        console.error('❌ HLS no soportado');
        alert('Tu navegador no soporta transmisión en vivo.');
    }
    
    currentVideoIndex = 0;
    isLiveStreamActive = true;
    updateActiveSidebarVideo(0);
}

// ============ REPRODUCIR STREAM EN VIVO ============
function playLiveStream() {
    console.log('▶️ Intentando reproducir stream...');
    
    // Intentar con audio primero
    mainVideo.muted = false;
    mainVideo.play().then(() => {
        console.log('✅ Stream reproduciendo CON audio');
        playOverlay.classList.add('hidden');
        ocultarBotonAudio();
    }).catch((error) => {
        console.log('⚠️ Autoplay bloqueado, activando modo mute');
        // Reproducir muteado y mostrar botón
        mainVideo.muted = true;
        mainVideo.play().then(() => {
            console.log('🔇 Stream reproduciendo SIN audio');
            playOverlay.classList.add('hidden');
            mostrarBotonAudio();
        }).catch(err => {
            console.error('❌ Error crítico al reproducir:', err);
        });
    });
}

// ============ CARGA DE VIDEO GRABADO ============
function loadRecordedVideo(index) {
    currentVideoIndex = index;
    const video = videosData[index];
    
    if (video.videoSrc === "LIVE_STREAM") {
        if (hls) {
            hls.destroy();
        }
        initializeLiveStream();
        isLiveStreamActive = true;
    } else {
        if (hls) {
            hls.destroy();
            hls = null;
        }
        
        isLiveStreamActive = false;
        mainVideo.src = video.videoSrc;
        videoTitle.textContent = video.title;
        videoDate.textContent = video.dateLabel;
        playOverlay.classList.remove('hidden');
    }
    
    updateActiveSidebarVideo(index);
}

// ============ REPRODUCCIÓN DE VIDEO ============
function playVideo() {
    console.log('▶️ Intentando reproducir video...');
    
    mainVideo.muted = false;
    mainVideo.play().then(() => {
        console.log('✅ Video reproduciendo CON audio');
        playOverlay.classList.add('hidden');
        ocultarBotonAudio();
    }).catch((error) => {
        console.log('⚠️ Reproducción bloqueada, modo mute');
        mainVideo.muted = true;
        mainVideo.play().then(() => {
            console.log('🔇 Video reproduciendo SIN audio');
            playOverlay.classList.add('hidden');
            mostrarBotonAudio();
        }).catch(err => {
            console.error('❌ Error al reproducir:', err);
        });
    });
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
    
    videos.forEach((video) => {
        const card = document.createElement('div');
        card.className = 'grid-video-card';
        card.onclick = () => {
            loadRecordedVideo(videosData.indexOf(video));
            if (!video.isLive) {
                playVideo();
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        
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

// ============ EVENT LISTENERS ============
function setupEventListeners() {
    // Play overlay
    if (playOverlay) {
        playOverlay.addEventListener('click', playVideo);
    }
    
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
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = videosData.filter(video => 
                video.title.toLowerCase().includes(searchTerm)
            );
            renderVideoGrid(filtered);
        });
    }
    
    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('modo-claro');
        });
    }
    
    // PDF Modal
    if (verTodosResultados) {
        verTodosResultados.addEventListener('click', openPdfModal);
    }
    
    if (resultadosLink) {
        resultadosLink.addEventListener('click', (e) => {
            e.preventDefault();
            openPdfModal();
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', closePdfModal);
    }
    
    if (pdfModal) {
        pdfModal.addEventListener('click', (e) => {
            if (e.target === pdfModal) {
                closePdfModal();
            }
        });
    }
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
        case 'todos':
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
    const pdfViewer = document.getElementById('pdfViewer');
    if (pdfViewer) {
        pdfViewer.src = pdfUrl;
    }
    if (pdfModal) {
        pdfModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closePdfModal() {
    if (pdfModal) {
        pdfModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    const pdfViewer = document.getElementById('pdfViewer');
    if (pdfViewer) {
        pdfViewer.src = '';
    }
}

// ============ CLEANUP ============
window.addEventListener('beforeunload', () => {
    if (hls) {
        hls.destroy();
    }
});