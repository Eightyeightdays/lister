import getTemporaryOrder from "./getTemporaryOrder.js"
import { checkOrderString } from "../../playlist.js";

export default function dragStart(event){
    // only create a new string on open or after save
    if(checkOrderString === ""){
        getTemporaryOrder()
    }
    // give all cards temporary ids according to their index whenever drag begins
    let cardList = document.querySelectorAll(".video-card")
    let count = 1;
    cardList.forEach(card => {
        card.setAttribute("data-id", count)
        count++
    })
   
    if(event.target.classList.contains("video-card")){
        event.dataTransfer.setData("text/plain", event.target.dataset.id);
    }else{
        return; // event.target.closest(".video-card").setData("text/plain", event.target.closest(".video-card").dataset.id) get parent item id here so we set the correct data regardless // CHECK
    }

    setTimeout(()=>{
        event.target.classList.add("drag-start")
    },0)

}