import React from 'react';
import classNames from 'classnames/bind';
import styles from 'css/components/home';
import {browserHistory} from 'react-router';
import { Link } from 'react-router';
import {Button, Row, form, FormGroup, ControlLabel, FormControl, Col, Input} from 'react-bootstrap'
const cx = classNames.bind(styles);
import requestApi from '../utils/requests'

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


 	checkName(name) {
 		this.setState({failed: false, name: ''})
 		requestApi('/api/v1/cards/' + name)()
 			.then((json) => this.setState(json))
 	}


 	addToCollection() {
 		var self = this
 		requestApi('/api/v1/collection/' + self.props.params.slug, 'PUT')(self.state)
 		.then(() =>
 			self.setState({search: '', failed: false, name: ''})
 			)
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
		this.setState({search: e.target.value}) 		
		if(e.target.value.length > 2){
 			console.log(e.charCode)
 			this.checkName(e.target.value)
 		}
 	}

 	submitOnEnter(e){
 		console.log(e.charCode)
 		if(e.charCode === 13){
 			e.preventDefault()
 			this.addToCollection()
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
 								<FormControl className='centerText centerTextBox' onKeyPress={this.submitOnEnter.bind(this)} onChange={this.handleKeyPress.bind(this)}  value = {this.state.search}/>
 						</Col>
 					</Row>
 				</FormGroup>
 				<FormGroup>
 					<Row className ='centerText'>
 					{this.state.name ? this.confirmImage() : ''}
 					{this.state.failed ? this.searchFailed() : ''}<br />
 					<h1 className = 'profileName'>{this.state.message? "How'd you get here? Please log in!" : ''}</h1>
 					</Row>
 				</FormGroup>
 			</form>
 			</div>
 			);
 	}

 };
