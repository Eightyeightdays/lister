import sortPlaylists from "./sortPlaylists.js"
import displaySettings from "./displaySettings.js"
import displaySortOrder from "./displaySortOrder.js"
import {playlistOrderNode} from "../playlist.js"

export default function handleSort(order){
    sortPlaylists(order)                    // swap order so that listenForClicks changes the text content
    playlistOrderNode.textContent = order   // and then sort playlists runs using the new text content without needing an argument
    displaySettings("list")
    displaySortOrder()
}