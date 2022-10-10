import { checkOrderString } from "../../playlist.js";

export default function detectPlaylistOrderChange(){
    let testString = "";
    let cardList = document.querySelectorAll(".video-card")
    cardList.forEach(card => {
        testString += card.dataset.videoid;
    })
   
    if(checkOrderString === testString){
        testString = "";
        return false
    }else{
        testString = "";
        return true
    }
}