export default function clearStorage(){
    function onCleared() {
        console.log("STORAGE CLEARED");
    }
    
    function onError(e) {
    console.log(e);
    }
    
    browser.storage.local.clear().then(onCleared, onError);
    
}