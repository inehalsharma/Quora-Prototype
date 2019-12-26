import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import { Redirect } from 'react-router';
import GoogleLogin from 'react-google-login';
import url from '../Url/Url';
import cookie from 'react-cookies';
import { Link } from 'react-router-dom';

class CredentialProfile extends Component {
  constructor() {
    super();
    
  }
 
  render() {

    var educationText="No Education Credential present";
    var experienceText="No Experience Credential present";
    if (this.props.edu) {

      var id = -1;
      var eduDetail = [...this.props.edu];
      console.log("education", [...this.props.edu]);
      if(eduDetail.length > 0)
      {
          educationText="Added Education Credentials"
      }
    }

    if (this.props.comp) {

      var id_comp = -1;
      var compDetail = [...this.props.comp];
      console.log("company", [...this.props.comp]);
      if(compDetail.length > 0)
      {
          experienceText="Added Experience Credentials"
      }
    }

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
            <a class="nav-link" data-toggle="pill" href="#menu1" onClick={() => { this.setState({ status: "" }); }}>Experience</a>
          </li>
        </ul>

        <div class="tab-content">
          <div id="home" class="container tab-pane active"><br />

            <h4>{educationText}</h4>
            <br />
           <table class="table">
              <thead>
                <tr>
                  <th>School</th>
                  <th>Degree</th>
                  <th>Start Date</th>
                  <th>End Date</th>
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

                        </tr>
                      </tbody>
                  )
                })
              }
            </table>
          </div>

          <div id="menu1" class="container tab-pane fade"><br />
          <h4>{experienceText}</h4>
            <br />
           <table class="table">
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Company</th>
                  <th>Start Date</th>
                  <th>End Date</th>
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
                        </tr>
                      </tbody>
                  )
                })
              }
            </table>
          </div>
        </div>
      </div>
    )
  }
}



//export this Component
export default CredentialProfile;
