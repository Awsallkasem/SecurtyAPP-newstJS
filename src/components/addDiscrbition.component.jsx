import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import authService from "../services/auth.service";
import socket from "../socketInit";
import PgbAlg from "../services/encryption/level3";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

export default class addDiscrbition extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChangeaddDiscrbition = this.onChangeaddDiscrbition.bind(this);

    this.state = {
      addDiscrbition: "",
      loading: false,
      message: "",
    };
  }

  onChangeaddDiscrbition(e) {
    this.setState({
      addDiscrbition: e.target.value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({
      message: "",
      loading: true,
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      authService.discription(this.state.addDiscrbition);
      socket.on("done", async (data) => {
        const { containt } = data;
        if (!(await PgbAlg.checkMac(data, socket))) return;
        const dycryptedDiscription = PgbAlg.DycryptData(
          containt,
          JSON.parse(localStorage.getItem("sessionKey"))
        );
        if (dycryptedDiscription) {
          this.setState({
            message: dycryptedDiscription,
            loading: false,
          });
        }
      });
    }
  }
  render() {
    return (
      <div className="col-md-12 container">
        <div className="card card-container">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />

          <Form
            onSubmit={this.handleSubmit}
            ref={(c) => {
              this.form = c;
            }}
          >
            <div className="form-group">
              <label htmlFor="addDiscrbition">discription</label>
              <Input
                type="text"
                className="form-control"
                name="discription"
                value={this.state.addDiscrbition}
                onChange={this.onChangeaddDiscrbition}
                validations={[required]}
              />
            </div>

            <div className="form-group">
              <button
                className="btn btn-primary btn-block"
                disabled={this.state.loading}
              >
                {this.state.loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Submit</span>
              </button>
            </div>

            {this.state.message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {this.state.message}
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
