// Simple carousel scrolling helper
window.carouselInterop = {
    scrollByOffset: function (element, offset) {
        try {
            var el = element;
            if (!el) el = document.querySelector('.carousel-track');
            if (!el) return;
            el.scrollBy({ left: offset, behavior: 'smooth' });
        } catch (e) { }
    },
    scrollToStart: function (element) {
        try { var el = element; if (!el) el = document.querySelector('.carousel-track'); if (!el) return; el.scrollTo({ left: 0, behavior: 'smooth' }); } catch (e) { }
    }
};
