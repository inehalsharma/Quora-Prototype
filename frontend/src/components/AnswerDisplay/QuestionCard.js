import React, { Component } from 'react';
import Axios from 'axios';
import AnswerCard from './AnswerCard';
import url from '../Url/Url';

class QuestionCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            answers: []
        }
    }

    componentDidMount() {
        console.log('QUESTION IDD', localStorage.getItem('questionID'))
        Axios.get(url.url + 'answers', { params: { _id: localStorage.getItem('questionID') } }).then(result => {
            this.setState({
                answers: this.state.answers.concat(result.data)
            })
        });


    }

    render() {
        var display = this.state.answers.map(answer => {
            console.log('IS ANAIDIDI', answer.isAnonymous);
            if (answer.isAnonymous === false) {
                return (
                    <AnswerCard key={answer._id} image={answer.image} id={answer._id} answerDisp={answer.answer} fname={answer.fname} lname={answer.lname} date={answer.posted} upVote={answer.upVote} downVote={answer.downVote} isCommentable={answer.isCommentable} isVotable={answer.isVotable} views={answer.views} owner={answer.owner}/>
                );
            }

            else {
                return (
                    <AnswerCard key={answer._id} image="http://www.clker.com/cliparts/l/4/M/i/d/X/turquoise-anonymous-man-md.png" id={answer._id} answerDisp={answer.answer} fname="Anonymous" lname="" date={answer.posted} upVote={answer.upVote} downVote={answer.downVote} isCommentable={answer.isCommentable} isVotable={answer.isVotable} views={answer.views} answer={answer.owner}/>
                );
            }
        })



        return (
            <div>
                <div class="card bg-light text-dark">
                    <h4 style={{ paddingLeft: '25px', paddingRight: '25px' }} class="card-title">
                        <br />
                        {localStorage.getItem('question')}
                    </h4>
                    {/* {AnswerCard comes here} */}

                </div>
                {display}
            </div>
        );
    }
}

export default QuestionCard;