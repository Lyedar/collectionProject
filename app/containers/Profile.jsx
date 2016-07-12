import React from 'react';
import classNames from 'classnames/bind';
import styles from 'css/components/home';
import {Link, IndexLink, browserHistory} from 'react-router';
import _ from 'lodash';
const cx = classNames.bind(styles);
import {Grid, Col, Row, Button} from 'react-bootstrap'

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

export default class Profile extends React.Component {

  constructor(props){
    super(props);
    this.state={
      currentUser : "",
      profile: {
        userKollection: []
      }
    };
  }

  loggedInUser() {
    var self = this
    return fetch('/api/v1/getuser', {credentials : 'same-origin'})
    .then(function(response) {
      return response.json()
    }).then(function(json) {
      self.setState({currentUser: json})
      console.log('USER', self.state.currentUser)
    }).catch(function(ex) {
      console.log('user parsing failed', ex)
    })
  }

  profileUser() {
    var self = this
    return fetch('/api/v1/collection/' + self.props.params.slug)
    .then(function(response) {
      return response.json()
    }).then(function(json) {
      self.setState({profile: json})
      console.log('PROFILE', self.state.profile)
    }).catch(function(ex) {
      console.log('profile parsing failed', ex)
    })
  }

  removeItem(card) {
    var self = this
    return fetch('/api/v1/collection/remove/', {
      credentials : 'same-origin',
      method: 'PUT',
      headers: {
        'Accept': 'application/json', 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({user: self.state.profile.user, name: card.name}) 
    }).then(function(response) {
      return response.json()
    }).then(function(json) {
      console.log('parsed json', json)
      self.state.profile.userKollection = json
      self.setState({profile: self.state.profile})
    }).catch(function(ex) {
      console.log('parsing failed', ex)
    })
  }

  componentWillMount(){
    var self = this
    self.loggedInUser()
    self.profileUser()
  }

  displayDelete(card){
    var self = this
    if(_.get(this.state, 'currentUser.local.userName', null) === this.state.profile.user){
        return <Button onClick={self.removeItem.bind(self, card)} bsStyle = "danger">Delete Card</Button>
      }
    }

  displayKollection(){
    var self = this

    var colStyle = {
      paddingTop: '90px',

    }
    var rowStyle = {
      position: 'relative'
    }
    if(_.get(self.state , "profile.userKollection")){
      var sorted = self.state.profile.userKollection.sort(dynamicSort("name"))
        .reduce((counter, card)=>{
          if(counter[card.name]){
            counter[card.name].quantity += 1
          } else {
            card.quantity = 1
            counter[card.name] = card
          }
          return counter;
        }, {})

      console.log('sorted', sorted)
      var countedCards = []
      return _.values(sorted).map((card)=>
            <div>
              <Row className = 'profileCD'>
                <Col sm={4} md={4}>
                  <img className = 'imageShadow' src={`http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${card.multiverseid}&type=card`} />
                </Col>
                <Col  style={colStyle} sm={7}  md={7} className = 'centerText'>
                  <h3 className = {'textShadowTitle verticalAlign'}>{card.name}<br/></h3>
                  <h4 className ={'textShadowTitle'}>quantity x{card.quantity}</h4>
                  <label className = {'textShadow'}>{card.originalText}</label><br/>
                  <a className = {"link"} data-toggle="modal" href = {`http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=${card.multiverseid}`} target="_blank">Offical Wizards Page</a>
                  <a className = {"link"} href = {`http://sales.starcitygames.com/search.php?substring=${card.name}&t_all=All&start_date=2010-01-29&end_date=2012-04-22&order_1=finish&limit=25&action=Show%2BDecks&card_qty%5B1%5D=1&auto=Y`}>Card Pricing</a><br />
                  {this.displayDelete(card)} 
                </Col>
              </Row>
              <br />
            </div> 
      )//ends map
      console.log("returnable = " ,returnable)
    }  
  }

  render() {
    return (
     <div className = 'marginTop'>
      <h1 className = 'centerText profileName'>{this.state.profile.user}'s Profile</h1>
      <hr />
      <Grid>{this.displayKollection()}</Grid>
     </div>
     );
  }
};