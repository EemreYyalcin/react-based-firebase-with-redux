import Firebase from "./firebase";

let firebase =  new Firebase();


export const getFirebaseService = () => {
    return firebase;
}