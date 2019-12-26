import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import axios from 'axios';
import { connect } from "react-redux";
import url from '../Url/Url';

//create the Navbar Component
class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: "",
            email: "",
            role: "",
            search: "",
            profile: [],
            topic: [],
            question: [],
            notifys: [],
            questions: "",
            topics: [],
            topicselect: '',
            count: ''

        }
        this.onSelect = this.onSelect.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.searchChangeHandler = this.searchChangeHandler.bind(this);
    }

    questionAdd = (e) => {
        this.setState({
            questions: e.target.value
        })
    };

    onSelect = (e) => {
        this.setState({
            topicselect: e.target.value
        })
    };

    answerSubmit = (e) => {
        let owner = localStorage.email;
        let firstname = localStorage.fname;
        let lastname = localStorage.lname;
        let userimage = localStorage.image;
        axios.post(url.url + 'questions/create', { topicselect: this.state.topicselect, question: this.state.questions, owner, firstname, lastname, userimage })
            .then(response => {
                if (response.data) {
                    alert("Question Submitted");
                }
            })
    };

    componentDidMount() {
        axios.get(url.url + 'questions/topics')
            .then((response) => {
                console.log(response.data);
                this.setState({
                    topics: this.state.topics.concat(response.data)
                });
            });

        var email = localStorage.getItem('email');

        axios.get(url.url + 'answers/notify', {params: {email: email}}).then(result=>{
            var x = result.data;
            if(x.length === 0){
                this.setState({
                    count: ''
                })
            }
            else{
                this.setState({
                    count: x.length
                })
            }
            
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
        axios.get(url.url + 'search/profile', options)
            .then((response) => {
                //update the state with the response data
                this.setState({
                    profile: response.data.profile,

                });


            });

        axios.get(url.url + 'search/topic', options)
            .then((response) => {
                //update the state with the response data
                this.setState({
                    topic: response.data.topic,

                });


            });
        axios.get(url.url + 'search/question', options)
            .then((response) => {
                //update the state with the response data
                this.setState({
                    question: response.data.question,

                });


            });

    }


    componentWillMount() {

    }
    //handle logout to destroy the cookie
    handleLogout = () => {
        cookie.remove('cookie', { path: '/' })
        this.props.onLogout();
    }
    render() {
        //if Cookie is set render Logout Button
        let navLogin = null;
        if (cookie.load('cookie')) {
            console.log("Able to read cookie");
            navLogin = (
                <ul class="navbar-nav">
                <li class="nav-item">

                    <Link to="/home" class="nav-link"><i class='far fa-file-alt' style={{ fontSize: "25px" }}></i> Home</Link>
                </li>
                {/* <li class="nav-item">
                <Link to="/useranswerdisplay" class="nav-link"><i class='far fa-edit' style={{ fontSize: "25px" }}></i> Answers</Link>
                </li> */}

                <li class="nav-item">
                                <a class="nav-link" href="#" onClick={() => {
                                    this.setState({
                                        count: ''
                                    })
                                    this.props.history.push('/notifications');
                                    
                                }}><i class='fas fa-bell' style={{ fontSize: "25px" }}></i><span class="badge badge-light" style={{ color: 'red' }}><b>{this.state.count}</b></span></a>
                            </li>


                <li class="nav-item">
                    <Link to='/messages' class="nav-link"><i class='fas fa-envelope' style={{ fontSize: "25px" }}></i> Mails</Link>
                </li>
                <li class="nav-item">
                    <Link to='/graph' class="nav-link"><i class='fas fa-chart-line' style={{ fontSize: "25px" }}></i> Graphs</Link>
                </li>
                

               




                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbardrop" data-toggle="dropdown"><img class="img-profile rounded-circle" src={localStorage.image} height="40" width="40" /></a>
                    <div class="dropdown-menu">

                        <Link to="/profile" class="dropdown-item">Profile</Link>
                        {/* <a class="dropdown-item" href="#">Messages</a> */}
                        <Link to="/messages" class="dropdown-item">Messages</Link>
                        <Link to='/viewquestion' class="dropdown-item">Your Content</Link>
                        <Link to='/graph' class="dropdown-item">Your Stats</Link>
                        <Link to="/" onClick={this.handleLogout} class="dropdown-item">Logout</Link>
                    </div>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#"><button class="btn btn-danger" data-toggle="modal" data-target="#questionModal" type="submit">Add Question or Link</button></a>
                </li>
            </ul>
            );
        } else {
            //Else display login button
            console.log("Not Able to read cookie");
            navLogin = (
                <ul class="nav navbar-nav navbar-right">
                    <li><Link to="/login" class="nav-link"><i class='fas fa-user'></i></Link></li>
                </ul>
            )
        }
        let redirectVar = null;
        if (cookie.load('cookie')) {
            console.log("in Navbar redirectVar")
            redirectVar = <Redirect to="/home" />
        }
        if (!cookie.load('cookie')) {
            console.log("in Navbar redirectVar")
            redirectVar = <Redirect to="/home" />
        }
        let details = this.state.topics.map(topicc => {
            return (
                <option value={topicc.topic}>{topicc.topic}</option>
            )
        })



        return (
            <div>
                {redirectVar}
                <nav class="navbar navbar-expand-sm bg-light navbar-light">
                    <div class="container-fluid">
                        <div class="navbar-header">

                            <Link to="/home" class="navbar-brand"><img src="logo.png" height='30' width='120' alt="Profile Pic" /> </Link>
                        </div>

                        <ul class="navbar-nav">
                           

                           
                            <li class="nav-item dropdown">

                                <a class="nav-link dropdown-toggle" href="#" id="navbardrop" data-toggle="dropdown"><button type="button" class="btn btn-danger"><i class="fa fa-search"></i>   Search Quora</button></a>

                                <div class="dropdown-menu">
                                    <input class="form-control mr-sm-2" type="search" placeholder="Search Quora" onChange={this.searchChangeHandler} />

                                    {this.state.profile.map(res => {
                                        return (
                                            <div id="empty" class="dropdown-header"><small>Profile : </small><Link to="/profiledisplay" class="dropdown-item" onClick={
                                                () => {
                                                    localStorage.setItem('profiledisplay', res._id);
                                                }
                                            }>{res.fname}, {res.lname}</Link></div>
                                        )
                                    })
                                    }

                                    {this.state.topic.map(res => {
                                        return (
                                            <div id="empty" class="dropdown-header"><small>Topic : </small> <Link to="/topicfeed" class="dropdown-item"
                                                onClick={() => localStorage.setItem("topicFeed", res.topic)}
                                            >{res.topic}</Link></div>
                                        )
                                    })
                                    }

                                    {this.state.question.map(res => {
                                        return (
                                            <div id="empty" class="dropdown-header"><small>Question : </small> <Link to='/questionCard' onClick={() => {
                                                localStorage.setItem('questionID', res._id);
                                                localStorage.setItem('question', res.question);
                                                axios.post(url.url + 'answers/views', { questionID: res._id }).then(result => {
                                                    console.log(result.data.message);
                                                });
                                            }}>{res.question}</Link></div>
                                        )
                                    })
                                    }
                                    <div id="empty" class="dropdown-header"><hr /></div>
                                    <div id="empty" class="dropdown-header">Quora Search <a href=""> Terms and Conditions.</a></div>
                                </div>
                            </li>

                        </ul>


                        {navLogin}
                        <div class="modal" id="questionModal">
                            <div class="modal-header">
                                <h5 class="modal-title"><strong>Start your question with "What", "How", "Why", etc.</strong></h5>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>


                            <div class="modal-body">
                                <div>
                                    <textarea type="text" class="questionAdd" value={this.state.questions} onChange={this.questionAdd.bind(this)} placeholder="Optional: include a link that gives context" required />
                                </div>
                                <div class="row">
                                    <div class="col-md-9">
                                        <form onSubmit={this.answerSubmit.bind(this)}>
                                            <table>
                                                <tr>
                                                    <td>
                                                        <select name="topics" onChange={this.onSelect} value={this.state.value} class="form-control" required>
                                                            <option value="">Select Topic</option>
                                                            {details}
                                                        </select>
                                                    </td>
                                                    <td>
                                                    </td>

                                                    <td>
                                                        <button type="submit" class="btn btn-danger" >Submit</button>
                                                    </td>
                                                </tr>
                                            </table>






                                        </form>


                                    </div>
                                    <div class="col-md-3">
                                        <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>

                                    </div>
                                </div>
                            </div>


                            <div class="modal-footer">



                            </div>
                        </div>



                    </div>
                </nav>



            </div>
        )




    }
}

const mapStateToProps = state => {
    return {

    };
};

const mapDispachToProps = dispatch => {
    return {
        onLogout: () => dispatch({
            type: "LOGOUT",

        }),

    };
};

//export Home Component
export default connect(
    mapStateToProps,
    mapDispachToProps
)(Navbar);