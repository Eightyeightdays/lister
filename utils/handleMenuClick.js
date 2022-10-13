import displaySortOrder from "./displaySortOrder.js"
import displaySettings from "./displaySettings.js"

export default function handleMenuClick(event){
    if(event.target.dataset.id === "list"){
        displaySortOrder()
    }
    displaySettings(event.target.dataset.id)
}