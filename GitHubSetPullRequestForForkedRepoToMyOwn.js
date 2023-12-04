// ==UserScript==
// @name         GitHub Restore Default Pull Request Redirect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirect the "New pull request" button on GitHub to a create a Pull Request against the main branch of this repo, and _not_ the upstream repo
// @author       Marlen
// @match        https://github.com/*/pulls
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @run-at       document-body
// ==/UserScript==

(function() {
    'use strict';

    function patchNewPullRequestRedirect() {
        // Find the "New pull request" button
        var newPullRequestButton = document.querySelector('a[href*="/compare"]')

        // Check if the button exists
        if (newPullRequestButton) {
            const currentHref = window.location.href
            //e.g. https://github.com/icefoganalytics/travel-authorization/compare
            const urlSegments = currentHref.split('/')
            const repoOwner = urlSegments[3]
            const repoName = urlSegments[4]

            // Change the button's href attribute to the desired URL
            // e.g. /icefoganalytics/travel-authorization/compare/main...icefoganalytics:travel-authorization:main
            newPullRequestButton.href = `/${repoOwner}/${repoName}/compare/main...${repoOwner}:${repoName}:main`
            console.log("newPullRequestButton.href", newPullRequestButton.href)
        } else {
            // console.log("could not find compare button")
        }
    }

    // Run the function immediately on page load for existing elements
    patchNewPullRequestRedirect();

    // Create a MutationObserver to observe DOM changes
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // Run the function again if new nodes are added
                patchNewPullRequestRedirect();
            }
        });
    });

    // Start observing the document body for added nodes
    observer.observe(document.body, { childList: true, subtree: true });
})();
