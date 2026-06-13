(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var shell = document.querySelector("[data-player-box]");
    if (!shell) {
      return;
    }
    var video = shell.querySelector("video");
    var button = shell.querySelector(".player-overlay");
    if (!video || !button) {
      return;
    }
    var url = video.getAttribute("data-url") || "";
    var started = false;
    var hls = null;

    function playVideo() {
      if (!started) {
        started = true;
        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
          });
          hls.loadSource(url);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(function () {});
          });
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal && hls) {
              if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                hls.startLoad();
              } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                hls.recoverMediaError();
              }
            }
          });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = url;
          video.play().catch(function () {});
        } else {
          video.src = url;
          video.play().catch(function () {});
        }
      } else {
        video.play().catch(function () {});
      }
      shell.classList.add("is-playing");
    }

    button.addEventListener("click", playVideo);
    video.addEventListener("play", function () {
      shell.classList.add("is-playing");
    });
    video.addEventListener("pause", function () {
      if (video.currentTime === 0 || video.ended) {
        shell.classList.remove("is-playing");
      }
    });
    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
      }
    });
  });
})();
