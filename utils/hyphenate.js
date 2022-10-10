export default function hyphenate(title){
    let regex = /\s/g;
    return title.replace(regex, "-")
}