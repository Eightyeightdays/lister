export default function importLocalStorage(e){
    e.preventDefault()
    let file = document.getElementById("import-json").files[0]
    const reader = new FileReader();

    reader.onload = () => { 
        let obj = JSON.parse(reader.result)
        browser.tabs.query({active: true, currentWindow: true})
        .then(response => {
            let playlists = JSON.stringify(obj.playlists)
            browser.tabs.sendMessage(response[0].id, {
                command: "update localStorage",
                data: playlists,
                order: obj.playlistOrder,
                current: obj.currentPlaylist
            })
            .then(response => console.log(response.message)) 
            .catch(error => console.log(error))
        })

    };

    reader.readAsText(file);

}