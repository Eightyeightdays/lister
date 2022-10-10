export default function getLocalStorage(){     
    let storage = browser.tabs.query({active: true, currentWindow: true})
    .then(response => browser.tabs.sendMessage(response[0].id, {command: "return localStorage"})) 
    .then(response => response)
    .catch(error => console.log(error))
    return storage;
}