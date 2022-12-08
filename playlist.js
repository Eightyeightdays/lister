export const currentPlaylistNode = document.getElementById("current-playlist");
export const playlistOrderNode = document.getElementById("playlistOrder");
export const currentPlaylistLength = document.getElementById("playlist-length-container")
export const playlistPreview = document.getElementById("playlist-preview");
export const playlistLengthLabel = document.getElementById("playlist-length-label")

import hydrateUi from "./utils/hydrateUi.js"
import listenForClicks from "./utils/listenForClicks.js";
import handleEnterKeyPress from "./utils/handleEnterKeyPress.js"
import getStorage from "./utils/localStorage/getStorage.js";
import clearStorage from "./utils/localStorage/clearStorage.js"


document.getElementById("playlist-name-input").addEventListener("keypress", handleEnterKeyPress);   

// clearStorage()
hydrateUi()
listenForClicks()
getStorage()
