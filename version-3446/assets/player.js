(function () {
    var video = document.getElementById('movie-player');
    var overlay = document.getElementById('player-overlay');
    if (!video || !overlay) {
        return;
    }

    var hlsUrl = video.getAttribute('data-hls');
    var hlsInstance = null;
    var prepared = false;

    function prepare() {
        if (prepared || !hlsUrl) {
            return;
        }
        prepared = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = hlsUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(hlsUrl);
            hlsInstance.attachMedia(video);
        } else {
            video.src = hlsUrl;
        }
    }

    function play() {
        prepare();
        overlay.classList.add('hidden');
        video.setAttribute('controls', 'controls');
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {
                overlay.classList.remove('hidden');
            });
        }
    }

    overlay.addEventListener('click', play);
    video.addEventListener('click', function () {
        if (video.paused) {
            play();
        }
    });
    video.addEventListener('play', function () {
        overlay.classList.add('hidden');
    });
    video.addEventListener('pause', function () {
        if (!video.ended) {
            overlay.classList.remove('hidden');
        }
    });
    video.addEventListener('ended', function () {
        overlay.classList.remove('hidden');
    });
    window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
})();
