export default function clearLocalStorage(){
    browser.tabs.query({active: true, currentWindow: true})
    .then(response => browser.tabs.sendMessage(response[0].id, {command: "clear localStorage"})) 
    .then(response => console.log(response.message)) 
}