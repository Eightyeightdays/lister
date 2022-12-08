import createTitlesList from "./createTitlesList.js"
import showRelevantUi from "./showRelevantUi.js"
import displaySettings from "./displaySettings.js"
import showSelectedList from "./showSelectedList.js"
import {currentPlaylistNode, playlistOrderNode} from "../playlist.js"
import setSortState from "./localStorage/setSortState.js"
import getStorage from "./localStorage/getStorage.js"

export default async function hydrateUi(){
    let storage = await getStorage();
    currentPlaylistNode.textContent = storage.currentPlaylist
    playlistOrderNode.textContent = storage.order;

    if(storage.playlists){
        // console.log("Playlists were found in storage")
        createTitlesList(storage.playlists, storage.order);
        showRelevantUi()
    }else{
        displaySettings("create")
        setSortState("newest")
    }
    
    showSelectedList(storage.currentPlaylist)
    
}