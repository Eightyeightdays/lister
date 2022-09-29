const currentPlaylistNode = document.getElementById("current-playlist");
const playlistOrderNode = document.getElementById("playlistOrder");
const star = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="star"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>`

function listenForClicks() {
    document.addEventListener("click", (e) => {
        if(document.getElementById("current-playlist").textContent === "None Created" && e.target.id !== "add-playlist-name" && e.target.id !== "playlist-name-input"){
            promptUser()
            return;
        }

        // console.log(e.target)    // VERIFY

        if(e.target.id === "add-playlist-name"){
            browser.tabs.query({active: true, currentWindow: true})
                .then(addName)
        }else if (e.target.id === "add-to-playlist") {
            browser.tabs.query({active: true, currentWindow: true})
                .then(addVideo)
        }else if(e.target.id === "create-link"){
            browser.tabs.query({active: true, currentWindow: true})
                .then(createLink)
        }else if(e.target.classList.contains("list-title-card")){
            console.log(e.target.id)
            let realTitle = e.target.textContent.trim()    // this should display correctly
            console.log(realTitle)
            selectPlaylistTitle(realTitle)
            document.getElementById("current-playlist").textContent = realTitle;
        }else if(e.target.id === "clear-storage"){
            clearLocalStorage()
            removeCards()
            removePlaylistTitles()
            document.getElementById("current-playlist").textContent = "None created"
        }else if(e.target.id === "arrange-list-titles-forwards"){
            sortPlaylists("forwards");
            playlistOrderNode.textContent = "forwards"
        }else if(e.target.id === "arrange-list-titles-backwards"){
            sortPlaylists("backwards");
            playlistOrderNode.textContent = "backwards"
        }else if(e.target.id === "arrange-list-titles-oldest"){
            sortPlaylists("oldest");
            playlistOrderNode.textContent = "oldest"
        }else if(e.target.id === "arrange-list-titles-newest"){
            sortPlaylists("newest");
            playlistOrderNode.textContent = "newest"
        }else if(e.target.id === "arrange-list-titles-edited"){
            sortPlaylists("edited");
            playlistOrderNode.textContent = "edited"
        }else if(e.target.classList.contains("delete-video")){
            let id = e.target.dataset.id
            let playlistName = document.getElementById("current-playlist").textContent;
            deleteVideo(id, playlistName)
        }else if(e.target.id === "delete-current-playlist"){
            let playlistName = document.getElementById("current-playlist").textContent;
            deletePlaylist(playlistName)
        }else if(e.target.id === "begin-playlist"){
            beginPlaylist()
        }else if(e.target.id === "add-favourite"){
            setPlaylistFavourite()
        }else if(e.target.id === "save-changes"){
            updateListOrder()
            hideUpdateButton()
            alert("changes saved")  // UPDATE LATER
        }
    })

    document.addEventListener("mousedown", (e)=>{
        if(e.target.classList.contains("handle")){
            let parent = e.target.closest(".video-card")
            enableDrag(parent.id);
            console.log("MOUSE DOWN")
        }
    })
}


function addName(tabs) {
    let title = document.getElementById("playlist-name-input").value;
    let hyphenatedTitle = hyphenate(title)
    console.log(title)
    if(title === ""){
        alert("Playlist must have a name")
        return;
    }
    if(checkPlaylistName(title)){
        document.getElementById("playlist-name-input").value = ""
        console.log("EXIT")
        return
    }

    let element = `
    <div class="list-title-card" id=${hyphenatedTitle} datecreated=${Date.now()} dateedited=${Date.now()} favourite=false>
        ${title}
    </div>
    `;

    browser.tabs.sendMessage(tabs[0].id, {
        command: "add name",
        title: title
    })
    .then(document.getElementById("list-title-container").insertAdjacentHTML("afterbegin", element))
    .then(document.getElementById("playlist-name-input").value = "");   // clear input field
    setCurrentPlaylist(title)
    removeCards()
    document.getElementById("current-playlist").textContent = title;
    let order = playlistOrderNode.textContent
    sortPlaylists(order)
}

function addVideo(tabs) {
    browser.tabs.sendMessage(tabs[0].id, {  // why doesn't this start with a query?
        command: "add video",
        id: document.getElementById("current-playlist").textContent
    })
    .then(response => {
        console.log(response)
        if(response.message === "video details fetched"){
            createVideoCard(response.details)
            let order = playlistOrderNode.textContent
            console.log(order)
            updateTitleOnEdit(Date.now()) // localStorage is also updated by content script
            sortPlaylists(order) // update in real time
        }
    })
}

function createLink(){
    let something = browser.tabs.query({active: true, currentWindow: true})
    .then(response => browser.tabs.sendMessage(response[0].id, {
        command: "create link",
        id: document.getElementById("current-playlist").textContent
    }))
    .then(response => response)
    .catch(error => console.log(error))
    return something;
}

function beginPlaylist(){
    createLink()
    .then(response => window.open(response.url, '_blank'))
    setTimeout(()=>{
        window.close()
    }, 100)
}

let playlistPreview = document.getElementById("playlist-preview");

function clearLocalStorage(){
    browser.tabs.query({active: true, currentWindow: true})
    .then(response => browser.tabs.sendMessage(response[0].id, {command: "clear localStorage"})) 
    .then(response => console.log(response.message)) 
}

function createVideoCard(video){
    // console.log(video)   // {title, author, imgUrl, id}
    let videoNumber
    let totalCards = document.querySelectorAll(".video-card").length
    if(totalCards === 0){
        videoNumber = 1;
    }else{
        videoNumber = totalCards+1
    }

    let card = `
        <div class="video-card" id="playlist-video-${videoNumber}" data-videoid=${video.id}>
            <div class="image-box">
                <img class="playlist-preview-image" src=${video.imgUrl} alt="${video.title}">
            </div>
            <div class="card-details-box">
                <div class="playlist-video-title">${video.title}</div>
                <div class="playlist-video-author">Uploaded by: ${video.author}</div>
            </div>
            <div class="delete-video" data-id=${video.id}><svg class="delete-video" data-id=${video.id} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path class="delete-video" data-id=${video.id} d="M160 400C160 408.8 152.8 416 144 416C135.2 416 128 408.8 128 400V192C128 183.2 135.2 176 144 176C152.8 176 160 183.2 160 192V400zM240 400C240 408.8 232.8 416 224 416C215.2 416 208 408.8 208 400V192C208 183.2 215.2 176 224 176C232.8 176 240 183.2 240 192V400zM320 400C320 408.8 312.8 416 304 416C295.2 416 288 408.8 288 400V192C288 183.2 295.2 176 304 176C312.8 176 320 183.2 320 192V400zM317.5 24.94L354.2 80H424C437.3 80 448 90.75 448 104C448 117.3 437.3 128 424 128H416V432C416 476.2 380.2 512 336 512H112C67.82 512 32 476.2 32 432V128H24C10.75 128 0 117.3 0 104C0 90.75 10.75 80 24 80H93.82L130.5 24.94C140.9 9.357 158.4 0 177.1 0H270.9C289.6 0 307.1 9.358 317.5 24.94H317.5zM151.5 80H296.5L277.5 51.56C276 49.34 273.5 48 270.9 48H177.1C174.5 48 171.1 49.34 170.5 51.56L151.5 80zM80 432C80 449.7 94.33 464 112 464H336C353.7 464 368 449.7 368 432V128H80V432z"/></svg></div>
            <div class="handle playlist-handle"><div class="handle inner-handle"></div></div>
        </div>`;
        playlistPreview.insertAdjacentHTML("afterbegin", card); // insert video card
        videoNumber++;  // increment id number
}

function selectPlaylistTitle(id){
    console.log(id)
    showSelectedList(id)
    setCurrentPlaylist(id)
}

function setCurrentPlaylist(playlistName){
    document.getElementById("current-playlist").textContent = playlistName;
    browser.tabs.query({active: true, currentWindow: true})
    .then(response => browser.tabs.sendMessage(response[0].id, {command: "set current playlist", playlistName: playlistName})) 
    .then(response => console.log(response))
    .catch(error => console.log(error))
}

function showSelectedList(playlistName){
    browser.tabs.query({active: true, currentWindow: true})
    .then(response => browser.tabs.sendMessage(response[0].id, {command: "return localStorage"})) // get storage
    .then(response=>{
        if(response.storage){
            removeCards();                                  // clear existing display
            response.storage.forEach(list =>{
                if(list["playlistName"] === playlistName){  // find the matching playlist        
                    list.videos.forEach(video => createVideoCard(video))// create cards for every video
                    list.lastAccessed = Date.now(); // log date that the list was accessed
                }   
            }) 
        }
    })
}

function createTitlesList(data, order){
    let title;
    data.forEach(list => {
        let hyphenatedTitle = hyphenate(list.playlistName)
        if(list.favourite === false){
            title = 
            `<div class="list-title-card" id=${hyphenatedTitle} datecreated=${list.dateCreated} dateedited=${list.dateEdited} favourite=false>
                ${list.playlistName}
            </div>`


        }else{
            title = 
            `<div class="list-title-card" id=${hyphenatedTitle} datecreated=${list.dateCreated} dateedited=${list.dateEdited} favourite=true>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="star"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>
                ${list.playlistName}
            </div>`;
        }
       
        document.getElementById("list-title-container").insertAdjacentHTML("afterbegin", title)
    });

    if(order === null){
        console.log("Order was NULL, set to newest")    // not needed anymore
        order = "newest"
    }
    sortPlaylists(order)
}

function removeCards(){
    while(playlistPreview.firstChild){
        playlistPreview.removeChild(playlistPreview.firstChild);
    }
}

function sortPlaylists(order){
    let sortedFavourites;
    let sortedRest;
    let allFavourites = document.querySelectorAll(".list-title-card[favourite='true']")
    let allRest = document.querySelectorAll(".list-title-card[favourite='false']")
    let allTitles = []

    if(order === "forwards"){
        sortedFavourites = Array.from(allFavourites).sort((a,b) => a.id.toUpperCase() > b.id.toUpperCase())
        sortedRest = Array.from(allRest).sort((a,b) => a.id.toUpperCase() > b.id.toUpperCase())
    }else if(order === "backwards"){
        sortedFavourites = Array.from(allFavourites).sort((a,b) => a.id.toUpperCase() < b.id.toUpperCase())
        sortedRest = Array.from(allRest).sort((a,b) => a.id.toUpperCase() < b.id.toUpperCase())
    }else if(order === "newest"){
        sortedFavourites = Array.from(allFavourites).sort((a,b) => a.attributes.datecreated.value < b.attributes.datecreated.value)
        sortedRest = Array.from(allRest).sort((a,b) => a.attributes.datecreated.value < b.attributes.datecreated.value)
    }else if(order === "oldest"){
        sortedFavourites = Array.from(allFavourites).sort((a,b) => a.attributes.datecreated.value > b.attributes.datecreated.value)
        sortedRest = Array.from(allRest).sort((a,b) => a.attributes.datecreated.value > b.attributes.datecreated.value)
    }else if(order === "edited"){
        sortedFavourites = Array.from(allFavourites).sort((a,b) => a.attributes.dateedited.value < b.attributes.dateedited.value)
        sortedRest = Array.from(allRest).sort((a,b) => a.attributes.dateedited.value < b.attributes.dateedited.value)
    }
  
    sortedFavourites.forEach(title => allTitles.push(title))
    sortedRest.forEach(title => allTitles.push(title))

    allTitles.forEach(element =>{
        document.getElementById("list-title-container").appendChild(element)
    })

    setSortState(order);
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
        // update date edited
        updateTitleOnEdit(Date.now())
        tempList.dateEdited = Date.now()
        // remove card from UI
        let node = document.querySelector('[data-id="' +id+ '"]')
        let parent = node.closest(".video-card")
        parent.remove()
        // update list order
        let order = playlistOrderNode.textContent
        sortPlaylists(order)
        // update localStorage  
        updateLocalStorage(allLists)    
    })
}

function getLocalStorage(){     
    let something = browser.tabs.query({active: true, currentWindow: true})
    .then(response => browser.tabs.sendMessage(response[0].id, {command: "return localStorage"})) 
    .then(response => response)
    .catch(error => console.log(error))
    return something;
}

function getCurrentPlaylist(){
    let something = browser.tabs.query({active: true, currentWindow: true})
    .then(response => browser.tabs.sendMessage(response[0].id, {command: "return currentPlaylist"})) 
    .then(response => response)
    .catch(error => console.log(error))
    return something;
}

function hydrateUi(){
    getLocalStorage()
    .then(response => {
        if(response.storage){
            createTitlesList(response.storage, response.order);
        }
        playlistOrderNode.textContent = response.order;
    })
    .then(getCurrentPlaylist)
    .then(response => {
        showSelectedList(response.current)
        document.getElementById("current-playlist").textContent = response.current
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
 
var input = document.getElementById("playlist-name-input");

input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("add-playlist-name").click();
  }
}); 

function checkPlaylistName(name){
    let allNames = []
    document.querySelectorAll(".list-title").forEach(list => allNames.push(list.textContent.toUpperCase()))

    if(allNames.includes(name.toUpperCase())){
        alert("A playlist with that name already exists") // create UI notification
        return true;
    }else{
        console.log("Playlist name is unique")
        return false;
   }
}

function setSortState(order){
    browser.tabs.query({active: true, currentWindow: true})
    .then(response => browser.tabs.sendMessage(response[0].id, {command: "set sorting order", order: order})) 
    // .then(response => console.log(response))
    .catch(error => console.log(error))
}

function promptUser(){
    alert("create or select a playlist to begin")   // IMPROVE LATER
}

function setPlaylistFavourite(){
    let playlist = document.getElementById("current-playlist").textContent
    let hyphenatedPlaylist = hyphenate(document.getElementById("current-playlist").textContent)
    browser.tabs.query({active: true, currentWindow: true})
    .then(response => browser.tabs.sendMessage(response[0].id, {command: "favourite", list: playlist})) 
    .then(response => console.log(response))
    .catch(error => console.log(error))

    let container = document.getElementById(hyphenatedPlaylist)
   
    if(container.querySelector(".star")){
        container.setAttribute("favourite", false)
        container.querySelector(".star").remove()
    }else{
        container.setAttribute("favourite", true)
        container.insertAdjacentHTML("afterbegin", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="star" ><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>`)
    }

    let order = playlistOrderNode.textContent
    sortPlaylists(order)
}

