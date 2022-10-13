export default function detectPlaylistOrderChange(){
    let testString = "";
    let cardList = document.querySelectorAll(".video-card")
    cardList.forEach(card => {
        testString += card.dataset.videoid;
    })
   
    if(window.checkOrderString === testString){
        testString = "";
        return false
    }else{
        testString = "";
        return true
    }
}