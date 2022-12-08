export default async function getStorage(){
    const storage = await browser.storage.local.get()
    // console.log("Storage: ")
    // console.log(storage)
    return storage
}
    