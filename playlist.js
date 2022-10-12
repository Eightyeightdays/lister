export const currentPlaylistNode = document.getElementById("current-playlist");
export const playlistOrderNode = document.getElementById("playlistOrder");
export const currentPlaylistLength = document.getElementById("playlist-length-container")
export const playlistPreview = document.getElementById("playlist-preview");
export let checkOrderString = "";

import hydrateUi from "./utils/hydrateUi.js"
import listenForClicks from "./utils/listenForClicks.js";
import handleEnterKeyPress from "./utils/handleEnterKeyPress.js"
const input = document.getElementById("playlist-name-input");
input.addEventListener("keypress", handleEnterKeyPress);    // CHECK that this doesn't need an arrow function

browser.tabs.executeScript({file: "/content_scripts/makePlaylist.js"})
    .then(hydrateUi)
    .then(listenForClicks)
    .catch();




// function listenForClicks() {
//     document.addEventListener("click", (e) => {
//         // console.log(e.target)    // VERIFY

//         if(e.target.id === "add-playlist-name"){
//             browser.tabs.query({active: true, currentWindow: true})
//                 .then(addName)
//         }else if (e.target.classList.contains("add-video")) {
//             if(currentPlaylistLength.textContent === 50){
//                 alert("A playlist can only contain 50 videos maximum")
//                 return;
//             }else{
//                browser.tabs.query({active: true, currentWindow: true})
//                 .then(addVideo) 
//             }
//         }else if(e.target.classList.contains("create-link")){
//             browser.tabs.query({active: true, currentWindow: true})
//                 .then(createLink)
//         }else if(e.target.classList.contains("list-title-card")){
//             let realTitle = e.target.textContent.trim()    
//             selectPlaylistTitle(realTitle)
//             currentPlaylistNode.textContent = realTitle;
//         }else if(e.target.id === "clear-storage"){
//             clearLocalStorage()
//             removeCards()
//             removePlaylistTitles()
//             currentPlaylistNode.textContent = "None Created"
//             displaySettings("create")
//         }else if(e.target.id === "arrange-list-titles-forwards"){
//             sortPlaylists("forwards");
//             playlistOrderNode.textContent = "forwards"
//             displaySettings("list")
//             displaySortOrder()
//         }else if(e.target.id === "arrange-list-titles-backwards"){
//             sortPlaylists("backwards");
//             playlistOrderNode.textContent = "backwards"
//             displaySettings("list")
//             displaySortOrder()
//         }else if(e.target.id === "arrange-list-titles-oldest"){
//             sortPlaylists("oldest");
//             playlistOrderNode.textContent = "oldest"
//             displaySettings("list")
//             displaySortOrder()
//         }else if(e.target.id === "arrange-list-titles-newest"){
//             sortPlaylists("newest");
//             playlistOrderNode.textContent = "newest"
//             displaySettings("list")
//             displaySortOrder()
//         }else if(e.target.id === "arrange-list-titles-edited"){
//             sortPlaylists("edited");
//             playlistOrderNode.textContent = "edited"
//             displaySettings("list")
//             displaySortOrder()
//         }else if(e.target.classList.contains("delete-video")){
//             let id = e.target.dataset.id
//             let playlistName = currentPlaylistNode.textContent;
//             deleteVideo(id, playlistName)
//         }else if(e.target.classList.contains("delete-current-playlist")){
//             let playlistName = currentPlaylistNode.textContent;
//             deletePlaylist(playlistName)    
//             document.getElementById("show-more-settings").style.display = "none"
//             let container = document.getElementById("list-title-container")
//             if(container.children.length < 1){
//                 currentPlaylistNode.textContent = "None Created"
//                 displaySettings("create")
//             }else{
//                 displaySettings("list")
//                 displaySortOrder()
//             }
//         }else if(e.target.classList.contains("start-playlist")){
//             beginPlaylist()
//         }else if(e.target.classList.contains("add-favourite")){
//             setPlaylistFavourite()
//         }else if(e.target.classList.contains("save-changes")){
//             updateListOrder()
//             alert("changes saved")  // UPDATE LATER
//         }else if(e.target.classList.contains("card")){
//             setTimeout(()=>{
//                 window.close()
//             }, 100)
//         }else if(e.target.classList.contains("settings-item")){
//             if(e.target.dataset.id === "list"){
//                 displaySortOrder()
//             }
//             displaySettings(e.target.dataset.id)
//         }else if(e.target.classList.contains("open-button")){
//             let box = document.getElementById("show-more-settings");
//             if(box.style.display === "flex"){
//                 box.style.display = "none"
//             }else{
//                 box.style.display = "flex";
//                 setTimeout(()=>{
//                     box.style.display = "none"
//                 }, 3000)
//             }
//         }
//     })

