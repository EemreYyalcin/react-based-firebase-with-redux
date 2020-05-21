

export const signState = (authUser) => {
    return {
        type: 'SIGN_STATE',
        payload: authUser
    };
};

