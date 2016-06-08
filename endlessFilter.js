/**
 * This code snippet allows you to intercept the loading of new elements and modify the loaded posts.
 * The basic idea is to allow filtering out posts before they are inserted into the dom, and thus before their assets
 * are loaded. This reduces stress on both the client and the asset servers.
 *
 * It uses an abandoned event system in Soup. This was apparently planed for something, but was never used.
 *
 * To use the filter, register the event "processBatch" in SOUP.Events.
 * Example:
 *
 *     SOUP.Events.on("processBatch", function (doc) {
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
 */
(function () {
    if (Ajax.Request._EndlessFilter) return;
    
    var oldRequest = Ajax.Request;

    function getLoadAboveURL() {
        var url = $("endless_top_post").href;
        return url.match(/[&?]newer=1/) ? url : url + (url.indexOf("?") >= 0 ? "&" : "?") + "newer=1"
    }

    function getLoadBelowURL() {
        return SOUP.Endless.next_url.replace(/&?newer=1&?/g, "");
    }

    Ajax.Request = function (path, options) {
        var aboveURL = getLoadAboveURL();
        var belowURL = getLoadBelowURL();

        if (path !== aboveURL && path !== belowURL) {
            return oldRequest.apply(this, arguments);
        }

        var oldSuccess = options.onSuccess;
        options.onSuccess = function (response) {
            var text = response.responseText,
                pipePosition = text.indexOf("|"),
                nextPath = text.substring(0, pipePosition),
                content = text.substring(pipePosition + 1),
                parser = new DOMParser(),
                xmlDoc = parser.parseFromString(content, "text/html"),
                root = xmlDoc.body;

            SOUP.Events.trigger("processBatch", xmlDoc);

            response.responseText = nextPath + "|" + root.innerHTML;

            return oldSuccess.apply(this, arguments);
        };

        return oldRequest.apply(this, arguments);
    };
    Ajax.Request._EndlessFilter = true;
    Ajax.Request.Events = oldRequest.Events;
    Ajax.Request.prototype = oldRequest.prototype;
}());
