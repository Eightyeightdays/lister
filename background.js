function onCreated() {
    if (browser.runtime.lastError) {
        console.log(`Error: ${browser.runtime.lastError}`);
    } else {
        console.log("Context menu item created successfully!");
    }
}

browser.contextMenus.create({
    id: "add",
    title: "Add To Playlist",
    contexts: ["all"],
    documentUrlPatterns: ["*://www.youtube.com/*"],
    icons: {
        "16": "icons/Lister-16.png",
        "32": "icons/Lister-32.png"
    }
}, onCreated);

browser.contextMenus.onClicked.addListener((info) => {
    if(info.menuItemId === "add"){
        if(info.linkUrl === undefined){
            console.log("An error occurred trying to add the video URL")
            return;
        }else{
            browser.tabs.query({active: true, currentWindow: true})
            .then(response =>{
                browser.tabs.sendMessage(response[0].id, {
                    command: "add url", 
                    url: info.linkUrl
                })
                .then(response => console.log(response))
                .catch(error => console.log(error))
            })
        }
    }
})