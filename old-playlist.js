let main = document.getElementById("main");
main.style.background = "gold";
main.style.borderRadius = "15px";
main.style.padding = "10px";
/////////////////

// let playlistMaker = `
// <div id="playlist-ui">
//     <button id="add-to-playlist">Add To Playlist</button>
//     <button id="create-link">Create Link</button>
//     <a href="" id="playlist-link">Link to your playlist</a>
//     <div id="playlist-preview-container">
//         <div id="playlist-header">Playlist Title</div>
//         <div id="playlist-preview">
//         </div>
//     </div>
// </div>`

// let menuContainer = document.getElementById("top-row");
// let menuContainer2 = document.getElementById("player");

// menuContainer.insertAdjacentHTML("afterend", playlistMaker);
// menuContainer2.insertAdjacentHTML("afterend", playlistMaker);


let ui = document.getElementById("playlist-ui");
let addButton = document.getElementById("add-to-playlist");
let playlistLink = document.getElementById("playlist-link");
let createButton = document.getElementById("create-link");
let playlistContainer = document.getElementById("playlist-preview-container");
let playlistHeader = document.getElementById("playlist-header");
let playlistPreview = document.getElementById("playlist-preview");
let allVideoImgs = document.getElementsByClassName("playlist-preview-image");


// let uiStyle = {
//     position: "relative",
//     zIndex: "1",
//     background: "dodgerblue",
//     display: "flex",
//     placeItems: "center",
//     width: "100%",
//     padding: "1em",
//     fontSize: "15px",
//     gap: "1em"
// }

// let buttonStyle = {
//     background: "gold",
//     padding: "1em",
//     fontSize: "15px",
//     cursor: "pointer",
//     border: 0,
//     borderRadius: "10px",
//     margin: "1em"
// }

// let playlistContainerStyle = {
//     position: "relative",
//     display: "flex",
//     flexDirection: "column",
//     background: "red",
//     height: "100%",
//     width: "100%"
// }

// let playlistHeaderStyle = {
//     textAlign: "center"
// }

// let playlistPreviewStyle = {
//     background: "gainsboro",
//     width: "300px",
//     height: "100%",
//     display: "flex",
//     overflowX: "scroll",
//     gap: "1em"
// }

let cardStyle = {

}

let videoImgStyle = {
    width: "120px",
    height: "90px"
}

Object.assign(ui.style, uiStyle);
Object.assign(addButton.style, buttonStyle);
Object.assign(createButton.style, buttonStyle);
Object.assign(playlistContainer.style, playlistContainerStyle);
Object.assign(playlistHeader.style, playlistHeaderStyle);
Object.assign(playlistPreview.style, playlistPreviewStyle);



let playlistString = "";
let baseUrl = "https://www.youtube.com/watch_videos?video_ids=";


async function getJsonFromUrl(){
    let startUrl = "https://www.youtube.com/oembed?url=";
    let midUrl = window.location.href;
    let endUrl = "&format=json";
    let jsonUrl = startUrl + midUrl + endUrl;
    let videoDetails = {};
    await fetch(jsonUrl)
        .then(response => response.json())
        .then(data =>{
            videoDetails.title = data.title;        
            videoDetails.author = data.author_name;
            videoDetails.imgUrl = data.thumbnail_url;
            // console.log("1 - DATA OK: " + data.title)
        })
    return videoDetails;
}

async function addToPlaylist(){
    let videoDetails = await getJsonFromUrl();
    // console.log("2 - DETAILS OBJECT OK: " + videoDetails)
    let currentUrl = window.location.href;
    let start = currentUrl.search(/=/) + 1;
    let end = start + 12;
    let currentId = currentUrl.substring(start, end) + ",";
    playlistString += currentId;
    localStorage.setItem("playlistString", playlistString);
    // alert("Video added to playlist");
    await createVideoCard(videoDetails);
   
}

function createPlaylist(){
    let videoList = localStorage.getItem("playlistString");
    let fullUrl = baseUrl + videoList;
    playlistLink.href = fullUrl;
    navigator.clipboard.writeText(fullUrl);
    alert("Playlist generated and copied to clipboard")
}

let videoNumber = 1;
async function createVideoCard(info){
    let card = `
    <div style="background: white; border-radius: 10px; width: 120px" class="video-card">
        <div class="playlist-video-title">${info.title}</div>
        <img id="playlist-video-${videoNumber}" class="playlist-preview-image" src=${info.imgUrl} alt="${info.title}">
        <div class="playlist-video-author">Uploaded by: ${info.author}</div>
    </div>`;

    playlistPreview.insertAdjacentHTML("afterbegin", card); // insert video card
    let node = document.getElementById(`playlist-video-${videoNumber}`) // define node
    Object.assign(node.style, videoImgStyle); // assign styles to node
    videoNumber++;  // increment id number
}


createButton.addEventListener("click", createPlaylist);
addButton.addEventListener("click", addToPlaylist);

