export default function getVideoDetails(url){
    let startUrl = "https://www.youtube.com/oembed?url=";
    let midUrl = url;
    let endUrl = "&format=json";
    let jsonUrl = startUrl + midUrl + endUrl;
    let videoDetails = {}
    let errorMessage = "";

    fetch(jsonUrl)
    .then(response => {
        if(response.status != 200){
            errorMessage = response.statusText
        }else{
            return response.json()
        }
    })
    .then(data =>{
        if(!data){
            return
        }
        
        let start = data.thumbnail_url.search(/\/vi\//) + 4;
        let end = start + 11;
        let videoId = data.thumbnail_url.substring(start, end) + ",";

        videoDetails.title = data.title;        
        videoDetails.author = data.author_name;
        videoDetails.imgUrl = data.thumbnail_url;
        videoDetails.id = videoId;
        videoDetails.url = url;
    })
    .catch(error => console.log(error))
    
    if(errorMessage.length != 0){
        videoDetails.error = errorMessage
    }
        
    return videoDetails;

}