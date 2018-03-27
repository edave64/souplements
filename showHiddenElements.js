/**
 * Shows all post icons, the reposted section, replies and tags if they are disabled in the settings of a soup.
 * It does this by removing all the .hide-reposted-by and .hidden marker classes on the page.
 *
 * To be used with the infinite scrolling template
 *
 * Licence: Public domain
 */
[].forEach.call(
    document.querySelectorAll('.hide-reposted-by,.icons.hidden,.date.hidden,.hide-tags'),
    function (ele) {
        ele.classList.remove('hide-reposted-by');
        ele.classList.remove('hide-tags');
        ele.classList.remove('hidden');
    }
);
