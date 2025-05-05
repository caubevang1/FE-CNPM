import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { resetPasswordWithOtp } from '../../services/UserService';
import { SwalConfig } from '../../utils/config';
import useRoute from '../../hooks/useRoute';

export default function ResetPassword() {
    const { state } = useLocation();
    const { navigate } = useRoute();

    const [form, setForm] = useState({ otp: '', password: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await resetPasswordWithOtp(form.otp, {
                email: state?.email,
                newPassword: form.password
            });
            SwalConfig('Đặt lại mật khẩu thành công', 'success', false);
            navigate('/login');
        } catch (err) {
            SwalConfig(err.response.data.content || 'Lỗi đặt lại mật khẩu', 'error', true, 3000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form p-6 bg-white rounded shadow-md">
            <h2 className="text-lg font-bold mb-4">Đặt lại mật khẩu</h2>
            <input
                type="text"
                name="otp"
                placeholder="Nhập mã OTP"
                onChange={handleChange}
                className="form-input mb-3"
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Mật khẩu mới"
                onChange={handleChange}
                className="form-input mb-4"
                required
            />
            <button className="bg-green-600 text-white px-4 py-2 rounded">Xác nhận</button>
        </form>
    );
}
