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

        function add(tabs) {
            browser.tabs.sendMessage(tabs[0].id, {
                command: "add",
            })
            .then(response => {
                if(response.message === "video details fetched"){
                    // alert(response.message + " " + response.details.title)
                    createVideoCard(response.details)
                }
            })
        }

        function link(tabs){
            browser.tabs.sendMessage(tabs[0].id, {
                command: "link",
            })
            .then(response => {
                console.log(response) // empty for now
            })
        }

        if (e.target.id === "add-to-playlist") {
            browser.tabs.query({active: true, currentWindow: true})
                .then(add)
        }else if(e.target.id === "create-link"){
            browser.tabs.query({active: true, currentWindow: true})
                .then(link)
        }

    })
}

browser.tabs.executeScript({file: "/content_scripts/makePlaylist.js"})
    .then(listenForClicks)
    .then(console.log("EXTENSION CLICKED"))
    .catch();