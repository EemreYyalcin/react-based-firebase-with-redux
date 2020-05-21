import Firebase from "../components/Firebase";

let firebase =  new Firebase();


export const FirebaseReducer = (state = firebase, action) => {
    if (action.type === 'FIREBASE_STATE') {
        return firebase;
    }
    return state;
};