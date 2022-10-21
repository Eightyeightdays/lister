

export default function exportLocalStorage(){
    browser.tabs.query({active: true, currentWindow: true})
    .then(response => {
        browser.tabs.sendMessage(response[0].id, {
        command: "return localStorage"
        })
        .then(response =>{
            if(response.message === "Storage retrieved"){
                let{storage, order, current} = response; 
                let data = {
                    playlists: storage,
                    currentPlaylist: current,
                    playlistOrder: order
                }
                let json = JSON.stringify(data, null, 4)                
                let textFile = new Blob([json], {type: 'text/plain'});    
                let node = document.createElement("a")
                document.body.appendChild(node)
                node.setAttribute("href", window.URL.createObjectURL(textFile))
                node.setAttribute("download", "YouTube-Playlists.txt")
                node.click()
                document.body.removeChild(node)
            }
        })
    })
    
}