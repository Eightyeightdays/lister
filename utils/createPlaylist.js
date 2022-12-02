import {currentPlaylistNode, currentPlaylistLength, playlistOrderNode, playlistLengthLabel} from "../playlist.js"
import removeTags from "./removeTags.js"
import hyphenate from "./hyphenate.js"
import checkPlaylistName from "./checkPlaylistName.js"
import setCurrentPlaylist from "./setCurrentPlaylist.js"
import removeCards from "./removeVideoCards.js"
import sortPlaylists from "./sortPlaylists.js"
import displaySettings from "./displaySettings.js"
import displaySortOrder from "./displaySortOrder.js"
import setStorage from "./localStorage/setStorage.js"
import setPlaylistOrder from "./localStorage/setPlaylistOrder.js"

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
        favourite: false,
        length: 0
    }

    // gets and sets storage - could be abstracted
    browser.storage.local.get()
    .then(data =>{
        console.log(data)
        if(!data.playlists){
            console.log("No playlists were in storage")
            setStorage({playlists: [newList]});
            setPlaylistOrder("newest");
        }else{
            data.playlists.push(newList)
            setStorage({playlists: [...data.playlists]})
        }
    })
    .catch(err => console.log(err))

    document.getElementById("list-title-container").insertAdjacentHTML("afterbegin", element)
    document.getElementById("playlist-name-input").value = ""
    // END TEST

    // if(!localStorage.getItem("allPlaylists")){                              
    //     localStorage.setItem("allPlaylists", JSON.stringify([newList]))    
    //     localStorage.setItem("playlistOrder", "newest")                   
    // }else{
    //     let tempStorage = JSON.parse(localStorage.getItem("allPlaylists")) 
    //     tempStorage.push(newList);                                          
    //     localStorage.setItem("allPlaylists", JSON.stringify(tempStorage))   
    // }
    // setStorage(allPlaylists)
    // getStorage(allPlaylists)
    
    // document.getElementById("list-title-container").insertAdjacentHTML("afterbegin", element)
    // document.getElementById("playlist-name-input").value = ""
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