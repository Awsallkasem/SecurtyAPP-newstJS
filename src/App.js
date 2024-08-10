import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Profile from "./components/profile.component";

import EventBus from "./common/EventBus";
import socket, { reconnect } from "./socketInit";
import CompeleteInfo from "./components/completInfo.component";
import addDiscrbition from "./components/addDiscrbition.component";
import StudentsTabel from "./components/students.Tablecomponent";
import csrcomponent from "./components/csrcomponent";
import forge from "node-forge";

class App extends Component {
  constructor(props) {
    super(props);

    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: true,
      showAdminBoard: false,
      currentUser: undefined,
      isDoctor: false,
      ip: "",
      port: "",
    };
  }

  componentDidMount() {
    reconnect();
    const user = AuthService.getCurrentUser();
    const certificatFromPem = JSON.parse(
      localStorage.getItem("sendcertificat")
    );
    if (certificatFromPem) {
      const certificate = forge.pki.certificateFromPem(certificatFromPem);
      if (certificate.subject.getField("CN").value.includes("Dr")) {
        this.setState({ isDoctor: true });
      }
    }

    if (user) {
      this.setState({
        currentUser: user,
        showModeratorBoard: user.isAdmin,
        showAdminBoard: user.isAdmin,
      });
    }

    EventBus.on("logout", () => {
      this.logOut();
    });
  }

  componentWillUnmount() {
    socket.disconnect();
    EventBus.remove("logout");
  }

  logOut() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("phoneNumber");
    localStorage.clear();

    this.setState({
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    });
  }

  connect = () => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      reconnect();
    }
  };

  render() {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            UN
          </Link>
          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/"} className="nav-link">
                  Profile
                </Link>
              </li>
              {!this.state.isDoctor ? (
                <li className="nav-item">
                  <Link to="/addDiscrbition" className="nav-link">
                    addDiscrbition
                  </Link>
                </li>
              ) : (
                <li className="nav-item">
                  <Link to="/students" className="nav-link">
                    students list
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <Link to="/" className="nav-link" onClick={this.connect}>
                  connect
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/csr" className="nav-link">
                  conn
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/logout" className="nav-link" onClick={this.logOut}>
                  LogOut
                </Link>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/" className="nav-link" onClick={this.connect}>
                  connect
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route path="/addDiscrbition" component={addDiscrbition} />
            <Route exact path="/" component={Profile} />
            <Route exact path="/Profile" component={Profile} />
            <Route exact path="/completeInfo" component={CompeleteInfo} />
            <Route exact path="/students" component={StudentsTabel} />
            <Route exact path="/csr" component={csrcomponent} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
