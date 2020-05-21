import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import {SignUpLink} from '../SignUp';
import * as ROUTES from '../../constants/routes';
// import {PasswordForgetLink} from '../PasswordForget';
import {Button, Form, Grid, Header, Message, Segment} from "semantic-ui-react";
import {connect} from "react-redux";
import {signState} from "../../actions";
import {getFirebaseService} from "../Firebase";

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
};

class SignInForm extends Component {
    constructor(props) {
        super(props);
        this.state = {...INITIAL_STATE};
    }

    onSubmit = event => {
        const self = this;
        const {email, password} = this.state;
        console.log("FIREBASE:", this.props.authUser);
        getFirebaseService()
            .doSignInWithEmailAndPassword(email, password)
            .then((e) => {
                console.log("CURRENTUSER:", e);
                this.setState({...INITIAL_STATE});
                this.props.history.push(ROUTES.HOME);
            })
            .catch(error => {
                this.setState({error});
            });

        event.preventDefault();
    };

    onChange = event => {
        this.setState({[event.target.name]: event.target.value});
    };

    render() {
        const {email, password, error} = this.state;

        const isInvalid = password === '' || email === '';

        return (
            <Grid textAlign='center' style={{height: '90vh'}} verticalAlign='middle'>
                <Grid.Column style={{maxWidth: 450}}>
                    <Header as='h2' color='teal' textAlign='center'>
                        Sign In
                    </Header>
                    <Form size='large' onSubmit={this.onSubmit}>
                        <Segment stacked>
                            <Form.Input
                                fluid icon='mail'
                                iconPosition='left'
                                name="email"
                                value={email}
                                onChange={this.onChange}
                                type="text"
                                placeholder="Email Address"
                            />

                            <Form.Input
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Password'
                                onChange={this.onChange}
                                value={password}
                                type='password'
                                name='password'
                            />

                            <Button fluid size='large' disabled={isInvalid} type="submit">
                                Sign In
                            </Button>
                            {error && <p>{error.message}</p>}
                        </Segment>
                    </Form>
                    <Message>
                        <SignUpLink/>
                    </Message>
                    <Message>
                        {/*<PasswordForgetLink/>*/}
                    </Message>
                </Grid.Column>
            </Grid>


        );
    }
}

export const SignInLink = () => (
    <p>
        Do you have an account? <Link to={ROUTES.SIGN_IN}>Sign In</Link>
    </p>
);


const mapStateToProps = (state) => {
    return {
        authUser: state.authUser
    }
};

export default connect(
    mapStateToProps,
    {signState}
)(SignInForm);
