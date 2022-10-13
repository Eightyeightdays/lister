import removeCards from "./removeVideoCards.js"
import createVideoCard from "./createVideoCard.js";
import { currentPlaylistLength, playlistLengthLabel } from "../playlist.js";

export default function showSelectedList(playlistName){
    browser.tabs.query({active: true, currentWindow: true})
    .then(response => browser.tabs.sendMessage(response[0].id, {command: "return localStorage"})) 
    .then(response=>{
        if(response.storage){
            removeCards();                                 
            response.storage.forEach(list =>{
                if(list["playlistName"] === playlistName){         
                    list.videos.forEach(
                        video => {
                            createVideoCard(video)
                        }
                    )
                    list.lastAccessed = Date.now(); 
                    currentPlaylistLength.textContent = parseInt(list.length)
                    if(list.length === 1){
                        playlistLengthLabel.textContent = "Video"
                    }else{
                        playlistLengthLabel.textContent = "Videos"
                    }
                }   
            }) 
        }
    })
}