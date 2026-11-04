window.videoThumbnail = {

    getMiddleFrame: function (videoUrl) {

        return new Promise((resolve, reject) => {

            const video = document.createElement("video");

            video.preload = "metadata";
            video.muted = true;
            video.playsInline = true;

            video.addEventListener("loadedmetadata", () => {

                if (!Number.isFinite(video.duration) || video.duration <= 0) {
                    reject("Durata video non valida.");
                    return;
                }

                // Vai al frame centrale del video
                video.currentTime = video.duration / 2;
            });

            video.addEventListener("seeked", () => {

                try {

                    const maxWidth = 300;

                    const originalWidth = video.videoWidth;
                    const originalHeight = video.videoHeight;

                    if (originalWidth <= 0 || originalHeight <= 0) {
                        reject("Dimensioni video non valide.");
                        return;
                    }

                    /*
                     * Mantiene l'aspect ratio originale.
                     * Non ingrandisce video più piccoli di 300 px.
                     */
                    const width = Math.min(maxWidth, originalWidth);

                    const height = Math.round(
                        originalHeight * width / originalWidth
                    );

                    const canvas = document.createElement("canvas");

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext("2d");

                    if (!ctx) {
                        reject("Impossibile creare il canvas.");
                        return;
                    }

                    ctx.drawImage(
                        video,
                        0,
                        0,
                        width,
                        height
                    );

                    const thumbnail = canvas.toDataURL(
                        "image/jpeg",
                        0.82
                    );

                    resolve(thumbnail);

                }
                catch (error) {
                    reject(error.toString());
                }
            });

            video.addEventListener("error", () => {
                reject("Errore durante il caricamento del video.");
            });

            video.src = videoUrl;
        });
    }
};