import getLocalStorage from "./getLocalStorage.js"
import updatePlaylistEditDate from "./updatePlaylistEditDate.js"
import sortPlaylists from "./sortPlaylists.js"
import setStorage from "./localStorage/setStorage.js"
import getStorage from "./localStorage/getStorage.js"
import { playlistOrderNode, currentPlaylistLength, playlistLengthLabel } from "../playlist.js"

export default async function deleteVideo(id, name){
    let storage = await getStorage()
    let allLists = structuredClone(storage.playlists)
    let index = allLists.findIndex(list => list.playlistName === name)
    let currentPlaylist = allLists[index]
    let videoIndex = currentPlaylist.videos.findIndex(video => video.id === id)
    currentPlaylist.videos.splice(videoIndex, 1)
    
    let oldString = currentPlaylist.playlistString
    let stringIndex = oldString.indexOf(id)
    let start = oldString.substring(0, stringIndex)
    let end = oldString.substring(stringIndex+12)
    let newString = start + end
    currentPlaylist.playlistString = newString;   
    
    updatePlaylistEditDate(Date.now())
    currentPlaylist.dateEdited = Date.now()
    currentPlaylist.length --;
    
    let node = document.querySelector('[data-id="' +id+ '"]')
    let parent = node.closest(".video-card")
    parent.remove()
    
    let order = playlistOrderNode.textContent
    sortPlaylists(order)

    setStorage({playlists: allLists}) 
    currentPlaylistLength.textContent = parseInt(currentPlaylist.length)
    if(currentPlaylist.length === 1){
        playlistLengthLabel.textContent = "Video"
    }else{
        playlistLengthLabel.textContent = "Videos"
    }














    getLocalStorage()
    .then(response =>{
        let allLists = [].concat(response.storage)  // need to make sure that copies are made by VALUE not REFERENCE // CHECK
        let listIndex = allLists.findIndex(list => list.playlistName === name)
        let currentPlaylist = allLists[listIndex]
        let videoIndex = currentPlaylist.videos.findIndex(video => video.id === id)
        currentPlaylist.videos.splice(videoIndex, 1)
        
        let oldString = currentPlaylist.playlistString
        let stringIndex = oldString.indexOf(id)
        let start = oldString.substring(0, stringIndex)
        let end = oldString.substring(stringIndex+12)
        let newString = start + end
        currentPlaylist.playlistString = newString;   
        
        updatePlaylistEditDate(Date.now())
        currentPlaylist.dateEdited = Date.now()
        currentPlaylist.length --;
        
        let node = document.querySelector('[data-id="' +id+ '"]')
        let parent = node.closest(".video-card")
        parent.remove()
        
        let order = playlistOrderNode.textContent
        sortPlaylists(order)
    
        setStorage({playlists: allLists}) 
        currentPlaylistLength.textContent = parseInt(currentPlaylist.length)
        if(currentPlaylist.length === 1){
            playlistLengthLabel.textContent = "Video"
        }else{
            playlistLengthLabel.textContent = "Videos"
        }
    })
}