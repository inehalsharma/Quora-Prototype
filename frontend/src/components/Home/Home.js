import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import url from '../Url/Url';
import QACard from './QACard';

class Home extends Component {
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
            topics: []
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
        axios.get(url.url + 'questions/logQues', { params: { limit, t } }).then(result => {
            this.setState({
                questionsLog: result.data
            })
        })
    }

    nxtHandler(e) {
        this.paginate(1);
        let t = this.state.page + 1;
        const { limit } = this.state;
        axios.get(url.url + 'questions/logQues', { params: { limit, t } }).then(result => {
            this.setState({
                questionsLog: result.data
            })
        })
    }


    uploadFile() {

    }

    componentDidMount() {
        this.loadTopics();

        axios.get(url.url + 'questions/noLogQues').then(result => {
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
        axios.get(url.url + 'questions/logQues', { params: { limit, t } }).then(result => {
            this.setState({
                questionsLog: result.data
            })
        })
    }

    render() {

        let topics = this.state.topics.map(topic => {
            return (
                <p><Link to="/topicfeed"   onClick={() => localStorage.setItem("topicFeed",topic.topic) }  ><img class="img-profile rounded" src={"/uploads/topic/" + topic.picture} height="25" width="25" /><small> {topic.topic}</small></Link></p>
            )
        })
        let home = null;
        var questionDisplay = this.state.questions.map(questionPar => {
            console.log('ID', questionPar._id);
            return (
                <QACard key={questionPar._id} id={questionPar._id} question={questionPar.question} owner={questionPar.owner}/>
            );
        })

        var questionDisplayLog = this.state.questionsLog.map(questionPar => {
            console.log('ID', questionPar._id);
            return (
                <QACard key={questionPar._id} id={questionPar._id} question={questionPar.question} owner={questionPar.owner}/>
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
                        {topics}
                        <p><Link to="/topic"><small>  Add new Topic</small></Link></p>
                    </div>

                    <div class="col-md-8">

                        {questionDisplay}
                    </div>

                    <div class="col-md-2">
                        Improve your feed
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
                            {topics}
                            <p><Link to="/topic"><small>  Add new Topic</small></Link></p>
                        </div>

                        <div class="col-md-8">

                            {questionDisplayLog}
                            <div class="row">
                            <div class="col-md-1">
                            <button class="btn btn-sm btn-primary" onClick={this.prvHandler} name="prev" id="prev">&lt; </button>Previous
                            </div>
                            <div class="col-md-10">
                            
                            </div>
                            <div class="col-md-1">
                            <button class="btn btn-sm btn-primary" onClick={this.nxtHandler} name="next" id="next"> &gt; </button>Next
                            </div>
                            </div>
                            
                            
                            
                        </div>


                        <div class="col-md-2">
                            Improve your feed
                </div>
                    </div>
                    <div>
                        <p>Privacy Policy.</p>
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
//export Home Component
export default Home;