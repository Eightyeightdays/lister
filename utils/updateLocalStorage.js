export default function updateLocalStorage(data){
    browser.tabs.query({active: true, currentWindow: true})
        .then(response => browser.tabs.sendMessage(response[0].id, 
            {
                command: "update localStorage",
                data: JSON.stringify(data)
            }
        )) 
        .then(response => console.log(response.message)) 
        .catch(error => console.log(error))
}