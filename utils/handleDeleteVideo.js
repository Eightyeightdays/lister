import deleteVideo from "./deleteVideo.js"
import { currentPlaylistNode } from "../playlist.js";

export default function handleDeleteVideo(event){
    let id = event.target.dataset.id
    let playlistName = currentPlaylistNode.textContent;
    deleteVideo(id, playlistName)
}