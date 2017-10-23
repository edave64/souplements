require("../endlessFilter");
const MediaEmbedder = require("media-embedder");

if (!SOUP.EmbedFix) {
    SOUP.EmbedFix = true;

    function fixAll (doc) {
        var video_posts = doc.getElementsByClassName("post_video");
        
        const firstPost = document.getElementsByClassName("post")[0];
        let width = 500;

        if (firstPost) {
            width = parseInt(window.getComputedStyle(firstPost).width);
        }

        const height = (width / 16 * 9)|0;
        
        for (const video_post of video_posts) {
            const embed = video_post.getElementsByClassName("embed")[0];
            if (embed.children.length === 0) {
                const textarea = video_post.querySelector("[name='post[embedcode_or_url]']");
                let mediaData = MediaEmbedder.detect(textarea.innerText);

                if (!mediaData) {
                    const description = video_post.getElementsByClassName("body")[0];
                    if (description) {
                        mediaData.width = width;
                        mediaData.height = height;
                        mediaData = MediaEmbedder.detect(description.innerHTML);
                    }
                }

                if (mediaData) {
                    mediaData.width = width;
                    mediaData.height = height;
                    embed.innerHTML = MediaEmbedder.buildIframe(mediaData);
                }
            }
        }
    }

    SOUP.Endless.on("processBatch", function (doc) {
        fixAll(doc);
    });

    fixAll(document);
}
