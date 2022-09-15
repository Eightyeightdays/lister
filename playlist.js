document.getElementById("main").style.border = "5px solid gold";
document.getElementById("upload-info").style.background = "dodgerblue";
let menu = document.querySelector("#top-level-buttons-computed");

menu.style.background = "red";

let test = document.createElement("div")
test.innerText = "THIS IS A TEST";
menu.appendChild(test)
