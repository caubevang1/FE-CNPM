import React, { Component } from "react";
import NavBar from "./components/NavBar";
import AuthPage from "./components/AuthPage";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: true,
    };
  }

  switchToRegister = () => {
    this.setState({ isLogin: false });
  };

  switchToLogin = () => {
    this.setState({ isLogin: true });
  };

  render() {
    return (
      <>
        <NavBar switchToLogin={this.switchToLogin} switchToRegister={this.switchToRegister} />
        <AuthPage isLogin={this.state.isLogin} switchToLogin={this.switchToLogin} switchToRegister={this.switchToRegister} />
      </>
    );
  }
}

export default App;
