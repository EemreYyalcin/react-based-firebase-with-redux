import React, {Component} from 'react';
import {signState} from "../../actions";
import {connect} from "react-redux";
import {getFirebaseService} from "../Firebase";

class Session extends Component {

    componentDidMount() {
        this.listener = getFirebaseService().getAuth().onAuthStateChanged(
            authUser => {
                authUser
                    ? this.props.signState(authUser)
                    : this.props.signState(null)
            },
        );
    }

    componentWillUnmount() {
        this.listener();
    }




    render = () => null
}


const mapStateToProps = (state) => {
    return {
        authUser: state.authUser
    }
};

export default connect(
    mapStateToProps,
    {signState}
)(Session);
