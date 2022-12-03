import {currentPlaylistNode, currentPlaylistLength, playlistOrderNode, playlistLengthLabel} from "../playlist.js"
import createVideoCard from "./createVideoCard.js"
import updatePlaylistEditDate from "./updatePlaylistEditDate.js"
import sortPlaylists from "./sortPlaylists.js"
import getVideoDetails from "./getVideoDetails.js"
import addVideoToStorage from "./localStorage/addVideoToStorage.js"
import getPlaylistLength from "./localStorage/getPlaylistLength.js"

export default async function addVideo() { 
    let order = playlistOrderNode.textContent
    let playlistName = currentPlaylistNode.textContent
    let playlistLength = await getPlaylistLength(playlistName)  
    let response = await browser.tabs.query({active: true, currentWindow: true})
    let url = response[0].url
    let details = await getVideoDetails(url)

    if(details.error){
        console.log(details.error)
        console.log("Could not add video")
        return
    }else{
        console.log(details)
        createVideoCard(details)
        updatePlaylistEditDate(Date.now())
        sortPlaylists(order) 
        addVideoToStorage(details, playlistName)

        currentPlaylistLength.textContent = parseInt(playlistLength);
        if(playlistLength === 1){
            playlistLengthLabel.textContent = "Video"
        }else{
            playlistLengthLabel.textContent = "Videos"
        }
    }
    
}