import setStorage from "./setStorage.js"

export default async function addVideoToStorage(details, playlistName){
    details.dateAdded = Date.now()
    let data = await browser.storage.local.get()
    let index = data.playlists.findIndex(list => list.playlistName === playlistName)
    let currentPlaylist = data.playlists[index]
    let currentPlaylistString = currentPlaylist.playlistString
    let newPlaylistString = data.id + currentPlaylistString // newest video first
    
    currentPlaylist.playlistString = newPlaylistString;
    currentPlaylist.length ++;
    currentPlaylist.dateEdited = Date.now();
    currentPlaylist.videos.push(details)  
    
    setStorage({playlists:data.playlists})
    
}