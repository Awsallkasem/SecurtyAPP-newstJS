import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";

import AuthService from "../services/auth.service";
import socket, { reconnect } from "./../socketInit";
import PGPCrypto from "../services/encryption/PgpCrypt";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const email = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};

const name = (value) => {
  if (value.length < 3 || value.length > 50) {
    return (
      <div className="alert alert-danger" role="alert">
        The name must be between 3 and 50 characters.
      </div>
    );
  }
};
const nationalID = (value) => {
  if (value.length !== 11) {
    return (
      <div className="alert alert-danger" role="alert">
        The nationalID must be 11 characters.
      </div>
    );
  }
};
const password = (value) => {
  if (value.length < 8 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.onChangeusername = this.onChangeusername.bind(this);
    this.onChangenationalID = this.onChangenationalID.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      username: "",
      email: "",
      password: "",
      nationalID: "",
      successful: false,
      message: "",
      checked: false,
    };
  }

  onChangeusername(e) {
    this.setState({
      username: e.target.value,
    });
  }
  onChangenationalID(e) {
    this.setState({
      nationalID: e.target.value,
    });
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value,
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value,
    });
  }
  onChangeChecked() {
    const { checked } = this.state;
    if (checked) {
      this.setState({ checked: false });
    } else {
      this.setState({ checked: true });
    }
  }

  async handleRegister(e) {
    e.preventDefault();
    this.setState({
      message: "",
      successful: false,
    });
    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      await AuthService.register(
        this.state.username,
        this.state.email,
        this.state.password,
        this.state.nationalID,
        this.state.checked
      );
      socket.on("err", (data) => {
        this.setState({ message: data.message });
      });
      socket.on("Reg-Success", (data) => {
        this.setState({
          message: data.user,
          successful: true,
        });
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", JSON.stringify(data.token));
        localStorage.setItem("userId", JSON.stringify(data.user._id));
        localStorage.setItem("isDoctor", JSON.stringify(this.state.checked));
        const { publicKey, privateKey } = PGPCrypto.generatePairKeys();
        localStorage.setItem("publicClientKey", JSON.stringify(publicKey));
        localStorage.setItem("privateKey", JSON.stringify(privateKey));

        reconnect();
        this.props.history.push("/completeInfo");
        window.location.reload();
      });
    }
  }

  render() {
    return (
      <div className="col-md-12">
        <div className="card card-container">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />

          <Form
            onSubmit={this.handleRegister}
            ref={(c) => {
              this.form = c;
            }}
          >
            {!this.state.successful && (
              <div>
                <div className="form-group">
                  <label htmlFor="fname">First name</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="username"
                    value={this.state.username}
                    onChange={this.onChangeusername}
                    validations={[required, name]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChangeEmail}
                    validations={[required, email]}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="nationalID">nationalID</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="nationalID"
                    value={this.state.nationalID}
                    onChange={this.onChangenationalID}
                    validations={[required, nationalID]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Input
                    type="password"
                    className="form-control"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChangePassword}
                    validations={[required, password]}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="isDoctor">isDoctor</label>
                  <input
                    type="checkbox"
                    label="is Doctor"
                    name="is Doctor"
                    className="selectsingle"
                    onChange={() => this.onChangeChecked()}
                  />
                </div>
                <div className="form-group">
                  <button className="btn btn-primary btn-block">Sign Up</button>
                </div>
              </div>
            )}

            {this.state.message && (
              <div className="form-group">
                <div
                  className={
                    this.state.successful
                      ? "alert alert-success"
                      : "alert alert-danger"
                  }
                  role="alert"
                >
                  {this.state.successful ? false : this.state.message}
                </div>
              </div>
            )}
            <CheckButton
              style={{ display: "none" }}
              ref={(c) => {
                this.checkBtn = c;
              }}
            />
          </Form>
        </div>
      </div>
    );
  }
}
