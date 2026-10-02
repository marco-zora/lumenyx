window.instructionList = (function () {
    // listeners keyed by id string
    const listeners = new Map();

    function calculateAvailableHeight(elem, bottomOffset) {
        if (!elem) return 300;
        const rect = elem.getBoundingClientRect();

        // space from element top to bottom of viewport
        const spaceBelow = window.innerHeight - rect.top;

        // subtract bottomOffset (e.g. footer / margins) to avoid covering UI
        const available = spaceBelow - (bottomOffset || 80);

        // enforce sensible bounds
        return Math.max(120, Math.floor(available));
    }

    function init(dotNetRef, elem, bottomOffset) {
        if (!elem) return null;

        const id = (Date.now() + Math.random()).toString(36);

        const send = () => {
            const h = calculateAvailableHeight(elem, bottomOffset);
            try {
                dotNetRef.invokeMethodAsync('SetAvailableHeight', h);
            } catch (e) {
                // ignore
            }
        };

        // initial
        send();

        // throttled handler for resize/scroll/mutations
        let timeout;
        const scheduleSend = () => {
            clearTimeout(timeout);
            timeout = setTimeout(send, 80);
        };

        const onResize = () => scheduleSend();
        const onScroll = () => scheduleSend();

        window.addEventListener('resize', onResize, { passive: true });
        window.addEventListener('scroll', onScroll, { passive: true });

        // MutationObserver to detect content changes inside the list
        let observer = null;
        try {
            observer = new MutationObserver(scheduleSend);
            observer.observe(elem, { childList: true, subtree: true });
        } catch (e) {
            observer = null;
        }

        listeners.set(id, { onResize, onScroll, observer, dotNetRef });

        return id;
    }

    function dispose(id) {
        if (!id) return;
        const entry = listeners.get(id);
        if (!entry) return;
        try {
            window.removeEventListener('resize', entry.onResize);
            window.removeEventListener('scroll', entry.onScroll);
        } catch (e) {}
        try {
            if (entry.observer) entry.observer.disconnect();
        } catch (e) {}
        try { entry.dotNetRef.dispose(); } catch (e) {}
        listeners.delete(id);
    }

    return {
        initInstructionList: init,
        disposeInstructionList: dispose,
        calculateAvailableHeight: calculateAvailableHeight
    };
})();
