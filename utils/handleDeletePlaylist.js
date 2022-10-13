import deletePlaylist from "./deletePlaylist.js";
import displaySettings from "./displaySettings.js";
import displaySortOrder from "./displaySortOrder.js";
import { currentPlaylistNode } from "../playlist.js";

export default function handleDeletePlaylist(){
    let playlistName = currentPlaylistNode.textContent;
    deletePlaylist(playlistName)    
    document.getElementById("show-more-settings").style.display = "none"
    let container = document.getElementById("list-title-container")
    if(container.children.length < 1){
        currentPlaylistNode.textContent = "None Created"
        displaySettings("create")
    }else{
        displaySettings("list")
        displaySortOrder()
    }  
}