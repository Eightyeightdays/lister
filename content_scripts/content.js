(function(){
    const baseUrl = "https://www.youtube.com/watch_videos?video_ids="

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

    function createPlaylistLink(id){
        let tempData = JSON.parse(localStorage.getItem("allPlaylists")); 
        let index = tempData.findIndex(list => list.playlistName === id);
        let tempList = tempData[index] ;
        let videoList = tempList.playlistString;
        let fullUrl = baseUrl + videoList;
        let final = fullUrl.slice(0, -1);   // remove trailing comma
        navigator.clipboard.writeText(final);
        console.log("Playlist generated and copied to clipboard")
        return final;
    }

    function handleCommands(message){
        if(message.command === "add url"){
            let playlist = localStorage.getItem("currentPlaylist")
            let length = getPlaylistLength(playlist)
            if(length === 50){
                alert("A playlist can only contain 50 videos maximum")  // update UI later // CHECK
                return Promise.reject({message: "A playlist can only contain 50 videos maximum"})
            }
            return getVideoDetails(message.url)    // adding "return" here solved the problem
            .then(details => {
                if(details.error){
                    alert("Could not add video. Sorry")
                    return Promise.reject({message: details.error})
                }else{
                    let playlistLength = addVideo(details, playlist)
                    return Promise.resolve({
                        message: "video details fetched", 
                        details: details,
                        length: playlistLength      
                    })
                }
            })
            .catch(error => console.log(error))
        }else if(message.command === "create link"){
            var url = createPlaylistLink(message.id)
            return Promise.resolve({url: url})
        }
    }

    browser.runtime.onMessage.addListener(handleCommands);

})()