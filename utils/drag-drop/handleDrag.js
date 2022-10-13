import enableDrag from "./enableDrag.js";

export default function handleDrag(event){
    if(event.target.classList.contains("handle")){
        let parent = event.target.closest(".video-card")
        enableDrag(parent.id);
    }
}