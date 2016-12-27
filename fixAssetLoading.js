/**
 *
 * @param {Element} ele
 */
function fixElement (ele) {
    var attempt = ele.getAttribute("data-attempt") + 1 || 1;

    if (ele.tagName === "IMG") {
        fixImage(ele, attempt);
    }

    ele.setAttribute("data-attempt", attempt);
}

/**
 * @param {HTMLImageElement} img
 * @param attempt
 */
function fixImage (img, attempt) {
    switch (attempt) {
        case 1:
            var src = img.src;
            img.setAttribute("data-orig-src", src);
            var srcNew = src.replace(/_\d+(.\w+)$/, "$1");
            if (src === srcNew) return fixImage(img, 2);
            console.log("trying to repair image");
            img.src = srcNew;
            break;
        default:
            console.warn("image repair failed");
            // Give up;
            break;
    }
}

function init () {
    document.addEventListener("error", function (e) {
        if (e && e.target) fixElement(e.target);
    }, true);

    var images = document.getElementsByTagName("img");
    for (var i = 0; i < images.length; ++i) {
        var image = images[i];

        if (image.complete && image.naturalWidth === 0) {
            fixElement(image)
        }
    }
}

init();