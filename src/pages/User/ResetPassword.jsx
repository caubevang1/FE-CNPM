import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import { resetPasswordWithOtp } from '../../services/UserService';
import { SwalConfig } from '../../utils/config';
import useRoute from '../../hooks/useRoute';
import { kiemTraRong, kiemTraDoDai, kiemTraDinhDang } from '../../utils/validation'; // Import validation functions

export default function ResetPassword() {
    const { otp } = useParams(); // ✅ lấy từ URL
    const { navigate } = useRoute();

    const [form, setForm] = useState({
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState({
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setError({ ...error, [name]: '' });
    };

    // Validation function for password and confirmPassword
    const validateForm = () => {
        let isValid = true;
        const newError = {};

        // Validate password
        isValid = isValid && kiemTraRong(form.password, newError, 'password', 'Mật khẩu mới');
        isValid = isValid && kiemTraDoDai(form.password, newError, 'password', 'Mật khẩu mới', 8, 50);
        isValid = isValid && kiemTraDinhDang(form.password, newError, 'password', 'Mật khẩu mới', /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, 'phải có chữ thường, chữ hoa, số và ký tự đặc biệt');

        // Validate confirmPassword
        if (form.confirmPassword !== form.password) {
            newError.confirmPassword = 'Mật khẩu xác nhận không khớp';
            isValid = false;
        }

        setError(newError);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the form before submitting
        if (!validateForm()) {
            return;
        }

        const payload = {
            newPassword: form.password,
            confirmPassword: form.confirmPassword,
        };

        try {
            await resetPasswordWithOtp(otp, payload);
            SwalConfig('Đặt lại mật khẩu thành công', 'success', false);
            navigate('/login');
        } catch (err) {
            SwalConfig(
                err?.response?.data?.content ||
                err?.response?.data?.message ||
                'Lỗi đặt lại mật khẩu',
                'error',
                true,
                3000
            );
        }
    };

    return (
        <div className="login">
            <div className="login__overlay"></div>
            <form
                onSubmit={handleSubmit}
                className="form rounded-lg bg-white p-2 sm:p-4 md:p-8"
            >
                <div className="text-center mb-6">
                    <FontAwesomeIcon
                        className="w-10 h-10 text-orange-500"
                        icon={faCircleUser}
                    />
                    <h2 className="text-xl font-bold">Đặt lại mật khẩu</h2>
                </div>

                <div className="form-control">
                    <input
                        placeholder="none"
                        title="Mật khẩu mới"
                        onChange={handleChange}
                        type="password"
                        name="password"
                        className="form-input"
                        autoComplete="off"
                    />
                    <label className="form-label bg-white">Mật khẩu mới</label>
                </div>
                <p className="form-err font-medium mb-4 mt-1">{error.password}</p>

                <div className="form-control mt-6">
                    <input
                        placeholder="none"
                        title="Xác nhận mật khẩu"
                        onChange={handleChange}
                        type="password"
                        name="confirmPassword"
                        className="form-input"
                        autoComplete="off"
                    />
                    <label className="form-label bg-white">Xác nhận mật khẩu</label>
                </div>
                <p className="form-err font-medium mb-4 mt-1">{error.confirmPassword}</p>

                <div className="my-2 mt-4">
                    <button
                        type="submit"
                        className="w-full py-4 bg-green-600 text-white font-bold text-sm leading-tight uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg
                        focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out"
                    >
                        Xác nhận
                    </button>
                </div>

                <div className="text-right mt-2">
                    <span
                        onClick={() => navigate('/login')}
                        className="text-sm text-blue-600 cursor-pointer hover:underline"
                    >
                        Quay lại đăng nhập
                    </span>
                </div>
            </form>
        </div>
    );
}
