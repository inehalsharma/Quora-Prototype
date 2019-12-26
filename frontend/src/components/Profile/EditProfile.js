import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import { Redirect } from 'react-router';
import GoogleLogin from 'react-google-login';
import url from '../Url/Url';
import cookie from 'react-cookies';
import { Link } from 'react-router-dom';

class EditProfile extends Component {
  constructor() {
    super();

    this.state = {
      status: "",
      username: "",
      educationdegree: "",
      educationstart: "",
      educationend: "",
      school: "",
      profile: [],
      education: [],
      companyname: "",
      position: "",
      startyear: "",
      endyear: "",
      comp:[]

    }

    this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
    this.educationstartChangeHandler = this.educationstartChangeHandler.bind(
      this
    );
    this.educationendChangeHandler = this.educationendChangeHandler.bind(this);
    this.educationdegreeChangeHandler = this.educationdegreeChangeHandler.bind(
      this
    );
    this.schoolChangeHandler = this.schoolChangeHandler.bind(this);
    this.deleteEducation = this.deleteEducation.bind(this);
    this.addEducation = this.addEducation.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.startyearChangeHandler = this.startyearChangeHandler.bind(this);
    this.endyearChangeHandler = this.endyearChangeHandler.bind(this);

    this.positionChangeHandler = this.positionChangeHandler.bind(this);
    this.companyChangeHandler = this.companyChangeHandler.bind(this);
    this.deleteExperience = this.deleteExperience.bind(this);
    this.updateExperienceButton =this.updateExperienceButton.bind(this);
    
  }
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
  companyChangeHandler = e => {
    this.setState({
      companyname: e.target.value
    });
  };
  positionChangeHandler = e => {
    this.setState({
      position: e.target.value
    });
  };

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
    axios.get(url.url + "profile/education", options).then(response => {
      //update the state with the response data
      this.setState({
        education: response.data.education,
        comp:response.data.company,
      });
      console.log("response.data", response.data);

    });
  }
  componentDidMount() {
    this.getProfile();
  }


  deleteEducation = (e, index) => {
    var headers = new Headers();
    //prevent page from refresh
    e.preventDefault();


    const edu = [...this.state.education];
    console.log("education", edu);

    if (index > -1) {
      edu.splice(index, 1);
      console.log("education", edu);
      console.log("education index", index);
    }

    const data = [
      { propName: "email", value: localStorage.email },
      { propName: "education", value: edu },
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
  };

  deleteExperience = (e, index) => {
    var headers = new Headers();
    //prevent page from refresh
    e.preventDefault();


    const comp = [...this.state.comp];
    console.log("company", comp);

    if (index > -1) {
      comp.splice(index, 1);
      console.log("company", comp);
      console.log("company index", index);
    }

    const data = [
      { propName: "email", value: localStorage.email },
      { propName: "company", value: comp },
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
  };


  usernameChangeHandler = (e) => {
    this.setState({
      username: e.target.value
    })
  }
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
  schoolChangeHandler = e => {
    this.setState({
      school: e.target.value
    });
  };

  updateExperienceButton = e => {
    var headers = new Headers();
    //prevent page from refresh
    e.preventDefault();

    if (!(this.state.companyname || this.state.position || this.state.startyear || this.state.endyear))
    {alert(
      "Please enter a valid value"
    );}
    else
    {

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

  addEducation = e => {
    var headers = new Headers();
    //prevent page from refresh
    e.preventDefault();
    if (!(this.state.school || this.state.educationdegree || this.state.educationstart || this.state.educationend))
    {alert(
      "Please enter a valid value"
    );}
    else{
    const obj = {
      educationschool: this.state.school,
      educationdegree: this.state.educationdegree,
      educationstart: this.state.educationstart,
      educationend: this.state.educationend
    }
    const edu = this.state.education.slice();
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
  render() {


    if (this.state.education) {

      var id = -1;
      var eduDetail = [...this.state.education];
    }

    if (this.state.comp) {

      var id_comp = -1;
      var compDetail = [...this.state.comp];
    }

    var eduDetails =
      <div>
        <div class="form-group row">
          <div class="col-5">School</div>
          <div class="col-7">
            <input onChange={this.schoolChangeHandler} type="text" class="form-control" placeholder="school" />
          </div>
        </div>
        <br />
        <div class="form-group row">
          <div class="col-5">Degree</div>
          <div class="col-7">
            <input onChange={this.educationdegreeChangeHandler} type="text" class="form-control" placeholder="degree" />
          </div>
        </div>
        <br />
        <div class="form-group row">
          <div class="col-5">Start Date</div>
          <div class="col-7">
            <input onChange={this.educationstartChangeHandler} type="date" class="form-control" placeholder="start year" />
          </div>
        </div>
        <br />
        <div class="form-group row">
          <div class="col-5">End Dates</div>
          <div class="col-7">
            <input onChange={this.educationendChangeHandler} type="date" class="form-control" placeholder="end year" />
          </div>
        </div>
        <br /><br />
        <p><font color="red">{this.state.status}</font></p>
        <br /> <br />
        <button onClick={this.addEducation} class="btn btn-primary">Add</button>
      </div>

var compDetails =
<div>
  <div class="form-group row">
    <div class="col-5">Position</div>
    <div class="col-7">
      <input onChange={this.positionChangeHandler} type="text" class="form-control" placeholder="position" />
    </div>
  </div>
  <br />
  <div class="form-group row">
    <div class="col-5">Company/Organisation</div>
    <div class="col-7">
      <input onChange={this.companyChangeHandler} type="text" class="form-control" placeholder="company/organisation" />
    </div>
  </div>
  <br />
  <div class="form-group row">
    <div class="col-5">Start Date</div>
    <div class="col-7">
      <input onChange={this.startyearChangeHandler} type="date" class="form-control" placeholder="start year" />
    </div>
  </div>
  <br />
  <div class="form-group row">
    <div class="col-5">End Dates</div>
    <div class="col-7">
      <input onChange={this.endyearChangeHandler} type="date" class="form-control" placeholder="end year" />
    </div>
  </div>
  <br /><br />
  <p><font color="red">{this.state.status}</font></p>
  <br /> <br />
  <button onClick={this.updateExperienceButton} class="btn btn-primary">Add</button>
</div>







    return (
      <div class="container">
        <a href="#close" title="Close" class="close" onClick={() => { this.setState({ status: "" }); }}>X</a>

        <h2>Credentials and Highlights</h2>
        <br />

        <ul class="nav nav-pills" role="tablist">
          <li class="nav-item">
            <a class="nav-link active" data-toggle="pill" href="#home" onClick={() => { this.setState({ status: "" }); }}>Education</a>

          </li>
          <li class="nav-item">
            <a class="nav-link" data-toggle="pill" href="#menu3" onClick={() => { this.setState({ status: "" }); }}>+ Add Education Credential</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-toggle="pill" href="#menu1" onClick={() => { this.setState({ status: "" }); }}>Experience</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-toggle="pill" href="#menu2" onClick={() => { this.setState({ status: "" }); }}>+ Add Experience Credential</a>
          </li>
        </ul>

        <div class="tab-content">
          <div id="home" class="container tab-pane active"><br />

            <h4>Added education credentials</h4>
            <br />
           <table class="table">
              <thead>
                <tr>
                  <th>School</th>
                  <th>Degree</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th></th>
                </tr>
              </thead>
              {

                eduDetail.map((educationvalue, index) => {
                  id = id + 1;

                  return (

                      <tbody>

                        <tr>
                          <td>
                            {educationvalue.educationschool}
                          </td>
                          <td>
                            {educationvalue.educationdegree}
                          </td>
                          <td>
                            {educationvalue.educationstart}
                          </td>
                          <td>
                            {educationvalue.educationend}
                          </td>
                          <td>
                            <button onClick={(e) => this.deleteEducation(e, index)} class="btn btn-primary">Delete</button>

                          </td>

                        </tr>
                      </tbody>
                  )
                })


              }
            </table>
            <p><font color="red">{this.state.status}</font></p>
          </div>

          <div id="menu1" class="container tab-pane fade"><br />
          <h4>Added experience credentials</h4>
            <br />
           <table class="table">
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Company</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th></th>
                </tr>
              </thead>
              {

                compDetail.map((compvalue, index) => {
                  id_comp = id_comp + 1;

                  return (

                      <tbody>

                        <tr>
                          <td>
                            {compvalue.companyposition}
                          </td>
                          <td>
                            {compvalue.companyname}
                          </td>
                          <td>
                            {compvalue.companystart}
                          </td>
                          <td>
                            {compvalue.companyend}
                          </td>
                          <td>
                            <button onClick={(e) => this.deleteExperience(e, index)} class="btn btn-primary">Delete</button>

                          </td>

                        </tr>
                      </tbody>
                  )
                })


              }
            </table>
            <p><font color="red">{this.state.status}</font></p>
          </div>

          <div id="menu2" class="container tab-pane fade"><br />
            <h4>Add Experience</h4>
            {compDetails}
            
          </div>

          <div id="menu3" class="container tab-pane fade"><br />
            <h4>Add Education</h4>
            {eduDetails}

          </div>
        </div>
      </div>
    )
  }
}



//export this Component
export default EditProfile;
