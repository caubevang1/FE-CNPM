import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { kiemTraDinhDang, kiemTraDoDai, kiemTraRong } from '../../utils/validation';
import { SwalConfig } from '../../utils/config';
import { DangKy } from '../../services/UserService';
import { GROUPID } from '../../utils/constant';
import useRoute from '../../hooks/useRoute';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nguoiDung: {
                username: '',
                password: '',
                checkPassword: '',
                firstName: '',
                lastName: '',
                dateOfBirth: '',
                gender: '',
                avatar: '',
                email: '',
                phoneNumber: '',
            },
            err: {},
            isValid: true,
        };
    }

    handleChangeInput = (e) => {
        const { name, title, value, files, type } = e.target;
        const { nguoiDung } = this.state;
        let isValid = true;

        const fieldValue = type === 'file' ? files[0] : value;
        const newErr = {}; // Reset errors

        // Kiểm tra rỗng
        isValid = kiemTraRong(fieldValue, newErr, name, title);

        // Các điều kiện riêng
        if (name === 'username') {
            isValid = isValid &&
                kiemTraDoDai(fieldValue, newErr, name, title, 6, 6) &&
                kiemTraDinhDang(fieldValue, newErr, name, title, /^\S*$/, 'không được có khoảng cách');
        }
        if (name === 'password') {
            isValid = isValid &&
                kiemTraDoDai(fieldValue, newErr, name, title, 6, 50) &&
                kiemTraDinhDang(fieldValue, newErr, name, title, /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{0,}$/, 'phải có chữ thường, chữ hoa, số và ký tự đặc biệt');
        }
        if (name === 'checkPassword') {
            if (fieldValue !== nguoiDung.password) {
                newErr[name] = 'Mật khẩu xác nhận không khớp';
                isValid = false;
            }
        }
        if (name === 'firstName' || name === 'lastName') {
            isValid = isValid && kiemTraDinhDang(fieldValue, newErr, name, title, /^[^\d!@#$%^&*]+$/, 'không được có số và ký tự đặc biệt');
        }
        if (name === 'email') {
            isValid = isValid && kiemTraDinhDang(fieldValue, newErr, name, title, /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, 'không hợp lệ');
        }
        if (name === 'phoneNumber') {
            isValid = isValid &&
                kiemTraDinhDang(fieldValue, newErr, name, title, /^[0-9]+$/, 'phải là số') &&
                kiemTraDoDai(fieldValue, newErr, name, title, 10, 10);
        }

        this.setState({
            nguoiDung: { ...nguoiDung, [name]: fieldValue },
            err: newErr, // chỉ giữ lỗi hiện tại
            isValid,
        });
    }

    callApiRegister = async () => {
        try {
            await DangKy(this.state.nguoiDung);
            SwalConfig('Đăng ký thành công', 'success', false);
            this.props.navigate('/login');
        } catch (error) {
            SwalConfig(error.response?.data?.content || 'Đăng ký thất bại', 'error', true, 3000);
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { nguoiDung, isValid } = this.state;
        const required = ['username', 'password', 'checkPassword', 'firstName', 'lastName', 'dateOfBirth', 'gender', 'email', 'phoneNumber'];
        const filled = required.every(key => nguoiDung[key] !== '');
        if (filled && isValid) {
            console.log(this.state.nguoiDung);
            this.callApiRegister();
        } else {
            SwalConfig('Vui lòng điền đầy đủ thông tin', 'info', false);
        }
    }

    render() {
        const { err } = this.state;
        return (
            <div className='register mt-16'>
                <div className="register__overlay"></div>
                <form onSubmit={this.handleSubmit} className="form rounded-lg bg-white p-2 sm:px-8 sm:py-4 lg:py-6">
                    <div className='text-center mb-4'>
                        <FontAwesomeIcon className='w-10 h-10 text-orange-500' icon={faCircleCheck} />
                        <h2 className='text-xl font-bold'>Đăng Ký</h2>
                    </div>

                    {/* Username */}
                    <div className="form-control">
                        <input onChange={this.handleChangeInput} type="text" name="username" title='Tài khoản' className="form-input" />
                        <label className="form-label bg-white">Tài khoản</label>
                    </div>
                    <p className='form-err mb-4'>{err.username}</p>

                    {/* Password */}
                    <div className="form-control mt-5">
                        <input onChange={this.handleChangeInput} type="password" name="password" title='Mật khẩu' className="form-input" />
                        <label className="form-label bg-white">Mật khẩu</label>
                    </div>
                    <p className='form-err mb-4'>{err.password}</p>

                    {/* Check Password */}
                    <div className="form-control mt-5">
                        <input onChange={this.handleChangeInput} type="password" name="checkPassword" title='Xác nhận mật khẩu' className="form-input" />
                        <label className="form-label bg-white">Xác nhận mật khẩu</label>
                    </div>
                    <p className='form-err mb-4'>{err.checkPassword}</p>

                    {/* Họ và Tên */}
                    <div className="flex gap-4 mt-5">
                        <div className="form-control flex-1">
                            <input onChange={this.handleChangeInput} type="text" name="lastName" title='Họ' className="form-input" />
                            <label className="form-label bg-white">Họ</label>
                        </div>
                        <p className='form-err'>{err.lastName}</p>
                        <div className="form-control flex-1">
                            <input onChange={this.handleChangeInput} type="text" name="firstName" title='Tên' className="form-input" />
                            <label className="form-label bg-white">Tên</label>
                        </div>
                        <p className='form-err'>{err.firstName}</p>
                    </div>

                    {/* Ngày sinh và Giới tính */}
                    <div className="flex gap-4 mt-5 items-end">
                        <div className="form-control flex-1">
                            <input onChange={this.handleChangeInput} type="date" name="dateOfBirth" title='Ngày sinh' className="form-input" />
                            <label className="form-label bg-white">Ngày sinh</label>
                        </div>
                        <p className='form-err'>{err.dateOfBirth}</p>
                        <div className="form-control flex-1">
                            <label className="block mb-1 font-medium">Giới tính</label>
                            <div className="flex gap-4">
                                <label>
                                    <input type="radio" name="gender" value="1" onChange={this.handleChangeInput} /> Nam
                                </label>
                                <label>
                                    <input type="radio" name="gender" value="0" onChange={this.handleChangeInput} /> Nữ
                                </label>
                            </div>
                        </div>
                        <p className='form-err'>{err.gender}</p>
                    </div>

                    {/* Email */}
                    <div className="form-control mt-5">
                        <input onChange={this.handleChangeInput} type="email" name="email" title='Email' className="form-input" />
                        <label className="form-label bg-white">Email</label>
                    </div>
                    <p className='form-err mb-4'>{err.email}</p>

                    {/* Phone */}
                    <div className="form-control mt-5">
                        <input onChange={this.handleChangeInput} type="text" name="phoneNumber" title='Số điện thoại' className="form-input" />
                        <label className="form-label bg-white">Số điện thoại</label>
                    </div>
                    <p className='form-err mb-4'>{err.phoneNumber}</p>

                    <div className="my-4">
                        <button type="submit" className="w-full py-4 bg-red-600 text-white font-bold uppercase rounded-lg hover:bg-red-700 transition">
                            Đăng Ký
                        </button>
                    </div>

                    <div className='text-right'>
                        <span onClick={() => this.props.navigate('/login')} className='text-black hover:text-black font-medium cursor-pointer'>
                            Bạn đã có tài khoản ? <span className='text-red-600'>Đăng nhập thôi!</span>
                        </span>
                    </div>
                </form>
            </div>
        );
    }
}

// Wrapper to inject navigate via hook
export default function RegisterWithNavigate(props) {
    const { navigate } = useRoute();
    return <Register {...props} navigate={navigate} />;
}
