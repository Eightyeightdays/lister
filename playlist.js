export const currentPlaylistNode = document.getElementById("current-playlist");
export const playlistOrderNode = document.getElementById("playlistOrder");
export const currentPlaylistLength = document.getElementById("playlist-length-container")
export const playlistPreview = document.getElementById("playlist-preview");
export let checkOrderString = "";

import hydrateUi from "./utils/hydrateUi.js"
import listenForClicks from "./utils/listenForClicks.js";
import handleEnterKeyPress from "./utils/handleEnterKeyPress.js"
const input = document.getElementById("playlist-name-input");
input.addEventListener("keypress", handleEnterKeyPress);    // CHECK that this doesn't need an arrow function

browser.tabs.executeScript({file: "/content_scripts/makePlaylist.js"})
    .then(hydrateUi)
    .then(listenForClicks)
    .catch();