import setStorage from "../localStorage/setStorage.js"
import getStorage from "../localStorage/getStorage.js"
import {currentPlaylistNode} from "../../playlist.js"

export default function updateListOrderNew(){   // add async/await for storage?
    let currentPlaylist = currentPlaylistNode.textContent
    let cardList = document.querySelectorAll(".video-card")
    let newList = []
    let newString = "";
    let tempArray = [];

    cardList.forEach(item =>{
        newList.push(item.dataset.videoid)
        newString += item.dataset.videoid   // 
    })
    
    const storage = getStorage()
    if(!storage.playlists){
        console.log("Error retrieving playlists")
        return
    }
    const playlists = storage.playlists
    console.log(playlists)
    let index = playlists.findIndex(list => list.playlistName === currentPlaylist)
    let playlistsClone = structuredClone(playlists); // deep copy by value
    let selectedList = playlistsClone[index].videos
    
    for (let index = 0; index < newList.length; index++) {
        for (let index2 = 0; index2 < newList.length; index2++) {
            if(newList[index] === selectedList[index2].id){
                tempArray.unshift(selectedList[index2])
                break
            }
        }
    }
    
    playlistsClone[index].videos = tempArray  // update video array 
    playlistsClone[index].playlistString = newString  // update playlist url
    // setStorage({playlists: playlists}) // WHY ARE WE NOT UPDATING USING playlistsClone ???
    setStorage({playlists: playlistsClone}) // WHY ARE WE NOT UPDATING USING playlistsClone ???

}