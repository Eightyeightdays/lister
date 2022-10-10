import displaySettings from "./displaySettings.js"
import {currentPlaylistNode} from "../playlist.js"

export default function showRelevantUi(){ 
    let container = document.getElementById("list-title-container")
    if(container.childNodes.length < 1){
        displaySettings("create")
    }else if(currentPlaylistNode.textContent === "None Selected"){
        displaySettings("list")
        displaySortOrder()
    }else{
        displaySettings("main")
    }
}