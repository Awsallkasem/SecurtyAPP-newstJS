import React, { Component } from "react";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import authService from "../services/auth.service";
import socket from "../socketInit";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};
const phoneNumber = (value) => {
  if (value.length < 3 || value.length > 50) {
    return (
      <div className="alert alert-danger" role="alert">
        The phoneNumber must be between 10 and 50 characters.
      </div>
    );
  }
};
const location = (value) => {
  if (value.length <= 0) {
    return (
      <div className="alert alert-danger" role="alert">
        The location must be greeter than 0 characters.
      </div>
    );
  }
};
class CompeleteInfo extends Component {
  state = {
    phoneNumber: "",
    location: "",
    message: "",
    successful: false,
  };

  onChangephoneNumber = (e) => {
    this.setState({
      phoneNumber: e.target.value,
    });
  };
  onChangelocation = (e) => {
    this.setState({
      location: e.target.value,
    });
  };
  handelSubmit = (e) => {
    e.preventDefault();
    this.setState({
      message: "",
      successful: false,
    });
    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      authService.completeInfo(this.state.phoneNumber,this.state.location);
   
socket.on("err",(data)=>{console.log(data);})

    }
  };

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
              onSubmit={this.handelSubmit}
              ref={(c) => {
                this.form = c;
              }}
            >
              {!this.state.successful && (
                <div>

                  
                  <div className="form-group">
                    <label htmlFor="phoneNumber">phoneNumber</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="phoneNumber"
                      value={this.state.phoneNumber}
                      onChange={this.onChangephoneNumber}
                      validations={[required, phoneNumber]}
                    />
                  </div>
  
             
                  <div className="form-group">
                    <label htmlFor="location">location</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="location"
                      value={this.state.location}
                      onChange={this.onChangelocation}
                      validations={[required, location]}
                    />
                  </div>
  
                
  
                  <div className="form-group">
                    <button className="btn btn-primary btn-block">submit</button>
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

export default CompeleteInfo;
