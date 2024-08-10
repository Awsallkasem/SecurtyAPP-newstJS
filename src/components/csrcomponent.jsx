import React, { Component } from "react";
import socket from "../socketInit";
const csr = require("../services/csrGenerator");
class csrcomponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      num1: this.generateRandomNumber(),
      num2: this.generateRandomNumber(),
      userAnswer: "",
      isCorrect: null,
      checked: false,
    };
  }

  generateRandomNumber = () => {
    return Math.floor(Math.random() * 10) + 1; // Adjust the range of random numbers as needed
  };

  handleChange = (event) => {
    this.setState({ userAnswer: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { num1, num2, userAnswer } = this.state;
    const sum = num1 + num2;
    if (parseInt(userAnswer) === sum) {
      const user = JSON.parse(localStorage.getItem("user"));

      const publickey = JSON.parse(localStorage.getItem("publicClientKey"));
      const privateKey = JSON.parse(localStorage.getItem("privateKey"));
      const csRequest = csr.generateCSR(
        privateKey,
        publickey,
        user,
        this.state.checked
      );
      socket.emit("csr", csRequest);
      socket.on("sendcertificat", (data) => {
        localStorage.setItem("sendcertificat", JSON.stringify(data));
        window.location.href = "/";
        window.location.reload();
      });
    }
  };
  onChangeChecked() {
    const { checked } = this.state;
    if (checked) {
      this.setState({ checked: false });
    } else {
      this.setState({ checked: true });
    }
  }

  render() {
    const { num1, num2, userAnswer, isCorrect } = this.state;

    return (
      <div>
        <h2>who are you </h2>
        <p>
          What is the sum of {num1} and {num2}?
        </p>
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={userAnswer} onChange={this.handleChange} />
          <button type="submit">Check Answer</button>
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
        </form>
        {isCorrect !== null && (
          <p>{isCorrect ? "Correct! Well done." : "Incorrect. Try again."}</p>
        )}
      </div>
    );
  }
}

export default csrcomponent;
