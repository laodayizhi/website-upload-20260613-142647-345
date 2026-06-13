var MoviePlayer = (function () {
    function attach(source) {
        var video = document.getElementById("moviePlayer");
        var cover = document.getElementById("playCover");
        var hlsInstance = null;

        if (!video || !source) {
            return;
        }

        function bind() {
            if (video.getAttribute("data-bound") === "1") {
                return;
            }

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({ enableWorker: true });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
            } else {
                video.src = source;
            }

            video.setAttribute("data-bound", "1");
        }

        function start() {
            bind();
            if (cover) {
                cover.classList.add("is-hidden");
            }
            var playback = video.play();
            if (playback && typeof playback.catch === "function") {
                playback.catch(function () {});
            }
        }

        if (cover) {
            cover.addEventListener("click", start);
        }

        video.addEventListener("click", function () {
            if (video.paused) {
                start();
            }
        });

        video.addEventListener("play", function () {
            if (cover) {
                cover.classList.add("is-hidden");
            }
        });

        window.addEventListener("pagehide", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    return {
        attach: attach
    };
}());
