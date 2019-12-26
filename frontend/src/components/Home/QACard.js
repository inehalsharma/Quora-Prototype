import React, { Component } from 'react';
import Axios from 'axios';
import url from '../Url/Url';
import cookie, { load } from 'react-cookies';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill';

class QACard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            answerBox: '',
            answerPar: '',
            answer: '',
            anonymousStatus: 'true',
            changeUp: 0,
            changeDown: 0,
            comment: '',
            comments: [],
            commentsDisp: '',
            commentable: 'true',
            votable: 'true',
            followerUp:0,
            followCount: 0,
            followersData: []
        }
        this.anonymousSelect = this.anonymousSelect.bind(this);
        this.onAnswer = this.onAnswer.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onComment = this.onComment.bind(this);
        this.commentable = this.commentable.bind(this);
        this.votable = this.votable.bind(this);
    }

    onComment(event) {
        this.setState({
            comment: event.target.value
        })
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

    anonymousSelect(event) {
        this.setState({
            anonymousStatus: event.target.value
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

    componentDidMount() {
        // console.log('MYDID', this.props.id);
        Axios.get(url.url + 'answers/one', { params: { _id: this.props.id } }).then(docs => {
            this.setState({
                answerPar: docs.data
            })
        })

        Axios.get(url.url + 'questions/followNumber', {params:{ qid: this.props.id }}).then(response => {
            // console.log('MY RESPONSESSSSSS', response);
            this.setState({
                followersData: response.data,
                followCount: response.data.length
            });
        })
    }

    render() {
        var prevComments = '';
        let whoAnswered = null;
        let ifCommentable = null;
        let ifVotable = null;
        var views = 0;
        if (this.state.answerPar.views != undefined) {
            views = this.state.answerPar.views;
        }
        if (true) {
            if (this.state.answerPar.answer) {
                if (this.state.answerPar.isAnonymous) {
                    whoAnswered = (
                        <p><img class="img-profile rounded-circle" src="http://www.clker.com/cliparts/l/4/M/i/d/X/turquoise-anonymous-man-md.png" height="40" width="40" /> {"Anonymous"}, <small>{this.state.answerPar.posted.substr(0, 10)}, {this.state.answerPar.posted.substr(11, 5)}</small></p>
                    );
                }
                else {
                    whoAnswered = (
                        <p><img class="img-profile rounded-circle" src={this.state.answerPar.image} height="40" width="40" /> {this.state.answerPar.fname} {this.state.answerPar.lname}, <small>{this.state.answerPar.posted.substr(0, 10)}, {this.state.answerPar.posted.substr(11, 5)}</small></p>
                    );
                }
            }
            else {
                whoAnswered = (
                    <p><small>Not Yet Answered</small></p>
                );
            }
        }


        if (true) {
            if (this.state.answerPar.isCommentable) {
                ifCommentable = (<div class="card-body">
                    <p><small>Comment</small></p>

                    <table>
                        <tr>
                            <td><textarea rows="1" cols="63" name="comment" id="comment" placeholder="Comment..." value={this.state.value} onChange={this.onComment}></textarea></td>
                            <td><p><small><a class="nav-link" href="#" onClick={() => {
                                if (cookie.load('cookie')) {
                                    const { comment } = this.state;
                                    const _id = this.state.answerPar._id;
                                    Axios.post(url.url + 'answers/comment', { _id, comment }).then(result => {
                                        alert(result.data);
                                    })
                                }
                                else {
                                    alert('Login First');
                                }

                            }}>Submit</a></small></p></td>
                            <td><p><small><a class="nav-link" href="#" onClick={(e) => {
                                e.preventDefault();
                                const _id = this.state.answerPar._id;
                                Axios.get(url.url + 'answers/comment', { params: { _id: _id } }).then(result => {
                                    console.log('COMMENT GET DaTA', result.data);
                                    this.setState({
                                        comments: result.data
                                    })
                                    if (this.state.comments.length > 0) {
                                        prevComments = this.state.comments.map(com => {
                                            console.log('COMMENT', com.comment);
                                            return (
                                                <tr key={com._id}>
                                                    <td><p>{com.comment}</p></td>
                                                    <td><i><p style={{ WebkitTextFillColor: '#808080' }}><small>{com.posted.substr(0, 10)},  {com.posted.substr(11, 5)}</small></p></i></td>
                                                </tr>);
                                        })
                                        this.setState({
                                            commentsDisp: prevComments
                                        })
                                    }
                                })
                            }}>View All</a></small></p></td>
                        </tr>
                    </table>
                    <table>
                        <th>Previous Comments</th>
                        {this.state.commentsDisp}
                    </table>
                </div>);
            }

            else {
                ifCommentable = (<div>

                </div>);
            }
        }


        if (true) {
            if (this.state.answerPar.isVotable) {
                ifVotable = (<div class="card-body">

                    <p><a href="" onClick={(e) => {
                        e.preventDefault();
                        if (cookie.load('cookie')) {
                            const user = {
                                fname: localStorage.getItem('fname'),
                                lname: localStorage.getItem('lname'),
                                email: localStorage.getItem('email')
                            }
                            var email = localStorage.getItem('email');
                            Axios.post(url.url + 'answers/upvote', { _id: this.state.answerPar._id, email }).then(result => {
                                if (result.data.flag === true) {
                                    // for real time changes
                                    this.setState({
                                        changeUp: 1
                                    })
                                }

                                alert(result.data.message);
                            })
                        }
                        else {
                            alert('Login First');
                        }

                    }}><i class="fa fa-arrow-up custom"></i> Upvote&nbsp;     {this.state.answerPar.upVote + this.state.changeUp}</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="" onClick={(e) => {
                        e.preventDefault();
                        if (cookie.load('cookie')) {
                            const user = {
                                fname: localStorage.getItem('fname'),
                                lname: localStorage.getItem('lname'),
                                email: localStorage.getItem('email')
                            }
                            var email = localStorage.getItem('email');
                            Axios.post(url.url + 'answers/downvote', { _id: this.state.answerPar._id, email }).then(result => {
                                if (result.data.flag === true) {
                                    // for real time changes
                                    this.setState({
                                        changeDown: 1
                                    })
                                }
                                alert(result.data.message);
                            })
                        }
                        else {
                            alert('Login First');
                        }

                    }}><i class="fa fa-arrow-down custom"></i> Downvote&nbsp;    {this.state.answerPar.downVote + this.state.changeDown}</a></p>

                </div>);
            }

            else {
                ifVotable = (
                    <div>

                    </div>
                )
            }
        }


        return (

            <div>
                <div class="card bg-light text-dark">
                    <h4 style={{ paddingLeft: '25px', paddingRight: '25px' }} class="card-title">
                        <br />
                        <Link to='/questionCard' onClick={() => {
                            localStorage.setItem('questionID', this.props.id);
                            localStorage.setItem('question', this.props.question);
                            localStorage.setItem('questionOwner', this.props.owner);
                            var email = localStorage.getItem('email');
                            Axios.post(url.url + 'answers/views', { questionID: this.props.id }).then(result => {
                                console.log(result.data.message);
                            });
                            var question = localStorage.getItem('question');
                            Axios.post(url.url + 'answers/notify', {questionID: this.props.id, email: email, question}).then(result=>{
                                console.log(result.data.message);
                            })
                        }}>{this.props.question}</Link>
                        {/* //Question Comes here */}
                        {/* {questionPar.question}  */}
                    </h4>
                    <div class="card-body">
                        {/* <p><img class="img-profile rounded-circle" src={localStorage.image} height="40" width="40" /> {this.state.answerPar.fname} {this.state.answerPar.lname}, <small>{this.state.answerPar.date}</small></p> */}
                        {whoAnswered}
                        <p><a class="nav-link" href="#" onClick={(e) => {
                            e.preventDefault();
                            if (cookie.load('cookie')) {
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
                                                </div>
                                                <div class="col-md-4">
                                                <select name="commentable" onChange={this.commentable} value={this.state.value} class="form-control">
                                                    <option value="true">Commentable</option>
                                                    <option value="false">Not Commentable</option>
                                                </select>
                                                </div>
                                                <div class="col-md-4">
                                                <select name="votable" onChange={this.votable} value={this.state.value} class="form-control">
                                                    <option value="true">Votable</option>
                                                    <option value="false">Not Votable</option>
                                                </select>
                                                </div>
                                           
                                        </div>
                                        <br />
                                        
                                            <div className="text-editor">
                                                <ReactQuill theme="snow"
                                                    modules={this.modules}
                                                    formats={this.formats} value={this.state.answer}
                                                    onChange={this.handleChange}>
                                                </ReactQuill>
                                            </div>
                                       <br/>
                                        <button class="btn btn-sm btn-primary" type="submit" onClick={() => {
                                            var _id = localStorage.getItem('questionID');
                                            var email = localStorage.getItem('email');
                                            var answer = this.state.answer;
                                            var { anonymousStatus } = this.state;
                                            var { commentable } = this.state;
                                            var { votable } = this.state;
                                            var fname = localStorage.getItem('fname');
                                            var lname = localStorage.getItem('lname');
                                            var image = localStorage.getItem('image');
                                            var question = localStorage.getItem('question');

                                            Axios.post(url.url + 'answers', { _id, email, answer, anonymousStatus, fname, lname, image, commentable, votable, question }).then(result => {
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
                                    </div>
                                })
                            }
                            else {
                                alert('Login First');
                            }

                        }}><i class='far fa-edit'></i> Answer</a></p>
                        <p><a class="nav-link" href="#" onClick={(e) => {
                            e.preventDefault();
                            if (cookie.load('cookie')) {

                                var qid = this.props.id;
                                var follower = localStorage.getItem('email');
                                var question = localStorage.getItem('question');
                                Axios.post(url.url + 'questions/follow', { qid, follower, question })
                                                                   .then(response => {
                                        if (response.data.success === true) {
                                            this.setState({
                                                followerUp: 1
                                            })
                                        }
                                        alert(response.data.message);
                                    })
                            }
                            else {
                                alert('Login First');
                            }

                        }}> <i class="fas fa-user-plus"></i>  Follow  &nbsp;{this.state.followCount + this.state.followerUp}</a></p>
                        {this.state.answerBox}
                        <br />
                        <p>
                            {/* ABCD */}
                            {/* answer comes here */}
                            {/* {this.pro   ps.answer} */}
                            {/* {console.log('ANSWER', this.state.answerPar)} */}
                            <div dangerouslySetInnerHTML={{ __html: this.state.answerPar.answer }}></div>
                        </p>
                        <p><small>{views} views</small></p>
                        {ifVotable}
                        
                    </div>
                    {ifCommentable}
                </div>
                <br/>
            </div>
        );
    }
}

export default QACard;