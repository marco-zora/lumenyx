export function scrollByOffset(viewport, offset) {
    if (!viewport) {
        return;
    }

    viewport.scrollBy({
        left: offset,
        behavior: "smooth"
    });
}


