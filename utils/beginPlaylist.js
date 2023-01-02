import getPlaylistLink from "./localStorage/getPlaylistLink.js"

export default async function beginPlaylist(){
    let url = await getPlaylistLink()
    
    if(url){
        browser.tabs.create({
            url: url
        });
        
        setTimeout(()=>{
            window.close()
        }, 100)
    }

}