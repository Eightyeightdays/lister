export default function dragOver(event){
    event.preventDefault()
    if(event.target.classList.contains("video-card")){
        event.target.classList.add("drag-over")
    }else{
        event.target.closest(".video-card").classList.add("drag-over")
    }
}