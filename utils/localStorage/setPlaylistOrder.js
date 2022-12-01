import setStorage from "./setStorage.js"

export default function setPlaylistOrder(order){
    let item = {
        playlistOrder: order
    }
    setStorage(item)
}