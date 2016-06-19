/**
 * Requires hider
 *
 * Replaces the usual soup NSFW filters with one based on the hider script. This not only means that you can toggle
 * individual posts to be visible again, but also saves bandwidth by commenting the post content out, not just setting
 * them to not visible.
 */
(function () {
    if (SOUP.BetterNSFW) return;
    SOUP.BetterNSFW = true;

    function importFilters () {
        var map = SOUP.Public.haider_map.slice(0);
        for (var i = 0; i < map.length; ++i) {
            SOUP.Public.showPostsWithSelector(map[i]);
            addFilter(map[i]);
        }
    }

    function removeFilter (selector) {
        if (selector === "#posts .post.f_nsfw") {
            SOUP.Hider.unregisterFilter("NSFW");
        } else {
            SOUP.Hider.unregisterFilter(selector);
        }
    }

    function addFilter (selector) {
        if (selector === "#posts .post.f_nsfw") {
            SOUP.Hider.registerFilter(function (post) {
                return post.matches(selector);
            }, "NSFW", true);
        } else {
            SOUP.Hider.registerFilter(function (post) {
                return post.matches(selector);
            }, selector, false);
        }
    }

    importFilters();

    SOUP.Public.showPostsWithSelector = removeFilter;
    SOUP.Public.hidePostsWithSelector = addFilter;
}());