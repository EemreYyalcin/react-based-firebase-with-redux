import React from 'react';

import {Menu} from "semantic-ui-react";
import {getFirebaseService} from "../Firebase";

const SignOutButton = () => (
    <Menu.Item onClick={getFirebaseService().doSignOut}
               name='signOut'
               active='false'
               position='right'
    >
        Sign Out
    </Menu.Item>
);

export default (SignOutButton);