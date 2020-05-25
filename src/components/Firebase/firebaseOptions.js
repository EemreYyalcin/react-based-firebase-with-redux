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

export const getPopularMessagesFromDb = (callback) => {
    getFirebaseService().getMessageV2('0').on('value', snapshot => {
        const popularMessages = [];
        snapshot.forEach(child => {
            console.log("GGEEEETTTT:", child.key, child.val());
            getFirebaseService()
                .getLikesV2(child.key)
                .on('value', snapshot => {
                    console.log("LIKESSSS", snapshot.val());
                    popularMessages.push({key: child.key, value: child.val(), likes: snapshot.val()})
                });
        });
        //TODO: Without Timeout Action
        setTimeout(() => callback({popularMessages}), 1000);
    });
}


export const likeMessage = (messageId, userUid, isLiked) => {

    if (isLiked === true){
        unLikeMessage(messageId, userUid);
        return;
    }

    let date = Date().toString();
    getFirebaseService()
        .addLikesV2(messageId, userUid)
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


export const getLikesMessage = (likeCallBack, messageId) => {

    getFirebaseService()
        .getLikesV2(messageId)
        .on('value', snapshot => {
            console.log("LIKESSSS", snapshot.val());
            likeCallBack(messageId, snapshot.val());
        });

}





