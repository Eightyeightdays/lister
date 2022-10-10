import createVideoCard from "./createVideoCard.js"
import updatePlaylistEditDate from "./updatePlaylistEditDate.js"
import sortPlaylists from "./sortPlaylists.js"
import {currentPlaylistNode, currentPlaylistLength, playlistOrderNode} from "../playlist.js"

export default function addVideo(tabs) {
    browser.tabs.sendMessage(tabs[0].id, {  // why doesn't this start with a query?
        command: "add video",
        id: currentPlaylistNode.textContent
    })
    .then(response => {
        console.log(response)
        if(response.message === "video details fetched"){
            createVideoCard(response.details)
            let order = playlistOrderNode.textContent
            updatePlaylistEditDate(Date.now()) // localStorage is also updated by content script
            sortPlaylists(order) 
            currentPlaylistLength.textContent ++ 
        }
    })
}