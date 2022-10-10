export default function displaySettings(id){
    let containers = document.querySelectorAll(".settings-container");
    containers.forEach(item => {
        if(item.dataset.id === id){
            item.style.display = "flex"
        }else{
            item.style.display = "none"
        }
    })
}