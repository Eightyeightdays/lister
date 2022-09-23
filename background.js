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
    contexts: ["all"]
}, onCreated);

browser.contextMenus.onClicked.addListener((info, tab) => {
    browser.tabs.executeScript({file: "/content_scripts/makePlaylist.js"})
    .then(response => console.log(response))
    .catch(error => console.log(error))

    if(info.linkUrl === "undefined"){
            return;
    }else if(info.menuItemId === "add"){
        console.log(info.linkUrl);

        setTimeout(()=>{
            browser.tabs.sendMessage(tab.id, {command: "add url", url: info.linkUrl})
            .then(response => console.log(response))
            .catch(error => console.log(error))
        }, 10)
    
    }
})
 
console.log("background")









