export default async function getPlaylistLength(name){
    browser.storage.local.get().then(data =>{
        let index = data.playlists.findIndex(list => list.playlistName === name)
        let videoArr = data.playlists[index].videos
        let length = videoArr.length
    })
    return length
}