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

export const getPopularMessagesFromDb = (callback, likeCallBack, userId) => {
    getFirebaseService().getMessageV2('0').on('value', snapshot => {
        const popularMessages = [];
        snapshot.forEach(child => {
            popularMessages.push({key: child.key, value: child.val()})
            getFirebaseService()
                .getLikesV2(child.key, userId)
                .on('value', snapshot => {
                    console.log("ID:", child.key, "VALUE:", snapshot.val());
                    likeCallBack(child.key, snapshot.val());
                });
        });
        callback({popularMessages});
    });
}


export const likeMessage = (message, user, likes) => {

    getFirebaseService().addLikeCountV2(message, !!likes).then(() => console.log("sas"));
    if (!!likes) {
        unLikeMessage(likes);
        return;
    }
    let date = Date().toString();
    getFirebaseService()
        .addLikesV2(getRandomUid())
        .set({
            message,
            user,
            date
        })
        .then(() => console.log("SUCCESSFULL LIKED"))
        .catch(error => {
            console.log("ERROR CREATED", error)
        })
}


export const unLikeMessage = (likes) => {
    console.log("UNLIKE:", likes);
    getFirebaseService()
        .removeLikesV2(likes)
        .then(() => console.log("SUCCESSFULL UNLIKED"))
        .catch(error => {
            console.log("ERROR CREATED", error)
        })
}


export const addMessageToDbV3 = (callBack, message, userUid, displayName) => {
    let date = Date().toString();
    let parentMessageId = '0'; // TODO: Change Child Messages
    let deleted = false;
    getFirebaseService()
        .addMessageV3(parentMessageId)
        .add({
            message,
            date,
            userUid,
            parentMessageId,
            deleted,
            displayName
        })
        .then((e) => {
            callBack({message: '', error: null, invalidButton: true});
        })
        .catch(error => {
            console.log(error)
            callBack(error)
        });
}

export const getPopularMessagesFromDbV3 = (callback, likeCallBack, likeCountCallBack, userId) => {
    getFirebaseService().getMessageV3('0').onSnapshot(
        snapshot => {
            const popularMessages = [];
            snapshot.forEach(child => {
                getFirebaseService().getUserLikesV3(child.id, userId).onSnapshot(snapshot1 => {
                    console.log("SNAPSHOT1:", child.id, userId, snapshot1);
                    snapshot1.forEach(child1 => {
                        likeCallBack(child.id, child1.data());
                        console.log("CHILD:", child1.data());
                    })
                    // likeCallBack(child.id, snapshot1.);
                });
                getFirebaseService().getLikesCountV3(child.id).onSnapshot(snapshot1 => {
                    if (snapshot1 === null) {
                        likeCountCallBack(child.id, 0);
                        return;
                    }
                    likeCountCallBack(child.id, snapshot1.size);
                })
                popularMessages.push({key: child.id, value: child.data()})
            });
            callback({popularMessages});
        });
}

export const likeMessageV3 = (message, user, liked, likeCallBack) => {

    if (liked) {
        return;
    }
    console.log("ADDLIKE:");
    getFirebaseService()
        .addLikesV3(message, user)
        .then(() => {
        likeCallBack(message, {date: Date(), user: user});
    });
}

