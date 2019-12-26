import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Login from './Login/Login';
import Home from './Home/Home';
import QuestionDisplay from './QuestionDisplay/QuestionDisplay';
import TopicDisplay from './TopicDisplay/TopicDisplay';
import ProfileDisplay from './ProfileDisplay/ProfileDisplay';
import SignUp from './SignUp/SignUp';
import Profile from './Profile/Profile';
import Topic from './TopicDisplay/Topic';
import ViewQuestions from './ViewQuestions/ViewQuestions';
import Messages from './Messages/Messages';
import AnswerDisplay from './AnswerDisplay/AnswerDisplay';
import Navbar from './LandingPage/Navbar';
import TopicFeed from './TopicDisplay/TopicFeed';
import YourContent from './User/YourContent';
import Notifications from './Notifications/Notifications';
import Graph from './Graph/Graph';

//Create a Main Component
class Main extends Component {
    render(){
        return(
            <div>
       
                {/*Render Different Component based on Route*/}
                <Route path="/" component={Navbar}/>
                <Route path="/login" component={Login}/>
                <Route path="/home" component={Home}/>
                <Route path="/questiondisplay" component={QuestionDisplay}/>
                <Route path="/topicdisplay" component={TopicDisplay}/>
                <Route path="/profiledisplay" component={ProfileDisplay}/>
                <Route path="/signup" component={SignUp}/>
                <Route path="/profile" component={Profile}/>
                <Route path="/topic" component={Topic}/>
                <Route path="/viewquestion" component={ViewQuestions}/>
                <Route path='/messages' component={Messages}/>
				<Route path='/questionCard' component={AnswerDisplay}/>
                <Route path='/topicfeed' component={TopicFeed}/>
                <Route path="/yourcontent" component={YourContent}/>
                <Route path='/notifications' component={Notifications}/>
                <Route path="/graph" component={Graph}/>
            </div>
         
        )
    }
}
//Export The Main Component
export default Main;