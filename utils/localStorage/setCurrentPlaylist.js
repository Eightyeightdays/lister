import {currentPlaylistNode} from "../../playlist.js"
import setStorage from "./setStorage.js";

export default function setCurrentPlaylist(playlistName){
    currentPlaylistNode.textContent = playlistName;
    setStorage({currentPlaylist: playlistName})
}