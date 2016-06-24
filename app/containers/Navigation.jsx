import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import classNames from 'classnames/bind';
import styles from 'css/components/navigation';

const cx = classNames.bind(styles);

class Navigation extends Component {

  constructor(props){
    super(props);
    this.state = {
      search: ''
    }
  }

	logout(){
		fetch('/api/v1/logout',{credentials : 'same-origin'})
	}

   

  render() {
    return (
      <nav className={cx('navigation')} role="navigation">
      	<Link to="/" className={cx('item')} activeClassName={cx('active')}>Home</Link>
      	<Link to="/add-post" className={cx('item')} activeClassName={cx('active')}>Add Post</Link>
      	<Link to="/login" className={cx('item')} activeClassName={cx('active')}>Login</Link>
      	<Link to="/" onClick={this.logout} className={cx('item')} activeClassName={cx('active')}>Logout</Link>
        <input onChange={(e)=>this.setState({search: "/search/" + e.target.value})} />
        <Link to={this.state.search}><button>Search Collections</button></Link>
      </nav>
    );
  }
}

export default Navigation;