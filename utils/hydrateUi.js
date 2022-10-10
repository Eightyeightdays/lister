import getLocalStorage from "./getLocalStorage.js"
import createTitlesList from "./createTitlesList.js"
import showRelevantUi from "./showRelevantUi.js"
import displaySettings from "./displaySettings.js"
import getCurrentPlaylist from "./getCurrentPlaylist.js"
import showSelectedList from "./showSelectedList.js"
import {currentPlaylistNode, playlistOrderNode} from "../playlist.js"

export default function hydrateUi(){
    getLocalStorage()
    .then(response => {
        if(response.storage){
            createTitlesList(response.storage, response.order);
            showRelevantUi()
        }else{
            displaySettings("create")
        }
        playlistOrderNode.textContent = response.order;
    })
    .then(getCurrentPlaylist)
    .then(response => {
        showSelectedList(response.current)
        currentPlaylistNode.textContent = response.current;
    })
    .catch(error => console.log(error))
}