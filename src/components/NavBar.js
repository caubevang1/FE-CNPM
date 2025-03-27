import React, { Component } from "react";
import "./NavBar.scss";

class NavBar extends Component {
    render() {
        return (
            <nav className="navbar">
                <div className="logo">Nhóm 13</div>
                <ul className="nav-links">
                    <li><a href="#">Phim</a></li>
                    <li><a href="#">Cụm rạp</a></li>
                    <li><a href="#">Tin tức</a></li>
                    <li><a href="#">Ứng dụng</a></li>
                </ul>
                <div className="auth-buttons">
                    <button className="login" onClick={this.props.switchToLogin}>Đăng Nhập</button>
                    <button className="register" onClick={this.props.switchToRegister}>Đăng Ký</button>
                </div>
            </nav>
        );
    }
}

export default NavBar;
