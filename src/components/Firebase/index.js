import Firebase from "./firebase";

let firebase =  new Firebase();


export const getFirebaseService = () => {
    return firebase;
}


export function getRandomUid() {
    return 'xxxxxxxxxxxx4xxxyxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}