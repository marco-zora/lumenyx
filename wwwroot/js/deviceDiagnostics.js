export async function getDeviceDiagnostics() {
    const devicePixelRatio = window.devicePixelRatio || 1;

    const visualViewportWidth =
        window.visualViewport?.width ?? window.innerWidth;

    const visualViewportHeight =
        window.visualViewport?.height ?? window.innerHeight;

    const visualViewportScale =
        window.visualViewport?.scale ?? 1;

    const storage = await getStorageDiagnostics();
    const graphics = getGraphicsDiagnostics();
    const connection = getConnectionDiagnostics();

    return {
        display: {
            screenWidth: screen.width || 0,
            screenHeight: screen.height || 0,

            availableWidth: screen.availWidth || 0,
            availableHeight: screen.availHeight || 0,

            viewportWidth: window.innerWidth || 0,
            viewportHeight: window.innerHeight || 0,

            visualViewportWidth:
                roundValue(visualViewportWidth, 2),

            visualViewportHeight:
                roundValue(visualViewportHeight, 2),

            estimatedPhysicalWidth:
                Math.round((screen.width || 0) * devicePixelRatio),

            estimatedPhysicalHeight:
                Math.round((screen.height || 0) * devicePixelRatio),

            devicePixelRatio:
                roundValue(devicePixelRatio, 3),

            visualViewportScale:
                roundValue(visualViewportScale, 3),

            colorDepth: screen.colorDepth || 0,

            orientation:
                getScreenOrientation()
        },

        system: {
            platform:
                navigator.userAgentData?.platform ||
                navigator.platform ||
                "",

            language:
                navigator.language || "",

            languages:
                Array.isArray(navigator.languages)
                    ? navigator.languages.join(", ")
                    : "",

            hardwareConcurrency:
                navigator.hardwareConcurrency ?? null,

            deviceMemoryGb:
                navigator.deviceMemory ?? null,

            maxTouchPoints:
                navigator.maxTouchPoints || 0,

            cookieEnabled:
                navigator.cookieEnabled === true,

            online:
                navigator.onLine === true,

            standalone:
                isStandaloneMode(),

            userAgent:
                navigator.userAgent || ""
        },

        storage,

        connection,

        graphics,

        features: {
            serviceWorker:
                "serviceWorker" in navigator,

            cacheStorage:
                "caches" in window,

            webSocket:
                "WebSocket" in window,

            pushManager:
                "PushManager" in window,

            notifications:
                "Notification" in window,

            fullscreen:
                document.fullscreenEnabled === true ||
                document.webkitFullscreenEnabled === true,

            pictureInPicture:
                "pictureInPictureEnabled" in document,

            webShare:
                typeof navigator.share === "function"
        }
    };
}

async function getStorageDiagnostics() {
    let quotaBytes = 0;
    let usageBytes = 0;
    let persistent = null;

    if (navigator.storage?.estimate) {
        try {
            const estimate =
                await navigator.storage.estimate();

            quotaBytes = estimate.quota || 0;
            usageBytes = estimate.usage || 0;
        }
        catch {
            quotaBytes = 0;
            usageBytes = 0;
        }
    }

    if (navigator.storage?.persisted) {
        try {
            persistent =
                await navigator.storage.persisted();
        }
        catch {
            persistent = null;
        }
    }

    const indexedDbTest =
        await testIndexedDb();

    const availableBytes =
        Math.max(0, quotaBytes - usageBytes);

    const usagePercentage =
        quotaBytes > 0
            ? (usageBytes / quotaBytes) * 100
            : 0;

    return {
        indexedDbSupported:
            "indexedDB" in window,

        indexedDbTestSucceeded:
            indexedDbTest.succeeded,

        indexedDbMessage:
            indexedDbTest.message,

        quotaBytes,

        usageBytes,

        availableBytes,

        usagePercentage:
            roundValue(usagePercentage, 2),

        persistent
    };
}

