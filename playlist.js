let main = document.getElementById("main");
main.style.background = "gold";
main.style.borderRadius = "15px";
main.style.padding = "10px";
document.getElementById("content-text").style.color = "white !important";
document.getElementById("upload-info").style.background = "dodgerblue";

// let menu = document.querySelector("#top-level-buttons-computed");
// menu.style.background = "gold";

let menuContainer = document.getElementById("menu-container")

menuContainer.insertAdjacentHTML("afterbegin", 
    `<div id="playlist-interface">
        <button id="add-to-playlist">Add To Playlist</button>
    </div>`
);

let interface = document.getElementById("playlist-interface");
let addButton = document.getElementById("add-to-playlist");

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

function getVideoId(){
    let currentUrl = window.location.href;
}

function addToPlaylist(){
    

}


