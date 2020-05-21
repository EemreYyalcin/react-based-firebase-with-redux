import React from 'react';
import {Link} from 'react-router-dom';

import * as ROUTES from '../../constants/routes';
import {Menu} from "semantic-ui-react";


const Navigation = ({authUser}) => {
    console.log(authUser);
    if (authUser !== null) {
        return <NavigationAuth/>
    }
    return <NavigationNonAuth/>;
}

const NavigationAuth = () => (
    <Menu>
        <Menu.Item header>Options</Menu.Item>
        <Menu.Item
            name='landing'
            active='false'
        >
            <Link to={ROUTES.LANDING}>Landing</Link>
        </Menu.Item>
        <Menu.Item
            name='home'
            active='false'
        >
            <Link to={ROUTES.HOME}>Home</Link>
        </Menu.Item>
        <Menu.Item
            name='account'
            active='false'
        >
            <Link to={ROUTES.ACCOUNT}>Account</Link>
        </Menu.Item>
        <Menu.Item
            name='admin'
            active='false'
        >
            <Link to={ROUTES.ADMIN}>Admin</Link>
        </Menu.Item>
        {/*<SignOutButton/>*/}
    </Menu>
);


const NavigationNonAuth = () => (
    <Menu>
        <Menu.Item header>Options</Menu.Item>
        <Menu.Item
            name='landing'
            active='false'
        >
            <Link to={ROUTES.LANDING}>Landing</Link>
        </Menu.Item>
        <Menu.Item
            name='signIn'
            active='false'
        >
            <Link to={ROUTES.SIGN_IN}>Sign In</Link>
        </Menu.Item>
        <Menu.Item
            name='signUp'
            active='false'
        >
            <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
        </Menu.Item>
    </Menu>
);


export default Navigation;