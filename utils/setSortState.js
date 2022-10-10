export default function setSortState(order){
    browser.tabs.query({active: true, currentWindow: true})
    .then(response => browser.tabs.sendMessage(response[0].id, {command: "set sorting order", order: order})) 
    .then(response => console.log(response))
    .catch(error => console.log(error))
}