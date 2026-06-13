(function () {
    window.setupPlayer = function (videoId, buttonId, streamUrl) {
        var video = document.getElementById(videoId);
        var button = document.getElementById(buttonId);
        var hlsInstance = null;
        var attached = false;

        if (!video || !button || !streamUrl) {
            return;
        }

        function attach() {
            if (attached) {
                return;
            }
            attached = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false
                });
                hlsInstance.loadSource(streamUrl);
                hlsInstance.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
        }

        function play() {
            attach();
            button.classList.add("hidden");
            var promise = video.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(function () {
                    button.classList.remove("hidden");
                });
            }
        }

        button.addEventListener("click", play);
        video.addEventListener("click", function () {
            if (video.paused) {
                play();
            }
        });
        video.addEventListener("play", function () {
            button.classList.add("hidden");
        });
        video.addEventListener("pause", function () {
            button.classList.remove("hidden");
        });
        window.addEventListener("beforeunload", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    };
})();
