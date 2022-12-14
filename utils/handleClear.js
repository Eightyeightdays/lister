import clearLocalStorage from "./clearLocalStorage.js"
import removeCards from "./removeVideoCards.js"
import removePlaylistTitles from "./removePlaylistTitles.js"
import displaySettings from "./displaySettings.js"
import { currentPlaylistNode, currentPlaylistLength, playlistLengthLabel } from "../playlist.js"

export default function handleClear(){
    clearLocalStorage()
    removeCards()
    removePlaylistTitles()
    currentPlaylistNode.textContent = "None Created"
    currentPlaylistLength.textContent = 0;
    playlistLengthLabel.textContent = "Videos"
    displaySettings("create")
}