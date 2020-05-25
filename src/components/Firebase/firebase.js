import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

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

    addMessageV2 = (baseMessageId,messageId) => this.db.ref(`messagesV2/${baseMessageId}/${messageId}`);

    getMessageV2 = (baseMessageId) => this.db.ref(`messagesV2/${baseMessageId}`).orderByChild('likes');

    // addLikesV2 = (baseMessageId, messageId, userId) => this.db.ref(`messagesV2/${baseMessageId}/${messageId}/likes/${userId}`);

    addLikesV2 = (messageId, userId) => this.db.ref(`likesV2/${messageId}_${userId}`);

    removeLikesV2 = (messageId, userId) => this.db.ref(`likesV2/${messageId}_${userId}`).remove();

    getLikesV2 = (messageId) => this.db.ref('likesV2').orderByKey().startAt(messageId);

    // removeLikesV2 = (baseMessageId, messageId, userId) => this.db.ref(`messagesV2/${baseMessageId}/${messageId}/likes/${userId}`).remove();


    getAuth = () => {
        return this.auth;
    }

    user = uid => this.db.ref(`users/${uid}`);

    users = () => this.db.ref('users');

}

export default Firebase;