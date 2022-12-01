export const currentPlaylistNode = document.getElementById("current-playlist");
export const playlistOrderNode = document.getElementById("playlistOrder");
export const currentPlaylistLength = document.getElementById("playlist-length-container")
export const playlistPreview = document.getElementById("playlist-preview");
export const playlistLengthLabel = document.getElementById("playlist-length-label")

import hydrateUi from "./utils/hydrateUi.js"
import listenForClicks from "./utils/listenForClicks.js";
import handleEnterKeyPress from "./utils/handleEnterKeyPress.js"

// import Test from "./TEST.js"

document.getElementById("playlist-name-input").addEventListener("keypress", handleEnterKeyPress);   

// Test()
hydrateUi()
listenForClicks()