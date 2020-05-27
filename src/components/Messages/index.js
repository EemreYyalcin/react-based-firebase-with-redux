import React, {Component} from 'react';
import {connect} from "react-redux";
import {signState} from "../../actions";
import {Button, Comment, Form, Grid, Header, Icon, Message} from 'semantic-ui-react'
import {getFirebaseService} from "../Firebase";
import "./commentCss.css";
import {addMessageToDbV3, getPopularMessagesFromDbV3, likeMessageV3} from "../Firebase/firebaseOptions";

class Messages extends Component {

    constructor(props) {
        super(props);

        this.state = {
            popularMessages: [],
            flowMessages: [],
            loading: false,
            message: '',
            error: null,
            invalidButton: true,
            load: false
        }

        this.onSetState = this.onSetState.bind(this);
    }

    componentDidMount() {
        console.log("MOUNT", this.props.authUser);
        // getPopularMessagesFromDbV3(this.onSetState, this.likeCallBack);
    }


    componentWillUnmount() {
        getFirebaseService().messages().off();
    }


    messageCheck = (message) => {
        if (message === null || message.length > 100 || message.length < 3) {
            return false;
        }

        if (message.match(/[^a-zA-Z0-9 ]/g)) {
            return false;
        }
        return true;
    }

    onSubmit = event => {
        const {message} = this.state;
        if (message === null || message.length > 200 || message.length < 3) {
            this.setState({error: "Message Length too large or too small"});
            return;
        }

        if (message.match(/[^a-zA-Z0-9 ]/g)) {
            this.setState({error: "Invalid Input"});
            return;
        }
        addMessageToDbV3(this.onSetState, message, this.props.authUser.uid, this.props.authUser.displayName);

        event.preventDefault();
    };

    onChange = event => {

        console.log("EVENT:", event.target);
        if (this.state.message === event.target.value) {
            return;
        }

        if (100 - this.state.message.length <= 0 && event.target.value.length >= this.state.message.length) {
            return;
        }


        this.setState({
            invalidButton: !(this.messageCheck(event.target.value)),
            message: event.target.value,
            count: this.state.count - 1
        });
    };

    onSetState = events => {
        this.setState(events)
    };

    likeCallBack = (key, likes) => {
        this.setState({[key]: likes});
    };

    likeCountCallBack = (key, count) => {
        this.setState({[key + 'count']: count});
    }

    checkLikes = messageId => {
        console.log("CHECKLINES:", messageId,this.state[messageId]);
        if (!!this.state[messageId]) {
            return true;
        }
        return false;
    }

    getLikeCount = messageId => {
        let count = this.state[messageId + 'count'];
        if (count === undefined || count === null) {
            return "0 like";
        }
        console.log("COUNT:", count);
        return count + " likes";
    }

    getComments = (messages) => {
        return messages
            .filter(e => e.key !== '0' && e.value.displayName !== undefined)
            .map(e => {
                return (
                    <Comment key={e.key}>
                        <Comment.Avatar src=' https://api.adorable.io/avatars/285/trtr.png'/>
                        <Comment.Content>
                            <Comment.Author as='a'>{e.value.displayName}</Comment.Author>
                            <Comment.Metadata>
                                <div>{new Date(e.value.date).toLocaleString()}</div>
                                <div>
                                    <Icon name='star'/>{this.getLikeCount(e.key)}
                                </div>
                            </Comment.Metadata>
                            <Comment.Text>{e.value.message}</Comment.Text>
                            <Comment.Actions>
                                <Comment.Action
                                    onClick={() => likeMessageV3(e.key, this.props.authUser.uid, this.checkLikes(e.key), this.likeCallBack)}>
                                    {this.checkLikes(e.key) ? <div>liked</div> : <div>like</div>}
                                </Comment.Action>
                            </Comment.Actions>
                        </Comment.Content>
                    </Comment>
                );
            });
    }


    render() {

        const {message, load} = this.state;

        if (!load) {
            if (this.props.authUser === null) {
                return <div>LOADING</div>
            }
            this.setState({load: true});
            getPopularMessagesFromDbV3(this.onSetState, this.likeCallBack, this.likeCountCallBack, this.props.authUser.uid);
            return <div>LOADING</div>
        }

        return (
            <Comment.Group size='large' textAlign='left'>
                <Header as='h3' dividing>
                    The Most Popular
                </Header>
                {this.getComments(this.state.popularMessages)}

                <Form reply onSubmit={this.onSubmit}>
                    <Form.TextArea name='message' rows={2} placeholder='Comment this topic' value={message}
                                   onChange={this.onChange}
                                   style={{minHeight: 100, maxHeight: 100}}/>
                    <Grid>
                        <Grid.Column floated='left' width={5}>
                            <Button content='Add Reply' labelPosition='left' icon='edit' primary type="submit"
                                    disabled={this.state.invalidButton}/>
                        </Grid.Column>
                        <Grid.Column floated='right' width={5} textAlign='right'>
                            <div>{(100 - this.state.message.length)}</div>
                        </Grid.Column>
                    </Grid>
                </Form>
                {this.state.error !== null && (<Message attached='bottom' negative>
                    <Icon name='exclamation' color='red'/>
                    {this.state.error}
                </Message>)}
            </Comment.Group>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        authUser: state.authUser
    }
};

export default connect(
    mapStateToProps,
    {signState}
)(Messages);
