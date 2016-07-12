import React from 'react';
import classNames from 'classnames/bind';
import styles from 'css/components/home';
import 'whatwg-fetch';
import {browserHistory} from 'react-router';
import { Link } from 'react-router';
import {Button, Row, form, FormGroup, ControlLabel, FormControl, Col, Input} from 'react-bootstrap'
const cx = classNames.bind(styles);

/*
 * Note: This is kept as a container-level component, 
 *  i.e. We should keep this as the container that does the data-fetching 
 *  and dispatching of actions if you decide to have any sub-components.
 */

 export default class AddItem extends React.Component {

 	constructor(props) {
 		super(props);
 		this.state = {	
 			search: '',
 			failed: false
 		};
 	}


 	checkName() {
 		var self = this
 		self.setState({failed: false, name: ''})
 		fetch('/api/v1/cards/' + this.state.search, {credentials : 'same-origin'}) 
 		.then(function(response) {
 			console.log("response", response)
 			return response.json()
 		}).then(function(json) {
 			console.log("json", json)
 			self.setState(json)
 			console.log("state" , self.state)
 		}).catch(function(ex) {
 			console.log('parsing failed', ex)
 		})
 	}


 	addToCollection() {
 		var self = this
 		fetch('/api/v1/collection/' + self.props.params.slug, {
 			credentials : 'same-origin',
 			method: 'PUT',
 			headers: {
 				'Accept': 'application/json', 
 				'Content-Type': 'application/json'
 			},
 			body: JSON.stringify(self.state)	
 		}).then(function(response) {
 			return response.json()
 		}).then(function(json) {
 			console.log('parsed json', json)
 		}).catch(function(ex) {
 			console.log('parsing failed', ex)
 		})
 		self.setState({search: '', failed: false, name: ''})
 	}

 	confirmImage(){
 		console.log(this.state)
 		return (
 			<div className ='centerText'>
	 			<Row className ='centerText'>
	 				<h3 className = 'textShadowTitle'>{this.state.name}</h3>
	 			</Row>
	 			<Row className ='centerText'>
	 				<img className = 'imageShadow' src={`http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${this.state.multiverseid}&type=card`} /><br /><br />
	 			</Row>
	 			<Row className ='centerText'>
	 				<Button onClick={this.addToCollection.bind(this)} bsStyle = 'primary'>Add to Collection</Button>
	 			</Row>
 			</div>
 		)
 	}

 	searchFailed(){
 		return (
 			<h2>Sorry, No Card Found</h2>
 		)
 	}

 	handleKeyPress(e){
 		console.log(e.charCode)
 		if(e.charCode === 13){
 			e.preventDefault()
 			this.checkName()
 		}
 	}

 	render() {
 		return (
 			<div className={cx('home marginTop')}>
 			<form>
				<FormGroup>
					<Row className ='centerText'>
 						<h1 className = 'centerText profileName'>Search via Card Name!</h1>
 						<ControlLabel className='centerText'>Card Name</ControlLabel>
 						<Col sm={12} md={12} >
 								<FormControl className='centerText' onChange={(e) => this.setState({search: e.target.value})} onKeyPress = {this.handleKeyPress.bind(this)} value = {this.state.search}/>
 								<Button className='centerButton' onClick={this.checkName.bind(this)} bsStyle = 'primary'>Search</Button>
 						</Col>
 					</Row>
 				</FormGroup>
 				<FormGroup>
 					<Row className ='centerText'>
 					{this.state.name ? this.confirmImage() : ''}
 					{this.state.failed ? this.searchFailed() : ''}<br />
 					<h1 className = 'profileName'>{this.state.message? "How'd you get here? Please log in!" : ''}</h1>
 					<Button><Link to={"/addscan/" + this.props.params.slug} bsStyle = 'primary'>Search via Photo</Link></Button>
 					</Row>
 				</FormGroup>
 			</form>
 			</div>
 			);
 	}

 };
