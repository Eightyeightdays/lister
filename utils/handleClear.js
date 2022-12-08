import clearStorage from "./localStorage/clearStorage.js"
import removeCards from "./removeVideoCards.js"
import removePlaylistTitles from "./removePlaylistTitles.js"
import displaySettings from "./displaySettings.js"
import { currentPlaylistNode, currentPlaylistLength, playlistLengthLabel, playlistOrderNode } from "../playlist.js"

export default function handleClear(){
    clearStorage()
    removeCards()
    removePlaylistTitles()
    currentPlaylistNode.textContent = "None Created"
    currentPlaylistLength.textContent = 0;
    playlistOrderNode.textContent = "";
    playlistLengthLabel.textContent = "Videos"
    displaySettings("create")
}