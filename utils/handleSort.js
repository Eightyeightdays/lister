import sortPlaylists from "./sortPlaylists.js"
import displaySettings from "./displaySettings.js"
import displaySortOrder from "./displaySortOrder.js"
import {playlistOrderNode} from "../playlist.js"

export default function handleSort(order){
    sortPlaylists(order)
    playlistOrderNode.textContent = order
    displaySettings("list")
    displaySortOrder()
}