import showSelectedList from "./showSelectedList.js"
import setCurrentPlaylist from "./localStorage/setCurrentPlaylist.js"

export default function selectPlaylistTitle(id){
    showSelectedList(id)
    setCurrentPlaylist(id)
}