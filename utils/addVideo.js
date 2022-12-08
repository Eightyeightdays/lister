import {currentPlaylistNode, currentPlaylistLength, playlistOrderNode, playlistLengthLabel} from "../playlist.js"
import createVideoCard from "./createVideoCard.js"
import updatePlaylistEditDate from "./updatePlaylistEditDate.js"
import sortPlaylists from "./sortPlaylists.js"
import getVideoDetails from "./getVideoDetails.js"
import addVideoToStorage from "./localStorage/addVideoToStorage.js"

export default async function addVideo() { 
    let playlistName = currentPlaylistNode.textContent
    let playlistLength = parseInt(currentPlaylistLength.textContent)

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
        sortPlaylists()
        addVideoToStorage(details, playlistName)

        playlistLength++
        currentPlaylistLength.textContent = playlistLength

        if(playlistLength === 1){
            playlistLengthLabel.textContent = "Video"
        }else{
            playlistLengthLabel.textContent = "Videos"
        }
    }
    
}