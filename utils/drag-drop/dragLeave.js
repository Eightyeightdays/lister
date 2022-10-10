export default function dragLeave(event){
    if(event.target.classList.contains("video-card")){
        event.target.classList.remove("drag-over")
    }else{
        event.target.closest(".video-card").classList.remove("drag-over")
    }
}