/**
 * This code snippet allows you to intercept the loading of new elements and modify the loaded posts.
 * The basic idea is to allow filtering out posts before they are inserted into the dom, and thus before their assets
 * are loaded. This reduces stress on both the client and the asset servers.
 *
 * To use the filter, register the event "processBatch" in SOUP.Endless.
 * Example:
 *
 *     SOUP.Endless.on("processBatch", function (doc) {
 *         // your code here
 *     });
 *
 * The doc argument represents a temporary HTMLDocument node, storing the new loaded posts. You can work with it
 * like you can work with ''document''.
 *
 * Be careful to never remove all posts, otherwise Soup will assume you reached the end.
 *
 * Please keep in mind that soup already has some filters build in: http://faq.soup.io/post/4328678
 * These are probably easier on the servers.
 *
 * Licence: Public domain
 *
 * UPDATE 1.1:
 * The soup event-api was used! I just used it wrong. It is supposed to be a template. The event is now fired on
 * SOUP.Endless instead of SOUP.Events
 *
 * UPDATE 1.2:
 * Also trigger for loaded in reactions
 */
(function () {
    // Add events to SOUP.Endless
    if (!SOUP.Endless.trigger) {
        SOUP.tools.extend(SOUP.Endless, SOUP.Events);
    }

    if (Ajax.Request._EndlessFilter) return;

    var oldRequest = Ajax.Request;

    function getLoadAboveURL() {
        var url = $("endless_top_post").href;
        return url.match(/[&?]newer=1/) ? url : url + (url.indexOf("?") >= 0 ? "&" : "?") + "newer=1";
    }

    function getLoadBelowURL() {
        return SOUP.Endless.next_url.replace(/&?newer=1&?/g, "");
    }

    function catchBatchLoad (path, options) {
        var oldSuccess = options.onSuccess;
        options.onSuccess = function (response) {
            var text = response.responseText,
                pipePosition = text.indexOf("|"),
                nextPath = text.substring(0, pipePosition),
                content = text.substring(pipePosition + 1),
                parser = new DOMParser(),
                xmlDoc = parser.parseFromString(content, "text/html"),
                root = xmlDoc.body;

            root.setAttribute("id", "posts");
            SOUP.Endless.trigger("processBatch", xmlDoc);

            response.responseText = nextPath + "|" + root.innerHTML;

            return oldSuccess.apply(this, arguments);
        };

        return oldRequest.apply(this, arguments);
    }

    function catchPreviewLoad (path, options) {
        var oldSuccess = options.onSuccess;
        options.onSuccess = function (response) {
            var content = response.responseText,
                parser = new DOMParser(),
                xmlDoc = parser.parseFromString(content, "text/html"),
                root = xmlDoc.body;

            root.setAttribute("id", "posts");
            SOUP.Endless.trigger("processBatch", xmlDoc);

            response.responseText = root.innerHTML;

            return oldSuccess.apply(this, arguments);
        };

        return oldRequest.apply(this, arguments);
    }

    Ajax.Request = function (path, options) {
        var aboveURL = getLoadAboveURL();
        var belowURL = getLoadBelowURL();

        if (path === aboveURL || path === belowURL) {
            return catchBatchLoad.apply(this, arguments);
        }
        if (path.startsWith("http://" + document.location.host + "/preview/")) {
            return catchPreviewLoad.apply(this, arguments);
        }
        return oldRequest.apply(this, arguments);
    };
    Ajax.Request._EndlessFilter = true;
    Ajax.Request.Events = oldRequest.Events;
    Ajax.Request.prototype = oldRequest.prototype;
}());
