import React, { Component } from "react";
import ApiService from "../../ApiService";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

class EditUserComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      firstName: "",
      lastName: "",
      age: "",
      salary: "",
      message: null,
    };
  }

  componentDidMount() {
    this.loadUser();
  }

  loadUser = () => {
    ApiService.fetchUsersByID(window.localStorage.getItem("userID"))
      .then((res) => {
        let user = res.data;
        this.setState({
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          age: user.age,
          salary: user.salary,
        });
      })
      .catch((err) => {
        console.log("loadUser() Error!", err);
      });
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  saveUser = (e) => {
    e.preventDefault();
    let user = {
      id: this.state.id,
      password: this.state.password,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      age: this.state.age,
      salary: this.state.salary,
    };

    ApiService.editUser(user)
      .then((res) => {
        this.setState({
          message: user.lastName + "님 정보가 수정되었습니다.",
        });
        this.props.history.push("/users");
      })
      .catch((err) => {
        console.log("saveUser() Error!", err);
      });
  };

  render() {
    return (
      <div>
        <Typography variant="h4" style={style}>
          Edit User
        </Typography>
        <form>
          <TextField
            type="text"
            name="username"
            readOnly={true}
            fullWidth
            margin="normal"
            value={this.state.username}
          />

          <TextField
            name="firstName"
            fullWidth
            margin="normal"
            placeholder="edit firstName"
            value={this.state.firstName}
            onChange={this.onChange}
          />
          <TextField
            name="lastName"
            fullWidth
            margin="normal"
            placeholder="insert lastName"
            value={this.state.lastName}
            onChange={this.onChange}
          />
          <TextField
            type="number"
            name="age"
            fullWidth
            margin="normal"
            placeholder="insert age"
            value={this.state.age}
            onChange={this.onChange}
          />
          <TextField
            type="number"
            name="salary"
            fullWidth
            margin="normal"
            placeholder="insert salary"
            value={this.state.salary}
            onChange={this.onChange}
          />
          <Button varient="contained" color="primary" onClick={this.saveUser}>
            Save
          </Button>
        </form>
      </div>
    );
  }
}

const style = {
  display: "flex",
  justifyContent: "center",
};

export default EditUserComponent;
