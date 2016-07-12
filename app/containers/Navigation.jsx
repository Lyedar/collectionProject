import React, { Component, PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import styles from 'css/components/navigation';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap'
const cx = classNames.bind(styles);
const {Header, Brand} = Navbar
class Navigation extends Component {

 constructor(props){
    super(props);
    this.state = {}
  }  

  componentWillMount() {
    var self = this
    fetch('/api/v1/getuser', {credentials : 'same-origin'})
    .then(function(response) {
      return response.json()
    }).then(function(json){
      self.setState(json)
      console.log("parsed json", json)
    }).catch(function(ex) {
      console.log('parsing failed', ex)
    })
  }

  logInOut(){
    if(this.props.user){
      return(
        <NavDropdown eventKey={2} title= {this.props.user} id = "user-drop-down">
          <MenuItem eventKey={2.1} href={/profile/ + this.props.user}>Profile</MenuItem>
          <MenuItem eventKey={2.2} href={"/additem/" + this.props.user}>Search Name Add</MenuItem>
          <MenuItem eventKey={2.3} href={"/addscan/" + this.props.user}>Picture Add</MenuItem> 
          <MenuItem eventKey={2.4} href="/logout">Log Out</MenuItem>  
        </NavDropdown> 
      )     
    } else {
      return <NavItem eventKey={2} href="/login">Login</NavItem>  
    }
  }

  render() {
    return (
      <Navbar className={"navbar-fixed-top"} fluid = 'true'>
        <Header>
          <Brand>
            COLLECTION BOX
          </Brand>
        </Header>
        <Nav>
          <NavItem eventKey={1} href='/'>Home</NavItem>
          {this.logInOut()}
        </Nav>
      </Navbar>
      );
  }
}



export default Navigation;