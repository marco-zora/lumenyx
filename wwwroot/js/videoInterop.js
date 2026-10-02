window.videoInterop = {
    playVideo: function (element) {
        try {
            if (!element) return;
            element.play();
        } catch (e) {
            // ignore
        }
    },
    pauseVideo: function (element) {
        try {
            if (!element) return;
            element.pause();
            element.currentTime = 0;
        } catch (e) {
        }
    }
    ,
    playAndWait: function (element) {
        return new Promise((resolve) => {
            try {
                if (!element) { resolve(false); return; }

                let onEnded = function () {
                    cleanup();
                    resolve(true);
                };

                let onPause = function () {
                    // pause can mean stopped by user or program; treat as not ended
                    cleanup();
                    resolve(false);
                };

                function cleanup() {
                    try {
                        element.removeEventListener('ended', onEnded);
                        element.removeEventListener('pause', onPause);
                    } catch (e) { }
                }

                element.addEventListener('ended', onEnded);
                element.addEventListener('pause', onPause);

                element.play().catch(() => {
                    cleanup();
                    resolve(false);
                });
            }
            catch (e) {
                resolve(false);
            }
        });
    }
};

// Play a video after setting its src (useful when element exists and src changes)
window.videoInterop.playAndWaitWithSrc = function (element, src) {
    return new Promise((resolve) => {
        try {
            // If the element reference is not provided or not resolved yet,
            // try to find the preview video element by selector as a fallback.
            var el = element;
            try {
                if (!el) el = document.querySelector('.preview-video');
            } catch (e) { el = element; }

            if (!el) { resolve(false); return; }

            console.log("videoInterop.playAndWaitWithSrc called. src=", src, " element=", el);

            if (src) {
                try {
                    el.src = src;
                    if (el.load) el.load();
                } catch (e) { }
            }

            // Ensure video is muted to allow autoplay in many browsers
            try { el.muted = true; } catch (e) { }

            let onEnded = function () {
                console.log('videoInterop: ended event for src=', src);
                cleanup();
                resolve(true);
            };

            let onPause = function () {
                try {
                    console.log('videoInterop: pause event for src=', src, ' currentTime=', el.currentTime, ' duration=', el.duration);

                    // If the pause happens at the end (currentTime ~= duration), treat as ended
                    if (el.duration && Math.abs(el.currentTime - el.duration) < 0.5) {
                        console.log('videoInterop: pause at end detected, treating as ended.');
                        cleanup();
                        resolve(true);
                        return;
                    }
                }
                catch (e) { }

                cleanup();
                resolve(false);
            };

            function cleanup() {
                try {
                    if (el) {
                        el.removeEventListener('ended', onEnded);
                        el.removeEventListener('pause', onPause);
                    }
                } catch (e) { }
            }

            el.addEventListener('ended', onEnded);
            el.addEventListener('pause', onPause);

            el.play().then(() => {
                console.log('videoInterop: play() started for src=', src);
            }).catch((err) => {
                console.log('videoInterop: play() failed for src=', src, err);
                cleanup();
                resolve(false);
            });
        }
        catch (e) {
            resolve(false);
        }
    });
};
