import React, { Component } from 'react';
import axios from 'axios';
import url from '../Url/Url';
import { Link } from 'react-router-dom';

class Messages extends Component {

    constructor() {
        super();
        this.state = {
            messagesInbox: [],
            messagesOutbox: [],
            content: '',
            to: '',
            user: [],
            fname: "",
            lname: ""
        }
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangeContent = this.onChangeContent.bind(this);
        this.searchChangeHandler = this.searchChangeHandler.bind(this);
    }


    componentDidMount() {
        axios.get(url.url + 'messages', { params: { email: localStorage.getItem('email') } }).then(result => {
            this.setState({
                messagesInbox: this.state.messagesInbox.concat(result.data)
            })
        })

        axios.get(url.url + 'messages/sent', { params: { email: localStorage.getItem('email') } }).then(result => {
            this.setState({
                messagesOutbox: this.state.messagesOutbox.concat(result.data)
            })
        })
    }

    searchChangeHandler = (e) => {

        const value = e.target.value;

        const params = {

            search: value,


        };
        const options = {
            params,
            headers: {
                'Authorization': localStorage.jwt,

            },
        };
        axios.get(url.url + 'search/user', options)
            .then((response) => {
                //update the state with the response data
                this.setState({
                    user: response.data.user,

                });


            });


    }

    onChangeEmail(event) {
        this.setState({
            to: event.target.value
        })
    }

    onChangeContent(event) {
        this.setState({
            content: event.target.value
        })
    }

    render() {
        if (this.state.messagesInbox != undefined) {
            var displayInbox = this.state.messagesInbox.map(message => {
                return (
                    <tr class="">
                        <td class="inbox-small-cells"><i class="fa fa-star"></i></td>
                        <td class="view-message">{message.from}</td>
                        <td class="view-message">{message.content}</td>
                        <td class="view-message inbox-small-cells"></td>
                        <td class="view-message text-right">{message.date.substr(0, 10)}, {message.date.substr(11, 5)}</td>
                    </tr>
                );
            })
        }

        if (this.state.messagesOutbox != undefined) {
            var displayOutbox = this.state.messagesOutbox.map(message => {
                return (
                    <tr class="">
                        <td class="inbox-small-cells"><i class="fa fa-star"></i></td>
                        <td class="view-message">{message.to}</td>
                        <td class="view-message">{message.content}</td>
                        <td class="view-message inbox-small-cells"></td>
                        <td class="view-message text-right">{message.date.substr(0, 10)}, {message.date.substr(11, 5)}</td>
                    </tr>
                );
            })
        }


        return (
            <div>
                <div class="container">
                    <br />
                    <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#messageModal">Compose New Message</button>

                    <div class="modal" id="messageModal">
                        <div class="modal-header">
                            <h5 class="modal-title"><strong>New Message</strong></h5>
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>


                        <div class="modal-body" style={{ height: '750px' }} >
                            <input class="form-control mr-sm-2" type="search" placeholder="Search User" onChange={this.searchChangeHandler} />
                            {this.state.user.map(res => {
                                return (
                                    <div id="empty" class="dropdown-header"><a class="dropdown-item" onClick={
                                        () => {
                                            this.setState({
                                                to: res.email,
                                                fname: res.fname,
                                                lname: res.lname

                                            });
                                        }
                                    }><small>User : </small>{res.fname} {res.lname}, [{res.email}]</a></div>
                                )
                            })
                            }
                            <div>
                                <br />

                                <h5>Mail Recepient:<font color="red">{this.state.fname} {this.state.lname} {this.state.to}</font></h5>
                            </div>
                            <br />
                            <div>
                                <textarea type="text" name="content" class="form-control" onChange={this.onChangeContent} placeholder="Your Message...." rows="5" />
                            </div>
                            <br />
                            <button type="button" class="btn btn-danger" onClick={() => {
                                const from = localStorage.getItem('email');
                                const { to, content } = this.state;
                                axios.post(url.url + 'messages', { to, from, content }).then(result => {
                                    alert(result.data.message);
                                })
                            }} >Send</button>&nbsp;
                            <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>

                            <br />
                        </div>


                        <div class="modal-footer">


                        </div>
                    </div>
                    <br /><br />
                    <div class="inbox-head">
                        <h3>Inbox</h3>
                    </div>
                    <div class="inbox-body">
                        <table class="table table-striped table-hover">
                            <tbody>
                                {displayInbox}
                            </tbody>
                        </table>
                    </div>

                    <br /><br />
                    <div class="inbox-head">
                        <h3>Outbox</h3>
                    </div>
                    <div class="inbox-body">
                        <table class="table table-striped table-hover">
                            <tbody>
                                {displayOutbox}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default Messages;





