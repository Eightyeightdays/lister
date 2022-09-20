var videoNumber = 1;

function listenForClicks() {
    document.addEventListener("click", (e) => {
   
        function createVideoCard(info){
            let playlistPreview = document.getElementById("playlist-preview");

            let card = `
            <div class="video-card" id="playlist-video-${videoNumber}">
                <div class="playlist-video-title">${info.title}</div>
                <img class="playlist-preview-image" src=${info.imgUrl} alt="${info.title}">
                <div class="playlist-video-author">Uploaded by: ${info.author}</div>
            </div>`;

            playlistPreview.insertAdjacentHTML("afterbegin", card); // insert video card

            videoNumber++;  // increment id number
        }

        function addName(tabs) {
            let title = document.getElementById("playlist-name-input").value;
            let element = `<div class="list-title">${title}</div>`;
            browser.tabs.sendMessage(tabs[0].id, {
                command: "add name",
                title: title
            })
            .then(document.getElementById("list-title-container").insertAdjacentHTML("afterbegin", element))
            .then(document.getElementById("playlist-name-input").value = "");   // clear input field
        }

        function addVideo(tabs) {
            console.log("ADD VIDEO CLICKED")
            browser.tabs.sendMessage(tabs[0].id, {
                command: "add video",
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
                })
            .then(response => {
                console.log(response) // empty for now
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
        }else if(e.target.id === ""){

        }

    })
}




function getInitialStorage(){   // runs every time popup is opened
    browser.tabs.query({active: true, currentWindow: true})
    .then(response => browser.tabs.sendMessage(response[0].id, {message: "return localStorage"}))
}

function initialiseUi(data){

}

function createTitlesList(data){
    data.forEach(list => {
        let title = `<div class="list-title">${list.playlistName}</div>`;
        document.getElementById("list-title-container").insertAdjacentHTML("afterbegin", title)
    });
}

browser.runtime.onMessage.addListener(message =>{
    if(message.message === "Storage retrieved"){
        console.log("Storage retrieved, UI BEING REBUILT")
        createTitlesList(JSON.parse(message.storage))
    }else if(message.message === "Storage is empty"){
        console.log("Nothing in storage");
        /// PROMPT USER TO CREATE A LIST
        return;
    }
    
})

browser.runtime.onConnect.addListener(getInitialStorage)

browser.tabs.executeScript({file: "/content_scripts/makePlaylist.js"})
    .then(getInitialStorage)
    .then(console.log("EXECUTED"))
    .then(listenForClicks)
    .catch();

