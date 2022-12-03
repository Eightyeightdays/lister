// import deletePlaylist from "./deletePlaylist.js";
import deletePlaylist from "./localStorage/deletePlaylist.js";
import displaySettings from "./displaySettings.js";
import displaySortOrder from "./displaySortOrder.js";
import { currentPlaylistNode } from "../playlist.js";

export default function handleDeletePlaylist(){
    console.log("handleDeletePlaylist ran")
    let playlistName = currentPlaylistNode.textContent;
    deletePlaylist(playlistName)    
    document.getElementById("show-more-settings").style.display = "none"

    let container = document.getElementById("list-title-container")
    if(container.children.length < 1){
        console.log("HERE")
        currentPlaylistNode.textContent = "None Created"
        displaySettings("create")
    }else{
        console.log("THERE")
        displaySettings("list")
        displaySortOrder()
    }  
}