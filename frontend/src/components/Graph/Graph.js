import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { Chart } from "react-google-charts";
import url from "../Url/Url";

class Graph extends Component {
    constructor() {
        super();
        this.state = {
            answer: [],
            profile: [],
            question: [],
            upvote: [],
            downvote: [],
            bookmark: [],
            bookmark_ans: []

        }


    }
    componentDidMount() {
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
        axios.get(url.url + "graph/graphanswer", options).then(response => {
            //update the state with the response data
            this.setState({
                answer: this.state.answer.concat(response.data)
            });
            console.log("answer", response);

        });

        axios.get(url.url + "graph/profileview", options).then(response => {
            //update the state with the response data
            this.setState({
                profile: this.state.profile.concat(response.data)
            });

        });

        axios.get(url.url + "graph/graphquestion", options).then(response => {
            //update the state with the response data
            this.setState({
                question: this.state.question.concat(response.data)
            });

        });

        axios.get(url.url + "graph/graphupvote", options).then(response => {
            //update the state with the response data
            this.setState({
                upvote: this.state.upvote.concat(response.data)
            });

        });

        axios.get(url.url + "graph/graphdownvote", options).then(response => {
            //update the state with the response data
            this.setState({
                downvote: this.state.downvote.concat(response.data)
            });

        });

        axios.get(url.url + "graph/graphbookmark", options).then(response => {
            console.log("bookmark", response.data)
            //update the state with the response data
            this.setState({
                bookmark: this.state.bookmark.concat(response.data.data),
                bookmark_ans: this.state.bookmark_ans.concat(response.data.result)
            });

        });
    }


    render() {
        let myVar = '';
        var countb = {};
        var output_b = [["Answers", "No of times Bookmarked"]];
        var y;
        this.state.bookmark.forEach(function (y) { countb[y] = (countb[y] || 0) + 1; });

        for (y in countb) {
            console.log("Bookmark Key", y);
            console.log("Bookmark Value", countb[y]);
            output_b.push([y, countb[y]])
        }
        console.log("output_b", output_b);

        // if (this.state.bookmark_ans != null && this.state.bookmark_ans != undefined &&  this.state.bookmark_ans >= 1) {
            myVar = this.state.bookmark_ans.map(item => {
                if(item!=undefined){
                    return (

                        <tr><td>{item.questionID}:</td><td> => </td><td><div dangerouslySetInnerHTML={{ __html: item.answer }}></div></td></tr>
    
                    )
                }
                else{
                    return(
                        <div></div>
                    );
                }
                
            })
        // }


        var counts = {};
        var output_p = [[{ type: 'date', id: 'Date' }, { type: 'number', id: 'Won/Loss' }]];
        var x;
        this.state.profile.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });

        for (x in counts) {
            console.log("Key", x);
            console.log("Value", counts[x]);
            output_p.push([new Date(x), counts[x]])
        }
        console.log("output_p", output_p);


        let output = [["Answers", "Views"]]
        console.log("state answer", this.state.answer);
        if (this.state.answer.length > 1) {


            this.state.answer.map(item => {
                var out = item.answer.slice(3, 20)
                output.push([out + "..", parseInt(item.views)])
            })
        }

        let output_question = [["Question", "Views"]]
        console.log("state Question", this.state.question);
        if (this.state.answer.length > 1) {


            this.state.question.map(item => {

                output_question.push([item.question, parseInt(item.views)])
            })
        }
        let upvote = [["Answers", "Upvote"]]
        console.log("upvote", this.state.upvote);
        if (this.state.upvote.length > 1) {


            this.state.upvote.map(item => {
                var out = item.answer.slice(3, 25)
                upvote.push([out + "..", parseInt(item.upVote)])
            })
        }
        let downvote = [["Answer", "DownVote"]]
        console.log("downvote", this.state.downvote);
        if (this.state.downvote.length > 1) {


            this.state.downvote.map(item => {
                var out = item.answer.slice(3, 25)
                downvote.push([out + "..", parseInt(item.downVote)])
            })
        }

        const data = [
            ["Task", "Hours per Day"],
            ["Work", 11],
            ["Eat", 2],
            ["Commute", 2],
            ["Watch TV", 2],
            ["Sleep", 7] // CSS-style declaration
        ];

        const options_question = {
            title: "Top 10 Question View",
            pieHole: 0.4,
            is3D: false
        };

        const options_upvote = {
            title: "Top 10 Max Upvoted Answers",
            pieHole: 0.4,
            is3D: false
        };

        const options_downvote = {
            title: "Top 5 Downvoted Answers",
            pieHole: 0.4,
            is3D: false
        };

        const options = {
            title: "Top 10 Answer View",
            pieHole: 0.4,
            is3D: false
        };

        const options_b = {
            title: "No. of times Answers Were Bookmarked",
            pieHole: 0.4,
            is3D: false
        };

        return (
            <div class="container">
                <br />
                <div class="row">
                    <div class="col-md-2">

                    </div>
                    <div class="col-md-10">
                        <h2>Performance Statistics</h2>
                        <br />

                        <div className={"my-pretty-chart-container"}>
                            {console.log(this.state.profile)}
                            <Chart
                                width={1000}
                                height={350}
                                chartType="Calendar"
                                loader={<div>Loading Chart</div>}
                                data={output_p}

                                options={{
                                    title: 'Profile View Per Day',
                                }}
                                rootProps={{ 'data-testid': '1' }}
                            />


                        </div>
                        <div className={"my-pretty-chart-container"}>

                            <Chart
                                chartType="BarChart"
                                width="100%"
                                height="400px"
                                data={upvote}
                                options={options_upvote}
                            />
                        </div>
                        <div className={"my-pretty-chart-container"}>

                            <Chart
                                chartType="BarChart"
                                width="100%"
                                height="400px"
                                data={downvote}
                                options={options_downvote}
                            />
                        </div>

                        <div className={"my-pretty-chart-container"}>

                            <Chart
                                chartType="PieChart"
                                width="100%"
                                height="400px"
                                data={output}
                                options={options}
                            />
                        </div>

                       


                        <div className={"my-pretty-chart-container"}>

                            <Chart
                                chartType="BarChart"
                                width="100%"
                                height="400px"
                                data={output_question}
                                options={options_question}
                            />
                        </div>

                        <div className={"my-pretty-chart-container"}>

                            <Chart
                                chartType="BarChart"
                                width="100%"
                                height="400px"
                                data={output_b}
                                options={options_b}
                            />
                            <table>
                                <tr><th>Answer ID</th><th>Answer</th></tr>
                                <p>{
                                    myVar
                                    
                                }</p></table>
                        </div>


                    </div>


                </div>

            </div>
        )
    }
}

export default Graph;