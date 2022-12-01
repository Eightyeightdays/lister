import removeTags from "./removeTags.js"
import hyphenate from "./hyphenate.js"
import checkPlaylistName from "./checkPlaylistName.js"
import setCurrentPlaylist from "./setCurrentPlaylist.js"
import removeCards from "./removeVideoCards.js"
import sortPlaylists from "./sortPlaylists.js"
import displaySettings from "./displaySettings.js"
import displaySortOrder from "./displaySortOrder.js"
import {currentPlaylistNode, currentPlaylistLength, playlistOrderNode, playlistLengthLabel} from "../playlist.js"

export default function createPlaylist() {
    let title = removeTags(document.getElementById("playlist-name-input").value.trim())
    let hyphenatedTitle = hyphenate(title)

    if(title === ""){
        alert("Playlist must have a name")
        return;
    }
    if(checkPlaylistName(title)){
        document.getElementById("playlist-name-input").value = ""
        alert("A playlist with that name already exists")
        return
    }

    let element = `
        <div class="list-title-card" id=${hyphenatedTitle} datecreated=${Date.now()} dateedited=${Date.now()} favourite=false>
            ${title}
        </div>
    `;

    // TESTING
    let newList = {
        playlistName: title,
        videos: [],
        playlistString: "",
        dateCreated: Date.now(),
        dateEdited: Date.now(),
        lastAccessed: Date.now(),
        viewCount: 0,
        favourite: false,
        length: 0
    }
    let allPlaylists = {
        name: "allPlaylists",
        playlists: [newList]
    }   
           
    function setItem() {
        console.log("STORAGE UPDATED!!!");
    }

    function onError(error) {
        console.log(error)
    }

    browser.storage.local.set(allPlaylists).then(setItem, onError)
    // END TEST

    // browser.tabs.query({active: true, currentWindow: true})
    // .then(response => {
    //     console.log(response)
    //     browser.tabs.sendMessage(response[0].id, {
    //     command: "create playlist",
    //     title: title
    //     })
    // })
    // .then(document.getElementById("list-title-container").insertAdjacentHTML("afterbegin", element))
    // .then(document.getElementById("playlist-name-input").value = ""); 

    setCurrentPlaylist(title)
    removeCards()
    currentPlaylistNode.textContent = title;
    currentPlaylistLength.textContent = 0;
    playlistLengthLabel.textContent = "Videos"
    let order = playlistOrderNode.textContent
    sortPlaylists(order)
    displaySettings("list")
    displaySortOrder()
}