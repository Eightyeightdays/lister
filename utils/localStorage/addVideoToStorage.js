import setStorage from "./setStorage.js"

export default function addVideoToStorage(details, playlistName){
    details.dateAdded = Date.now()
    browser.storage.local.get()
    .then(data =>{
        let index = data.playlists.findIndex(list => list.playlistName === playlistName)
        let currentPlaylist = data.playlists[index]
        let currentPlaylistString = currentPlaylist.playlistString
        let newPlaylistString = data.id + currentPlaylistString // newest video first
        
        currentPlaylist.playlistString = newPlaylistString;
        currentPlaylist.length ++;
        currentPlaylist.dateEdited = Date.now();
        currentPlaylist.videos.push(details)  
        
        setStorage({playlists:data.playlists})

        // console.log(currentPlaylist.videos)
        // console.log(currentPlaylist)
        // console.log(data)
    })

}