import removeCards from "./removeVideoCards.js"
import createVideoCard from "./createVideoCard.js";
import getStorage from "./localStorage/getStorage.js";
import { currentPlaylistLength, playlistLengthLabel } from "../playlist.js";

export default async function showSelectedList(playlistName){
    let storage = await getStorage()
    let playlists = storage.playlists
    if(playlists){
        removeCards()
        playlists.forEach(list =>{
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
}