import React from 'react';
import classNames from 'classnames/bind';
import styles from 'css/components/home';
import 'whatwg-fetch';
import { Link } from 'react-router';
const cx = classNames.bind(styles);
import {browserHistory} from 'react-router';
import {Button, form, FormGroup, ControlLabel, FormControl, Col, Row} from 'react-bootstrap';

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
			self.setState(json)
		}).catch(function(ex) {
			console.log('parsing failed', ex)
		}).then(function(){
			if(self.state.success){
				self.props.toggleLogin()
				browserHistory.push('/')
			}
		})
	}

	render(){
		var self = this 
		return(
			<div className = 'marginTop'>
			<form>
				<FormGroup>
					<Row>
					<Col sm={3}>
					<ControlLabel>Email</ControlLabel>
					<FormControl type="email" placeHolder = "Enter Email" onChange={(e)=>this.setState({email:e.target.value})}/><br />
					</Col>
					</Row>
				</FormGroup>
				<FormGroup>
					<Row>
					<Col sm={3}>
					<ControlLabel>Password</ControlLabel>
					<FormControl type="password" placeHolder= "Enter Password" onChange={(e)=>this.setState({password:e.target.value})} /><br />
					</Col>
					</Row>
				</FormGroup>
			</form>

			<Button onClick ={this.pullUser.bind(this)} bsStyle = 'primary'>Login</Button><br/>
			<br/> Don't have an Account?
			<Link to = "/signup">  Sign Up Here</Link>
			</div>)
		}
	}