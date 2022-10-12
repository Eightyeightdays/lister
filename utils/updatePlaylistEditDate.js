import {currentPlaylistNode} from "../playlist.js"
import hyphenate from "./hyphenate.js"

export default function updatePlaylistEditDate(date){
    let currentPlaylist = hyphenate(currentPlaylistNode.textContent)
    let title = document.getElementById(currentPlaylist)
    title.setAttribute("dateedited", date)
}