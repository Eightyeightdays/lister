import { checkOrderString } from "../../playlist.js"

export default function getTemporaryOrder(){
    let cardList = document.querySelectorAll(".video-card")
    cardList.forEach(card => {
        checkOrderString += card.dataset.videoid    // for detecting playlist order changes
    })
}