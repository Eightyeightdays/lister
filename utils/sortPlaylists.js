import setSortState from "./setSortState.js"

export default function sortPlaylists(order){
    let sortedFavourites;
    let sortedRest;
    let allFavourites = document.querySelectorAll(".list-title-card[favourite='true']")
    let allRest = document.querySelectorAll(".list-title-card[favourite='false']")
    let allTitles = []

    if(order === "forwards"){
        sortedFavourites = Array.from(allFavourites).sort((a,b) => a.id.toUpperCase() > b.id.toUpperCase())
        sortedRest = Array.from(allRest).sort((a,b) => a.id.toUpperCase() > b.id.toUpperCase())
    }else if(order === "backwards"){
        sortedFavourites = Array.from(allFavourites).sort((a,b) => a.id.toUpperCase() < b.id.toUpperCase())
        sortedRest = Array.from(allRest).sort((a,b) => a.id.toUpperCase() < b.id.toUpperCase())
    }else if(order === "newest"){
        sortedFavourites = Array.from(allFavourites).sort((a,b) => a.attributes.datecreated.value < b.attributes.datecreated.value)
        sortedRest = Array.from(allRest).sort((a,b) => a.attributes.datecreated.value < b.attributes.datecreated.value)
    }else if(order === "oldest"){
        sortedFavourites = Array.from(allFavourites).sort((a,b) => a.attributes.datecreated.value > b.attributes.datecreated.value)
        sortedRest = Array.from(allRest).sort((a,b) => a.attributes.datecreated.value > b.attributes.datecreated.value)
    }else if(order === "edited"){
        sortedFavourites = Array.from(allFavourites).sort((a,b) => a.attributes.dateedited.value < b.attributes.dateedited.value)
        sortedRest = Array.from(allRest).sort((a,b) => a.attributes.dateedited.value < b.attributes.dateedited.value)
    }
  
    sortedFavourites.forEach(title => allTitles.push(title))
    sortedRest.forEach(title => allTitles.push(title))

    allTitles.forEach(element =>{
        document.getElementById("list-title-container").appendChild(element)
    })

    setSortState(order);
}