(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

    players.forEach(function (player) {
      var video = player.querySelector('video');
      var button = player.querySelector('[data-play-button]');
      var note = player.querySelector('[data-player-note]');
      var source = player.getAttribute('data-hls-src');
      var initialized = false;

      function setNote(message) {
        if (note) {
          note.textContent = message;
        }
      }

      function startPlayer() {
        if (!video || !source) {
          setNote('播放源暂不可用');
          return;
        }

        player.classList.add('playing');

        if (!initialized) {
          if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
              enableWorker: true,
              lowLatencyMode: true
            });

            hls.loadSource(source);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
              video.play().catch(function () {
                setNote('请再次点击播放器开始播放');
              });
            });
            hls.on(window.Hls.Events.ERROR, function (event, data) {
              if (data && data.fatal) {
                setNote('当前播放源加载失败，请稍后重试');
              }
            });
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            video.addEventListener('loadedmetadata', function () {
              video.play().catch(function () {
                setNote('请再次点击播放器开始播放');
              });
            }, { once: true });
          } else {
            video.src = source;
            setNote('浏览器不支持 HLS，可更换浏览器后播放');
          }

          initialized = true;
        } else {
          video.play().catch(function () {
            setNote('请再次点击播放器开始播放');
          });
        }
      }

      if (button) {
        button.addEventListener('click', startPlayer);
      }

      if (video) {
        video.addEventListener('click', function () {
          if (!initialized) {
            startPlayer();
          }
        });
      }
    });
  });
})();
