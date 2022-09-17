(function(){

    if (window.hasRun) {
        return;
    }
    window.hasRun = true;
    ////////////////////

    let playlistString = "";
    let baseUrl = "https://www.youtube.com/watch_videos?video_ids=";
    let playlistLink = document.getElementById("playlist-link");

     // function createPlaylistLink(){
    //     let videoList = localStorage.getItem("playlistString");
    //     let fullUrl = baseUrl + videoList;
    //     playlistLink.href = fullUrl;
    //     navigator.clipboard.writeText(fullUrl);
    //     alert("Playlist generated and copied to clipboard")
    // }
    
    function addToLocalStorage(){
        let currentUrl = window.location.href;
        let start = currentUrl.search(/=/) + 1;
        let end = start + 12;
        let currentId = currentUrl.substring(start, end) + ",";
        playlistString += currentId;
        localStorage.setItem("playlistString", playlistString);
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

    getVideoDetails().then(details =>{
        browser.runtime.onMessage.addListener((message) => {
        if (message.command === "add") {
            addToLocalStorage();
            return Promise.resolve({
                message: "video details fetched",
                details: details
            })
        } 
    });
    })

    
    

})()

