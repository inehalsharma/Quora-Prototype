import React, { Component } from 'react';
import Axios from 'axios';
import url from '../Url/Url';
import {Link} from 'react-router-dom';

class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            display: [],
            topics: []
        }
    }

    loadTopics() {
        //loads topics to show on left side of home screen
        Axios.get(url.url + 'topics')
            .then((response) => {
                //update the state with the response data
                this.setState({
                    topics: response.data
                });
            });
    }

    componentDidMount() {
        this.loadTopics();
        var email = localStorage.getItem('email');
        Axios.get(url.url + 'answers/notify', {params: {email: email}}).then(result=>{
            this.setState({
                display: result.data
            })
        })
        Axios.post(url.url + 'answers/notify', {email}).then(result=>{
            console.log(result);  
        })
    }

    render() {
        let topics = this.state.topics.map(topic => {
            return (
                <p><Link to="/topicfeed"   onClick={() => localStorage.setItem("topicFeed",topic.topic) }  ><img class="img-profile rounded" src={"/uploads/topic/" + topic.picture} height="25" width="25" /><small> {topic.topic}</small></Link></p>
            )
        });


        let notifications = this.state.display.map(notif => {
            if(notif.view){
                return(
                    <div>
                        <p><strong>{notif.question}</strong></p>
                        <div dangerouslySetInnerHTML={{ __html: notif.answer }}></div>
                    </div>
                )
            }
            else{
                <div>

                </div>
            }
            
        })

        return (
            <div class="container">

                <br />
                <div class="row">

                    <div class="col-md-2">
                        {topics}
                        <p><Link to="/topic"><small>  Add new Topic</small></Link></p>
                    </div>

                    <div class="col-md-8">
                        {notifications}
                    </div>


                    <div class="col-md-2">
                        Improve your feed
                    </div>
                </div>
            </div>
                );
            }
        }
        
export default Notifications;