let main = document.getElementById("main");
main.style.background = "gold";
main.style.borderRadius = "15px";
main.style.padding = "10px";
/////////////////
// alert(document.getElementById("menu-container"))

let menuContainer = document.getElementById("top-row");
// if(document.getElementById("menu-container")){
//     menuContainer = document.getElementById("menu-container");
// }else{
//     menuContainer = document.getElementById("menu");
// }

menuContainer.insertAdjacentHTML("afterbegin", 
    `<div id="playlist-ui">
        <button id="add-to-playlist">Add To Playlist</button>
        <button id="create-link">Create Link</button>
        <a href="" id="playlist-link">Link to your playlist</a>
    </div>`
);

let ui = document.getElementById("playlist-ui");
let addButton = document.getElementById("add-to-playlist");
let playlistLink = document.getElementById("playlist-link");
let createButton = document.getElementById("create-link");
let playlistString = "";
let baseUrl = "https://www.youtube.com/watch_videos?video_ids=";

let uiStyle = {
    background: "dodgerblue",
    display: "flex",
    placeItems: "center",
    padding: "1em",
    fontSize: "15px",
}

let buttonStyle = {
    background: "gold",
    padding: "1em",
    fontSize: "15px",
    cursor: "pointer",
    border: 0,
    borderRadius: "10px",
    margin: "1em"
}

Object.assign(ui.style, uiStyle);
Object.assign(addButton.style, buttonStyle);
Object.assign(createButton.style, buttonStyle)

function getJsonFromUrl(url){
    let startUrl = "https://www.youtube.com/oembed?url=";
    let midUrl = window.location.href;
    let endUrl = "&format=json";
    let jsonUrl = startUrl + midUrl + endUrl;
    fetch(jsonUrl)
        .then(response => response.json())
        .then(data =>{
            console.log(data.title)
            console.log(data.author_name)
            console.log(data.thumbnail_url)
        })
}

function addToPlaylist(){
    getJsonFromUrl();
    let currentUrl = window.location.href;
    let start = currentUrl.search(/=/) + 1;
    let end = start + 12;
    let currentId = currentUrl.substring(start, end) + ",";
    playlistString += currentId;
    localStorage.setItem("playlistString", playlistString);
    alert("Video added to playlist");
}

function createPlaylist(){
    let videoList = localStorage.getItem("playlistString");
    let fullUrl = baseUrl + videoList;
    playlistLink.href = fullUrl;
    navigator.clipboard.writeText(fullUrl);
    alert("Playlist generated and copied to clipboard")
}

createButton.addEventListener("click", createPlaylist);
addButton.addEventListener("click", addToPlaylist);

