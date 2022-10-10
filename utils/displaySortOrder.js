export default function displaySortOrder(){
    let container = document.querySelector(".playlist-order-container");
    container.style.display = "flex"
    setTimeout(()=>{
        container.style.opacity = "0"
    }, 1000)
    setTimeout(()=>{
        container.style.display = "none"
        container.style.opacity = "0.7"
    }, 3000)
}