//     document.addEventListener("mousedown", (e)=>{
//         if(e.target.classList.contains("handle")){
//             let parent = e.target.closest(".video-card")
//             enableDrag(parent.id);
//             console.log("MOUSE DOWN")
//         }
//     })
// }

// function addName(tabs) {
//     let title = removeTags(document.getElementById("playlist-name-input").value.trim())
//     let hyphenatedTitle = hyphenate(title)

//     if(title === ""){
//         alert("Playlist must have a name")
//         return;
//     }
//     if(checkPlaylistName(title)){
//         document.getElementById("playlist-name-input").value = ""
//         alert("A playlist with that name already exists")
//         return
//     }

//     let element = `
//     <div class="list-title-card" id=${hyphenatedTitle} datecreated=${Date.now()} dateedited=${Date.now()} favourite=false>
//         ${title}
//     </div>
//     `;

//     browser.tabs.sendMessage(tabs[0].id, {
//         command: "add name",
//         title: title
//     })
//     .then(document.getElementById("list-title-container").insertAdjacentHTML("afterbegin", element))
//     .then(document.getElementById("playlist-name-input").value = "");   
//     setCurrentPlaylist(title)
//     removeCards()
//     currentPlaylistNode.textContent = title;
//     currentPlaylistLength.textContent = 0;
//     let order = playlistOrderNode.textContent
//     sortPlaylists(order)
//     displaySettings("list")
//     displaySortOrder()
// }

// function addVideo(tabs) {
//     browser.tabs.sendMessage(tabs[0].id, {  // why doesn't this start with a query?
//         command: "add video",
//         id: currentPlaylistNode.textContent
//     })
//     .then(response => {
//         console.log(response)
//         if(response.message === "video details fetched"){
//             createVideoCard(response.details)
//             let order = playlistOrderNode.textContent
//             updatePlaylistEditDate(Date.now()) // localStorage is also updated by content script
//             sortPlaylists(order) 
//             currentPlaylistLength.textContent ++ 
//         }
//     })
// }

// function createLink(){
//     let link = browser.tabs.query({active: true, currentWindow: true})
//     .then(response => browser.tabs.sendMessage(response[0].id, {
//         command: "create link",
//         id: currentPlaylistNode.textContent
//     }))
//     .then(response => response)
//     .catch(error => console.log(error))
//     return link;
// }

// function beginPlaylist(){
//     createLink()
//     .then(response => {
//         console.log(response)
//         window.open(response.url, '_blank')
//     })
//     setTimeout(()=>{
//         window.close()
//     }, 100)
// }

// function clearLocalStorage(){
//     browser.tabs.query({active: true, currentWindow: true})
//     .then(response => browser.tabs.sendMessage(response[0].id, {command: "clear localStorage"})) 
//     .then(response => console.log(response.message)) 
// }

// function createVideoCard(video){    //  {title, author, imgUrl, id}
//     let videoNumber
//     let totalCards = document.querySelectorAll(".video-card").length
//     if(totalCards === 0){
//         videoNumber = 1;
//     }else{
//         videoNumber = totalCards+1
//     }

