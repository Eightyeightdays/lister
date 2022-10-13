
import getLocalStorage from "../getLocalStorage.js"
import updateLocalStorage from "../updateLocalStorage.js"
import {currentPlaylistNode} from "../../playlist.js"

export default function updateListOrder(){
    let currentPlaylist = currentPlaylistNode.textContent
    let cardList = document.querySelectorAll(".video-card")
    let newList = []
    let newString = "";
    let tempArray = [];

    cardList.forEach(item =>{
        newList.push(item.dataset.videoid)
        newString += item.dataset.videoid   // 
    })
    
    getLocalStorage()
    .then(response =>{
        let index = response.storage.findIndex(list => list.playlistName === currentPlaylist)
        let allLists = [].concat(response.storage)
        let originalList = allLists[index].videos
        
        for (let index = 0; index < newList.length; index++) {
            for (let index2 = 0; index2 < newList.length; index2++) {
                if(newList[index] === originalList[index2].id){
                    tempArray.unshift(originalList[index2])
                    break
                }
            }
        }

        allLists[index].videos = tempArray  // update video array 
        allLists[index].playlistString = newString  // update playlist url
        updateLocalStorage(response.storage)    // WHY ARE WE NOT UPDATING USING allLists ???
    
    })
    .catch(error => console.log(error))
}