export default function removeTags(string){
    let lt = /</g; 
    let gt = />/g;
    return string.replace(lt, "-").replace(gt, "-")
}