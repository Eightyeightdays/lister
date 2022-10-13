export default function dragStart(event){
    window.checkOrderString = "";   // re-initialise string after every drop
    let cardList = document.querySelectorAll(".video-card")
    let count = 1;
    
    cardList.forEach(card => {
        card.dataset.id = count;
        window.checkOrderString += card.dataset.videoid
        count++
    })
   
    if(event.target.classList.contains("video-card")){
        event.dataTransfer.setData("text/plain", event.target.dataset.id);
    }else{
        return;
    }

    setTimeout(()=>{
        event.target.classList.add("drag-start")
    },0)

}