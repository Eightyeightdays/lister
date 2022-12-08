import sortPlaylists from "./sortPlaylists.js"
import displaySettings from "./displaySettings.js"
import displaySortOrder from "./displaySortOrder.js"
import {playlistOrderNode} from "../playlist.js"

export default function handleSort(order){
    playlistOrderNode.textContent = order
    sortPlaylists()
    displaySettings("list")
    displaySortOrder()
}