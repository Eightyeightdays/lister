import { playlistPreview } from "../playlist.js";

export default function removeCards(){
    while(playlistPreview.firstChild){
        playlistPreview.removeChild(playlistPreview.firstChild);
    }
}