function updateTitleOnEdit(date){
    let currentPlaylist = hyphenate(document.getElementById("current-playlist").textContent)
    let title = document.getElementById(currentPlaylist)
    title.setAttribute("dateedited", date)
}

function enableDrag(id){
    let card = document.getElementById(id)
    card.setAttribute("draggable", true)
    card.classList.add("draggable")   
    let allCards = document.querySelectorAll(".video-card")
    allCards.forEach(card => {
        card.addEventListener("dragstart", dragStart)
        card.addEventListener('dragenter', dragEnter)
        card.addEventListener('dragover', dragOver);
        card.addEventListener('dragleave', dragLeave);
        card.addEventListener('drop', drop);
    })
}

let checkOrderString = "";
function getTemporaryOrder(){
    let cardList = document.querySelectorAll(".video-card")
    cardList.forEach(card => {
        checkOrderString += card.dataset.videoid    // for detecting playlist order changes
    })
}

function dragStart(event){
    // only create a new string on open or after save
    if(checkOrderString === ""){
        getTemporaryOrder()
    }
    // give all cards temporary ids according to their index whenever drag begins
    let cardList = document.querySelectorAll(".video-card")
    let count = 1;
    cardList.forEach(card => {
        card.setAttribute("data-id", count)
        count++
    })
   
    if(event.target.classList.contains("video-card")){
        event.dataTransfer.setData("text/plain", event.target.dataset.id);
    }else{
        return; // get parent item id here so we set the correct data regardless
    }

    setTimeout(()=>{
        event.target.classList.add("drag-start")
    },0)

    console.log("DRAG START:")
    console.log(checkOrderString)
    console.log("------")
}

