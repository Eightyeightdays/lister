import {currentPlaylistNode} from "../playlist.js"

export default function createLink(){
    let link = browser.tabs.query({active: true, currentWindow: true})
    .then(response => browser.tabs.sendMessage(response[0].id, {
        command: "create link",
        id: currentPlaylistNode.textContent
    }))
    .then(response => response)
    .catch(error => console.log(error))
    return link;
}