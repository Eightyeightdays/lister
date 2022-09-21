var videoNumber = 1;

function listenForClicks() {
    document.addEventListener("click", (e) => {

        function addName(tabs) {
            let title = document.getElementById("playlist-name-input").value;
            let element = `<div class="list-title" id=${title} datecreated=${Date.now()}>${title}</div>`;
            browser.tabs.sendMessage(tabs[0].id, {
                command: "add name",
                title: title
            })
            .then(document.getElementById("list-title-container").insertAdjacentHTML("afterbegin", element))
            .then(document.getElementById("playlist-name-input").value = "");   // clear input field
        }

        function addVideo(tabs) {
            console.log("ADD VIDEO CLICKED")
            let id = document.getElementById("current-playlist").textContent
            browser.tabs.sendMessage(tabs[0].id, {
                command: "add video",
                id: id
            })
            .then(response => {
                console.log(response)
                if(response.message === "video details fetched"){
                    createVideoCard(response.details)
                }
            })
        }

        function createLink(tabs){
            browser.tabs.sendMessage(tabs[0].id, {
                command: "create link",
                id: document.getElementById("current-playlist").textContent
            })
            .then(response => {
                console.log(response.url) // link to playlist
                document.getElementById("playlist-link").href = response.url;
            })
        }
    
        if(e.target.id === "add-playlist-name"){
            browser.tabs.query({active: true, currentWindow: true})
                .then(addName)
        }else if (e.target.id === "add-to-playlist") {
            browser.tabs.query({active: true, currentWindow: true})
                .then(addVideo)
        }else if(e.target.id === "create-link"){
            browser.tabs.query({active: true, currentWindow: true})
                .then(createLink)
        }else if(e.target.classList.contains("list-title")){
            selectPlaylistTitle(e.target.id)
            document.getElementById("current-playlist").textContent = e.target.id;
        }else if(e.target.id === "clear-storage"){
            clearLocalStorage()
        }else if(e.target.id === "arrange-list-titles-forwards"){
            sortPlaylists("forwards");
        }else if(e.target.id === "arrange-list-titles-backwards"){
            sortPlaylists("backwards");
        }else if(e.target.id === "arrange-list-titles-oldest"){
            sortPlaylists("oldest");
        }else if(e.target.id === "arrange-list-titles-newest"){
            sortPlaylists("newest");
        }

    })
}

let playlistPreview = document.getElementById("playlist-preview");


function clearLocalStorage(){
    browser.tabs.query({active: true, currentWindow: true})
    .then(response => browser.tabs.sendMessage(response[0].id, {command: "clear localStorage"})) 
    .then(response => console.log(response.message)) 
}

function createVideoCard(video){
    console.log(video)   // {title, author, imgUrl}
   
    let card = `
        <div class="video-card" id="playlist-video-${videoNumber}">
            <div class="playlist-video-title">${video.title}</div>
            <img class="playlist-preview-image" src=${video.imgUrl} alt="${video.title}">
            <div class="playlist-video-author">Uploaded by: ${video.author}</div>
        </div>`;
        playlistPreview.insertAdjacentHTML("afterbegin", card); // insert video card
        videoNumber++;  // increment id number
}

function getLocalStorage(){   // runs every time popup is opened    
    browser.tabs.query({active: true, currentWindow: true})
    .then(response => browser.tabs.sendMessage(response[0].id, {command: "return localStorage"})) 
    .then(response => createTitlesList(response.storage)) 
}

function selectPlaylistTitle(id){
    let playlistName = document.getElementById(id).textContent;
    getSelectedTitleData(playlistName)
}

function getSelectedTitleData(playlistName){
    browser.tabs.query({active: true, currentWindow: true})
    .then(response => browser.tabs.sendMessage(response[0].id, {command: "return localStorage"})) // get storage
    .then(response=>{
        removeCards();                                  // clear existing display
        response.storage.forEach(list =>{
            if(list["playlistName"] === playlistName){  // find the matching playlist        
                list.videos.forEach(video => createVideoCard(video))// create cards for every video
                console.log("CREATED")
            }   
        }) 
    })
}

function createTitlesList(data){
    console.log(`DATA PASSED TO createTitlesList: ${data}`)
    data.forEach(list => {
        // console.log(list)
        let title = `<div class="list-title" datecreated=${list.dateCreated} id=${list.playlistName}>${list.playlistName}</div>`;
        document.getElementById("list-title-container").insertAdjacentHTML("afterbegin", title)
    });
}

function removeCards(){
    while(playlistPreview.firstChild){
        playlistPreview.removeChild(playlistPreview.firstChild);
    }
}

function sortPlaylists(order){
    let sortedArray;
    let allTitles = document.querySelectorAll(".list-title");
    if(order === "forwards"){
        sortedArray = Array.from(allTitles).sort((a,b) => a.id.toUpperCase() > b.id.toUpperCase())
    }else if(order === "backwards"){
        sortedArray = Array.from(allTitles).sort((a,b) => a.id.toUpperCase() < b.id.toUpperCase())
    }else if(order === "newest"){
        sortedArray = Array.from(allTitles).sort((a,b) => a.attributes.datecreated.value < b.attributes.datecreated.value)
    }else if(order === "oldest"){
        sortedArray = Array.from(allTitles).sort((a,b) => a.attributes.datecreated.value > b.attributes.datecreated.value)
    }
    sortedArray.forEach(element =>{
        document.getElementById("list-title-container").appendChild(element)
    })
}

browser.tabs.executeScript({file: "/content_scripts/makePlaylist.js"})
    .then(getLocalStorage)
    .then(listenForClicks)
    .catch();