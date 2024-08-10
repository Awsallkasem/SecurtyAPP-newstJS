import React, { Component } from "react";
import socket from "../socketInit";
import PgbAlg from "../services/encryption/level3";
import Table from "./../common/table";
import { Input } from "@material-ui/core";
import authService from "../services/auth.service";
const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};
class StudentsTabel extends Component {
  state = { students: null, marks: {}, message: "" };
  componentDidMount = () => {
    socket.emit("getstudents", null);
    socket.on("students", (data) => {
      const { containt } = data;
      if (!PgbAlg.checkMac(data, socket)) return;

      const dycryptedData = PgbAlg.DycryptData(
        containt,
        JSON.parse(localStorage.getItem("sessionKey"))
      );

      this.setState({ students: JSON.parse(dycryptedData) });
    });
  };
  onChangeMark = (nationalID, e) => {
    const { value } = e.target;
    this.setState((prevState) => ({
      marks: {
        ...prevState.marks,
        [nationalID]: value,
      },
    }));
  };
  onSaveMarks = () => {
    authService.addMarkswithSignture(this.state.marks);
    socket.on("done", () => {
      this.setState({ message: "done" });
    });
  };
  columns = [
    { path: "username", label: "student name" },
    { path: "nationalID", label: "national id" },
    {
      key: "actions",
      label: "add marks",
      content: (student) => (
        <div className="form-group">
          <label htmlFor="setmark">mark</label>
          <Input
            type="text"
            className="form-control"
            name={`addMark_${student.nationalID}`}
            value={this.state.marks[student.nationalID] || ""}
            onChange={(e) => this.onChangeMark(student.nationalID, e)}
            validations={[required]}
          />
        </div>
      ),
    },
  ];
  render() {
    return (
      <div className="container">
        <h2 className="text-center">Students List</h2>
        <div>
          <div className="row ">
            <div className="col-5">
              <button className="btn btn-primary" onClick={this.onSaveMarks}>
                Save Marks
              </button>
            </div>
            <div className="col-5">
              {" "}
              {this.state.message && (
                <div className="form-group">
                  <h5 className={"alert alert-success  container"} role="alert">
                    {this.state.successful ? false : this.state.message}
                  </h5>
                </div>
              )}
            </div>
          </div>
        </div>
        <Table columns={this.columns} data={this.state.students} />
      </div>
    );
  }
}

export default StudentsTabel;
