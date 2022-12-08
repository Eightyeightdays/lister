import getPlaylistLink from "./localStorage/getPlaylistLink.js"

export default async function beginPlaylist(){
    let url = await getPlaylistLink()
    window.open(url, "_blank")
    setTimeout(()=>{
        window.close()
    }, 100)
}