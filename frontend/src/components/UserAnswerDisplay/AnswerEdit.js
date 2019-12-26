import React, { Component } from 'react';
import Axios from 'axios';
import url from '../Url/Url';
import { load } from 'react-cookies';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill';

class AnswerEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            answerBox: '',
            questionPar: '',
            answer: this.props.answer,
            anonymousStatus: 'true',
            commentable: 'true',
            votable: 'true',
            changeUp: 0,
            changeDown: 0
        }
        this.anonymousSelect = this.anonymousSelect.bind(this);
        this.onAnswer = this.onAnswer.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.commentable = this.commentable.bind(this);
        this.votable = this.votable.bind(this);
    }

    modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ],
    }

    formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ]

    handleChange(value) {
        this.setState({ answer: value })
    }

    onAnswer(event) {
        this.setState({
            answer: event.target.value
        })
    }

    commentable(event) {
        this.setState({
            commentable: event.target.value
        })
    }

    votable(event) {
        this.setState({
            votable: event.target.value
        })
    }

    anonymousSelect(event) {
        this.setState({
            anonymousStatus: event.target.value
        })
    }

    componentDidMount() {
        // console.log('MYDID', this.props.id);
        Axios.get(url.url + 'answers/question', { params: { _id: this.props.id } }).then(docs => {
            // console.log('MY QUESTION ', docs);
            this.setState({
                questionPar: docs.data
            })
        })
    }

    render() {
        var x = this.state.questionPar[0];
        if(x != undefined){
            return (
                <div>
                    <div class="card bg-light text-dark">
                        <h4 style={{ paddingLeft: '25px', paddingRight: '25px' }} class="card-title">
                            <br />
                            {console.log('MY QUESTION console', x)}
                            {/* //Question Comes here */}
                            {/* {questionPar.question}  */}
                            {/* {this.state.questionPar[0]} */}
                            {x.question}
                        </h4>
                        <div class="card-body">
                            {/* <p><img class="img-profile rounded-circle" src={localStorage.image} height="40" width="40" /> {this.state.answerPar.fname} {this.state.answerPar.lname}, <small>{this.state.answerPar.date}</small></p> */}
                            <p><img class="img-profile rounded-circle" src={localStorage.image} height="40" width="40" /> {localStorage.fname} {localStorage.lname}, <small>Answered on {this.props.date.substr(0,10)}, {this.props.date.substr(11,5)}</small></p>
                            <p><a class="nav-link" href="#" onClick={(e) => {
                                e.preventDefault();
                                localStorage.setItem('questionID', this.props.id);
                                console.log('QUESTION ID', localStorage.getItem('questionID'));
                                this.setState({
                                    answerBox: <div>
                                        <div class="row">
                                            <div class="col-md-4">
                                                <select name="anonymousStatus" onChange={this.anonymousSelect} value={this.state.value} class="form-control">
                                                    <option value="true">Anonymous</option>
                                                    <option value="false">Not Anonymous</option>
                                                </select>
                                                <select name="commentable" onChange={this.commentable} value={this.state.value} class="form-control">
                                                    <option value="true">Commentable</option>
                                                    <option value="false">Not Commentable</option>
                                                </select>
                                                <select name="votable" onChange={this.votable} value={this.state.value} class="form-control">
                                                    <option value="true">Votable</option>
                                                    <option value="false">Not Votable</option>
                                                </select>
                                            </div>
                                        </div>
                                        <br />
                                        <div class="container">
                                            <ReactQuill theme="snow"
                                                modules={this.modules}
                                                formats={this.formats} value={this.state.answer}
                                                onChange={this.handleChange}>
                                            </ReactQuill>
                                        </div>
                                        <button class="btn btn-sm btn-primary" type="submit" onClick={() => {
                                            var _id = this.props.ansID;
                                            var email = localStorage.getItem('email');
                                            var answer = this.state.answer;
                                            var { commentable } = this.state;
                                            var { votable } = this.state;
                                            var { anonymousStatus } = this.state;
                                            Axios.post(url.url + 'answers/edit', { _id, email, answer, anonymousStatus, commentable, votable}).then(result => {
                                                const data = result.data;
                                                alert(data.message);
                                            })
                                        }}>Submit</button>&nbsp;
                                        <button class="btn btn-sm btn-primary" type="" onClick={
                                            () => {
                                                this.setState({
                                                    answerBox: ''
                                                })
                                            }
                                        }>Cancel</button>
                                        {/* <textarea rows="10" cols="83" name="answer" id="answer" onChange={this.onAnswer} defaultValue={this.props.answer} value={this.state.value} required></textarea>
                                        <button class="btn btn-sm btn-primary" type="submit" onClick={() => {
                                            var _id = this.props.ansID;
                                            var email = localStorage.getItem('email');
                                            var answer = this.state.answer;
                                            var { anonymousStatus } = this.state;
                                            var fname = localStorage.getItem('fname');
                                            var lname = localStorage.getItem('lname');
                                            Axios.post(url.url + 'answers/edit', { _id, email, answer, anonymousStatus}).then(result => {
                                                const data = result.data;
                                                alert(data.message);
                                            })
                                        }}>Submit</button>&nbsp;
                                                            <button class="btn btn-sm btn-primary" type="" onClick={
                                            () => {
                                                this.setState({
                                                    answerBox: ''
                                                })
                                            }
                                        }>Cancel</button> */}
                                    </div>
                                })
                            }}><i class='far fa-edit'></i> Edit</a></p>
                            {this.state.answerBox}
                            <br />
                            <p>
                                {/* ABCD */}
                                {/* answer comes here */}
                                {/* {this.pro   ps.answer} */}
                                {/* {console.log('ANSWER', this.state.answerPar)} */}
                                <div dangerouslySetInnerHTML={{__html: this.props.answer}}></div>
                            </p>
    
                        </div>
                        {/* <div class="card-footer">
                            <p><small>307.3k views</small></p>
                            <p><a href="" onClick={(e) => {
                                e.preventDefault();
                                const user = {
                                    fname: localStorage.getItem('fname'),
                                    lname: localStorage.getItem('lname'),
                                    email: localStorage.getItem('email')
                                }
                                Axios.post(url.url + 'answers/upvote', { _id: this.state.answerPar._id }).then(result => {
                                    // for real time changes
                                    this.setState({
                                        changeUp: 1
                                    })
    
                                })
                            }}><i class="fa fa-arrow-up custom"></i> Upvote&nbsp;     {this.state.answerPar.upVote + this.state.changeUp}</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="" onClick={(e) => {
                                e.preventDefault();
                                const user = {
                                    fname: localStorage.getItem('fname'),
                                    lname: localStorage.getItem('lname'),
                                    email: localStorage.getItem('email')
                                }
                                Axios.post(url.url + 'answers/downvote', { _id: this.state.answerPar._id }).then(result => {
                                    // for real time changes
                                    this.setState({
                                        changeDown: 1
                                    })
                                })
                            }}><i class="fa fa-arrow-down custom"></i> Downvote&nbsp;    {this.state.answerPar.downVote + this.state.changeDown}</a></p>
                        </div> */}
                    </div>
                    <br />
                </div>
            );
        }
        else{
            return(
                <div>

                </div>
            );
        }
        
    }
}

export default AnswerEdit;