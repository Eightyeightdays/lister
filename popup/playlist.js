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
            removeCards()
            removePlaylistTitles()
            document.getElementById("current-playlist").textContent = "None created"
        }else if(e.target.id === "arrange-list-titles-forwards"){
            sortPlaylists("forwards");
        }else if(e.target.id === "arrange-list-titles-backwards"){
            sortPlaylists("backwards");
        }else if(e.target.id === "arrange-list-titles-oldest"){
            sortPlaylists("oldest");
        }else if(e.target.id === "arrange-list-titles-newest"){
            sortPlaylists("newest");
        }else if(e.target.classList.contains("delete-video")){
            let id = e.target.id;
            let playlistName = document.getElementById("current-playlist").textContent;
            deleteVideo(id, playlistName)
        }else if(e.target.id === "test"){
            test()
        }else if(e.target.id === "delete-current-playlist"){
            let playlistName = document.getElementById("current-playlist").textContent;
            deletePlaylist(playlistName)
        }

    })
}

let playlistPreview = document.getElementById("playlist-preview");

let globalStorage;

function clearLocalStorage(){
    browser.tabs.query({active: true, currentWindow: true})
    .then(response => browser.tabs.sendMessage(response[0].id, {command: "clear localStorage"})) 
    .then(response => console.log(response.message)) 
}

function createVideoCard(video){
    // console.log(video)   // {title, author, imgUrl, id}
   
    let card = `
        <div class="video-card" id="playlist-video-${videoNumber}">
            <div class="playlist-video-title">${video.title}</div>
            <img class="playlist-preview-image" src=${video.imgUrl} alt="${video.title}">
            <div class="playlist-video-author">Uploaded by: ${video.author}</div>
            <div class="delete-video" id=${video.id}>DELETE VIDEO</div>
        </div>`;
        playlistPreview.insertAdjacentHTML("afterbegin", card); // insert video card
        videoNumber++;  // increment id number
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
                list.lastAccessed = Date.now(); // log date that the list was accessed
                console.log("CREATED")
            }   
        }) 
    })
}

function createTitlesList(data){
    // console.log(`DATA PASSED TO createTitlesList: ${data}`)
    data.forEach(list => {
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

function showRecentPlaylist(data){
    let max = Math.max(...data.map(list => list.dateEdited))
    let index = data.findIndex(list => list.dateEdited === max)
    let mostRecentlyEditedPlaylist = data[index];
    mostRecentlyEditedPlaylist.videos.forEach(video => createVideoCard(video))
    document.getElementById("current-playlist").textContent = mostRecentlyEditedPlaylist.playlistName;
}

function removePlaylistTitles(){
    let parent = document.getElementById("list-title-container")
    while(parent.firstChild){
        parent.removeChild(parent.firstChild)
    }
}

function deleteVideo(id, name){
    getLocalStorage()
    .then(response =>{
        // remove video
        let allLists = [].concat(response.storage)  // need to make sure that copies are made by VALUE not REFERENCE
        let listIndex = allLists.findIndex(list => list.playlistName === name)
        let tempList = allLists[listIndex]
        let videoIndex = tempList.videos.findIndex(video => video.id === id)
        tempList.videos.splice(videoIndex, 1)
        // update playlistString
        let oldString = tempList.playlistString
        let stringIndex = oldString.indexOf(id)
        let start = oldString.substring(0, stringIndex)
        let end = oldString.substring(stringIndex+12)
        let newString = start + end
        tempList.playlistString = newString;
        // remove card from UI
        let node = document.getElementById(id)
        let parent = node.closest(".video-card")
        parent.remove()
        // update localStorage
        browser.tabs.query({active: true, currentWindow: true})
        .then(response => browser.tabs.sendMessage(response[0].id, 
            {
                command: "update localStorage",
                data: JSON.stringify(allLists)
            }
        )) 
        .then(response => console.log(response.message)) 
    })
}

function getLocalStorage(){     
    var something = browser.tabs.query({active: true, currentWindow: true})
    .then(response => browser.tabs.sendMessage(response[0].id, {command: "return localStorage"})) 
    .then(response => response)
    .catch(error => console.log(error))
    return something;
}

function hydrateUi(){
    getLocalStorage()
    .then(response => {
        createTitlesList(response.storage);
        showRecentPlaylist(response.storage);
    })
    .catch(error => console.log(error))
}

function deletePlaylist(name){
    removeCards()   // clear playlist preview
    document.getElementById(name).remove()  // remove list title
    document.getElementById("current-playlist").textContent = "None Selected"   // remove current
    browser.tabs.query({active: true, currentWindow: true})
    .then(response => browser.tabs.sendMessage(response[0].id, {command: "delete playlist", name: name})) 
}

browser.tabs.executeScript({file: "/content_scripts/makePlaylist.js"})
    .then(hydrateUi)
    .then(listenForClicks)
    .catch();

