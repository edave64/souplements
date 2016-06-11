(function () {
    /**
     * Removes all posts that aren't reactions from a document
     */
    function removeNonReactions(doc) {
        var posts = doc.querySelectorAll(".post:not(.post_reaction)");

        for (var i = 0; i < posts.length; ++i) {
            var post = posts[i];
            var content = post.getElementsByClassName("content")[0];
            if (content) {
                content.innerHTML = "";
                post.style.display = "none";
            }
        }
    }

    // Remove all currently displayed non reactions
    removeNonReactions(document);

    // Remove all future non reactions
    SOUP.Endless.on("processBatch", function (doc) {
        removeNonReactions(doc);
    });
}());