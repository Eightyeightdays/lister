export default function addVideoToStorage(details, playlistName){
    let tempData = JSON.parse(localStorage.getItem("allPlaylists")); 
        let index = tempData.findIndex(list => list.playlistName === playlistName)
        let tempList = tempData[index] 
        let tempString = tempList.playlistString;   
        let newString = details.id + tempString; // play videos newest first
                     
        tempList.playlistString = newString;      

        let newVideo = {
            id: details.id,
            title: details.title,
            author: details.author,
            imgUrl: details.imgUrl,
            dateAdded: Date.now(),
            url: details.url
        }

        tempList.length ++;
        tempList.dateEdited = Date.now();
        tempList.videos.push(newVideo)  
        Object.assign(tempData[index], tempList)    
        localStorage.setItem("allPlaylists", JSON.stringify(tempData)); 

        return tempList.length  // make a separate function to return current playlist length
}