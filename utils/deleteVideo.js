import getLocalStorage from "./getLocalStorage.js"
import updatePlaylistEditDate from "./updatePlaylistEditDate.js"
import sortPlaylists from "./sortPlaylists.js"
import updateLocalStorage from "./updateLocalStorage.js"
import { playlistOrderNode } from "../playlist.js"

export default function deleteVideo(id, name){
    getLocalStorage()
    .then(response =>{
        let allLists = [].concat(response.storage)  // need to make sure that copies are made by VALUE not REFERENCE // CHECK
        let listIndex = allLists.findIndex(list => list.playlistName === name)
        let tempList = allLists[listIndex]
        let videoIndex = tempList.videos.findIndex(video => video.id === id)
        tempList.videos.splice(videoIndex, 1)
        
        let oldString = tempList.playlistString
        let stringIndex = oldString.indexOf(id)
        let start = oldString.substring(0, stringIndex)
        let end = oldString.substring(stringIndex+12)
        let newString = start + end
        tempList.playlistString = newString;   
        
        updatePlaylistEditDate(Date.now())
        tempList.dateEdited = Date.now()
        
        let node = document.querySelector('[data-id="' +id+ '"]')
        let parent = node.closest(".video-card")
        parent.remove()
        
        let order = playlistOrderNode.textContent
        sortPlaylists(order)
    
        updateLocalStorage(allLists)    
    })
}