// ==UserScript==
// @name         Copy Wommbat otp cookie
// @namespace    https://secure.bakecrafters.com
// @version      1.1
// @description  Copy trust_device cookie from prod to test environments
// @author       Alex O'Connor
// @match        https://secure.bc.test/session/create*
// @match        https://secure.bakecrafters.com/session/create*
// @match        https://secure.bakecrafters.info/session/create*
// @icon         https://bakecrafters.info/images/BC-logo.png
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==

(function() {
    'use strict';
    if (document.URL.includes("secure.bc.test") || document.URL.includes("secure.bakecrafters.info")) {
        let cookie = GM_getValue('otp_cookie').split('=');
        cookie[1] = decodeURIComponent(cookie[1]);
        document.cookie = `${cookie[0]}=${cookie[1]}; path=/`;
    } else if (document.URL.includes("secure.bakecrafters.com")) {
        let cookie = document.cookie.split('; ').filter((item) => { return item.split('=')[0] === 'trust_device'; } )
        if (cookie.length === 1) {
            GM_setValue('otp_cookie', cookie[0]);
        }
    }
})();
