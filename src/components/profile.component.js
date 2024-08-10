import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../services/auth.service";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { username: "" },
      phoneNumber: "",
      location: "",
    };
  }

  componentDidMount() {

    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true });

    if (JSON.parse(localStorage.getItem("phoneNumer"))) {

      this.setState({
        phoneNumber: JSON.parse(localStorage.getItem("phoneNumer")).phoneNumber,
        location: JSON.parse(localStorage.getItem("location")).location,
      });
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }

    const { currentUser, location, phoneNumber } = this.state;
    return (
      <div className="container">
        {this.state.userReady ? (
          <div>
            <header className="card ">
              <h3>
                <strong>{currentUser.username}</strong> Profile
              </h3>

              <p>
                <strong>Id:</strong> {currentUser._id}
              </p>
              <p>
                <strong>Email:</strong> {currentUser.email}
              </p>
              {JSON.stringify(localStorage.getItem("phoneNumber")) ? (
                <div>
                  <p>
                    <strong>phoneNumber:</strong> {phoneNumber}
                  </p>
                  <p>
                    <strong>location:</strong> {location}
                  </p>
                </div>
              ) : null}
            </header>
          </div>
        ) : null}
      </div>
    );
  }
}