function dragEnter(event){
    event.preventDefault()   
    if(event.target.classList.contains("video-card")){
        event.target.classList.add("drag-over")
    }else{
        event.target.closest(".video-card").classList.add("drag-over")
    }
}

function dragOver(event){
    event.preventDefault()
    if(event.target.classList.contains("video-card")){
        event.target.classList.add("drag-over")
    }else{
        event.target.closest(".video-card").classList.add("drag-over")
    }
}

function dragLeave(event){
    if(event.target.classList.contains("video-card")){
        event.target.classList.remove("drag-over")
    }else{
        event.target.closest(".video-card").classList.remove("drag-over")
    }
}

function drop(event){
    event.preventDefault()
    if(event.target.classList.contains("video-card")){
        event.target.classList.remove("drag-over")
    }else{
        event.target.closest(".video-card").classList.remove("drag-over")
    }
    let dropId;
    if(event.target.classList.contains("video-card")){
        dropId = event.target.dataset.id
        console.log(dropId)
    }else{
        dropId = event.target.closest(".video-card").dataset.id
        console.log(dropId)
    }
    
    let container = document.getElementById("playlist-preview")
    let dragId = event.dataTransfer.getData("text/plain") // id of dragged item
    let card = document.querySelector('[data-id="' +dragId+ '"]')   // dragged item
    card.classList.remove("drag-start")
    container.insertBefore(card, container.children[dropId])    // drop item below selected
    
    let change = detectPlaylistOrderChange()
    if(change){
        showUpdateButton()
    }else{
        hideUpdateButton()
    }
}


