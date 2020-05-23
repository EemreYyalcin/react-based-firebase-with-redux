import {getFirebaseService, getRandomUid} from "./index";


export const addMessageToDb = (callBack, message, userUid, displayName) => {
    let date = Date().toString();
    let parentMessageId = '0'; // TODO: Change Child Messages
    let deleted = false;
    getFirebaseService()
        .addMessageV2(parentMessageId, getRandomUid())
        .set({
            message,
            date,
            userUid,
            parentMessageId,
            deleted,
            displayName
        })
        .then(() =>
            callBack({message: '', error: null, invalidButton: true}))
        .catch(error => {
            console.log(error)
            callBack(error)
        });
}

export const getMessagesFromDb = (callback, baseMessageId) => {
    getFirebaseService().getMessageV2(baseMessageId).on('value', snapshot => {
        const messages = [];
        snapshot.forEach(child => {
            console.log("GGEEEETTTT:", child.key, child.val());
            messages.push({key: child.key, value: child.val()})
        });
        callback({messages});
    });
}


export const likeMessage = (baseMessageId, messageId, userUid, isLiked) => {

    if (isLiked === true){
        unLikeMessage(baseMessageId, messageId, userUid);
        return;
    }

    let date = Date().toString();
    getFirebaseService()
        .addLikesV2(baseMessageId, messageId, userUid)
        .set({
            date
        })
        .then(() => console.log("SUCCESSFULL LIKED"))
        .catch(error => {
            console.log("ERROR CREATED", error)
        })
}


export const unLikeMessage = (baseMessageId, messageId, userUid) => {

    getFirebaseService()
        .removeLikesV2(baseMessageId, messageId, userUid)
        .then(() => console.log("SUCCESSFULL UNLIKED"))
        .catch(error => {
            console.log("ERROR CREATED", error)
        })
}






