import React, { Component } from 'react';
import { Player } from '../../model/Player';
import { withRouter } from '../../util/withRouter';
import './Register.css';

class Register extends Component {
  constructor(props) {
    console.log('astuti')
    super(props);
    this.state = {
      username: ''
    }
  }

  onUsernameChange = (event) => {
    this.setState({
      username: event.target.value
    })
  }

  onSubmit = () => {
    const username = this.state.username;
    if (username) {
      const id = username + Date.now();
      const player = new Player(id, username)
      localStorage.setItem('player', JSON.stringify(player));
      this.props.navigate('/home');
    } else {
      alert('Fill in username');
    }
  }

  render() {
    return (
      <div>
        <h2>Enter Username</h2>
        <input value={this.state.username} onChange={this.onUsernameChange} placeholder="Username..." />
        <button onClick={this.onSubmit}>Enter</button>
      </div>
    )
  }
}

export default withRouter(Register);
