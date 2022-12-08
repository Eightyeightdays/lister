import detectPlaylistOrderChange from "./detectPlaylistOrderChange.js"
import updateListOrder from "./updateListOrder.js"

export default function drop(event){
    event.preventDefault()

    let dropId;

    if(event.target.classList.contains("video-card")){
        event.target.classList.remove("drag-over")
        dropId = event.target.dataset.id
    }else{
        event.target.closest(".video-card").classList.remove("drag-over")
        dropId = event.target.closest(".video-card").dataset.id
    }
    
    let container = document.getElementById("playlist-preview")
    let dragId = event.dataTransfer.getData("text/plain") 
    let card = document.querySelector('[data-id="' + dragId + '"]')   // dragged item
    card.classList.remove("drag-start")
    container.insertBefore(card, container.children[dropId]) 

    let change = detectPlaylistOrderChange()

    if(change){
        updateListOrder();
    }
}