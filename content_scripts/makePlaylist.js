(function(){

    if (window.hasRun) {
        return;
    }
    window.hasRun = true;
    ////////////////////

    let playlistString = "";
    let baseUrl = "https://www.youtube.com/watch_videos?video_ids=";
    // let playlistLink = document.getElementById("playlist-link");

    function createPlaylistLink(){
        let videoList = localStorage.getItem("playlistString");
        let fullUrl = baseUrl + videoList;
        console.log(fullUrl)
        // playlistLink.href = fullUrl;
        navigator.clipboard.writeText(fullUrl);
        alert("Playlist generated and copied to clipboard")
    }
    
    function setPlaylistName(name){
        let newList = {
            playlistName: name,
            playlistStrings: [],
            dateCreated: Date.now(),
            dateEdited: "",
            lastAccessed: ""
            }

        if(!localStorage.getItem("allPlaylists")){  // if no playlist exists
            localStorage.setItem("allPlaylists", JSON.stringify([newList]));    // initialise localStorage with allPlaylists
        }else{
            let tempStorage = JSON.parse(localStorage.getItem("allPlaylists")); // otherwise get existing storage
            tempStorage.push(newList);      // add new list
            localStorage.setItem("allPlaylists", JSON.stringify(tempStorage))   // update localStorage
        }
        
        
    }

    function updateLocalStorage(){
        let currentUrl = window.location.href;
        let start = currentUrl.search(/=/) + 1;
        let end = start + 12;
        let currentId = currentUrl.substring(start, end) + ",";
        playlistString += currentId;
        localStorage.setItem("allPlaylists", playlistString);
    }

    async function getVideoDetails(){
        let startUrl = "https://www.youtube.com/oembed?url=";
        let midUrl = window.location.href;
        let endUrl = "&format=json";
        let jsonUrl = startUrl + midUrl + endUrl;
        let videoDetails = {}
        await fetch(jsonUrl)
            .then(response => response.json())
            .then(data =>{
                videoDetails.title = data.title;        
                videoDetails.author = data.author_name;
                videoDetails.imgUrl = data.thumbnail_url;
            })
        return videoDetails;
    }
   
    browser.runtime.onMessage.addListener(message => {  // listen for messages from the popup
        console.log(JSON.stringify(message))

        if(message.command === "add name"){
            setPlaylistName(message.title)
        }else if(message.command === "add video") {
            return getVideoDetails()    // adding "return" here solved the problem
            .then(updateLocalStorage())
            .then(details =>{
                return Promise.resolve({message: "video details fetched", details: details})
            })
            .catch(error => console.log(error))
        }else if(message.command === "create link"){
            createPlaylistLink();
        }else{
            return;
            // console.log("UNKNOWN MESSAGE")
        }

    })


    // check if localStorage is available on the browser
    function storageAvailable(type) {
        let storage;
        try {
            storage = window[type];
            const x = '__storage_test__';
            storage.setItem(x, x);  
            storage.removeItem(x);
            return true;
        }
        catch (e) {
            return e instanceof DOMException && (
                // everything except Firefox
                e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === 'QuotaExceededError' ||
                // Firefox
                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                // acknowledge QuotaExceededError only if there's something already stored
                (storage && storage.length !== 0);
        }
        
    }
    
    if(storageAvailable('localStorage')) {
        console.log("localStorage is available on this browser");
    }
    else{
        console.log("Attention, localStorage is not available on this browser!");
    } 
    

    function returnStorage(message){
        if(message.message === "return localStorage"){
            console.log(message.message)
           if(localStorage.getItem("allPlaylists")){
            browser.runtime.sendMessage({message: "Storage retrieved", storage: localStorage.getItem("allPlaylists")})
            }else{
                browser.runtime.sendMessage({message: "Storage is empty"})
            } 
        }
    }

    browser.runtime.onMessage.addListener(returnStorage)

})()