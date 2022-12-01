export default function getStorage(){
    function confirmStorageFetch(data){
        console.log(data)
    }
    function onError(err){
        console.log(err)
    }
    browser.storage.local.get().then(confirmStorageFetch, onError)
}
    