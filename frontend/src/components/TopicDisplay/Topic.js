import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import url from '../Url/Url';

class Topic extends Component {
    constructor() {
        super();
        this.state = {
            topicName: "",
            paramPicName:"",
            file_status: "",
            file_upload: null,
            file_upload_status:[]
        }
        this.onChange = this.onChange.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);


    }
    imageChangeHandler = (e) => {
        this.setState({
            image : e.target.files[0]
        })
    }

    onChangeText (e) {
        this.setState({
            topicName : e.target.value
        })
    }

    onChange(e) {
        this.setState({file_upload: e.target.files[0]},function () {
            console.log("file upload",this.state.file_upload);
           });
    }

    onFormSubmit(e){
        e.preventDefault();
        console.log("submit");
        console.log("topic name", this.state.topicName);
        console.log("file upload",this.state.file_upload);

        const formData = new FormData();
        formData.append('myImage',this.state.file_upload);
        formData.append('param', this.state.topicName );
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        console.log(formData);
        axios.post(url.url +"topics",formData,config)
            .then((response) => {
                alert("The topic is successfully created");
                this.setState({file_upload_status:this.state.file_upload_status.concat(response.data.message) });
            }).catch((error) => {
        });
    }



    render() {
        //if not logged in go to login page
        let redirectVar = null;
        if (cookie.load('cookie')) {
            redirectVar = <Redirect to="/login" />
        }
        
        var path_image = window.location.origin + this.state.image; 

        return (
            <div class="container">
  
            <br/>
              <div>
                  <form onSubmit={this.onFormSubmit}>
                  <div class="row">
                        <div class="col-md-6">
                    
                      <input
                        type="file"
                        name="myImage"
                        onChange={this.onChange}
                       
                      />
                      </div>
                     
                    </div>
                    
                    <br/>
                    <div class="row">
                        <label  class="col-sm-2 col-form-label">Topic Name</label>
                        <div class="col-sm-6">
                            <input type="text" onChange = {this.onChangeText}  class="form-control" required />
                        </div>
                    </div>
                   <br/>
                    <button type="submit" class="btn btn-primary">
                      Create
                    </button>
                    </form>
                  
                  <p>{this.state.file_upload_status}</p>
            </div>
        </div>
        )

        
    }
}
//export Home Component
export default Topic;