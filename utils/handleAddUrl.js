import getVideoDetails from "./getVideoDetails"
import getPlaylistLength from "./localStorage/getPlaylistLength.js"
import addVideo from "./addVideo.js"

export default async function handleAddUrl(url){
    browser.storage.local.get()
    .then(data => {
        let currentPlaylist = data.currentPlaylist
        let length = getPlaylistLength(currentPlaylist)
        if(length === 50){
            alert("A playlist can only contain 50 videos maximum")  // TODO update UI 
        }
    })

    let details = await getVideoDetails(url)
    if(details.error){
        alert("Could not add video. Sorry")
    }else{
        addVideo(details, playlist)
    }
    // let playlist = localStorage.getItem("currentPlaylist")
    // let length = getPlaylistLength(playlist)
    // if(length === 50){
    //     alert("A playlist can only contain 50 videos maximum")  // update UI later // CHECK
    //     return Promise.reject({message: "A playlist can only contain 50 videos maximum"})
    // }
    // return getVideoDetails(message.url)    // adding "return" here solved the problem
    // .then(details => {
    //     if(details.error){
    //         alert("Could not add video. Sorry")
    //         return Promise.reject({message: details.error})
    //     }else{
    //         let playlistLength = addVideo(details, playlist)
    //         return Promise.resolve({
    //             message: "video details fetched", 
    //             details: details,
    //             length: playlistLength      
    //         })
    //     }
}