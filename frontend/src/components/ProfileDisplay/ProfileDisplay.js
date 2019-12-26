import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import url from "../Url/Url";
import CredentialProfile from "./CredentialProfile";


class ProfileDisplay extends Component {
    constructor() {
        super();
        this.state = {
            user: "",
            email: "",
            role: "",
            answers: [],
            questions: [],
            answerBox:'',
            anonymousStatus: false,
            anonymous: 'Not Anonymous',
            fname:"",
            lname:"",
            edu:[],
            comp:[],
            image:"",
            about:"",
            state:"",
            city:"",
            profileCredential:"",
            zipcode:"",
            profile:[],
            feeds: "Profile",
            followerUp:0,
            followersData:[]

        }
        this.getProfile = this.getProfile.bind(this);
        
      
    
    }
    componentWillMount() {
        

    }
    getProfile = e => {
        var headers = new Headers();
      const params = {
        id: localStorage.profiledisplay
      };
      const options = {
        params,
        headers: {
          Authorization: localStorage.jwt
        }
      };
      axios.get(url.url + "profile/id", options).then(response => {
        //update the state with the response data
        this.setState({
          profile: this.state.profile.concat(response.data)
        });
  
        this.state.profile.map(item => {
          this.setState({
            fname: item.fname,
            lname: item.lname,
            about: item.about,
            city: item.city,
            profileCredential: item.profilecredential,
            state: item.state,
            zipcode: item.zipcode,
            edu:item.education,
            comp:item.company,
            image:item.image
            
          });
  
        });
        
      });
      };
  
    componentDidMount() {
      this.getProfile();

      axios.get(url.url + 'profile/followNumber', {params:{ userid:  localStorage.profiledisplay}}).then(response => {
        // console.log('MY RESPONSESSSSSS', response);
        this.setState({
            followersData: response.data,
            followCount: response.data.length
        });
    })
    }

    render() {
        let redirectVar = null;
        
        if (!cookie.load('cookie')) {
            console.log("in Navbar redirectVar")
            redirectVar = <Redirect to="/home" />
        }
        var experienceText = "";
    if ([...this.state.comp])
    {
      var comp=[...this.state.comp];
      
      if(comp.length > 0)
        experienceText =<p><i class="fas fa-briefcase" /> {comp[comp.length - 1].companyposition} at {comp[comp.length - 1].companyname}</p>;
    }
    var locationText ="";
    if(this.state.city || this.state.state)
    {
      locationText = <b><i class="fas fa-map-marker" /> {this.state.city} {this.state.state}</b>;
    }

    var educationText= "";
    if ([...this.state.edu])
    {
      
      var edu=[...this.state.edu];
      
      if(edu.length > 0)
        educationText =<p><i class="fas fa-graduation-cap" /> {edu[edu.length - 1].educationdegree} at {edu[edu.length - 1].educationschool}</p>;
    }
        return (
            <div class="container">
            <div class="body-div">
            {redirectVar }
          <br />
          <div class="row">
            <div class="col-md-3">
              <img
                src={this.state.image} class="rounded-circle" alt="Profile Pic" width="170" height="155" />
              <br /> <br />
            </div>
            
            <div class="col-md-6">
              <table align="center" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                  <p>
                      <font size="6">{this.state.fname} {this.state.lname}{" "}</font>
                    </p>
                  </td>
                  </tr>
                  <tr>
                  <td>
                  <p>
                      <font size="4">{this.state.profileCredential} </font>{" "}
                      </p>
                  </td>
                  </tr>
                  <tr />
                <tr>
                  <td><p>
                      <font size="4">{this.state.about} </font>{" "}
                    </p></td>
                  </tr>
                  <tr>
                    <td>
                    <p><a class="nav-link" href="#" onClick={(e) => {
                            e.preventDefault();
                            if (cookie.load('cookie')) {

                                var follower = localStorage.getItem('email');
                                var userid = localStorage.getItem('profiledisplay');
                                var userfname = this.state.fname;
                                var userlname = this.state.lname;
                                var userimage = this.state.image;
                                {console.log("follow", follower,userid,userfname,userlname,userimage);}
                                axios.post(url.url + 'profile/follow', { follower, userid , userfname, userlname, userimage})
                                    .then(response => {
                                      {console.log("follow response", response.data)}
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
                      </td>
                  </tr>
                  </table>
                  </div>
                  <div class="col-md-3">
              <table align="center" width="100%" cellpadding="0" cellspacing="0" border="0">
             

              <div id="edit" class="modalDialog">
             <CredentialProfile  edu={this.state.edu} comp={this.state.comp}/>

              </div>
              <p>Credentials and Highlights <a href="#edit">More </a></p>

                <hr />
                <tr />
                <tr>
                  <td>
                  <b>{experienceText}</b>
                  </td>
                  </tr>
                  <tr>
                  <td>
                  <b>{educationText}</b>
                  </td>
                  </tr>
                  <tr>
                  <td>
                    {locationText}
                  </td>
                  </tr>

                </table>
                </div>
            </div>
            <hr />
          {/* Below part of Screen */}
          <div class="row">

            <div class="col-md-3">
              <h6>Feeds</h6>
              <hr />
              <ul style={{ listStyleType: "none" }} >
                <li><a onClick={() => { this.setState({ feeds: "Profile" }) }} class="a-hover">Profile</a></li>
                <li><a onClick={() => { this.setState({ feeds: "Questions" }) }} class="a-hover">Questions</a></li>
                <li><Link to="/useranswerdisplay" onClick={() => { this.setState({ feeds: "Answers" }) }} class="a-hover">Answers</Link></li>
                <li><a onClick={() => { this.setState({ feeds: "Bookmarks" }) }} class="a-hover">Bookmarks</a></li>
                <li><a onClick={() => { this.setState({ feeds: "Followers" }) }} class="a-hover">Followers</a></li>
                <li><a onClick={() => { this.setState({ feeds: "Following" }) }} class="a-hover">Following</a></li>
              </ul>

            </div>
            <div class="col-md-6">
              <h6>{this.state.feeds}</h6>
              <hr />
            </div>
            <div class="col-md-3">
            </div>
          </div>
          {/* end of Part */}
            </div>
            </div>
            
        )
    }
}

export default ProfileDisplay;