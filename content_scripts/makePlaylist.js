(function(){

    if (window.hasRun) {
        return;
    }
    window.hasRun = true;
    ////////////////////

    // check if localStorage is available on the browser // ^^ Maybe move inside the if statement
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
        return; // EXIT IF UNAVAILABLE
    } 



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
            videos: [],
            playlistString: "",
            dateCreated: Date.now(),
            dateEdited: "",
            lastAccessed: ""
            }

        if(!localStorage.getItem("allPlaylists")){                              // if no playlist exists
            localStorage.setItem("allPlaylists", JSON.stringify([newList]));    // initialise localStorage with allPlaylists
        }else{
            let tempStorage = JSON.parse(localStorage.getItem("allPlaylists")); // otherwise get existing storage
            tempStorage.push(newList);                                          // add new list
            localStorage.setItem("allPlaylists", JSON.stringify(tempStorage))   // update localStorage
        }
    }

    function updateCurrentList(data){
        let tempData = JSON.parse(localStorage.getItem("allPlaylists"));
        
        let currentUrl = window.location.href;
        let start = currentUrl.search(/=/) + 1;
        let end = start + 12;
        let currentId = currentUrl.substring(start, end) + ",";

        // get currently selected list
        // get playListString of current list
        playlistString += currentId;    // need to get old string from storage and add to it
        
        
        

        let newVideo = {
            id: currentId,
            title: data.title,
            author: data.author,
            imgUrl: data.imgUrl
        }

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
   
// Message handler //

    function handleCommands(message){
        console.log(message.command)

        if(message.command === "add name"){
            setPlaylistName(message.title)
        }else if(message.command === "add video") {
            return getVideoDetails()    // adding "return" here solved the problem
            .then(updateCurrentList(details))
            .then(details =>{
                return Promise.resolve({message: "video details fetched", details: details})
            })
            .catch(error => console.log(error))
        }else if(message.command === "create link"){
            createPlaylistLink();
        }else if(message.command === "return localStorage"){
            if(localStorage.getItem("allPlaylists")){
                return Promise.resolve({message: "Storage retrieved", storage: JSON.parse(localStorage.getItem("allPlaylists"))})
            }else{
                return Promise.reject({message: "Storage is empty"})
            } 
        }else{
            return;
        }
    }

    browser.runtime.onMessage.addListener(handleCommands);

})()