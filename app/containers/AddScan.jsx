import React from 'react';
import classNames from 'classnames/bind';
import 'whatwg-fetch';
import styles from 'css/components/home';
import {browserHistory} from 'react-router';
import { Link, IndexLink} from 'react-router';
import { Button, Row, form, FormGroup, ControlLabel, FormControl, Col } from 'react-bootstrap'
const cx = classNames.bind(styles);

function filterOne(arrN, filtinfo){
	var skip = false
	return arrN.reduce(function(prev, curr){
		if(skip || !filtinfo(curr)){
			console.log("Prev= ", prev," Curr= ", curr)
			return prev.concat(curr)
		}else{
			skip = true
			return prev
		}
	},[]);
}

export default class AddScan extends React.Component {

	constructor(props) {
 		super(props);
 		this.state = {
 			loading : false
 		}
 	}	

	imageScan() {
		var self = this
		self.setState({loading: true, card: undefined , multipleCards : undefined})
		var input = document.querySelector('input[type = "file"]')
 		var data = new FormData()
 		data.append('userPhoto', input.files[0])
		fetch('/api/v1/scanimage', {
			credentials: 'same-origin',
			method: 'POST',
			body: data
		}).then(function(response){
			console.log("Response", response)
			return response.json()
		}).then(function(json){

			self.setState({card: json,
						   loading: false})
		}).catch(function(ex){
			this.setState({loading: false})
			console.log('parsing failed', ex)
		});
	}

	multiScan() {
		var self = this
		self.setState({loading: true})
		self.setState({card : undefined, multipleCards : undefined})
		var input = document.querySelector('input[type = "file"]')
 		var data = new FormData()
 		data.append('userPhoto', input.files[0])
		fetch('/api/v1/scanmultipleimages', {
			credentials: 'same-origin',
			method: 'POST',
			body: data
		}).then(function(response){
			console.log("Response", response)
			return response.json()
		}).then(function(json){
			self.setState({multipleCards : json.filter((x) => x),
						   loading: false})
		}).catch(function(ex){
			self.setState({loading: false})
			console.log('parsing failed', ex)
		});
	}

	addToCollection() {
		var self = this
		var sendInfo
		if(_.get(self.state, 'card')){
			sendInfo = self.state.card
		} else if (_.get(self.state, 'multipleCards')) {
			sendInfo = self.state.multipleCards
		}
		console.log("Sendinfo = ", sendInfo)
		fetch('/api/v1/collection/' + self.props.params.slug, {
			credentials : 'same-origin',
			method: 'PUT',
			headers: {
 				'Accept': 'application/json', 
 				'Content-Type': 'application/json'
 			},
 			body: JSON.stringify(sendInfo)
		}).then(function(response){
			console.log("Response", response)
			return response.json()
		}).then(function(json){
			self.setState({card : undefined, multipleCards: undefined})
			console.log('parsed json MEMEMEMEMEMEMEMEMEME', json)
		}).catch(function(ex){
			console.log('parsing failed', ex)
		});
	}

	falseImage() {
		return (
			<div>
				<p>Could not find card.</p>
				<p>Make sure this is a Magic the Gathering card from Eternal Masters.</p>
			</div>
			)
	}

	confirmImage(){
		return (
			<div>
				<h3 className = 'textShadowTitle'>{this.state.card.name}</h3><br />
				<img className = 'imageShadow' src={`http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${this.state.card.multiverseid}&type=card`} /><br /><br />
				<Button onClick={this.addToCollection.bind(this)} bsStyle = 'primary'>Confirm</Button><br /><br />
			</div>
		)
	}

	switchButton() {
		var self = this
		self.setState({buttonState: !self.state.buttonState})
	}

	displayButton() {
		if(this.state.buttonState) {
			return (<Button onClick = {this.multiScan.bind(this)} bsStyle = 'primary' className = 'checkboxAddScan'>Add Photo</Button>)
		} else {
			return (<Button onClick={this.imageScan.bind(this)} bsStyle = 'primary' className = 'checkboxAddScan'>Add Photo</Button>)
		}
	}

	displayDelete(card){
		var self = this
        return <Button onClick={self.removeCard.bind(self, card)} bsStyle = 'danger'>Delete</Button>
    }

    removeCard(card){
    	this.setState({multipleCards: filterOne(this.state.multipleCards, (obj) => obj.name === card.name)})
    }

	displayMultiple() {
		var self = this
		if(_.get(self.state, 'multipleCards')) {
			return self.state.multipleCards
			.map((card)=>
				<Col md = {4}>
				<p><img className = 'imageShadow' src={`http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${card.multiverseid}&type=card`} />
				{this.displayDelete(card)}</p>
				</Col>
			)
		}
	}

	loadingDisplay(){
		if(this.state.loading){
			return(
				<h1 className = "profileName">
				NOW LOADING IMAGES
				</h1>
				)
		}
	}

	displayDelete(card){
		var self = this
        return <Button onClick={self.removeCard.bind(self, card)} bsStyle = 'danger'>Delete</Button>
    }

    removeCard(card){
    	this.setState({multipleCards: filterOne(this.state.multipleCards, (obj) => obj.name === card.name)})
    }

	displayMultiple() {
		var self = this
		if(_.get(self.state, 'multipleCards')) {
			return self.state.multipleCards.map((card)=>
				<Col md={4}>
				<p><img className = 'deleteButton' src={`http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${card.multiverseid}&type=card`} />
				{this.displayDelete(card)}</p>
				</Col>
			)
		}
	}

	examplePicture () {
		if (!(_.get(this.state, 'multipleCards')) || !this.state.multipleCards.length) {
				return (
					<div className = 'centerText'>
					<h3>Single Card Example</h3>
					<img width= {575} height= {325}  src = '../assets/Images/singleExample.jpg' className = 'rounded' />
					<h3>Multiple Cards Example</h3>
					<img width= {575} height= {325}  src = '../assets/Images/multicardExample.jpg' className = 'rounded' />
					</div>
				)
		}
	}

//will need to change bottom button
	render() {
		return (
			<div className = 'marginTop'>
			<form>
				<FormGroup>
					<Row className = 'centerText'>
					<h1 className = 'centerText profileName paddingAddScan'>Search via Photo Name!</h1>
					<ControlLabel>
						<input style={{width: '200px'}} type = "file" name = "userPhoto" />
					</ControlLabel>
					</Row>
				</FormGroup>
				<FormGroup>
					<Row className = 'centerText'>
						{this.state.card && !this.state.card.falseCard && !this.state.card.message? this.confirmImage() : ''}
						{_.get(this.state, 'card.falseCard')? this.falseImage() : ''}
						<h1 className = "profileName">{_.get(this.state , "card.message") || _.get(this.state , "multipleCards.message")? "Please log in to use this feature" : ""}</h1>
						{this.loadingDisplay()}
						<label className = "widthChange">{this.displayButton()}</label>
						<label className = "widthChange"><ControlLabel><input type = 'checkbox' id = "changeButton" onClick = {this.switchButton.bind(this)}/> For Multiple Cards at Once</ControlLabel></label>
						{(_.get(this.state, 'multipleCards')) && this.state.multipleCards.length ? 
							<div>
								<h2 className = "profileName">{this.state.multipleCards ? "Number of Cards found: " + this.state.multipleCards.length : ''}</h2>
								<Row>{this.displayMultiple()}</Row>
								<Button onClick={this.addToCollection.bind(this)} bsStyle = 'primary'>Confirm</Button>
							</div> 
						: ''} 
					</Row>
					<Row>
						{this.examplePicture()}
					</Row>
				</FormGroup>
			</form>
			</div>
		);
	}
}