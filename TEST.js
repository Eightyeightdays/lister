import setStorage from "./utils/localStorage/setStorage.js";

export default function Test(){
    let obj = {
        name: "test",
        message: "this is a test"
    }
    setStorage(obj)
}