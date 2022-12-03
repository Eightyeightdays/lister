import setStorage from "./setStorage.js"

export default function deletePlaylist(name){  
    browser.storage.local.get()
    .then(data =>{
        let index = data.playlists.findIndex(list => list.playlistName === name)
        data.playlists.splice(index, 1)
        setStorage({playlists: data.playlists})
        console.log(`The ${name} playlist was deleted!`)

        // need to create setCurrentPlaylist function
        if(data.playlists.length < 1){
            // "None Created"
        }else{
           //"None Selected"
        }
    })
}