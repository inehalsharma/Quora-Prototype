import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import { Redirect } from 'react-router';
import GoogleLogin from 'react-google-login';
import url from '../Url/Url';
import cookie from 'react-cookies';
import { Link } from 'react-router-dom';

//you wanna copy this file for componenets
class SignUp extends Component {
    constructor() {
        super();

        this.state = {

            status: "",
            username: "",
            password: "",
            fname: "",
            lname: "",
            email: "",
            emailPassword: "",
            signup_status: "",


        }

        this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
        this.fnameChangeHandler = this.fnameChangeHandler.bind(this);
        this.lnameChangeHandler = this.lnameChangeHandler.bind(this);
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.emailPasswordChangeHandler = this.emailPasswordChangeHandler.bind(this);

    }

    usernameChangeHandler = (e) => {
        this.setState({
            username: e.target.value
        })
    }

    //password change handler to update state variable with the text entered by the user
    passwordChangeHandler = (e) => {
        this.setState({
            password: e.target.value
        })
    }

    //fname handler
    fnameChangeHandler = (e) => {
        this.setState({
            fname: e.target.value
        })
    }

    //lname handler
    lnameChangeHandler = (e) => {
        this.setState({
            lname: e.target.value
        })
    }

    //email handler
    emailChangeHandler = (e) => {
        this.setState({
            email: e.target.value
        })
    }

    //emailPassword handler
    emailPasswordChangeHandler = (e) => {
        this.setState({
            emailPassword: e.target.value
        })
    }



    //submit Login handler to send a request to the node backend


    submitLogin = (e) => {

        console.log("submit login called")
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            email: this.state.username,
            password: this.state.password,

        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post(url.url + 'user/login', data)
            .then((response) => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    localStorage.setItem('email', response.data.email);
                    localStorage.setItem('fname', response.data.fname);
                    localStorage.setItem('lname', response.data.lname);
                    localStorage.setItem('jwt', response.data.jwt);
                    localStorage.setItem('image', response.data.image);

                    console.log(response.data);
                    this.setState({

                        status: response.data.message,
                    })
                } else {
                    this.setState({

                        signup_status: response.data.message
                    })
                }
            });
    }

    submitSignUp = (e) => {

        console.log("submit login called")
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            email: this.state.email,
            password: this.state.emailPassword,
            fname: this.state.fname,
            lname: this.state.lname

        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post(url.url + 'user', data)
            .then((response) => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {

                    console.log(response.data);
                    this.setState({

                        signup_status: response.data.message,
                    })
                } else {
                    this.setState({

                        signup_status: response.data.message
                    })
                }
            });
    }




    componentDidMount() {


    }


    render() {
        let redirectVar = null;

        if (cookie.load('cookie')) {
            console.log("cookie is defined");
            redirectVar = <Redirect to="/home" />



        }



        return (
            <div>
                {redirectVar}
                <div class="body"></div>
                <div class="grad"></div>
                <div class="panel-signup">
                    <div class="logo-signup">

                        <img src="logo.png" height="55%" width="80%" />


                    </div>
                    <div class="logotext-signup">

                        <h5>A place to share knowledge and better understand the world</h5>


                    </div>
                    <div class="google-signup">
                        <br />
                        <p> <b>Sign Up</b></p>
                        <form onSubmit={this.submitSignUp}>

                            <div class="form-group">

                                <input type="text" onChange={this.fnameChangeHandler} class="form-control" name="fname" placeholder="FIRST NAME" required />

                            </div>
                            <div class="form-group">


                                <input type="text" onChange={this.lnameChangeHandler} class="form-control" name="lname" placeholder="LAST NAME" required />


                            </div>

                            <div class="form-group">

                                <input type="email" onChange={this.emailChangeHandler} class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="EMAIL" name="email" required />

                            </div>
                            <div class="form-group">

                                <input type="password" onChange={this.emailPasswordChangeHandler} class="form-control" id="exampleInputPassword1" placeholder="PASSWORD" name="psw" required />
                            </div>

                            <Link to="/login">Cancel      </Link>


                            <input type="submit" class="btn btn-primary" value="Sign Up" />
                        </form>
                        <font color="red">{this.state.signup_status}</font>
                    </div>
                    <div class="login-signup">
                        <br />
                        <p> <b>Login</b></p>

                        <form onSubmit={this.submitLogin}>
                            <div class="form-group">

                                <input type="email" onChange={this.usernameChangeHandler} class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Email" required />

                            </div>
                            <div class="form-group">

                                <input type="password" onChange={this.passwordChangeHandler} class="form-control" id="exampleInputPassword1" placeholder="Password" required />
                            </div>

                            <input type="submit" class="btn btn-primary" value="Login" />
                        </form>
                        <font color="red">{this.state.status}</font>
                    </div>

                </div>





            </div>




        )
    }
}



//export this Component
export default SignUp;