//     let card = `
//         <div class="video-card card" id="playlist-video-${videoNumber}" data-videoid=${video.id}>
//             <a href=${video.videoUrl} class="card-link card">
//                 <div class="image-box card">
//                     <img class="playlist-preview-image card" src=${video.imgUrl} alt="${video.title}">
//                 </div>
//                 <div class="card-details-box card">
//                     <div class="playlist-video-title card">${video.title}</div>
//                     <div class="playlist-video-author card">Uploaded by: ${video.author}</div>
//                 </div>
//             </a>
//             <div class="delete-video" data-id=${video.id}><svg class="delete-video" data-id=${video.id} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path class="delete-video" data-id=${video.id} d="M160 400C160 408.8 152.8 416 144 416C135.2 416 128 408.8 128 400V192C128 183.2 135.2 176 144 176C152.8 176 160 183.2 160 192V400zM240 400C240 408.8 232.8 416 224 416C215.2 416 208 408.8 208 400V192C208 183.2 215.2 176 224 176C232.8 176 240 183.2 240 192V400zM320 400C320 408.8 312.8 416 304 416C295.2 416 288 408.8 288 400V192C288 183.2 295.2 176 304 176C312.8 176 320 183.2 320 192V400zM317.5 24.94L354.2 80H424C437.3 80 448 90.75 448 104C448 117.3 437.3 128 424 128H416V432C416 476.2 380.2 512 336 512H112C67.82 512 32 476.2 32 432V128H24C10.75 128 0 117.3 0 104C0 90.75 10.75 80 24 80H93.82L130.5 24.94C140.9 9.357 158.4 0 177.1 0H270.9C289.6 0 307.1 9.358 317.5 24.94H317.5zM151.5 80H296.5L277.5 51.56C276 49.34 273.5 48 270.9 48H177.1C174.5 48 171.1 49.34 170.5 51.56L151.5 80zM80 432C80 449.7 94.33 464 112 464H336C353.7 464 368 449.7 368 432V128H80V432z"/></svg></div>
//             <div class="handle playlist-handle"><div class="handle inner-handle"></div></div>
//         </div>`;
//         playlistPreview.insertAdjacentHTML("afterbegin", card); // insert video card
//         videoNumber++;  // Don't think i'm referencing these ids anywhere // CHECK
// }

// function selectPlaylistTitle(id){
//     showSelectedList(id)
//     setCurrentPlaylist(id)
// }

// function setCurrentPlaylist(playlistName){
//     currentPlaylistNode.textContent = playlistName;
//     browser.tabs.query({active: true, currentWindow: true})
//     .then(response => browser.tabs.sendMessage(response[0].id, {command: "set current playlist", playlistName: playlistName})) 
//     .then(response => console.log(response))
//     .catch(error => console.log(error))
// }

// function showSelectedList(playlistName){
//     browser.tabs.query({active: true, currentWindow: true})
//     .then(response => browser.tabs.sendMessage(response[0].id, {command: "return localStorage"})) 
//     .then(response=>{
//         if(response.storage){
//             removeCards();                                 
//             response.storage.forEach(list =>{
//                 if(list["playlistName"] === playlistName){         
//                     list.videos.forEach(video => createVideoCard(video))
//                     list.lastAccessed = Date.now(); 
//                 }   
//             }) 
//         }
//     })
// }

// function createTitlesList(data, order){
//     let title;
//     data.forEach(list => {
//         let hyphenatedTitle = hyphenate(list.playlistName)
//         if(list.favourite === false){
//             title = 
//             `<div class="list-title-card" id=${hyphenatedTitle} datecreated=${list.dateCreated} dateedited=${list.dateEdited} favourite=false>
//                 ${list.playlistName}
//             </div>`
//         }else{
//             title = 
//             `<div class="list-title-card" id=${hyphenatedTitle} datecreated=${list.dateCreated} dateedited=${list.dateEdited} favourite=true>
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="star"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>
//                 ${list.playlistName}
//             </div>`;
//         }
//         document.getElementById("list-title-container").insertAdjacentHTML("afterbegin", title)
//     });
//     sortPlaylists(order)
// }

// function removeCards(){
//     while(playlistPreview.firstChild){
//         playlistPreview.removeChild(playlistPreview.firstChild);
//     }
// }

// function sortPlaylists(order){
//     let sortedFavourites;
//     let sortedRest;
//     let allFavourites = document.querySelectorAll(".list-title-card[favourite='true']")
//     let allRest = document.querySelectorAll(".list-title-card[favourite='false']")
//     let allTitles = []

