

export const signState = (authUser) => {
    return {
        type: 'SIGN_STATE',
        payload: authUser
    };
};


export const createFirebase = () => {
    return {
        type: 'FIREBASE_STATE'
    };
};