function detectPlaylistOrderChange(){
    let testString = "";
    let cardList = document.querySelectorAll(".video-card")
    cardList.forEach(card => {
        testString += card.dataset.videoid;
    })
    console.log("DETECTING:")
    console.log(checkOrderString)
    console.log(testString)
    console.log("-----")
    if(checkOrderString === testString){
        testString = "";
        return false
    }else{
        testString = "";
        return true
    }
}

function updateListOrder(){
    testString = "";    
    checkOrderString = "";  // only clear strings on save
    // reset indexes on newly sorted list
    let currentPlaylist = currentPlaylistNode.textContent
    let cardList = document.querySelectorAll(".video-card")
    let newList = []
    let newString = "";
    let tempArray = [];

    cardList.forEach(item =>{
        newList.push(item.dataset.videoid)
        newString += item.dataset.videoid
    })
    console.log(newString)

    getLocalStorage()
    .then(response =>{
        let index = response.storage.findIndex(list => list.playlistName === currentPlaylist)
        let allLists = [].concat(response.storage)
        let originalList = allLists[index].videos
        
        newList.forEach(id =>{
            originalList.forEach((idx, index) =>{
                if(id === idx.id){
                    tempArray.unshift(originalList[index])
                }
            })
        })

        allLists[index].videos = tempArray  // update video array 
        allLists[index].playlistString = newString  // update playlist url
        updateLocalStorage(response.storage)
    
    })
    .catch(error => console.log(error))
}

function updateLocalStorage(data){
    browser.tabs.query({active: true, currentWindow: true})
        .then(response => browser.tabs.sendMessage(response[0].id, 
            {
                command: "update localStorage",
                data: JSON.stringify(data)
            }
        )) 
        .then(response => console.log(response.message)) 
        .catch(error => console.log(error))
}

function showUpdateButton(){
    document.getElementById("save-changes").style.display = "block"
}

function hideUpdateButton(){
    document.getElementById("save-changes").style.display = "none"
}

function hyphenate(title){
    let regex = /\s/g;
    return title.replace(regex, "-")
}

browser.tabs.executeScript({file: "/content_scripts/makePlaylist.js"})
    .then(hydrateUi)
    .then(listenForClicks)
    .catch();