//     if(order === "forwards"){
//         sortedFavourites = Array.from(allFavourites).sort((a,b) => a.id.toUpperCase() > b.id.toUpperCase())
//         sortedRest = Array.from(allRest).sort((a,b) => a.id.toUpperCase() > b.id.toUpperCase())
//     }else if(order === "backwards"){
//         sortedFavourites = Array.from(allFavourites).sort((a,b) => a.id.toUpperCase() < b.id.toUpperCase())
//         sortedRest = Array.from(allRest).sort((a,b) => a.id.toUpperCase() < b.id.toUpperCase())
//     }else if(order === "newest"){
//         sortedFavourites = Array.from(allFavourites).sort((a,b) => a.attributes.datecreated.value < b.attributes.datecreated.value)
//         sortedRest = Array.from(allRest).sort((a,b) => a.attributes.datecreated.value < b.attributes.datecreated.value)
//     }else if(order === "oldest"){
//         sortedFavourites = Array.from(allFavourites).sort((a,b) => a.attributes.datecreated.value > b.attributes.datecreated.value)
//         sortedRest = Array.from(allRest).sort((a,b) => a.attributes.datecreated.value > b.attributes.datecreated.value)
//     }else if(order === "edited"){
//         sortedFavourites = Array.from(allFavourites).sort((a,b) => a.attributes.dateedited.value < b.attributes.dateedited.value)
//         sortedRest = Array.from(allRest).sort((a,b) => a.attributes.dateedited.value < b.attributes.dateedited.value)
//     }
  
//     sortedFavourites.forEach(title => allTitles.push(title))
//     sortedRest.forEach(title => allTitles.push(title))

//     allTitles.forEach(element =>{
//         document.getElementById("list-title-container").appendChild(element)
//     })

//     setSortState(order);
// }

// function removePlaylistTitles(){
//     let parent = document.getElementById("list-title-container")
//     while(parent.firstChild){
//         parent.removeChild(parent.firstChild)
//     }
// }

// function deleteVideo(id, name){
//     getLocalStorage()
//     .then(response =>{
//         let allLists = [].concat(response.storage)  // need to make sure that copies are made by VALUE not REFERENCE // CHECK
//         let listIndex = allLists.findIndex(list => list.playlistName === name)
//         let tempList = allLists[listIndex]
//         let videoIndex = tempList.videos.findIndex(video => video.id === id)
//         tempList.videos.splice(videoIndex, 1)
        
//         let oldString = tempList.playlistString
//         let stringIndex = oldString.indexOf(id)
//         let start = oldString.substring(0, stringIndex)
//         let end = oldString.substring(stringIndex+12)
//         let newString = start + end
//         tempList.playlistString = newString;   
        
//         updatePlaylistEditDate(Date.now())
//         tempList.dateEdited = Date.now()
        
//         let node = document.querySelector('[data-id="' +id+ '"]')
//         let parent = node.closest(".video-card")
//         parent.remove()
        
//         let order = playlistOrderNode.textContent
//         sortPlaylists(order)
    
//         updateLocalStorage(allLists)    
//     })
// }

// function getLocalStorage(){     
//     let storage = browser.tabs.query({active: true, currentWindow: true})
//     .then(response => browser.tabs.sendMessage(response[0].id, {command: "return localStorage"})) 
//     .then(response => response)
//     .catch(error => console.log(error))
//     return storage;
// }

// function getCurrentPlaylist(){
//     let playlist = browser.tabs.query({active: true, currentWindow: true})
//     .then(response => browser.tabs.sendMessage(response[0].id, {command: "return currentPlaylist"})) 
//     .then(response => response)
//     .catch(error => console.log(error))
//     return playlist;
// }

// function hydrateUi(){
//     getLocalStorage()
//     .then(response => {
//         if(response.storage){
//             createTitlesList(response.storage, response.order);
//             showRelevantUi()
//         }else{
//             displaySettings("create")
//         }
//         playlistOrderNode.textContent = response.order;
//     })
//     .then(getCurrentPlaylist)
//     .then(response => {
//         showSelectedList(response.current)
//         currentPlaylistNode.textContent = response.current;
//     })
//     .catch(error => console.log(error))
// }

