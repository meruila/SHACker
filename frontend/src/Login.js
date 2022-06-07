import React, { Component } from "react";
import { Redirect } from "react-router";
import Cookies from "universal-cookie";

/**  Title of Component: Login
 *   Description: A component that has an email and password fields.
 *      - Directs to another page when login is successful.
 *   Output: Email Text field, Password Text field.
 * 
*/

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);

    this.state = {
      redirect: null }
  }

  login(e) {
    e.preventDefault();

    const credentials = {
      email: document.getElementById("l-email").value,
      password: document.getElementById("l-password").value
    }

    // Send a POST request
    fetch(
      process.env.REACT_APP_API_PATH + "/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
      })
      .then(response => response.json())
      .then(body => {
        if (!body.success) { alert("Failed to log in"); }
        else {
          // successful log in. store the token as a cookie
          //console.log(body);

          const cookies = new Cookies();
          cookies.set(
            "authToken",
            body.token,
            {
              path: "localhost:3001/",
              age: 60*60,
              sameSite: "lax"
            });

            localStorage.setItem("username", body.username);
            localStorage.setItem("userid", body.userid);
            alert("Successfully logged in");
            this.setState({ redirect: true });
        }
      })
  }

  render() {
    if(this.state.redirect){
      return <Redirect to="/feed" />
    }
    return (
      <div>
        <div className="login">
        <h2>Log In</h2>
          <form>
            <input type="text" id="l-email" placeholder="Email" />&nbsp;
            <input type="password" id="l-password" placeholder="password" />&nbsp;
            <button id="login" onClick={this.login}>Log In</button>
          </form>
        </div>
      </div>
    )
  }
}
