function onCreated() {
    if (browser.runtime.lastError) {
        console.log(`Error: ${browser.runtime.lastError}`);
    } else {
        console.log("Context menu item created successfully");
    }
}

browser.contextMenus.create({
    id: "add",
    title: "Add To Playlist",
    contexts: ["all"],
    documentUrlPatterns: ["*://www.youtube.com/*"]
}, onCreated);

browser.contextMenus.onClicked.addListener((info) => {
    // console.log(info)
    if(info.menuItemId === "add"){
        if(info.linkUrl === undefined){
                // throw error
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
        
        return;
    }
})