// function deletePlaylist(name){
//     removeCards()   
//     let hyphenatedTitle = hyphenate(name);
//     document.getElementById(hyphenatedTitle).remove() 
//     browser.tabs.query({active: true, currentWindow: true})
//     .then(response => browser.tabs.sendMessage(response[0].id, {command: "delete playlist", name: name})) 
// }

// function checkPlaylistName(name){
//     let allNames = []
//     document.querySelectorAll(".list-title-card").forEach(list => allNames.push(list.textContent.toUpperCase().trim()))
//     if(allNames.includes(name.toUpperCase())){
//         console.log("A playlist with that name already exists") 
//         return true;
//     }else{
//         console.log("Playlist name is unique")
//         return false;
//    }
// }

// function setSortState(order){
//     browser.tabs.query({active: true, currentWindow: true})
//     .then(response => browser.tabs.sendMessage(response[0].id, {command: "set sorting order", order: order})) 
//     // .then(response => console.log(response))
//     .catch(error => console.log(error))
// }

// function setPlaylistFavourite(){
//     let playlist = currentPlaylistNode.textContent
//     let hyphenatedPlaylist = hyphenate(playlist)
//     browser.tabs.query({active: true, currentWindow: true})
//     .then(response => browser.tabs.sendMessage(response[0].id, {command: "favourite", list: playlist})) 
//     .then(response => console.log(response))
//     .catch(error => console.log(error))

//     let container = document.getElementById(hyphenatedPlaylist)
   
//     if(container.querySelector(".star")){
//         container.setAttribute("favourite", false)
//         container.querySelector(".star").remove()
//     }else{
//         container.setAttribute("favourite", true)
//         container.insertAdjacentHTML("afterbegin", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="star" ><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>`)
//     }

//     let order = playlistOrderNode.textContent
//     sortPlaylists(order)
// }

// function updatePlaylistEditDate(date){
//     let currentPlaylist = hyphenate(currentPlaylistNode.textContent)
//     let title = document.getElementById(currentPlaylist)
//     title.setAttribute("dateedited", date)
// }

// function enableDrag(id){
//     let card = document.getElementById(id)
//     card.setAttribute("draggable", true)
//     card.classList.add("draggable")   
//     let allCards = document.querySelectorAll(".video-card")
//     allCards.forEach(card => {
//         card.addEventListener("dragstart", dragStart)
//         card.addEventListener('dragenter', dragEnter)
//         card.addEventListener('dragover', dragOver);
//         card.addEventListener('dragleave', dragLeave);
//         card.addEventListener('drop', drop);
//     })
// }

// export let checkOrderString = "";

// function getTemporaryOrder(){
//     let cardList = document.querySelectorAll(".video-card")
//     cardList.forEach(card => {
//         checkOrderString += card.dataset.videoid    // for detecting playlist order changes
//     })
// }

// function dragStart(event){
//     // only create a new string on open or after save
//     if(checkOrderString === ""){
//         getTemporaryOrder()
//     }
//     // give all cards temporary ids according to their index whenever drag begins
//     let cardList = document.querySelectorAll(".video-card")
//     let count = 1;
//     cardList.forEach(card => {
//         card.setAttribute("data-id", count)
//         count++
//     })
   
//     if(event.target.classList.contains("video-card")){
//         event.dataTransfer.setData("text/plain", event.target.dataset.id);
//     }else{
//         return; // event.target.closest(".video-card").setData("text/plain", event.target.closest(".video-card").dataset.id) get parent item id here so we set the correct data regardless // CHECK
//     }

//     setTimeout(()=>{
//         event.target.classList.add("drag-start")
//     },0)

// }

// function dragEnter(event){
//     event.preventDefault()   
//     if(event.target.classList.contains("video-card")){
//         event.target.classList.add("drag-over")
//     }else{
//         event.target.closest(".video-card").classList.add("drag-over")
//     }
// }

// function dragOver(event){
//     event.preventDefault()
//     if(event.target.classList.contains("video-card")){
//         event.target.classList.add("drag-over")
//     }else{
//         event.target.closest(".video-card").classList.add("drag-over")
//     }
// }

