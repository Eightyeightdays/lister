export default function getCurrentPlaylist(){
        let playlist = browser.tabs.query({active: true, currentWindow: true})
        .then(response => browser.tabs.sendMessage(response[0].id, {command: "return currentPlaylist"})) 
        .then(response => response)
        .catch(error => console.log(error))
        return playlist;
    }