import {currentPlaylistNode} from "../playlist.js"

export default function setCurrentPlaylist(playlistName){
    currentPlaylistNode.textContent = playlistName;
    browser.tabs.query({active: true, currentWindow: true})
    .then(response => browser.tabs.sendMessage(response[0].id, {command: "set current playlist", playlistName: playlistName})) 
    .then(response => console.log(response))
    .catch(error => console.log(error))
}