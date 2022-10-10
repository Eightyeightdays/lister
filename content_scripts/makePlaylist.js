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

    const baseUrl = "https://www.youtube.com/watch_videos?video_ids=";

    function createPlaylistLink(id){
        let tempData = JSON.parse(localStorage.getItem("allPlaylists")); // get storage
        let index = tempData.findIndex(list => list.playlistName === id);
        let tempList = tempData[index] ;
        let videoList = tempList.playlistString;
        let fullUrl = baseUrl + videoList;
        let final = fullUrl.slice(0, -1);   // added to remove trailing comma
        navigator.clipboard.writeText(final);
        console.log("Playlist generated and copied to clipboard")
        return final;
    }
    
    function setPlaylistName(name){
        let newList = {
            playlistName: name,
            videos: [],
            playlistString: "",
            dateCreated: Date.now(),
            dateEdited: Date.now(),
            lastAccessed: Date.now(),
            viewCount: 0,
            favourite: false,
            length: 0
        }

        if(!localStorage.getItem("allPlaylists")){                              
            localStorage.setItem("allPlaylists", JSON.stringify([newList]))    
            localStorage.setItem("playlistOrder", "newest")                   
        }else{
            let tempStorage = JSON.parse(localStorage.getItem("allPlaylists")) 
            tempStorage.push(newList);                                          
            localStorage.setItem("allPlaylists", JSON.stringify(tempStorage))   
        }
    }

    let frog;
    function updateCurrentList(data, url, id){
        let tempData = JSON.parse(localStorage.getItem("allPlaylists")); // get storage
        let index = tempData.findIndex(list => list.playlistName === id)
        let tempList = tempData[index] //   find playlist with selected id
        ////// ^^^ could be made into its own function for re-use in createPlaylistLink 
        let currentId;
        if(url.search(/=/) === -1){
             start = url.search(/shorts\//) + 7; // url for YouTube Shorts is different
            let end = start + 12;
            currentId = url.substring(start, end) + ",";    
        }else{
            let regex = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(\?\S*)?$/;
            let matches = url.match(regex)
            currentId = matches[1] + ",";    
        }
        
        let tempString = tempList.playlistString;   
        tempString += currentId;                    
        tempList.playlistString = tempString;      

        let newVideo = {
            id: currentId,
            title: data.title,
            author: data.author,
            imgUrl: data.imgUrl,
            dateAdded: Date.now(),
            videoUrl: url
        }

        tempList.length ++;
        tempList.dateEdited = Date.now();
        tempList.videos.push(newVideo)  
        console.log("Playlist length is: " + tempList.length + " videos.")
        Object.assign(tempData[index], tempList)    
        localStorage.setItem("allPlaylists", JSON.stringify(tempData)); 
        
        // need to return currentId in order to add it to video card // CHECK
        return frog = currentId
    }

    async function getVideoDetails(url){
        let startUrl = "https://www.youtube.com/oembed?url=";
        let midUrl = url;
        let endUrl = "&format=json";
        let jsonUrl = startUrl + midUrl + endUrl;
        let videoDetails = {}
        await fetch(jsonUrl)
            .then(response => response.json())
            .then(data =>{
                videoDetails.title = data.title;        
                videoDetails.author = data.author_name;
                videoDetails.imgUrl = data.thumbnail_url;
                console.log(data)
            })
        return videoDetails;
    }
   
    function deletePlaylist(name){  
        let storage = JSON.parse(localStorage.getItem("allPlaylists"))
        let index = storage.findIndex(list => list.playlistName === name)
        storage.splice(index, 1)
        localStorage.setItem("allPlaylists", JSON.stringify(storage))
        if(storage.length < 1){
            localStorage.setItem("currentPlaylist", "None Created") 
        }else{
            localStorage.setItem("currentPlaylist", "None Selected") 
        }
        
    }

    function setPlaylistFavourite(name){
        let tempData = JSON.parse(localStorage.getItem("allPlaylists")); 
        let index = tempData.findIndex(list => list.playlistName === name);
        let tempList = tempData[index] ;
        // could be made a separate function

        if(tempList.favourite === false){
            tempList.favourite = true
        }else{
            tempList.favourite = false
        }
        localStorage.setItem("allPlaylists", JSON.stringify(tempData))
        console.log(`${name} favourite status set to ${tempList.favourite}`)
    }

    function handleCommands(message){
        
        if(message.command === "add name"){
            setPlaylistName(message.title)
        }else if(message.command === "add video") {
            let url = window.location.href;
            return getVideoDetails(url)    // adding "return" here solved the problem
            .then(details => {
                updateCurrentList(details, url, message.id)
                details.id = frog // add videoId to details object
                return Promise.resolve({
                    message: "video details fetched", 
                    details: details
                })
            })
            .catch(error => console.log(error))
        }else if(message.command === "add url"){
            return getVideoDetails(message.url)    // adding "return" here solved the problem
            .then(details => {
                let id = localStorage.getItem("currentPlaylist")
                updateCurrentList(details, message.url, id)
                details.id = frog // add videoId to details object
                return Promise.resolve({
                    message: "video details fetched", 
                    details: details
                })
            })
            .catch(error => console.log(error))
        }else if(message.command === "create link"){
            var url = createPlaylistLink(message.id)
            return Promise.resolve({url: url})
        }else if(message.command === "return localStorage"){
            if(localStorage.getItem("allPlaylists")){
                return Promise.resolve({
                    message: "Storage retrieved", 
                    storage: JSON.parse(localStorage.getItem("allPlaylists")), 
                    order: localStorage.getItem("playlistOrder")
                })
            }else{
                localStorage.setItem("playlistOrder", "newest");
                localStorage.setItem("currentPlaylist", "None Created")
                return Promise.resolve({
                    message: "Storage is empty, order set to newest, currentPlaylist set to None", 
                    order: localStorage.getItem("playlistOrder")
                })
            } 
        }else if(message.command === "clear localStorage"){
            localStorage.removeItem("allPlaylists");
            localStorage.removeItem("playlistOrder");
            localStorage.removeItem("currentPlaylist");
            return Promise.resolve({
                message: "Storage cleared"
            })
        }else if(message.command === "update localStorage"){
            localStorage.setItem("allPlaylists", message.data)
            return Promise.resolve({
                message: "Storage updated"
            })
        }else if(message.command === "delete playlist"){
            deletePlaylist(message.name)
        }else if(message.command === "set current playlist"){
            localStorage.setItem("currentPlaylist", message.playlistName)
            return Promise.resolve({
                message: `current playlist set to ${message.playlistName}`
            })
        }else if(message.command === "return currentPlaylist"){
            let current = localStorage.getItem("currentPlaylist")
            return Promise.resolve({
                message: "current playlist retrieved", 
                current: current
            })
        }else if(message.command === "set sorting order"){
            localStorage.setItem("playlistOrder", message.order)
            return Promise.resolve({
                message: `playlist order set to ${message.order}`
            })
        }else if(message.command === "favourite"){
            setPlaylistFavourite(message.list)
            return Promise.resolve({
                message: `favourite status set for ${message.list}`
            })
        }
    }

    browser.runtime.onMessage.addListener(handleCommands);

})()