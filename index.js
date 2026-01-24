const video = document.getElementById("chontico-player");
const streamUrl = "https://streaming.totalmedios.com.co/live/chontico/index.m3u8";

if (Hls.isSupported()) {
    const hls = new Hls({ lowLatencyMode: true });
    hls.loadSource(streamUrl);
    hls.attachMedia(video);
} else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = streamUrl;
}




function cargarResultados() {
    const contenedor = document.getElementById("lista-resultados");
    if(!contenedor) return; // Seguridad por si no encuentra el ID

    contenedor.innerHTML = ""; // Limpia la lista antes de llenar

    sorteosChontico.forEach(item => {
        const li = document.createElement("li");
        li.className = "results__item";
        
        li.innerHTML = `
            <div class="results__meta">
                <span class="results__date">${item.fecha}</span>
                <span class="results__draw">Chontico ${item.sorteo}</span>
            </div>
            <div class="results__number">${item.numero}</div>
        `;
        
        contenedor.appendChild(li);
    });
}
document.addEventListener("DOMContentLoaded", cargarResultados);
document.addEventListener('DOMContentLoaded', () => {

    const botonTema = document.getElementById('theme-toggle');
    const cuerpo = document.body;
    const inputBusqueda = document.querySelector('.header__search input');
    const listaResultados = document.getElementById('lista-resultados');

    // --- 2. GESTIÓN DE MODO DÍA / NOCHE ---

    const temaGuardado = localStorage.getItem('tema');
    
    if (temaGuardado === 'claro') {
        cuerpo.classList.add('modo-claro');
    }

    if (botonTema) {
        botonTema.addEventListener('click', () => {
            // Alternar la clase CSS en el body
            cuerpo.classList.toggle('modo-claro');
            
            // Guardar la elección actual para futuras visitas
            if (cuerpo.classList.contains('modo-claro')) {
                localStorage.setItem('tema', 'claro');
                console.log("Modo claro activado");
            } else {
                localStorage.setItem('tema', 'oscuro');
                console.log("Modo oscuro activado");
            }
        });
    }

 
    
    if (inputBusqueda) {
        inputBusqueda.addEventListener('keyup', (e) => {
            const termino = e.target.value.toLowerCase();
            console.log(`Buscando: ${termino}`);
 
            const tarjetasNoticias = document.querySelectorAll('.news-card-v2');
            tarjetasNoticias.forEach(tarjeta => {
                const titulo = tarjeta.querySelector('h4').innerText.toLowerCase();
                if (titulo.includes(termino)) {
                    tarjeta.style.display = 'flex';
                } else {
                    tarjeta.style.display = 'none';
                }
            });
        });
    }

    const simularResultados = () => {
        if (!listaResultados) return;


        listaResultados.innerHTML = datosEjemplo.map(item => `
            <li class="results__item">
                <div class="results__meta">
                    <span>${item.fecha}</span>
                    <span class="results__draw">${item.sorteo}</span>
                </div>
                <div class="results__number">${item.numero}</div>
            </li>
        `).join('');
    };

    simularResultados();
});

        // JavaScript para el video de noticias
        const newsVideo = document.getElementById('newsVideo');
        const playOverlayNews = document.getElementById('playOverlayNews');
        const audioWarningNews = document.getElementById('audioWarningNews');
        const muteBtnNews = document.getElementById('muteBtnNews');

        // Función para reproducir el video
        function playNewsVideo() {
            newsVideo.play();
            playOverlayNews.classList.add('hidden');
            
            // Si el video está muted, mostrar advertencia de audio
            if (newsVideo.muted) {
                audioWarningNews.style.display = 'flex';
            }
        }

        // Toggle mute/unmute
        function toggleMuteNews() {
            if (newsVideo.muted) {
                newsVideo.muted = false;
                muteBtnNews.textContent = '🔊';
                audioWarningNews.classList.add('hidden');
            } else {
                newsVideo.muted = true;
                muteBtnNews.textContent = '🔇';
                audioWarningNews.classList.remove('hidden');
            }
        }

        // Pantalla completa
        function toggleFullscreenNews() {
            if (newsVideo.requestFullscreen) {
                newsVideo.requestFullscreen();
            } else if (newsVideo.webkitRequestFullscreen) {
                newsVideo.webkitRequestFullscreen();
            } else if (newsVideo.msRequestFullscreen) {
                newsVideo.msRequestFullscreen();
            }
        }

        // Cuando el video termina, mostrar overlay de nuevo
        newsVideo.addEventListener('ended', function() {
            playOverlayNews.classList.remove('hidden');
        });

        // Auto-play preview cuando se hace hover (opcional)
        newsVideo.parentElement.addEventListener('mouseenter', function() {
            if (newsVideo.paused) {
                newsVideo.play().catch(e => console.log('Autoplay prevented'));
            }
        });
