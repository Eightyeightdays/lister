export default async function getPlaylistLength(name){
    let data = await browser.storage.local.get() 
    let index = data.playlists.findIndex(list => list.playlistName === name)
    let videoArr = data.playlists[index].videos
    let length = videoArr.length
    console.log(length)
    return length
}