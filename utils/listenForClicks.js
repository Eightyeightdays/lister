import addName from "./createPlaylist.js"
import createLink from "./createLinkToPlaylist.js"
import beginPlaylist from "./beginPlaylist.js"
import setPlaylistFavourite from "./setPlaylistFavourite.js"
import handleSort from "./handleSort.js"
import handleClear from "./handleClear.js"
import handleAddVideo from "./handleAddVideo.js"
import handleDeleteVideo from "./handleDeleteVideo.js"
import handleDeletePlaylist from "./handleDeletePlaylist.js"
import handleMenuClick from "./handleMenuClick.js"
import handleSelectPlaylist from "./handleSelectPlaylist.js"
import handleDrag from "./drag-drop/handleDrag.js"
import showMoreSettings from "./showMoreSettings.js"
import closeUi from "./closeUi.js"

export default function listenForClicks() {
    document.addEventListener("click", (e) => {
        if(e.target.id === "add-playlist-name"){
            addName()
        }else if (e.target.classList.contains("add-video")) {
            handleAddVideo()
        }else if(e.target.classList.contains("create-link")){
            createLink()
        }else if(e.target.classList.contains("list-title-card")){
            handleSelectPlaylist(e)
        }else if(e.target.id === "clear-storage"){
            handleClear()          
        }else if(e.target.id === "arrange-list-titles-forwards"){
            handleSort("forwards")
        }else if(e.target.id === "arrange-list-titles-backwards"){
            handleSort("backwards")
        }else if(e.target.id === "arrange-list-titles-oldest"){
            handleSort("oldest")
        }else if(e.target.id === "arrange-list-titles-newest"){
            handleSort("newest")
        }else if(e.target.id === "arrange-list-titles-edited"){
            handleSort("edited")
        }else if(e.target.classList.contains("delete-video")){
            handleDeleteVideo(e)
        }else if(e.target.classList.contains("delete-current-playlist")){
            handleDeletePlaylist()
        }else if(e.target.classList.contains("start-playlist")){
            beginPlaylist()
        }else if(e.target.classList.contains("add-favourite")){
            setPlaylistFavourite()
        }else if(e.target.classList.contains("card")){  
            closeUi()
        }else if(e.target.classList.contains("settings-item")){
            handleMenuClick(e)
        }else if(e.target.classList.contains("open-button")){
            showMoreSettings()
        }
    })

    document.addEventListener("mousedown", (e)=>{
        handleDrag(e)
    })
}