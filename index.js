const video = document.getElementById("chontico-player");
const streamUrl = "https://streaming.totalmedios.com.co/live/chontico/index.m3u8";

if (Hls.isSupported()) {
    const hls = new Hls({ lowLatencyMode: true });
    hls.loadSource(streamUrl);
    hls.attachMedia(video);
} else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = streamUrl;
}

const sorteosChontico = [
    { fecha: "12 Ene 2026", sorteo: "Noche", numero: "4589" },
    { fecha: "12 Ene 2026", sorteo: "Día",   numero: "2231" },
    { fecha: "11 Ene 2026", sorteo: "Noche", numero: "5935" },
    { fecha: "11 Ene 2026", sorteo: "Día",   numero: "9225" }
];

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