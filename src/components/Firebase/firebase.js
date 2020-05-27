import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
    constructor() {
        app.initializeApp(config);
        this.auth = app.auth();
        this.db = app.database();
        this.firestore = app.firestore();
    }

    doCreateUserWithEmailAndPassword = (email, password, displayName) =>
        this.auth.createUserWithEmailAndPassword(email, password)
            .then((authUser) => {
                console.log(this.auth);
                this.auth.currentUser.updateProfile({
                    displayName: displayName
                }).then(function () {
                    console.log("Update SuccessFully");
                    return authUser;
                }, function (error) {
                    // An error happened.
                    return authUser;
                });
                return authUser;
            })


    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
        this.auth.currentUser.updatePassword(password);

    message = uid => this.db.ref(`messages/${uid}`);

    messages = () => this.db.ref('messages').orderByChild('date').limitToLast(5);

    addMessageV2 = (baseMessageId, messageId) => this.db.ref(`messagesV2/${baseMessageId}/${messageId}`);

    getMessageV2 = (baseMessageId) => this.db.ref(`messagesV2/${baseMessageId}`).orderByChild('likes');


    addLikesV2 = (key) => this.db.ref(`likesV2/${key}`);

    removeLikesV2 = (likeKey) => this.db.ref(`likesV2/${likeKey}`).remove();

    getLikesV2 = (messageId, userId) => this.db.ref('likesV2').orderByChild('message').equalTo(messageId);

    addLikeCountV2 = (messageId, isLiked) => this.db.ref(`likesCountV2/${messageId}`).transaction(function (value) {
        if (value === null) {
            // the counter doesn't exist yet, start at one
            return 1;
        } else if (typeof value === 'number') {
            // increment - the normal case
            if (isLiked) {
                return value - 1;
            }
            return value + 1;
        } else {
            // we can't increment non-numeric values
            console.log('The counter has a non-numeric value: ' + value)
            // letting the callback return undefined cancels the transaction
        }
    });


    getAuth = () => {
        return this.auth;
    }

    user = uid => this.db.ref(`users/${uid}`);

    users = () => this.db.ref('users');


    addMessageV3 = () => this.firestore.collection(`messages`);

    getMessageV3 = (baseMessageId) => this.firestore.collection('messages').where('parentMessageId', '==', baseMessageId);


    addLikesV3 = (messageId, userId) => {
        let date = Date().toString();
        this.firestore.collection('message').doc(messageId).collection('likes').add({
            userId,
            date
        }).then(() => {
            this.firestore.collection('messages').doc(messageId).collection('likes').get().then(snapshot => {
                let likeCount = 0;
                if (snapshot !== null) {
                    likeCount = Object.keys(snapshot).length
                }
                this.firestore.collection('message').doc(messageId).update('likeCount', likeCount).then(() => console.log('SUCCESSFULLY LIKED'));
            });
        });
    }

    getUserLikesV3 = (messageId, userId) => {
        let messageRef = this.firestore.collection('messages').doc(messageId);
        return messageRef.collection('likes').where('user', '==', userId);
    }


}

export default Firebase;