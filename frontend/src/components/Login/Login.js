import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import { Redirect } from 'react-router';
import GoogleLogin from 'react-google-login';
import url from '../Url/Url';
import cookie from 'react-cookies';
import { Link } from 'react-router-dom';

//you wanna copy this file for componenets
class Login extends Component {
    constructor() {
        super();

        this.state = {
            
            status:"",
            username:"",
            password:""


        }
        this.responseGoogle = this.responseGoogle.bind(this);
        this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);

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
        axios.post(url.url+'user/login', data)
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
                        
                        status: response.data.message
                    })
                }
            });
    }

    responseGoogle = (response) => {
        
        console.log(response);
        if(response.error){
            alert(response.error);
        }
        else{
            const data = {
                email:response.profileObj.email,
                lname: response.profileObj.familyName,
                fname:response.profileObj.givenName,
                image:response.profileObj.imageUrl
            };
            console.log("data",data);
            axios.defaults.withCredentials = true;
            //make a post request with the user data
            axios.post(url.url+'user/google', data)
                .then((response) => {
                    console.log("Status Code : ", response.status);
                    if (response.status === 200) {
                        localStorage.setItem('email', response.data.email);
                        localStorage.setItem('fname', response.data.fname);
                        localStorage.setItem('lname', response.data.lname);
                        localStorage.setItem('jwt', response.data.jwt);
                        localStorage.setItem('image', response.data.image);
    
                        this.setState({
                           
                            status: response.data.message,
                        })
                    }
                    else {
                       this.setState({
                        
                        status: response.data.message
                    })
                        
                    }
    
    
    
                });
        }
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
                <div class="panel">
                    <div class="logo">
                        
                        <img src="logo.png" height="55%" width="80%"/>


                    </div>
                    <div class="logotext">
                        
                        <h5>A place to share knowledge and better understand the world</h5>

                    </div>
                    <div class="google">
                        <GoogleLogin
                            clientId="624602059574-qsv45kcgn89v376114ql2ps2t5rljfd7.apps.googleusercontent.com"
                            buttonText="Sign in with Google"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            cookiePolicy={'single_host_origin'}
                        />
                        <br/><br/>
                        <small><Link to="/signup">Sign Up With Email.</Link> By signing up you indicate that you have read and agree to Quora's Terms of Service and Privacy Policy.</small>
                    </div>
                    <div class="login">
                  <p> <b>Login</b></p>
                        <form onSubmit={this.submitLogin}>
                            <div class="form-group">

                                <input type="email" onChange={this.usernameChangeHandler} class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Email" required/>

                            </div>
                            <div class="form-group">

                                <input type="password" onChange={this.passwordChangeHandler} class="form-control" id="exampleInputPassword1" placeholder="Password" required/>
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
export default Login;
