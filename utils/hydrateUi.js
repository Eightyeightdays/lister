import getLocalStorage from "./getLocalStorage.js"
import createTitlesList from "./createTitlesList.js"
import showRelevantUi from "./showRelevantUi.js"
import displaySettings from "./displaySettings.js"
import getCurrentPlaylist from "./getCurrentPlaylist.js"
import showSelectedList from "./showSelectedList.js"
import {currentPlaylistNode, playlistOrderNode} from "../playlist.js"
import setSortState from "./localStorage/setSortState.js"

export default function hydrateUi(){
    browser.storage.local.get()
    .then(data =>{
        if(data.playlists){
            createTitlesList(data.playlists, data.order);
            showRelevantUi()
        }else{
            displaySettings("create")
            setSortState("newest")
        }
        playlistOrderNode.textContent = data.order;
    })
    
    
    
    
    // getLocalStorage()
    // .then(response => {
    //     if(response.storage){
    //         createTitlesList(response.storage, response.order);
    //         showRelevantUi()
    //     }else{
    //         displaySettings("create")
    //     }
    //     playlistOrderNode.textContent = response.order;
    //     console.log(playlistOrderNode)
    // })
    // .then(getCurrentPlaylist)
    // .then(response => {
    //     showSelectedList(response.current)
    //     currentPlaylistNode.textContent = response.current;
    // })
    // .catch(error => console.log(error))
}