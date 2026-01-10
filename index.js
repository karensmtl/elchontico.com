const video = document.getElementById("chontico-player");
const streamUrl =
	"https://streaming.totalmedios.com.co/live/chontico/index.m3u8";

if (Hls.isSupported()) {
	const hls = new Hls({
		lowLatencyMode: true,
	});
	hls.loadSource(streamUrl);
	hls.attachMedia(video);
} else if (video.canPlayType("application/vnd.apple.mpegurl")) {
	// Safari (iOS / macOS)
	video.src = streamUrl;
} else {
	console.error("HLS no es soportado en este navegador");
}
