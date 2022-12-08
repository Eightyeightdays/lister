export default function setStorage(item){
    function confirmStorageUpdate(){
        // console.log(`The item was updated in local storage.`)
    }
    function onError(err){
        console.log(err)
    }
    browser.storage.local.set(item)
    .then(confirmStorageUpdate, onError)
}