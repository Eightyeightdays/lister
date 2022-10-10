export default function removePlaylistTitles(){
    let parent = document.getElementById("list-title-container")
    while(parent.firstChild){
        parent.removeChild(parent.firstChild)
    }
}