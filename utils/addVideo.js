import createVideoCard from "./createVideoCard.js"
import updatePlaylistEditDate from "./updatePlaylistEditDate.js"
import sortPlaylists from "./sortPlaylists.js"
import {currentPlaylistNode, currentPlaylistLength, playlistOrderNode, playlistLengthLabel} from "../playlist.js"
import getVideoDetails from "./getVideoDetails.js"
import addVideoToStorage from "./localStorage/addVideoToStorage.js"
import getPlaylistLength from "./localStorage/getPlaylistLength.js"


export default async function addVideo() { 
    let order = playlistOrderNode.textContent
    let playlistName = currentPlaylistNode.textContent
    let playlistLength = await getPlaylistLength("FRIDAY")  // replace with playlistName
    console.log(playlistLength)

    browser.tabs.query({active: true, currentWindow: true})
    .then(response => {
        let url = response[0].url
        let details = getVideoDetails(url)
        if(details.error){
            console.log(details.error)
            console.log("Could not add video")
            return
        }else{
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
    })

    
    
    // browser.tabs.query({active: true, currentWindow: true})
    // .then(response => {
    //     browser.tabs.sendMessage(response[0].id, {  
    //         command: "add video",
    //         playlist: currentPlaylistNode.textContent
    //         }
    //     )
    //     .then(response => {
    //         console.log(response)
    //         if(response.message === "video details fetched"){
    //             createVideoCard(response.details)
    //             let order = playlistOrderNode.textContent
    //             updatePlaylistEditDate(Date.now())
    //             sortPlaylists(order) 
    //             currentPlaylistLength.textContent = parseInt(response.length);
    //             if(response.length === 1){
    //                 playlistLengthLabel.textContent = "Video"
    //             }else{
    //                 playlistLengthLabel.textContent = "Videos"
    //             }
    //         }else if(response.message === "Unauthorized"){
    //             alert("Could not add video. Sorry")
    //             window.close();
    //         }
    //     })
    // })
    
}