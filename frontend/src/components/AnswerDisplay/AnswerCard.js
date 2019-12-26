import React, { Component } from 'react';
import Axios from 'axios';
import url from '../Url/Url';
import cookie from 'react-cookies';

class AnswerCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            answerBox: '',
            answerPar: [],
            answer: '',
            anonymousStatus: '',
            changeUp: 0,
            changeDown: 0,
            comment: '',
            comments: [],
            commentsDisp: ''
        }
        this.onComment = this.onComment.bind(this);
    }

    // componentDidMount() {
    //     // console.log('MYDID', this.props.id);
    //     // Axios.get(url.url + 'answers', { params: { _id: this.props.id } }).then(docs => {
    //     //     this.setState({
    //     //         answerPar: docs.data
    //     //     })

    //     // })
    // }
    

    

    onComment(event) {
        this.setState({
            comment: event.target.value
        })
    }

    render() {
        var views = 0;
        if (this.props.views != undefined) {
            views = this.props.views;
        }

        var prevComments = '';
        let ifCommentable = null;
        let ifVotable = null;

        if (true) {
            if (this.props.isCommentable) {
                ifCommentable = (<div>
                    <p><small>Comment</small></p>

                    <table>
                        <tr>
                            <td><textarea rows="1" cols="63" name="comment" id="comment" placeholder="Comment..." value={this.state.value} onChange={this.onComment}></textarea></td>
                            <td><p><small><a class="nav-link" href="#" onClick={(e) => {
                                e.preventDefault();
                                if (cookie.load('cookie')) {
                                    const { comment } = this.state;
                                    const _id = this.props.id;
                                    Axios.post(url.url + 'answers/comment', { _id, comment }).then(result => {
                                        alert(result.data.message);
                                        this.setState({
                                            comment: ''
                                        })
                                    })
                                }
                                else {
                                    alert('Login First');
                                }

                            }}>Submit</a></small></p></td>
                            <td><p><small><a class="nav-link" href="#" onClick={(e) => {
                                e.preventDefault();
                                const _id = this.props.id;
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
                ifCommentable = (
                    <div>

                    </div>
                )
            }
        }


        if (true) {
            if (this.props.isVotable) {
                ifVotable = (
                    <div>
                        <div>

                            <p><a href="" onClick={(e) => {

                                e.preventDefault();
                                const user = {
                                    fname: localStorage.getItem('fname'),
                                    lname: localStorage.getItem('lname'),
                                    email: localStorage.getItem('email')
                                }

                                var email = localStorage.getItem('email');
                                Axios.post(url.url + 'answers/upvote', { _id: this.props.id, email }).then(result => {
                                    if (result.data.flag === true) {
                                        // for real time changes
                                        this.setState({
                                            changeUp: 1
                                        })
                                    }

                                    alert(result.data.message);
                                })
                            }}><i class="fa fa-arrow-up custom"></i> Upvote&nbsp;     {this.props.upVote + this.state.changeUp}</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="" onClick={(e) => {
                                e.preventDefault();
                                const user = {
                                    fname: localStorage.getItem('fname'),
                                    lname: localStorage.getItem('lname'),
                                    email: localStorage.getItem('email')
                                }
                                var email = localStorage.getItem('email');
                                Axios.post(url.url + 'answers/downvote', { _id: this.props.id, email }).then(result => {
                                    if (result.data.flag === true) {
                                        // for real time changes
                                        this.setState({
                                            changeDown: 1
                                        })
                                    }
                                    alert(result.data.message);
                                })
                            }}><i class="fa fa-arrow-down custom"></i> Downvote&nbsp;    {this.props.downVote + this.state.changeDown}</a></p><br />



                        </div>
                    </div>
                )
            }

            else {
                <div>

                </div>
            }
        }

        return (

            <div>

                <div class="card-body" style={{backgroundColor: '#DCDCDC'}}>
                    {/* <p><img class="img-profile rounded-circle" src={localStorage.image} height="40" width="40" /> {this.state.answerPar.fname} {this.state.answerPar.lname}, <small>{this.state.answerPar.date}</small></p> */}
                    <p><img class="img-profile rounded-circle" src={this.props.image} height="40" width="40" /> {this.props.fname} {this.props.lname}, <small>Answered on {this.props.date.substr(0, 10)}, {this.props.date.substr(11, 5)}</small></p>
                    <br />
                    <p>
                        <p><a href="#" onClick={(e) => {
                            e.preventDefault();
                            if (cookie.load('cookie')) {
                                const questionID = localStorage.getItem('questionID');
                                const question = localStorage.getItem('question');
                                const email = localStorage.getItem('email');
                                const questionOwner = this.props.owner
                                const answer = this.props.answerDisp;
                                const _id = this.props.id;
                                Axios.post(url.url + 'answers/bookmark', { _id, question, questionID, questionOwner, answer, email }).then(result => {
                                    if (result.data.bookmarked) {
                                        alert('Added to Bookmarks');
                                    }
                                    else {
                                        alert('Removed from Bookmarks');
                                    }
                                })
                            }
                            else{
                                alert('Login First');
                            }

                        }}><i class="fa fa-bookmark"></i>&nbsp;&nbsp;Bookmark</a></p>
                        <div dangerouslySetInnerHTML={{ __html: this.props.answerDisp }}></div>
                    </p>
                    <p><small>{views} views</small></p>
                    {ifVotable}
                    {ifCommentable}
                </div>
                
                <br/><br/>

            </div>

        );
    }
}

export default AnswerCard;