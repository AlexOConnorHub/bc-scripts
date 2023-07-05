// ==UserScript==
// @name         Create Git Branch
// @namespace    https://helpdesk.bakecrafters.com
// @version      1.2
// @description  This allows users to copy/paste git commands to create and set the upstream for branches related to tickets
// @author       Alex O'Connor
// @match        https://helpdesk.bakecrafters.com
// @icon         https://bakecrafters.info/images/BC-logo.png
// @grant        none
// ==/UserScript==

let init = false;

var observer = new MutationObserver(function(mutations) {
    let menu = getMenu();
    if (menu.children.length === 4 && !init) {
        init = true;
        let makeBranch = menuItem(" Checkout Branch");
        let makePR = menuItem(" Create PR");
        makeBranch.addEventListener('click', checkoutBranch);
        makePR.addEventListener('click', createPR);
        menu.insertBefore(makePR, menu.children[1]);
        menu.insertBefore(makeBranch, makePR);
    }
});

function githubImg() {
    let github = document.createElement('img');
    github.setAttribute('class', 'menu-item-icon');
    github.setAttribute('src', 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgMGMtNi42MjYgMC0xMiA1LjM3My0xMiAxMiAwIDUuMzAyIDMuNDM4IDkuOCA4LjIwNyAxMS4zODcuNTk5LjExMS43OTMtLjI2MS43OTMtLjU3N3YtMi4yMzRjLTMuMzM4LjcyNi00LjAzMy0xLjQxNi00LjAzMy0xLjQxNi0uNTQ2LTEuMzg3LTEuMzMzLTEuNzU2LTEuMzMzLTEuNzU2LTEuMDg5LS43NDUuMDgzLS43MjkuMDgzLS43MjkgMS4yMDUuMDg0IDEuODM5IDEuMjM3IDEuODM5IDEuMjM3IDEuMDcgMS44MzQgMi44MDcgMS4zMDQgMy40OTIuOTk3LjEwNy0uNzc1LjQxOC0xLjMwNS43NjItMS42MDQtMi42NjUtLjMwNS01LjQ2Ny0xLjMzNC01LjQ2Ny01LjkzMSAwLTEuMzExLjQ2OS0yLjM4MSAxLjIzNi0zLjIyMS0uMTI0LS4zMDMtLjUzNS0xLjUyNC4xMTctMy4xNzYgMCAwIDEuMDA4LS4zMjIgMy4zMDEgMS4yMy45NTctLjI2NiAxLjk4My0uMzk5IDMuMDAzLS40MDQgMS4wMi4wMDUgMi4wNDcuMTM4IDMuMDA2LjQwNCAyLjI5MS0xLjU1MiAzLjI5Ny0xLjIzIDMuMjk3LTEuMjMuNjUzIDEuNjUzLjI0MiAyLjg3NC4xMTggMy4xNzYuNzcuODQgMS4yMzUgMS45MTEgMS4yMzUgMy4yMjEgMCA0LjYwOS0yLjgwNyA1LjYyNC01LjQ3OSA1LjkyMS40My4zNzIuODIzIDEuMTAyLjgyMyAyLjIyMnYzLjI5M2MwIC4zMTkuMTkyLjY5NC44MDEuNTc2IDQuNzY1LTEuNTg5IDguMTk5LTYuMDg2IDguMTk5LTExLjM4NiAwLTYuNjI3LTUuMzczLTEyLTEyLTEyeiIvPjwvc3ZnPg==');
    return github;
}

function githubSvg() {
    let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z');

    let github = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    github.setAttribute('class', 'menu-item-icon');
    github.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    github.setAttribute('width', '24')
    github.setAttribute('height', '24')
    github.setAttribute('viewBox', '0 0 24 24')

    github.appendChild(path);
    return github;
}

function labelSpan(title) {
    let span = document.createElement('span');
    span.setAttribute('class', 'menu-item-name');
    span.textContent = title;
    return span;
}

function menuItem(title) {
    let item = document.createElement('a');
    item.setAttribute('class', 'menu-item');
    item.appendChild(githubSvg());
    item.appendChild(labelSpan(title));
    return item;
}

function getTicketNumber() {
    let final;
    try {
        final = document.querySelector(".ticket-number").textContent;
    } catch (e) {
        console.warn(e);
        final = null;
    }
    return final;
}

function getTicketState() {
    return document.querySelector("select[name='state_id'] option:checked").textContent;
}

function getMenu() {
    return document.getElementById("navigation");
}

function createPR() {
    let branch = getTicketNumber();
    let url = `https://github.com/BakeCrafters/wommbat/pull/new/${branch}`;

    window.open(url, '_blank').focus();
}

function checkoutBranch(e) {
    let branch = getTicketNumber();
    if (branch === null) {
        alert("Please select a ticket!");
        return;
    }
    let command = `git checkout `;
    let activeElement = document.activeElement;
    if (confirm("Create new branch for this ticket")) {
        command += `-b ${branch} origin/production`
    } else {
        command += branch;
    }
    activeElement.focus();
    setTimeout(() => {
        navigator.clipboard.writeText(command)
            .then((e) => {
            alert(`Copied`);
        }, (e) => {
            console.log(e);
            alert(`Copy: ${command}`);
        })
    }, 50);
}

function showOptions() {
    console.log("Ya done now!");
    this.parentElement.removeEventListener('click', showOptions);
}

observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});
