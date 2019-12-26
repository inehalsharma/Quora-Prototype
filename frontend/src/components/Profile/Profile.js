import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import url from "../Url/Url";
import * as state from "./state";
import Editprofile from "./EditProfile";
import { Link } from 'react-router-dom';
import AnswerEdit from '../UserAnswerDisplay/AnswerEdit';

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      feeds: "Profile",
      question: [],
      questionfollower:[],
      answer: [],
      answers: [],
      useranswers: [],
      followers: [],
      following: [],
      bookmarked: [],
      file: null,
      file_status: "",
      profile: [],
      authFlag: false,
      status: "",
      about: "",
      city: "",
      companyname: "",
      school: "",
      fname: "",
      lname: "",
      profileCredential: "",
      position: "",
      startyear: "",
      endyear: "",
      educationdegree: "",
      educationstart: "",
      educationend: "",
      state: "",
      zipcode: "",
      edu: [],
      comp: [],
      followersData: [],
      followCount: "",
      profile_id: "",
      followingData: [],
      userInactive:false,

    };
    //Bind the handlers to this class


    this.educationstartChangeHandler = this.educationstartChangeHandler.bind(
      this
    );
    this.educationendChangeHandler = this.educationendChangeHandler.bind(this);
    this.educationdegreeChangeHandler = this.educationdegreeChangeHandler.bind(
      this
    );
    this.startyearChangeHandler = this.startyearChangeHandler.bind(this);
    this.endyearChangeHandler = this.endyearChangeHandler.bind(this);

    this.positionChangeHandler = this.positionChangeHandler.bind(this);
    this.aboutChangeHandler = this.aboutChangeHandler.bind(this);
    this.cityChangeHandler = this.cityChangeHandler.bind(this);

    this.companyChangeHandler = this.companyChangeHandler.bind(this);
    this.schoolChangeHandler = this.schoolChangeHandler.bind(this);
    this.stateChangeHandler = this.stateChangeHandler.bind(this);
    this.zipcodeChangeHandler = this.zipcodeChangeHandler.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.fnameChangeHandler = this.fnameChangeHandler.bind(this);
    this.lnameChangeHandler = this.lnameChangeHandler.bind(this);
    this.profileCredentialChangeHandler = this.profileCredentialChangeHandler.bind(
      this
    );
    this.updateName = this.updateName.bind(this);
    this.updateProfileCredentialButton = this.updateProfileCredentialButton.bind(
      this
    );
    this.updateAboutButton = this.updateAboutButton.bind(this);
    this.updateEducationButton = this.updateEducationButton.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  componentWillMount() {
    //will be used to fetch User's feed details and count
    var headers = new Headers();
    const params = {
      email: localStorage.email
    };
    const options = {
      params,
      headers: {
        Authorization: localStorage.jwt
      }
    };
    // axios.get(url.url + "profile/email", options).then(response => {
    //   //update the state with the response data
    //   this.setState({
    //     profile: this.state.profile.concat(response.data)
    //   });
    // });
    this.getProfile();
  }
  //get the books data from backend
  getProfile() {
    var headers = new Headers();
    const params = {
      email: localStorage.email
    };
    const options = {
      params,
      headers: {
        Authorization: localStorage.jwt
      }
    };
    axios.get(url.url + "profile/email", options).then(response => {
      //update the state with the response data
      this.setState({
        profile: this.state.profile.concat(response.data)
      });
      console.log("data", response.data);

      this.state.profile.map(item => {
        this.setState({
          fname: item.fname,
          lname: item.lname,
          about: item.about,
          city: item.city,
          country: item.country,
          school: item.educationschool,
          profileCredential: item.profilecredential,
          company: item.companyname,
          position: item.companyposition,
          startyear: item.companystart,
          endyear: item.companyend,
          educationstart: item.educationstart,
          educationdegree: item.educationdegree,
          educationend: item.educationend,
          state: item.state,
          zipcode: item.zipcode,
          edu: item.education,
          comp: item.company,
          profile_id: item._id

        });

      });

    });
  }
  componentDidMount() {
    this.getProfile()
    axios.get(url.url + 'profile/followercount', { params: { useremail: localStorage.email } }).then(response => {
      console.log("response", response.data);
      // console.log('MY RESPONSESSSSSS', response);
      this.setState({
        followersData: response.data,
        followCount: response.data.length
      });
    })

    axios.get(url.url + 'profile/following', { params: { followeremail: localStorage.email } }).then(response => {
      console.log("response other", response.data);
      // console.log('MY RESPONSESSSSSS', response);
      this.setState({
        followingData: response.data,
        
      });
    })

      var follower = localStorage.getItem('email');
      axios.get(url.url + 'questions/questionfollow', { params: { follower } })
      .then((response) => {
        console.log("Data in Question Followed",response.data);
        this.setState({
          questionfollower: this.state.questionfollower.concat(response.data)
        });
    });


    var email = localStorage.getItem('email');
    axios.get(url.url + 'answers/bookmark', { params: { email } }).then(result => {
      this.setState({
        answers: result.data
      })
    })

    axios.get(url.url + 'answers/useranswer', { params: { email: email } }).then(result => {
      console.log('MY ANSWER ', result.data);
      this.setState({
        useranswers: this.state.useranswers.concat(result.data)
      })
    })

  }

  stateChangeHandler = e => {
    this.setState({
      state: e.target.value
    });
  };

  zipcodeChangeHandler = e => {
    this.setState({
      zipcode: e.target.value
    });
  };

  educationendChangeHandler = e => {
    this.setState({
      educationend: e.target.value
    });
  };

  educationstartChangeHandler = e => {
    this.setState({
      educationstart: e.target.value
    });
  };

  educationdegreeChangeHandler = e => {
    this.setState({
      educationdegree: e.target.value
    });
  };

  positionChangeHandler = e => {
    this.setState({
      position: e.target.value
    });
  };

  aboutChangeHandler = e => {
    this.setState({
      about: e.target.value
    });
  };

  startyearChangeHandler = e => {
    this.setState({
      startyear: e.target.value
    });
  };

  endyearChangeHandler = e => {
    this.setState({
      endyear: e.target.value
    });
  };

  profileCredentialChangeHandler = e => {
    this.setState({
      profileCredential: e.target.value
    });
  };

  cityChangeHandler = e => {
    this.setState({
      city: e.target.value
    });
  };

  companyChangeHandler = e => {
    this.setState({
      companyname: e.target.value
    });
  };

  schoolChangeHandler = e => {
    this.setState({
      school: e.target.value
    });
  };

  fnameChangeHandler = e => {
    console.log("in here");
    this.setState({
      fname: e.target.value
    });
  };

  lnameChangeHandler = e => {
    this.setState({
      lname: e.target.value
    });
  };

  onFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("myImage", this.state.file);
    formData.append("email", localStorage.email);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: localStorage.jwt
      }
    };
    axios
      .post(url.url + "profile/imgupload", formData, config)
      .then(response => {
        alert("The file is successfully uploaded");
        let image = response.data.message;
        localStorage.setItem('image', image);
        this.setState({
          file_status: response.data.message
        });
      })
      .catch(error => { });
  }
  onChange(e) {
    this.setState({
      file: e.target.files[0]
    });
  }

  updateName = e => {
    console.log("submit name called");
    var headers = new Headers();

    //prevent page from refresh
    e.preventDefault();

    console.log("in updatename button");
    const data = [
      { propName: "email", value: localStorage.email },
      { propName: "fname", value: this.state.fname },
      { propName: "lname", value: this.state.lname }
    ];
    const options = {
      data,
      headers: {
        Authorization: localStorage.jwt
      }
    };
    const data1 = {
      fname: this.state.fname,
      lname: this.state.lname
    };
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.patch(url.url + "profile", data).then(response => {
      console.log("Status Code : ", response.status);
      if (response.status === 200) {
        this.props.onProfileLoad(data1);

        this.setState({
          authFlag: true,
          status: response.data.message
        });
      } else {
        console.log("Status Code : ", response.status);
        this.setState({
          status: response.data
        });
      }
    });
  };

  updateProfileCredentialButton = e => {
    var headers = new Headers();
    //prevent page from refresh
    e.preventDefault();

    const data = [
      { propName: "email", value: localStorage.email },
      { propName: "profilecredential", value: this.state.profileCredential }
    ];

    const data1 = {
      profileCredential: this.state.profileCredential
    };
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.patch(url.url + "profile", data).then(response => {
      console.log("Status Code : ", response.status);
      if (response.status === 200) {
        this.props.onProfileLoad(data1);

        this.setState({
          authFlag: true,
          status: response.data.message
        });
      } else {
        console.log("Status Code : ", response.status);
        this.setState({
          status: response.data
        });
      }
    });
  };

  updateAboutButton = e => {
    var headers = new Headers();
    //prevent page from refresh
    e.preventDefault();

    const data = [
      { propName: "email", value: localStorage.email },
      { propName: "about", value: this.state.about }
    ];

    const data1 = {
      about: this.state.about
    };
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.patch(url.url + "profile", data).then(response => {
      console.log("Status Code : ", response.status);
      if (response.status === 200) {
        this.props.onProfileLoad(data1);

        this.setState({
          authFlag: true,
          status: response.data.message
        });
      } else {
        console.log("Status Code : ", response.status);
        this.setState({
          status: response.data
        });
      }
    });
  };

  updateExperienceButton = e => {
    var headers = new Headers();
    //prevent page from refresh
    e.preventDefault();

    if (!(this.state.companyname || this.state.position || this.state.startyear || this.state.endyear)) {
      alert(
        "Please enter a valid value"
      );
    }
    else {

      const obj = {
        companyname: this.state.companyname,
        companyposition: this.state.position,
        companystart: this.state.startyear,
        companyend: this.state.endyear
      };

      const exp = this.state.comp.slice();
      exp.push(obj);

      const data = [
        { propName: "email", value: localStorage.email },
        { propName: "company", value: exp },
      ];
      //set the with credentials to true
      axios.defaults.withCredentials = true;
      //make a post request with the user data
      axios.patch(url.url + "profile", data).then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {


          this.setState({
            authFlag: true,
            status: response.data.message
          });
          this.getProfile();
        } else {
          console.log("Status Code : ", response.status);
          this.setState({
            status: response.data
          });
        }
      });
    }
  };

  updateEducationButton = e => {
    var headers = new Headers();
    //prevent page from refresh
    e.preventDefault();

    const data = [
      { propName: "email", value: localStorage.email },
      { propName: "educationschool", value: this.state.school },
      { propName: "educationdegree", value: this.state.educationdegree },
      { propName: "educationstart", value: this.state.educationstart },
      { propName: "educationend", value: this.state.educationend }
    ];

    const data1 = {
      school: this.state.school,
      educationdegree: this.state.educationdegree,
      educationend: this.state.educationend,
      educationstart: this.state.educationstart
    };
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.patch(url.url + "profile", data).then(response => {
      console.log("Status Code : ", response.status);
      if (response.status === 200) {
        this.props.onProfileLoad(data1);

        this.setState({
          authFlag: true,
          status: response.data.message
        });
      } else {
        console.log("Status Code : ", response.status);
        this.setState({
          status: response.data
        });
      }
    });
  };

  addEducation = e => {
    var headers = new Headers();
    //prevent page from refresh
    e.preventDefault();
    if (!(this.state.school || this.state.educationdegree || this.state.educationstart || this.state.educationend)) {
      alert(
        "Please enter a valid value"
      );
    }
    else {
      const obj = {
        educationschool: this.state.school,
        educationdegree: this.state.educationdegree,
        educationstart: this.state.educationstart,
        educationend: this.state.educationend
      }
      const edu = this.state.edu.slice();
      edu.push(obj);

      const data = [
        { propName: "email", value: localStorage.email },
        { propName: "education", value: edu },
      ];

      const data1 = {
        school: this.state.school,
        educationdegree: this.state.educationdegree,
        educationend: this.state.educationend,
        educationstart: this.state.educationstart
      };
      //set the with credentials to true
      axios.defaults.withCredentials = true;
      //make a post request with the user data
      axios.patch(url.url + "profile", data).then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          this.props.onProfileLoad(data1);

          this.setState({
            authFlag: true,
            status: response.data.message
          });
          this.getProfile();
        } else {
          console.log("Status Code : ", response.status);
          this.setState({
            status: response.data
          });
        }
      });
    }
  };


  updateLocationButton = e => {
    var headers = new Headers();
    //prevent page from refresh
    e.preventDefault();

    // zipcode validation
    var regexresult = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(this.state.zipcode);
    console.log("Result of zipcode regex", regexresult);

    //us state validation

    var checkstate = false;
    if (
      state.stateAbbreviations.includes(this.state.state) ||
      state.statenames.includes(this.state.state)
    ) {
      checkstate = true;
    }
    if (regexresult && checkstate) {
      const data = [
        { propName: "email", value: localStorage.email },
        { propName: "city", value: this.state.city },
        { propName: "state", value: this.state.state },
        { propName: "zipcode", value: this.state.zipcode }
      ];

      const data1 = {
        school: this.state.school,
        educationdegree: this.state.educationdegree,
        educationend: this.state.educationend,
        educationstart: this.state.educationstart
      };
      //set the with credentials to true
      axios.defaults.withCredentials = true;
      //make a post request with the user data
      axios.patch(url.url + "profile", data).then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          this.props.onProfileLoad(data1);

          this.setState({
            authFlag: true,
            status: response.data.message
          });
        } else {
          console.log("Status Code : ", response.status);
          this.setState({
            status: response.data
          });
        }
      });
    } else if (regexresult == false && checkstate == true) {
      console.log("Invalid US zip code");
      alert("Please enter a valid US zip code!!");
    } else if (regexresult == true && checkstate == false) {
      console.log("Invalid US state: malformed_state exception");
      alert("Please enter a valid US State!! malformed_state exception");
    } else {
      console.log(
        "Invalid US zip code && Invalid US State!! malformed_state exception"
      );
      alert(
        "Please enter a valid US zip code and State!! malformed_state exception"
      );
    }
  };
  deleteUser = e => {
    
    var headers = new Headers();

    //prevent page from refresh
    e.preventDefault();

    console.log("user delete");
    var headers = new Headers();
    const params = {
      email: localStorage.email
    };
    
    const options = {
      params,
      headers: {
        Authorization: localStorage.jwt
      }
    };
    
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.post(url.url + "user/delete", options).then(response => {
      console.log("Status Code : ", response.status);
      if (response.status === 200) {
        console.log("deletion", response.data);
        cookie.remove('cookie', { path: '/' })
        this.props.onLogout();
        this.setState({
          userInactive: true
        });
        console.log(this.state.userInactive);
      } 
    });
  };


  render() {
    let redirectVar = null;
    if (this.state.userInactive)
    {     
      redirectVar = <Redirect to="/home" />;
    }
    if (!cookie.load("cookie")) {
      redirectVar = <Redirect to="/login" />;
    }
    var ref = "#";
    ref = ref + localStorage.email;
    var ref_about = "#";
    ref_about = ref_about + "about";
    var ref_name = "#name";
    var aboutText = "Write description about yourself";
    if (this.state.about) {
      aboutText = "Edit";
    }
    var credentialText = "Add profile credential";
    if (this.state.profileCredential) {
      credentialText = "Edit";
    }
    var experienceText = <p><a href="#employment"><i class="fas fa-briefcase" /> Add Employment credential</a></p>;
    if ([...this.state.comp]) {
      
      var comp = [...this.state.comp];
      
      if (comp.length > 0)
        experienceText = <p><i class="fas fa-briefcase" /> {comp[comp.length - 1].companyposition} at {comp[comp.length - 1].companyname}</p>;
    }
    var locationText = "Add Location credential";
    if (this.state.city || this.state.state) {
      locationText = <b>{this.state.city} {this.state.state}</b>;
    }

    var educationText = <p><a href="#education"> <i class="fas fa-graduation-cap" /> Add education credential</a></p>;
    if ([...this.state.edu]) {
      
      var edu = [...this.state.edu];
      if (edu.length > 0)
        educationText = <p><i class="fas fa-graduation-cap" /> {edu[edu.length - 1].educationdegree} at {edu[edu.length - 1].educationschool}</p>;
    }

    return (
      <div class="container">
      {redirectVar}
        <div class="body-div">
          <br />
          <div class="row">
            <div class="col-md-3">
              <img
                src={localStorage.image} class="rounded-circle" alt="Profile Pic" width="170" height="155" />
              <br /> <br />
              <p>
                <div id="image" class="modalDialog">
                  <div>
                    <a href="#close" title="Close" class="close" onClick={() => { this.setState({ file_status: "" }); }}>X</a>
                    <h4>Add/Update image </h4>
                    <br />
                    <form onSubmit={this.onFormSubmit}>
                      <div class="row">
                        <div class="col-md-6">
                          <input type="file" name="myImage" onChange={this.onChange} />
                        </div>
                        <div class="col-md-6">
                          <button type="submit" class="btn btn-primary">Upload</button>
                        </div>
                      </div>
                    </form>

                    <p>
                      <font color="red">{this.state.file_status}</font>
                    </p>
                    <br /><br />
                    <a href="#close"><button type="reset" onClick={() => { this.setState({ file_status: "" }); }} class="btn btn-danger">Cancel</button>{" "}</a>{" "}&nbsp;
                      </div>
                </div>
                <p>
                  <div><a href="#image">Add image</a></div>

                </p>
              </p>


            </div>
            <div class="col-md-6">
              <table align="center" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <div id="name" class="modalDialog">
                      <div>
                        <a href="#close" title="Close" class="close" onClick={() => { this.setState({ status: "" }); }}>X</a>
                        <h4>Update Name </h4>
                        <input onChange={this.fnameChangeHandler} type="text" class="form-control" value={this.state.fname} />
                        <br />
                        <input onChange={this.lnameChangeHandler} type="text" class="form-control" value={this.state.lname} />
                        <br /> <br /><br />
                        <p>
                          <font color="red">{this.state.status}</font>
                        </p>
                        <br /><br />
                        <a href="#close"><button type="reset" onClick={() => { this.setState({ status: "" }); }} class="btn btn-danger">Cancel</button>{" "}</a>{" "}&nbsp;
                        <button onClick={this.updateName} class="btn btn-primary">Update</button>
                      </div>
                    </div>
                    <p>
                      <font size="6">{this.state.fname} {this.state.lname}{" "}</font>{" "}<a href={ref_name}>Edit</a>
                    </p>
                  </td>
                </tr>

                <tr>
                  <td>
                    <div id={localStorage.email} class="modalDialog">
                      <div>
                        <a href="#close" title="Close" class="close" onClick={() => { this.setState({ status: "" }); }}>X</a>
                        <h4>Edit credentials</h4>
                        <p>Credentials also appear on answers you write.</p>
                        <p><i class="fas fa-user" /> Add profile credential</p>
                        <textarea onChange={this.profileCredentialChangeHandler} rows="7" cols="50" class="form-control" name="content" value={this.state.profileCredential} />
                        <br /> <br /><br />
                        <p><font color="red">{this.state.status}</font></p>
                        <br /><br />
                        <a href="#close"><button type="reset" onClick={() => { this.setState({ status: "" }); }} class="btn btn-danger">Cancel</button></a>{" "}
                        &nbsp;
                        <button onClick={this.updateProfileCredentialButton} class="btn btn-primary">Update</button>
                      </div>
                    </div>
                    <p>
                      <font size="4">{this.state.profileCredential} </font>{" "}<a href={ref}>{credentialText}</a>
                    </p>
                  </td>
                </tr>
                <tr />
                <tr>
                  <td>
                    <div id="about" class="modalDialog">
                      <div>
                        <a href="#close" title="Close" class="close" onClick={() => { this.setState({ status: "" }); }}>X</a>
                        <h4>Write description about yourself </h4>
                        <textarea onChange={this.aboutChangeHandler} rows="7" cols="50" class="form-control" name="about" value={this.state.about} />
                        <br /> <br /><br />
                        <p><font color="red">{this.state.status}</font>
                        </p>
                        <br /><br />
                        <a href="#close"><button type="reset" class="btn btn-danger" onClick={() => { this.setState({ status: "" }); }}>Cancel</button></a>
                        &nbsp;
                        <button onClick={this.updateAboutButton} class="btn btn-primary">Update</button>
                      </div>
                    </div>
                    <p>
                      <font size="4">{this.state.about} </font>{" "}<a href={ref_about}>{aboutText}</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p><i class="fas fa-user-plus"></i>  Follow  &nbsp;{this.state.followCount}</p>

                  </td>

                </tr>

                <tr />
              </table>
            </div>
            <div class="col-md-3">
              <table align="center" width="100%" cellpadding="0" cellspacing="0" border="0">


                <div id="edit" class="modalDialog">
                  <Editprofile edu={this.state.edu} />

                </div>
                <p>Credentials and Highlights <a href="#edit"><i class="fas fa fa-edit" /> </a></p>

                <hr />
                <tr />
                <tr>
                  <td>
                    <div id="employment" class="modalDialog">
                      <div>
                        <a href="#close" title="Close" class="close" onClick={() => { this.setState({ status: "" }); }}>X</a>
                        <h4>Add employment credential </h4>
                        <br />
                        <br />
                        <div class="form-group row">
                          <div class="col-5">Position</div>
                          <div class="col-7">
                            <input onChange={this.positionChangeHandler} type="text" class="form-control" value={this.state.position} placeholder="position" />
                          </div>
                        </div>
                        <br />
                        <div class="form-group row">
                          <div class="col-5">Company/Organisation</div>
                          <div class="col-7">
                            <input onChange={this.companyChangeHandler} type="text" class="form-control" value={this.state.companyname} placeholder="company/organisation" />
                          </div>
                        </div>
                        <br />
                        <div class="form-group row">
                          <div class="col-5">Start Date</div>
                          <div class="col-7">
                            <input onChange={this.startyearChangeHandler} type="date" class="form-control" value={this.state.startyear} placeholder="start year" />
                          </div>
                        </div>
                        <br />
                        <div class="form-group row">
                          <div class="col-5">End Dates</div>
                          <div class="col-7">
                            <input onChange={this.endyearChangeHandler} type="date" class="form-control" value={this.state.endyear} placeholder="end year" />
                          </div>
                        </div>
                        <br /><br /><br />
                        <p> <font color="red">{this.state.status}</font></p>
                        <br /> <br /> <br />
                        <a href="#close"> <button type="reset" class="btn btn-danger" onClick={() => { this.setState({ status: "" }); }}>Cancel</button></a>
                        &nbsp;
                        <button onClick={this.updateExperienceButton} class="btn btn-primary">Update</button>
                      </div>
                    </div>
                    <b>{experienceText}</b>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div id="education" class="modalDialog">
                      <div>
                        <a href="#close" title="Close" class="close" onClick={() => { this.setState({ status: "" }); }}>X</a>
                        <h4>Add education credential </h4>
                        <br /><br />
                        <div class="form-group row">
                          <div class="col-5">School</div>
                          <div class="col-7">
                            <input onChange={this.schoolChangeHandler} type="text" class="form-control" value={this.state.school} placeholder="school" />
                          </div>
                        </div>
                        <br />
                        <div class="form-group row">
                          <div class="col-5">Degree</div>
                          <div class="col-7">
                            <input onChange={this.educationdegreeChangeHandler} type="text" class="form-control" value={this.state.educationdegree} placeholder="degree" />
                          </div>
                        </div>
                        <br />
                        <div class="form-group row">
                          <div class="col-5">Start Date</div>
                          <div class="col-7">
                            <input onChange={this.educationstartChangeHandler} type="date" class="form-control" value={this.state.educationstart} placeholder="start year" />
                          </div>
                        </div>
                        <br />
                        <div class="form-group row">
                          <div class="col-5">End Dates</div>
                          <div class="col-7">
                            <input onChange={this.educationendChangeHandler} type="date" class="form-control" value={this.state.educationend} placeholder="end year" />
                          </div>
                        </div>
                        <br /><br />
                        <p><font color="red">{this.state.status}</font></p>
                        <br /> <br />
                        <a href="#close"><button type="reset" class="btn btn-danger" onClick={() => { this.setState({ status: "" }); }}>Cancel</button></a>
                        &nbsp;
                        <button onClick={this.addEducation} class="btn btn-primary">Update</button>
                      </div>
                    </div>
                    <b>{educationText}</b>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div id="location" class="modalDialog">
                      <div>
                        <a href="#close" title="Close" class="close" onClick={() => { this.setState({ status: "" }); }}>X</a>
                        <h4>Add location credential </h4>
                        <br /><br />
                        <div class="form-group row">
                          <div class="col-5">City</div>
                          <div class="col-7">
                            <input onChange={this.cityChangeHandler} type="text" class="form-control" value={this.state.city} placeholder="city" />
                          </div>
                        </div>
                        <br />
                        <div class="form-group row">
                          <div class="col-5">State</div>
                          <div class="col-7">
                            <input onChange={this.stateChangeHandler} type="text" class="form-control" value={this.state.state} placeholder="valid USA state name or abbreviation" />
                          </div>
                        </div>
                        <br />
                        <div class="form-group row">
                          <div class="col-5">Zip code</div>
                          <div class="col-7">
                            <input onChange={this.zipcodeChangeHandler} type="text" class="form-control" value={this.state.zipcode} placeholder="valid USA zipcode" />
                          </div>
                        </div>
                        <br /><br />
                        <p><font color="red">{this.state.status}</font></p>
                        <br /> <br />
                        <a href="#close"><button type="reset" class="btn btn-danger" onClick={() => { this.setState({ status: "" }); }}>Cancel</button></a>
                        &nbsp;
                        <button onClick={this.updateLocationButton} class="btn btn-primary">Update</button>
                      </div>
                    </div>
                    <p><a href="#location"><i class="fas fa-map-marker" /> {locationText}</a></p>
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
                <li><a onClick={(e) => {
                  e.preventDefault();
                  this.setState({

                    feeds: <div >
                      <p>Question Followed</p>
                      <hr />
                      <div class="container">
                          <ol>
                      {this.state.questionfollower.map(item => {
                        return (
                            
                              <div >
                               <h5 class="card-title"> <li>{item.question}</li></h5>
                                
                              </div>
                                                   
                        )
                      })}
                      </ol>
                      <br/>
                        </div>
                    </div>

                  })
                }} class="a-hover">Question Followed</a></li>
                
                <li><a onClick={(e) => {
                  e.preventDefault();
                  if (this.state.useranswers.length > 0) {
                    this.setState({
                      feeds: <div>
                        <p>Answers</p>
                        <hr />
                        <div style={{height: '500px', overflowY: 'scroll'}}>
                          {
                            this.state.useranswers.map(answer => {
                              return (
                                <AnswerEdit key={answer._id} ansID={answer._id} id={answer.questionID} date={answer.posted} answer={answer.answer} />
                              );
                            })
                          }
                        </div>
                      </div>
                    })
                  }
                }} class="a-hover">Answers</a></li>
                
                <li><a onClick={(e) => {
                  e.preventDefault();
                  if (this.state.answers.length > 0) {
                    this.setState({
                      feeds: <div>
                        <p>Bookmarks</p>
                        <hr />
                        <div>
                          <div>
                            {
                              this.state.answers.map(answer => {
                                return (
                                  <div key={answer._id} class="card-body">

                                    <p><strong>{answer.question}</strong></p>
                                    <tr>
                                      <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                                      <td><p><div dangerouslySetInnerHTML={{ __html: answer.answer }}></div></p></td>
                                      <td>&nbsp;&nbsp;</td>
                                      <td><p><a href="#" onClick={() => {
                                        console.log(answer);
                                        const email = localStorage.getItem('email');
                                        const _id = answer.answerID;
                                        axios.post(url.url + 'answers/bookmark', { _id, email }).then(result => {
                                          if (result.data.bookmarked) {
                                            alert('Added to Bookmarks');
                                          }
                                          else {
                                            alert('Removed from Bookmarks');
                                            // window.location.reload();
                                          }
                                        })
                                      }}><i class="fa fa-bookmark"></i>&nbsp;&nbsp;Remove Bookmark</a></p></td>
                                    </tr>
                                  </div>
                                );
                              })
                            }
                          </div>
                        </div>
                      </div>
                    })

                  }
                  else {
                    this.setState({
                      feeds: <div>
                        <p>Bookmarks</p>
                        <hr />
                      </div>
                    })
                  }

                }} class="a-hover">Bookmarks</a></li>
                <li><a onClick={(e) => {
                  e.preventDefault();
                  this.setState({

                    feeds: <div >
                      <p>Following</p>
                      <hr />
                      <div class="container">
                          <div class="card-columns"> 
                      {this.state.followingData.map(item => {
                        return (
                            <div class="card" style={{width:"150px"}}>
                            <img class="card-img-top" src={item.userimage} alt="Card image" style={{width:"100%"}} />
                              <div class="card-body">
                                <h5 class="card-title">{item.userfname} {item.userlname}</h5>
                                
                                <Link to="/profiledisplay" class="btn btn-primary" onClick={
                                                () => {
                                                    localStorage.setItem('profiledisplay', item.userid);
                                                }
                                            }>See Profile</Link>
                              </div>
                            </div>                         
                        )
                      })}
                       </div>
                        </div>
                    </div>

                  })
                }} class="a-hover">Following</a></li>
                <li><a onClick={() => {
                  this.setState({

                    feeds: <div >
                      <p>Followers</p>
                      <hr />
                      <div class="container">
                          <div class="card-columns"> 
                      {this.state.followersData.map(item => {
                        return (
                            <div class="card" style={{width:"150px"}}>
                            <img class="card-img-top" src={item.followerimage} alt="Card image" style={{width:"100%"}} />
                              <div class="card-body">
                                <h5 class="card-title">{item.followerfname} {item.followerlname}</h5>
                                
                                <Link to="/profiledisplay" class="btn btn-primary" onClick={
                                                () => {
                                                    localStorage.setItem('profiledisplay', item.followerid);
                                                }
                                            }>See Profile</Link>
                              </div>
                            </div>                         
                        )
                      })}
                       </div>
                        </div>
                    </div>

                  })
                }} class="a-hover">Followers</a></li>
              
              <li><a onClick={(e) => {
                  e.preventDefault();
                  this.setState({

                    feeds: <div >
                      <p>Delete User</p>
                      <hr />
                      <div class="container">
                      <button onClick={this.deleteUser} class="btn btn-primary">Delete</button>
                      <br/>
                        </div>
                    </div>

                  })
                }} class="a-hover">Delete</a></li>
                </ul>

            </div>
            <div class="col-md-9">
              <h6>{this.state.feeds}</h6>
            </div>           
          </div>
          {/* end of Part */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispachToProps = dispatch => {
  return {
    onProfileLoad: data =>
      dispatch({
        type: "PROFILE_LOAD",
        email: data.email,
        mobile: data.mobile,
        about: data.about,
        city: data.city,
        country: data.country,
        company: data.company,

        school: data.school,
        hometown: data.hometown,
        languages: data.languages,
        gender: data.gender
      }),
      onLogout: () => dispatch({
        type: "LOGOUT",

    }),
  };
};

//export Home Component
export default connect(
  mapStateToProps,
  mapDispachToProps
)(Profile);
