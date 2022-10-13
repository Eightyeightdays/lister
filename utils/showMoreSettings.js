export default function showMoreSettings(){
    let box = document.getElementById("show-more-settings");
    if(box.style.display === "flex"){
        box.style.display = "none"
    }else{
        box.style.display = "flex";
        setTimeout(()=>{
            box.style.display = "none"
        }, 3000)
    }
}