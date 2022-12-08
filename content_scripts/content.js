(function(){

    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

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
        return; 
    } 

    // THIS FUNCTION IS AN EXACT COPY BECAUSE IMPORT METHOD IS NOT WORKING
    async function getVideoDetails(url){
        let startUrl = "https://www.youtube.com/oembed?url=";
        let midUrl = url;
        let endUrl = "&format=json";
        let jsonUrl = startUrl + midUrl + endUrl;
        let data = await fetch(jsonUrl)
        let json = await data.json()
        let urlStart = json.thumbnail_url.search(/\/vi\//) + 4;
        let urlEnd = urlStart + 11;
        let videoId = json.thumbnail_url.substring(urlStart, urlEnd) + ",";
        
        let videoDetails = {
            title: json.title,
            author: json.author_name,
            imgUrl: json.thumbnail_url,
            id: videoId,
            url: url
        }
     
        return videoDetails;
    }
    //
    // ANOTHER COPY
    async function addVideoToStorage(details, playlistName){
        details.dateAdded = Date.now()
        let data = await browser.storage.local.get()
        let index = data.playlists.findIndex(list => list.playlistName === playlistName)
        let currentPlaylist = data.playlists[index]
       
        let currentPlaylistString = currentPlaylist.playlistString
        let newPlaylistString = details.id + currentPlaylistString // newest video first
        currentPlaylist.playlistString = newPlaylistString;
        
        currentPlaylist.length ++;
        currentPlaylist.dateEdited = Date.now();
        currentPlaylist.videos.push(details)  
        
        browser.storage.local.set({playlists:data.playlists})
    }
    //

    async function handleCommands(message){
        if(message.command === "add url"){
            let currentPlaylistName;
            browser.storage.local.get()
            .then(data=>{
                currentPlaylistName = data.currentPlaylist
                let index = data.playlists.findIndex(list => list.playlistName === currentPlaylistName)
                let currentPlaylist = data.playlists[index]
                let currentPlaylistlength = currentPlaylist.length

                if(currentPlaylistlength === 50){
                    alert("A playlist can only contain 50 videos maximum")  
                    return Promise.reject({message: "A playlist can only contain 50 videos maximum"})
                }

            })
           
            let details = await getVideoDetails(message.url)    
            if(details.error){
                alert("Could not add video. Sorry")
                return Promise.reject({message: details.error})
            }else{
                addVideoToStorage(details, currentPlaylistName)
                return Promise.resolve({
                    message: "video details fetched", 
                    details: details
                })
            }
        }
    
    }

    browser.runtime.onMessage.addListener(handleCommands);

})()