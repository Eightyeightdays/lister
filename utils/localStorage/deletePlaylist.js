import { currentPlaylistLength, playlistLengthLabel, currentPlaylistNode } from "../../playlist.js";
import setStorage from "./setStorage.js"
import getStorage from "./getStorage.js"
import removeCards from "../removeVideoCards.js"
import hyphenate from "../hyphenate.js"
import setCurrentPlaylist from "./setCurrentPlaylist.js";
import displaySettings from "../displaySettings.js";
import displaySortOrder from "../displaySortOrder.js";

export default async function deletePlaylist(){  
    document.getElementById("show-more-settings").style.display = "none"
    let playlistName = currentPlaylistNode.textContent;
    let container = document.getElementById("list-title-container")
    let storage = await getStorage()
    let index = storage.playlists.findIndex(list => list.playlistName === playlistName)
    storage.playlists.splice(index, 1)
    setStorage({playlists: storage.playlists})
    console.log(`The ${playlistName} playlist was deleted!`)

    removeCards()   
    let hyphenatedTitle = hyphenate(playlistName);
    document.getElementById(hyphenatedTitle).remove() 
    currentPlaylistLength.textContent = 0;
    playlistLengthLabel.textContent = "Videos"

    if(container.children.length < 1){
        setCurrentPlaylist("None Created")
        displaySettings("create")
    }else{
        setCurrentPlaylist("None Selected")
        displaySettings("list")
        displaySortOrder()
    }  
    
}