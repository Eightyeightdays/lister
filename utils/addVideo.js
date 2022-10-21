import createVideoCard from "./createVideoCard.js"
import updatePlaylistEditDate from "./updatePlaylistEditDate.js"
import sortPlaylists from "./sortPlaylists.js"
import {currentPlaylistNode, currentPlaylistLength, playlistOrderNode, playlistLengthLabel} from "../playlist.js"

export default function addVideo() {
    browser.tabs.query({active: true, currentWindow: true})
    .then(response => {
        browser.tabs.sendMessage(response[0].id, {  
            command: "add video",
            playlist: currentPlaylistNode.textContent
            }
        )
        .then(response => {
            console.log(response)
            if(response.message === "video details fetched"){
                createVideoCard(response.details)
                let order = playlistOrderNode.textContent
                updatePlaylistEditDate(Date.now())
                sortPlaylists(order) 
                currentPlaylistLength.textContent = parseInt(response.length);
                if(response.length === 1){
                    playlistLengthLabel.textContent = "Video"
                }else{
                    playlistLengthLabel.textContent = "Videos"
                }
            }else if(response.message === "Unauthorized"){
                alert("Could not add video. Sorry")
                window.close();
            }
        })
    })
    
}