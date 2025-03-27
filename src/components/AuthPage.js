import React, { Component } from "react";
import "./Auth.scss";

class Login extends Component {
    render() {
        return (
            <div className="auth-container">
                <div className="auth-box">
                    <div className="auth-icon">🔑</div>
                    <h2>Đăng Nhập</h2>
                    <input type="text" placeholder="Email hoặc số điện thoại" />
                    <input type="password" placeholder="Mật khẩu" />
                    <button className="auth-button">ĐĂNG NHẬP</button>
                    <p>
                        Bạn chưa có tài khoản? <span onClick={this.props.switchToRegister}>Đăng ký ngay!</span>
                    </p>
                </div>
            </div>
        );
    }
}

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            phoneNum: "",
            password: "",
            dob: "",
            error: "",
        };
    }

    validateInput = (field, value) => {
        let error = "";

        switch (field) {
            case "name":
                error = value.length < 2 ? "Họ và tên phải có ít nhất 2 ký tự!" : "";
                break;
            case "email":
                error = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Email không hợp lệ!";
                break;
            case "phoneNum":
                error = /^[0-9]{10}$/.test(value) ? "" : "Số điện thoại phải có 10 chữ số!";
                break;
            case "password":
                error = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value)
                    ? ""
                    : "Mật khẩu phải có ít nhất 6 ký tự, gồm chữ hoa, chữ thường và số!";
                break;
            case "dob":
                if (!value) {
                    error = "Vui lòng chọn ngày sinh!";
                } else {
                    const age = new Date().getFullYear() - new Date(value).getFullYear();
                    error = age < 13 ? "Bạn phải ít nhất 13 tuổi để đăng ký!" : "";
                }
                break;
            default:
                break;
        }

        this.setState({ error });
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value }, () => {
            this.validateInput(name, value);
        });
    };

    handleRegistration = () => {
        const { name, email, phoneNum, password, dob, error } = this.state;
        if (!name || !email || !phoneNum || !password || !dob) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }
        if (error) {
            alert("Vui lòng kiểm tra lại thông tin!");
        } else {
            alert("Đăng ký thành công!");
        }
    };

    render() {
        return (
            <div className="auth-container">
                <div className="auth-box">
                    <h2>Đăng Ký</h2>

                    <input type="text" name="name" placeholder="Họ và tên" onChange={this.handleInputChange} />
                    <input type="email" name="email" placeholder="Email" onChange={this.handleInputChange} />
                    <input type="text" name="phoneNum" placeholder="Số điện thoại" onChange={this.handleInputChange} />
                    <input type="password" name="password" placeholder="Mật khẩu" onChange={this.handleInputChange} />
                    <input type="date" name="dob" onChange={this.handleInputChange} />

                    {this.state.error && <p className="error">{this.state.error}</p>}

                    <button className="auth-button" onClick={this.handleRegistration}>ĐĂNG KÝ</button>
                    <p>Bạn đã có tài khoản? <span onClick={this.props.switchToLogin}>Đăng nhập ngay!</span></p>
                </div>
            </div>
        );
    }
}

class AuthPage extends Component {
    render() {
        return this.props.isLogin ? (
            <Login switchToRegister={this.props.switchToRegister} />
        ) : (
            <Register switchToLogin={this.props.switchToLogin} />
        );
    }
}

export default AuthPage;