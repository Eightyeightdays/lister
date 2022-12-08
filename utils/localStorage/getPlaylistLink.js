import { currentPlaylistNode } from "../../playlist.js"

export default async function getPlaylistLink(){
    const baseUrl = "https://www.youtube.com/watch_videos?video_ids="
    let playlistName = currentPlaylistNode.textContent
    let data = await browser.storage.local.get()
    let index = data.playlists.findIndex(list => list.playlistName === playlistName)
    let fullString = baseUrl + data.playlists[index].playlistString
    let finalUrl = fullString.slice(0, -1);
    
    navigator.clipboard.writeText(finalUrl);
    console.log("Playlist generated and copied to clipboard")

    return finalUrl
}