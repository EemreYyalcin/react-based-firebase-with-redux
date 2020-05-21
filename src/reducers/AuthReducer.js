

export const AuthReducer = (state = null, action) => {
    if (action.type === 'SIGN_STATE') {
        return action.payload;
    }
    return state;
};