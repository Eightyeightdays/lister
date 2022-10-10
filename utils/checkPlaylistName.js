export default function checkPlaylistName(name){
    let allNames = []
    document.querySelectorAll(".list-title-card").forEach(list => allNames.push(list.textContent.toUpperCase().trim()))
    if(allNames.includes(name.toUpperCase())){
        console.log("A playlist with that name already exists") 
        return true;
    }else{
        console.log("Playlist name is unique")
        return false;
   }
}