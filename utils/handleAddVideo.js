import {currentPlaylistLength} from "../playlist.js"
import addVideo from "./addVideo.js";

export default function handleAddVideo(){
    if(parseInt(currentPlaylistLength.textContent) === 50){
        alert("A playlist can only contain 50 videos maximum")
        return;
    }else{
        addVideo()
    }
}