import addName from "./createPlaylist.js"
import addVideo from "./addVideo.js"
import createLink from "./createLinkToPlaylist.js"
import selectPlaylistTitle from "./selectPlaylistTitle.js"
import clearLocalStorage from "./clearLocalStorage.js"
import removeCards from "./removeVideoCards.js"
import removePlaylistTitles from "./removePlaylistTitles.js"
import displaySettings from "./displaySettings.js"
import sortPlaylists from "./sortPlaylists.js"
import displaySortOrder from "./displaySortOrder.js"
import deleteVideo from "./deleteVideo.js"
import deletePlaylist from "./deletePlaylist.js"
import beginPlaylist from "./beginPlaylist.js"
import setPlaylistFavourite from "./setPlaylistFavourite.js"
import updateListOrder from "./drag-drop/updateListOrder.js"
import enableDrag from "./drag-drop/enableDrag.js"
import {currentPlaylistNode, currentPlaylistLength, playlistOrderNode, playlistLengthLabel} from "../playlist.js"

export default function listenForClicks() {
    document.addEventListener("click", (e) => {
        // console.log(e.target)    // VERIFY

        if(e.target.id === "add-playlist-name"){
            browser.tabs.query({active: true, currentWindow: true})
                .then(addName)
        }else if (e.target.classList.contains("add-video")) {
            if(parseInt(currentPlaylistLength.textContent) === 50){
                alert("A playlist can only contain 50 videos maximum")
                return;
            }else{
               browser.tabs.query({active: true, currentWindow: true})
                .then(addVideo) 
            }
        }else if(e.target.classList.contains("create-link")){
            browser.tabs.query({active: true, currentWindow: true})
                .then(createLink)
        }else if(e.target.classList.contains("list-title-card")){
            let realTitle = e.target.textContent.trim()    
            selectPlaylistTitle(realTitle)
            currentPlaylistNode.textContent = realTitle;
        }else if(e.target.id === "clear-storage"){
            clearLocalStorage()
            removeCards()
            removePlaylistTitles()
            currentPlaylistNode.textContent = "None Created"
            currentPlaylistLength.textContent = 0;
            playlistLengthLabel.textContent = "Videos"
            displaySettings("create")
        }else if(e.target.id === "arrange-list-titles-forwards"){
            sortPlaylists("forwards");
            playlistOrderNode.textContent = "forwards"
            displaySettings("list")
            displaySortOrder()
        }else if(e.target.id === "arrange-list-titles-backwards"){
            sortPlaylists("backwards");
            playlistOrderNode.textContent = "backwards"
            displaySettings("list")
            displaySortOrder()
        }else if(e.target.id === "arrange-list-titles-oldest"){
            sortPlaylists("oldest");
            playlistOrderNode.textContent = "oldest"
            displaySettings("list")
            displaySortOrder()
        }else if(e.target.id === "arrange-list-titles-newest"){
            sortPlaylists("newest");
            playlistOrderNode.textContent = "newest"
            displaySettings("list")
            displaySortOrder()
        }else if(e.target.id === "arrange-list-titles-edited"){
            sortPlaylists("edited");
            playlistOrderNode.textContent = "edited"
            displaySettings("list")
            displaySortOrder()
        }else if(e.target.classList.contains("delete-video")){
            let id = e.target.dataset.id
            let playlistName = currentPlaylistNode.textContent;
            deleteVideo(id, playlistName)
        }else if(e.target.classList.contains("delete-current-playlist")){
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
        }else if(e.target.classList.contains("start-playlist")){
            beginPlaylist()
        }else if(e.target.classList.contains("add-favourite")){
            setPlaylistFavourite()
        }else if(e.target.classList.contains("save-changes")){  // redundant as automatic now // CHECK
            updateListOrder()
        }else if(e.target.classList.contains("card")){
            setTimeout(()=>{
                window.close()
            }, 100)
        }else if(e.target.classList.contains("settings-item")){
            if(e.target.dataset.id === "list"){
                displaySortOrder()
            }
            displaySettings(e.target.dataset.id)
        }else if(e.target.classList.contains("open-button")){
            let box = document.getElementById("show-more-settings");
            if(box.style.display === "flex"){
                box.style.display = "none"
            }else{
                box.style.display = "flex";
                setTimeout(()=>{
                    box.style.display = "none"
                }, 3000)
            }
        }
    })

    document.addEventListener("mousedown", (e)=>{
        if(e.target.classList.contains("handle")){
            let parent = e.target.closest(".video-card")
            enableDrag(parent.id);
            console.log("MOUSE DOWN")
        }
    })
}