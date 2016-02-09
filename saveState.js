/**
 * A bookmarklet for saving the current position in an infinite stream as the current url, without reloading.
 *
 * Very loosely based on reSoup by Leo Settele (https://github.com/LeuX/reSoup)
 *
 * Licence: Public Domain
 */
(function () {
    // don't do anything on single post pages
    if (location.pathname.indexOf("/post/") >= 0) { return; }

    var urlPart1 = ""; // part before the post-id
    var urlPart2 = ""; // part after the post-id

    // /friend/ or a /fof/ soup use since as a get parameter ?since=, otherwise, it is part of the path with /since/
    if (location.pathname.match(/\/(friends|fof)/)) {
        // ?since=
        var match = location.href.match(/([\?&])since=\d+/);
        if (match) {
            var parts = location.href.split(match[0]);
            urlPart1 = parts[0] + match[1];
            urlPart2 = parts[1];
        } else {
            urlPart1 = (location.pathname) + (location.search > "" ? location.search + "&" : "?")
        }
        urlPart1 += "since=";
    } else {
        // /since/
        urlPart1 = location.pathname.replace(/\/since\/\d+/i, "");
        urlPart1 = (urlPart1 + "/since/").replace("//", "/");
        urlPart2 = location.search;
    }

    function sinceUrl (value) {
        return urlPart1 + value + urlPart2;
    }

    // This function returns all visible posts, and "idx", the index of the post currently in view
    var posts = SOUP.Public.pointapePosts();
    if (posts) {
        // since excludes the post with the given id, so we need
        var idx = Math.max(posts.idx - 1,0),
            postID = Number(posts.ls[idx].id.substring(4));
        window.history.replaceState(null, null, sinceUrl(postID));
    }
}());
