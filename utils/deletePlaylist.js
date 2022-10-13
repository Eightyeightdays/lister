import removeCards from "./removeVideoCards.js"
import hyphenate from "./hyphenate.js"
import { currentPlaylistLength, playlistLengthLabel } from "../playlist.js";

export default function deletePlaylist(name){
    removeCards()   
    let hyphenatedTitle = hyphenate(name);
    document.getElementById(hyphenatedTitle).remove() 
    currentPlaylistLength.textContent = 0;
    playlistLengthLabel.textContent = "Videos"
    browser.tabs.query({active: true, currentWindow: true})
    .then(response => browser.tabs.sendMessage(response[0].id, {command: "delete playlist", name: name})) 
}