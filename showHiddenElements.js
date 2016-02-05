/**
 * Shows all post icons, the reposted section and replies, if they are disabled in the settings of a soup.
 * It does this by removing all the .hide-reposted-by and .hidden marker classes on the page.
 *
 * To be used with the infinite scrolling template
 *
 * Licence: Public domain
 */
[].forEach.call(
    document.querySelectorAll('.hide-reposted-by,.icons.hidden,.date.hidden'),
    function (ele) {
        ele.classList.remove('hide-reposted-by');
        ele.classList.remove('hidden');
    }
);