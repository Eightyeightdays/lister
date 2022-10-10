import createLink from "./createLinkToPlaylist.js"

export default function beginPlaylist(){
    createLink()
    .then(response => {
        console.log(response)
        window.open(response.url, '_blank')
    })
    setTimeout(()=>{
        window.close()
    }, 100)
}