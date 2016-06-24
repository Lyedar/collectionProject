import React from 'react';
import classNames from 'classnames/bind';
import styles from 'css/components/home';
import 'whatwg-fetch';
import { Link } from 'react-router';
const cx = classNames.bind(styles);
import {browserHistory} from 'react-router';

export default class Login extends React.Component {
	setInitialState(){
		this.setState={
			email:'',
			password:'',
			success:''
		}
	}

	pullUser(){
		console.log(this.props)
		var self = this
		console.log("HERE HERE" , self)
		fetch('/api/v1/login', {
			credentials : 'same-origin',
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email : self.state.email,
				password : self.state.password
			})
		})
		.then(function(response) {
			return response.json()
		}).then(function(json) {
			self.props.toggleLogin()
			self.setState(json)
		}).catch(function(ex) {
			console.log('parsing failed', ex)
		}).then(function(){
			if(self.state.success){
				browserHistory.push('/')
			}
		})
	}

	render(){
		var self = this 
		return(<div>
			Email:
			<input onChange={(e)=>this.setState({email:e.target.value})}/><br/>
			Password: 
			<input onChange={(e)=>this.setState({password:e.target.value})}/><br/>
			<button onClick ={this.pullUser.bind(this)}>Login</button><br/>
			<br/> Don't have an Account?
			<Link to = "/signup">Sign Up Here</Link>
			</div>)
		}
	}