import React, {Component} from 'react';
import "semantic-ui-css/semantic.min.css";

import * as ROUTES from '../../constants/routes';
import {BrowserRouter, Route} from "react-router-dom";
import Navigation from "../Navigation";
import {HomePage} from "../HomePage";
import SignUpForm from "../SignUp";
import SignInForm from "../SignIn";
import {connect} from "react-redux";
import {createFirebase} from "../../actions"


class App extends Component {

    componentDidMount() {
        this.props.createFirebase();
    }

    render() {
        return (
            <BrowserRouter>
                <div>
                    <Navigation authUser={this.props.authUser}/>

                    <Route path={ROUTES.HOME} component={HomePage}/>
                    <Route path={ROUTES.SIGN_UP} component={SignUpForm}/>
                    <Route path={ROUTES.SIGN_IN} component={SignInForm}/>
                    {/*<Route exact path={ROUTES.LANDING} component={LandingPage} />*/}
                    {/*<Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage}/>*/}
                    {/*<Route path={ROUTES.ACCOUNT} component={AccountPage}/>*/}
                    {/*<Route path={ROUTES.ADMIN} component={AdminPage}/>*/}
                </div>
            </BrowserRouter>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        firebase: state.firebase,
        authUser: state.authUser
    }
};

export default connect(
    mapStateToProps,
    {createFirebase}
)(App);
