import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import url from '../Url/Url';

class ViewQuestions extends Component {
    constructor() {
        super();
        this.state = {
            questions: [],
            question: ''
        }
    }

    componentDidMount() {
        let email = localStorage.email;
        axios.get(url.url + 'questions', { params: { email } })
            .then((response) => {
                console.log(response.data);
                this.setState({
                    questions: this.state.questions.concat(response.data)
                });
            });
    }

    questionEdit = (e) => {
        this.setState({
            question: e.target.value
        })
    };

    questionUpdate = (e) => {
        let qid = localStorage.questionID;
        axios.post(url.url + 'questions/edit', { question: this.state.question, qid })
            .then(response => {
                if (response.data) {
                    alert("Question Updated");
                    window.location.reload();
                }
            })
    };

    render() {
        //if not logged in go to login page
        let redirectVar = null;
        if (!cookie.load('cookie')) {
            redirectVar = <Redirect to="/login" />
        }
        let details = this.state.questions.map(question => {
            return (
                <div class="card bg-light text-dark">
                    <div class="card-body">
                        <p><img class="img-profile rounded-circle" src={localStorage.image} height="40" width="40" /> {localStorage.fname} {localStorage.lname}, <small>Asked On {question.posted}</small></p>
                    </div>
                    <h4>
                        <p>{question.question}</p>
                    </h4>
                    <div>
                        <button class="btn btn-danger" type="submit" data-toggle="modal" data-target="#questionEditModal" onClick={() => {
                            localStorage.setItem('questionID', question._id);
                            this.setState({
                                question: question.question
                            })
                        }}><i class="far fa-edit"> Edit</i></button>
                    </div>
                    <br /><br />
                </div>


            )
        })
        return (
            <div class="container">
                <br />
                <div class="row">
                    <div class="col-md-2">
                    </div>
                    <div class="col-md-8">
                        <div class="card bg-light text-dark">
                            <br />
                            {details}
                        </div>
                    </div>
                    <div class="col-md-2">
                    </div>
                </div>
                <div class="modal" id="questionEditModal">
                    <div class="modal-header">
                        <h5 class="modal-title"><strong>Start your question with "What", "How", "Why", etc.</strong></h5>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                    </div>


                    <div class="modal-body">
                        <div>
                            <textarea type="text" class="questionAdd" onChange={this.questionEdit.bind(this)} placeholder="Optional: include a link that gives context" value={this.state.question} />
                        </div>
                    </div>


                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" onClick={this.questionUpdate.bind(this)}>Update</button>
                        <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>

                    </div>
                </div>
            </div>
        )


    }
}
//export ViewQuestions Component
export default ViewQuestions;