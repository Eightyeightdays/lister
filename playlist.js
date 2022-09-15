let main = document.getElementById("main");
main.style.background = "gold";
main.style.borderRadius = "15px";
main.style.padding = "10px";
/////////////////

let menuContainer = document.getElementById("menu-container")

menuContainer.insertAdjacentHTML("afterbegin", 
    `<div id="playlist-interface">
        <button id="add-to-playlist">Add To Playlist</button>
        <button id="create-link">Create Link</button>
        <a href="" id="playlist-link">Link to your playlist</a>
    </div>`
);

let interface = document.getElementById("playlist-interface");
let addButton = document.getElementById("add-to-playlist");
let playlistLink = document.getElementById("playlist-link");
let createButton = document.getElementById("create-link");
createButton.addEventListener("click", createPlaylist);
addButton.addEventListener("click", addToPlaylist);

Object.assign(interface.style, {
    background: "dodgerblue",
    display: "grid",
    placeItems: "center",
    padding: "1em",
    fontSize: "25px",
});

Object.assign(addButton.style, {
    background: "gold",
    padding: "1em",
    fontSize: "25px",
    cursor: "pointer",
    border: 0,
});

let playlistString = "";
let baseUrl = "https://www.youtube.com/watch_videos?video_ids=";


function addToPlaylist(){
    let currentUrl = window.location.href;
    let start = currentUrl.search(/=/) + 1;
    let end = start + 12;
    let currentId = currentUrl.substring(start, end) + ",";
   
    playlistString += currentId;
    localStorage.setItem("playlistString", playlistString);
    console.log("STRING: " + localStorage.getItem("playlistString"));
}

function createPlaylist(){
    let videoList = localStorage.getItem("playlistString");
    let fullUrl = baseUrl + videoList;
    playlistLink.href = fullUrl;
}