async function testIndexedDb() {
    if (!("indexedDB" in window)) {
        return {
            succeeded: false,
            message:
                "IndexedDB non è supportato dal browser."
        };
    }

    const databaseName =
        "LumenyxDeviceDiagnostics";

    const storeName =
        "DiagnosticsTest";

    try {
        await new Promise((resolve, reject) => {
            const deleteRequest =
                indexedDB.deleteDatabase(databaseName);

            deleteRequest.onsuccess = () => resolve();
            deleteRequest.onerror = () => resolve();
            deleteRequest.onblocked = () => resolve();
        });

        const database =
            await openTestDatabase(databaseName, storeName);

        const testValue = {
            id: "test",
            value: crypto.randomUUID
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random()}`,
            timestamp: new Date().toISOString()
        };

        await writeIndexedDbValue(
            database,
            storeName,
            testValue
        );

        const readValue =
            await readIndexedDbValue(
                database,
                storeName,
                testValue.id
            );

        if (!readValue ||
            readValue.value !== testValue.value) {
            database.close();

            return {
                succeeded: false,
                message:
                    "Il valore letto da IndexedDB non coincide con quello scritto."
            };
        }

        await deleteIndexedDbValue(
            database,
            storeName,
            testValue.id
        );

        database.close();

        indexedDB.deleteDatabase(databaseName);

        return {
            succeeded: true,
            message:
                "Test di scrittura, lettura e cancellazione completato."
        };
    }
    catch (error) {
        return {
            succeeded: false,
            message:
                error?.message ||
                String(error) ||
                "Errore sconosciuto durante il test IndexedDB."
        };
    }
}

function openTestDatabase(
    databaseName,
    storeName
) {
    return new Promise((resolve, reject) => {
        const request =
            indexedDB.open(databaseName, 1);

        request.onupgradeneeded = event => {
            const database =
                event.target.result;

            if (!database.objectStoreNames.contains(storeName)) {
                database.createObjectStore(
                    storeName,
                    { keyPath: "id" }
                );
            }
        };

        request.onsuccess = event => {
            resolve(event.target.result);
        };

        request.onerror = event => {
            reject(
                event.target.error ||
                new Error(
                    "Impossibile aprire il database IndexedDB."
                )
            );
        };

        request.onblocked = () => {
            reject(
                new Error(
                    "Apertura IndexedDB bloccata da un'altra connessione."
                )
            );
        };
    });
}

function writeIndexedDbValue(
    database,
    storeName,
    value
) {
    return new Promise((resolve, reject) => {
        const transaction =
            database.transaction(
                storeName,
                "readwrite"
            );

        const store =
            transaction.objectStore(storeName);

        store.put(value);

        transaction.oncomplete = () => resolve();

        transaction.onerror = () => {
            reject(
                transaction.error ||
                new Error(
                    "Errore durante la scrittura IndexedDB."
                )
            );
        };

        transaction.onabort = () => {
            reject(
                transaction.error ||
                new Error(
                    "Scrittura IndexedDB annullata."
                )
            );
        };
    });
}

function readIndexedDbValue(
    database,
    storeName,
    id
) {
    return new Promise((resolve, reject) => {
        const transaction =
            database.transaction(
                storeName,
                "readonly"
            );

        const store =
            transaction.objectStore(storeName);

        const request =
            store.get(id);

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(
                request.error ||
                new Error(
                    "Errore durante la lettura IndexedDB."
                )
            );
        };
    });
}

function deleteIndexedDbValue(
    database,
    storeName,
    id
) {
    return new Promise((resolve, reject) => {
        const transaction =
            database.transaction(
                storeName,
                "readwrite"
            );

        const store =
            transaction.objectStore(storeName);

        store.delete(id);

        transaction.oncomplete = () => resolve();

        transaction.onerror = () => {
            reject(
                transaction.error ||
                new Error(
                    "Errore durante la cancellazione IndexedDB."
                )
            );
        };
    });
}

function getConnectionDiagnostics() {
    const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;

    if (!connection) {
        return {
            supported: false,
            type: "",
            effectiveType: "",
            downlinkMbps: null,
            rttMs: null,
            saveData: false
        };
    }

    return {
        supported: true,

        type:
            connection.type || "",

        effectiveType:
            connection.effectiveType || "",

        downlinkMbps:
            Number.isFinite(connection.downlink)
                ? connection.downlink
                : null,

        rttMs:
            Number.isFinite(connection.rtt)
                ? connection.rtt
                : null,

        saveData:
            connection.saveData === true
    };
}

function getGraphicsDiagnostics() {
    const canvas =
        document.createElement("canvas");

    const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");

    if (!gl) {
        return {
            webGlSupported: false,
            version: "",
            vendor: "",
            renderer: "",
            maxTextureSize: 0
        };
    }

    let vendor = "";
    let renderer = "";

    try {
        const debugInfo =
            gl.getExtension(
                "WEBGL_debug_renderer_info"
            );

        if (debugInfo) {
            vendor =
                gl.getParameter(
                    debugInfo.UNMASKED_VENDOR_WEBGL
                ) || "";

            renderer =
                gl.getParameter(
                    debugInfo.UNMASKED_RENDERER_WEBGL
                ) || "";
        }
        else {
            vendor =
                gl.getParameter(gl.VENDOR) || "";

            renderer =
                gl.getParameter(gl.RENDERER) || "";
        }
    }
    catch {
        vendor = "";
        renderer = "";
    }

    return {
        webGlSupported: true,

        version:
            gl.getParameter(gl.VERSION) || "",

        vendor,

        renderer,

        maxTextureSize:
            gl.getParameter(gl.MAX_TEXTURE_SIZE) || 0
    };
}

function getScreenOrientation() {
    if (screen.orientation?.type) {
        return screen.orientation.type;
    }

    if (window.matchMedia(
        "(orientation: portrait)"
    ).matches) {
        return "portrait";
    }

    return "landscape";
}

function isStandaloneMode() {
    const displayModeStandalone =
        window.matchMedia(
            "(display-mode: standalone)"
        ).matches;

    const iosStandalone =
        window.navigator.standalone === true;

    return displayModeStandalone || iosStandalone;
}

function roundValue(value, decimals) {
    if (!Number.isFinite(value)) {
        return 0;
    }

    const factor =
        Math.pow(10, decimals);

    return Math.round(value * factor) / factor;
}