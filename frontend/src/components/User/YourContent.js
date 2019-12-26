import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import url from '../Url/Url';

class YourContent extends Component {
    constructor() {
        super();
        this.state = {
            user: "",
            email: "",
            role: "",
            answers: [],
            questions: [],
            answerBox: '',
            anonymousStatus: false,
            anonymous: 'Not Anonymous',
            questionsAskedList: [],
            questionsFollowedList: [],
            questionsAnsweredList: [],
            results: ["a"],
            contentType: "",
            userEmail: localStorage.getItem("email"),
            year: "",
            sort: -1,  //newest

        }
        this.setContent = this.setContent.bind(this);
        this.loadAsked = this.loadAsked.bind(this);
        this.loadAnswered = this.loadAnswered.bind(this);
        this.loadFollowed = this.loadFollowed.bind(this);
        this.ApplyYearFilter = this.ApplyYearFilter.bind(this);
        this.ApplySortFilter = this.ApplySortFilter.bind(this);
    }
    componentWillMount() {

    }
    componentDidMount() {
      this.loadAnswered();
      this.loadAsked();
      this.loadFollowed();
    }


    ApplyYearFilter = (e) => {
     
        this.setState({
            year: e
          }, () => this.setContent(this.state.contentType))
            ;
    }

    ApplySortFilter = (e) => {
        this.setState({
            sort: e
        }, () => this.setContent(this.state.contentType))
          ;
    }

    setContent = (e) => {
    

        this.setState({
            contentType: e
          });
       if (e == "asked") {
           this.loadAsked();
       }
       else if (e == "followed") {
        this.loadFollowed();
       }
       else if (e == "answered") {
        this.loadAnswered();   
        }


    }

    loadAsked(){
        var email = this.state.userEmail;
        const params = {
            createdby: email,
            year: this.state.year,
            sort: this.state.sort
        };
        const options = {
            params,
            headers: {
                'Authorization': localStorage.jwt,
            },
        };
      
      axios.get(url.url+'questions/created'
        , options
      )
        .then((response) => {
          
          this.setState({
            questionsAskedList: response.data
          });
        });
    }

    loadFollowed(){
        var email = this.state.userEmail;

        const params = {
            user: email,
            year: this.state.year,
            sort: this.state.sort
        };
        const options = {
            params,
            headers: {
                'Authorization': localStorage.jwt,
            },
        };
      
      axios.get(url.url+'questions/followedquestions'
        , options
      )
        .then((response) => {
            console.log("hit",response)
          this.setState({
            questionsFollowedList: response.data
          });
        });
    }

    loadAnswered(){
        var email = this.state.userEmail;

        const params = {
            owner: email,
            year: this.state.year,
            sort: this.state.sort
        };
        const options = {
            params,
            headers: {
                'Authorization': localStorage.jwt,
            },
        };
      
      axios.get(url.url+'answers/answered'
        , options
      )
        .then((response) => {
        
          //update the state with the response data
          this.setState({
            questionsAnsweredList: response.data
          });
        });
    }


    render() {
      
        let redirectVar = null;
        if (cookie.load('cookie')) {
            console.log("in Navbar redirectVar")
            redirectVar = <Redirect to="/home" />
        }
        if (!cookie.load('cookie')) {
            console.log("in Navbar redirectVar")
            redirectVar = <Redirect to="/home" />
        }
        let questionsAsked = this.state.questionsAskedList.map(item => {
            return (
                <div class="top7">
                 <li class="list-group-item">   <Link to='/questionCard' onClick={() => {
                    localStorage.setItem('questionID', item._id);
                    localStorage.setItem('question', item.question);
                    axios.post(url.url + 'answers/views', { questionID: item._id }).then(result => {
                        alert(result.data.message);
                    });
                }}> {item.question} <br/> <p class="text-secondary"> asked {item.posted}</p></Link></li>
                </div>
            )
        })

        let questionsFollowed = this.state.questionsFollowedList.map(item => {
            return (
                <div class="top7">
                <li class="list-group-item">   <Link to='/questionCard' onClick={() => {
                   localStorage.setItem('questionID', item.questionid);
                   localStorage.setItem('question', item.question);
                   axios.post(url.url + 'answers/views', { questionID: item.questionid }).then(result => {
                    alert(result.data.message);
                });
               }}> {item.question} <br/> <p class="text-secondary"> followed {item.followed}</p></Link></li>
               </div>
            )
        })

        let questionsAnswered = this.state.questionsAnsweredList.map(item => {
            return (
                <div class="top7">
                <li class="list-group-item">   <Link to='/questionCard' onClick={() => {
                   localStorage.setItem('questionID', item.questionID);
                   localStorage.setItem('question', item.question);
                   axios.post(url.url + 'answers/views', { questionID: item.questionID }).then(result => {
                    alert(result.data.message);
                });
               }}> {item.question} <br/> <p class="text-secondary"> answered {item.posted}</p></Link></li>
               </div>
            )
        })


        let display = this.state.results.map(questionsAnsweredList => {
            return (
                <p style={{margin : '20px'}}>
                        Hello! Select a filter.
                </p>
            )
        })
        if (this.state.contentType == "asked") {
             display =  questionsAsked ;
        }
        else if (this.state.contentType == "followed") {
             display =  questionsFollowed ;
        }
        else if (this.state.contentType == "answered") {
             display =  questionsAnswered ;
        }
        return (
            <div class="container">
                <div class="row" style={{margin : '20px'}}>

                    <div class="col-md-2">
                        <h6>  By Content Type </h6>
                        <p><Link to="/yourcontent" onClick={() => this.setContent( "asked") }><small>  Questions Asked </small></Link></p>
                        <p><Link to="/yourcontent" onClick={() => this.setContent( "followed") } ><small>  Questions Followed </small></Link></p>
                        <p><Link to="/yourcontent" onClick={() => this.setContent( "answered") }   ><small> Answers </small></Link></p>
                        <br />
                        <h6>  By Year </h6>
                        <p><Link to="/yourcontent"
                             ref={this.simulateClick}
                             onClick={() => this.ApplyYearFilter("2019")}
                        ><small>  2019 </small></Link></p>
                        <p><Link to="/yourcontent"    onClick={() => this.ApplyYearFilter("2018")}
                             ><small>  2018</small></Link></p>
                               <p><Link to="/yourcontent"    onClick={() => this.ApplyYearFilter("")}
                             ><small>  All</small></Link></p>
                        <br />
                        <h6>  Sort Order </h6>
                        <p><Link to="/yourcontent"  onClick={() => this.ApplySortFilter("-1")}   ><small>  Newest </small></Link></p>
                        <p><Link to="/yourcontent"  onClick={() => this.ApplySortFilter("1")}     ><small>  Oldest</small></Link></p>
                    </div>
                    <div class="col-md-8">
                        <div class="card">
                        {display}
                  
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default YourContent;