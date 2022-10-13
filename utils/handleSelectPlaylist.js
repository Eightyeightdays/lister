import selectPlaylistTitle from "./selectPlaylistTitle.js";
import { currentPlaylistNode } from "../playlist.js";

export default function handleSelectPlaylist(event){
    let realTitle = event.target.textContent.trim()    
    selectPlaylistTitle(realTitle)
    currentPlaylistNode.textContent = realTitle;
}