import dragStart from "./dragStart.js"
import dragEnter from "./dragEnter.js"
import dragOver from "./dragOver.js"
import dragLeave from "./dragLeave.js"
import drop from "./drop.js"

export default function enableDrag(id){
    let card = document.getElementById(id)
    card.setAttribute("draggable", true)
    card.classList.add("draggable")   
    let allCards = document.querySelectorAll(".video-card")
    allCards.forEach(card => {
        card.addEventListener("dragstart", dragStart)
        card.addEventListener('dragenter', dragEnter)
        card.addEventListener('dragover', dragOver);
        card.addEventListener('dragleave', dragLeave);
        card.addEventListener('drop', drop);
    })
}