export default async function getVideoDetails(url){
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