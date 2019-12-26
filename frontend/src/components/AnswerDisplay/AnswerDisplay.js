import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import url from '../Url/Url';
import QuestionCard from './QuestionCard';
import AnswerCard from './AnswerCard';

class Home extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            answers: [],
            question: '',
            questions: [],
            answerBox: '',
            topics: []
        }
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


    uploadFile() {

    }

    componentDidMount() {
        this.loadTopics();
    
        axios.get(url.url + 'questions/logQues').then(result => {
            this.setState({
                questions: this.state.questions.concat(result.data)
            })
        });
    }


    render() {

        let topics = this.state.topics.map(topic => {
            return (
                <p><Link to="/topicfeed"   onClick={() => localStorage.setItem("topicFeed",topic.topic) }  ><img class="img-profile rounded" src={"/uploads/topic/" + topic.picture} height="25" width="25" /><small> {topic.topic}</small></Link></p>
            )
        })
        //if not logged in go to login page
        let redirectVar = null;
        if (!cookie.load('cookie')) {
            redirectVar = <Redirect to="/login" />
        }

        // var questionDisplay = this.state.questions.map(questionPar => {
        //     console.log('ID', questionPar._id);
        //     return (
        //         <QuestionCard key={questionPar._id} id={questionPar._id} question={questionPar.question} />
        //     );

        // })

        return (
            <div class="container">

                <br />
                <div class="row">

                    
                    <div class="col-md-2">
                            {topics}
                            <p><Link to="/topic"><small>  Add new Topic</small></Link></p>
                        
                    </div>

                    <div class="col-md-8">
                        <QuestionCard/>
                        
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
            </div>
        )


    }
}
//export Home Component
export default Home;