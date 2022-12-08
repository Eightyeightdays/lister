// import createLink from "./createLinkToPlaylist.js"
import getPlaylistLink from "./localStorage/getPlaylistLink.js"

export default function beginPlaylist(){
    getPlaylistLink()


    // createLink()
    // .then(response => {
    //     window.open(response.url, '_blank')
    // })
    // setTimeout(()=>{
    //     window.close()
    // }, 100)
}