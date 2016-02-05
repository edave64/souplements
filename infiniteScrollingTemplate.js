/**
 * A template to insert your code into that automatically makes it efficiently support infinite scrolling. For creating
 * a bookmarklet, insert your code, then compact the result and prefix it with "javascript:"
 *
 * Licence: Public domain
 */
(function () {
    function customCode () {
        // write code here
    }

    // Reduces calls to customCode by limiting it to execute once per javascript activity and stops it from calling
    // itself.
    var _runner = null;
    function runDelayed () {
        if (_runner === null) {
            _runner = setTimeout(function () {
                try {
                    customCode();
                } finally {
                    _runner = null;
                }
            }, 0);
        }
    }
    function register () {
        customCode();
        new MutationObserver(runDelayed).observe(
            document.getElementById('contentcontainer'), {
                childList: true,
                subtree: true
            }
        );
    }
    // Is the soup page already loaded? This allows the custom code to run as both a bookmarklet and a userscript.
    if (document.getElementById('contentcontainer')) {
        register();
    } else {
        document.addEventListener("load", register);
    }
}());
