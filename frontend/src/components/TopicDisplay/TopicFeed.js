import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import url from '../Url/Url';
import QACard from '../Home/QACard';

class TopicFeed extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            answers: [],
            question: '',
            questions: [],
            answerBox: '',
            questionsLog: [],
            page: 0,
            limit: 5,
            topics: [],
            followStatus: "Follow",
            userEmail: localStorage.getItem("email"),


        }
        this.nxtHandler = this.nxtHandler.bind(this);
        this.prvHandler = this.prvHandler.bind(this);
    }

    paginate(n) {
        this.setState({
            page: this.state.page + n
        })
    }

    loadTopics() {
        //loads topics to show on left side of home screen
        axios.get(url.url + 'topics')
            .then((response) => {
                //update the state with the response data
                this.setState({
                    topics: response.data
                });
            });
    }

    prvHandler(e) {
        let t = this.state.page - 1;
        if (t < 0 || this.state.page === 0) {
            t = 0;
        }
        else {
            this.paginate(-1);
        }
        const { limit } = this.state;
        let topic = localStorage.getItem("topicFeed");

        axios.get(url.url + 'questions/logQues', { params: { limit, t, topic } }).then(result => {
            this.setState({
                questionsLog: result.data
            })
        })
    }

    nxtHandler(e) {
        this.paginate(1);
        let t = this.state.page + 1;
        const { limit } = this.state;
        let topic = localStorage.getItem("topicFeed");

        axios.get(url.url + 'questions/logQues', { params: { limit, t, topic } }).then(result => {
            this.setState({
                questionsLog: result.data
            })
        })
    }


    uploadFile() {

    }

    componentDidMount() {
        this.loadTopics();

        let topic = localStorage.getItem("topicFeed");
        var follower = this.state.userEmail;

        //check if the topic is followed

        axios.get(url.url + 'topics/isfollowed', { params: { topic, follower } }).then(result => {
            if (result.data.length > 0) {
                this.setState({
                    followStatus: "Followed"
                })
            } //that  means user follows this topic.
        });


        axios.get(url.url + 'questions/noLogQues', { params: { topic } }).then(result => {
            this.setState({
                questions: this.state.questions.concat(result.data)
            })
        });


        let t = this.state.page - 1;
        if (t < 0 || this.state.page === 0) {
            t = 0;
        }
        else {
            this.paginate(-1);
        }
        const { limit } = this.state;
        axios.get(url.url + 'questions/logQues', { params: { limit, t, topic } }).then(result => {
            this.setState({
                questionsLog: result.data
            })
        })
    }

    FollowTopic() {

        //if already followed then do nothing

        if (this.state.followStatus != "Followed") {


            var follower = this.state.userEmail;
            var topic = localStorage.getItem('topicFeed');

            if(follower == null || follower == "")
            {
                alert("Please login first!");
            }
            else
            {
                axios.post(url.url + 'topics/follow', { topic, follower }).then(result => {
                    const data = result.data;
                    this.setState({
                        followStatus: "Followed"
                    })
                    //alert(data.message);
                })
            }
        


        }
    }

    render() {

        let topics = this.state.topics.map(topic => {
            return (
                <p><Link to="/topic"><img class="img-profile rounded" src={"/uploads/topic/" + topic.picture} height="25" width="25" /><small> {topic.topic}</small></Link></p>
            )
        })
        let home = null;
        var questionDisplay = this.state.questions.map(questionPar => {
            console.log('ID', questionPar._id);
            return (
                <QACard key={questionPar._id} id={questionPar._id} question={questionPar.question} />
            );
        })

        var questionDisplayLog = this.state.questionsLog.map(questionPar => {
            console.log('ID', questionPar._id);
            return (
                <QACard key={questionPar._id} id={questionPar._id} question={questionPar.question} />
            );
        })

        //if not logged in go to login page
        let redirectVar = null;
        if (!cookie.load('cookie')) {
            redirectVar = <Redirect to="/login" />
            home = (<div class="container">

                <br />
                <div class="row">

                    <div class="col-md-2">

                    </div>

                    <div class="col-md-8">

                        <a href="#"> {localStorage.getItem("topicFeed")} </a> |
                        <a href="#" onClick={(e) => this.FollowTopic(e)}> {this.state.followStatus} </a>
                        {questionDisplay}
                    </div>

                    <div class="col-md-2">

                    </div>
                </div>
                <div id="myModal" class="modal fade" role="dialog">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                <h4 class="modal-title">Upload Image</h4>
                            </div>
                            <div class="modal-body">
                                <input type="file" onChange={this.onChange} name="file" id="file" />
                                <button class="btn btn-sm btn-primary" onClick={this.uploadFile.bind(this)}>Upload</button>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)
        }

        //Logged In
        else {
            home = (
                <div class="container">

                    <br />
                    <div class="row">

                        <div class="col-md-2">
                        </div>

                        <div class="col-md-8">
                            <a href="#"> {localStorage.getItem("topicFeed")} </a>
                            <a href="#" onClick={(e) => this.FollowTopic(e)}> {this.state.followStatus} </a>

                            {questionDisplayLog}
                            <button class="btn btn-sm btn-primary" onClick={this.prvHandler} name="prev" id="prev">&lt;</button>
                            <button class="btn btn-sm btn-primary" onClick={this.nxtHandler} name="next" id="next">&gt;</button>
                        </div>


                        <div class="col-md-2">

                        </div>
                    </div>
                    <div id="myModal" class="modal fade" role="dialog">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                    <h4 class="modal-title">Upload Image</h4>
                                </div>
                                <div class="modal-body">
                                    <input type="file" onChange={this.onChange} name="file" id="file" />
                                    <button class="btn btn-sm btn-primary" onClick={this.uploadFile.bind(this)}>Upload</button>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }


        return (
            <div>
                {home}
            </div>
        )


    }
}
export default TopicFeed;