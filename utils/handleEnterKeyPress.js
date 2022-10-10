export default function handleEnterKeyPress(event){
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("add-playlist-name").click()
    }
}