// function dragLeave(event){
//     if(event.target.classList.contains("video-card")){
//         event.target.classList.remove("drag-over")
//     }else{
//         event.target.closest(".video-card").classList.remove("drag-over")
//     }
// }

// function drop(event){
//     event.preventDefault()
//     let dropId;

//     if(event.target.classList.contains("video-card")){
//         event.target.classList.remove("drag-over")
//         dropId = event.target.dataset.id
//     }else{
//         event.target.closest(".video-card").classList.remove("drag-over")
//         dropId = event.target.closest(".video-card").dataset.id
//     }
    
//     let container = document.getElementById("playlist-preview")
//     let dragId = event.dataTransfer.getData("text/plain") 
//     let card = document.querySelector('[data-id="' + dragId + '"]')   // dragged item
//     card.classList.remove("drag-start")
//     container.insertBefore(card, container.children[dropId])    
//     let change = detectPlaylistOrderChange()
//     if(change){
//         updateListOrder();
//     }
// }


// function detectPlaylistOrderChange(){
//     let testString = "";
//     let cardList = document.querySelectorAll(".video-card")
//     cardList.forEach(card => {
//         testString += card.dataset.videoid;
//     })
   
//     if(checkOrderString === testString){
//         testString = "";
//         return false
//     }else{
//         testString = "";
//         return true
//     }
// }

// function updateListOrder(){
//     testString = "";    
//     checkOrderString = "";  // only clear strings on save
//     let currentPlaylist = currentPlaylistNode.textContent
//     let cardList = document.querySelectorAll(".video-card")
//     let newList = []
//     let newString = "";
//     let tempArray = [];

//     cardList.forEach(item =>{
//         newList.push(item.dataset.videoid)
//         newString += item.dataset.videoid   // 
//     })
    
//     getLocalStorage()
//     .then(response =>{
//         let index = response.storage.findIndex(list => list.playlistName === currentPlaylist)
//         let allLists = [].concat(response.storage)
//         let originalList = allLists[index].videos
        
//         for (let index = 0; index < newList.length; index++) {
//             for (let index2 = 0; index2 < newList.length; index2++) {
//                 if(newList[index] === originalList[index2].id){
//                     tempArray.unshift(originalList[index2])
//                     break
//                 }
//             }
//         }

//         allLists[index].videos = tempArray  // update video array 
//         allLists[index].playlistString = newString  // update playlist url
//         updateLocalStorage(response.storage)    // WHY ARE WE NOT UPDATING USING allLists ???
    
//     })
//     .catch(error => console.log(error))
// }

// function updateLocalStorage(data){
//     browser.tabs.query({active: true, currentWindow: true})
//         .then(response => browser.tabs.sendMessage(response[0].id, 
//             {
//                 command: "update localStorage",
//                 data: JSON.stringify(data)
//             }
//         )) 
//         .then(response => console.log(response.message)) 
//         .catch(error => console.log(error))
// }

// function hyphenate(title){
//     let regex = /\s/g;
//     return title.replace(regex, "-")
// }

// function displaySettings(id){
//     let containers = document.querySelectorAll(".settings-container");
//     containers.forEach(item => {
//         if(item.dataset.id === id){
//             item.style.display = "flex"
//         }else{
//             item.style.display = "none"
//         }
//     })
// }

// function showRelevantUi(){ 
//     let container = document.getElementById("list-title-container")
//     if(container.childNodes.length < 1){
//         displaySettings("create")
//     }else if(currentPlaylistNode.textContent === "None Selected"){
//         displaySettings("list")
//         displaySortOrder()
//     }else{
//         displaySettings("main")
//     }
// }

// function displaySortOrder(){
//     let container = document.querySelector(".playlist-order-container");
//     container.style.display = "flex"
//     setTimeout(()=>{
//         container.style.opacity = "0"
//     }, 1000)
//     setTimeout(()=>{
//         container.style.display = "none"
//         container.style.opacity = "0.7"
//     }, 3000)
// }

// function removeTags(string){
//     let lt = /</g; 
//     let gt = />/g;
//     return string.replace(lt, "-").replace(gt, "-")
// }