import React, { useState } from 'react';
import { sendOtpEmail } from '../../services/UserService';
import { SwalConfig } from '../../utils/config';
import useRoute from '../../hooks/useRoute';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const { navigate } = useRoute();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Email gửi đi:", email); // THÊM DÒNG NÀY

        try {
            const res = await sendOtpEmail({ email });
            SwalConfig('Đã gửi mã OTP đến email của bạn', 'success', false);
            navigate('/reset-password', { state: { email } });
        } catch (err) {
            console.log('Lỗi từ server:', err?.response?.data);

            const message =
                err?.response?.data?.message ||  // lấy từ message
                err?.response?.data?.content ||
                err?.message ||
                'Lỗi gửi OTP';

            SwalConfig(message, 'error', true, 3000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form p-6 bg-white rounded shadow-md">
            <h2 className="text-lg font-bold mb-4">Quên mật khẩu</h2>
            <input
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input mb-4"
                required
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Gửi OTP</button>
        </form>
    );
}
