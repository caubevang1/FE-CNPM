import { Input, Form, DatePicker, Select } from 'antd';
import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { layDanhSachLoaiNguoiDung, ThemNguoiDung } from '../../../redux/reducers/UserReducer';
import { SwalConfig } from '../../../utils/config';
import { kiemTraRong, kiemTraDoDai, kiemTraDinhDang } from '../../../utils/validation';
const { Option } = Select;

// const kiemTraRong = (value, errors, name, title) => {
//     if (!value || value.trim() === '') {
//         errors[name] = `${title} không được bỏ trống`;
//         return false;
//     }
//     return true;
// };

// const kiemTraDoDai = (value, errors, name, title, min, max) => {
//     if (value.length < min || value.length > max) {
//         errors[name] = `${title} phải từ ${min} đến ${max} ký tự`;
//         return false;
//     }
//     return true;
// };

// const kiemTraDinhDang = (value, errors, name, title, regex, msg) => {
//     if (!regex.test(value)) {
//         errors[name] = `${title} ${msg}`;
//         return false;
//     }
//     return true;
// };

export default () => {
    const dispatch = useDispatch();
    const { danhSachLoaiNguoiDung } = useSelector(state => state.UserReducer);

    useEffect(() => {
        dispatch(layDanhSachLoaiNguoiDung);
    }, []);

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
            checkPassword: '',
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            email: '',
            phoneNumber: '',
            gender: 1,
            avatar: 'default avatar',
            roles: 'USER',
        },
        validate: (values) => {
            const errors = {};
            const fields = [
                { name: 'username', title: 'Tài khoản' },
                { name: 'password', title: 'Mật khẩu' },
                { name: 'checkPassword', title: 'Nhập lại mật khẩu' },
                { name: 'firstName', title: 'Họ' },
                { name: 'lastName', title: 'Tên' },
                { name: 'email', title: 'Email' },
                { name: 'phoneNumber', title: 'Số điện thoại' },
                { name: 'dateOfBirth', title: 'Ngày sinh' },
            ];

            fields.forEach(({ name, title }) => {
                const value = values[name];
                let isValid = kiemTraRong(value, errors, name, title);

                if (name === 'username') {
                    isValid = isValid &&
                        kiemTraDoDai(value, errors, name, title, 6, 20) &&
                        kiemTraDinhDang(value, errors, name, title, /^\S*$/, 'không được có khoảng cách');
                }

                if (name === 'password') {
                    isValid = isValid &&
                        kiemTraDoDai(value, errors, name, title, 6, 50) &&
                        kiemTraDinhDang(value, errors, name, title, /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/, 'phải có chữ thường, chữ hoa, số và ký tự đặc biệt');
                }

                if (name === 'checkPassword') {
                    if (value !== values.password) {
                        errors[name] = 'Mật khẩu xác nhận không khớp';
                    }
                }

                if (name === 'firstName' || name === 'lastName') {
                    isValid = isValid &&
                        kiemTraDinhDang(value, errors, name, title, /^[^\d!@#$%^&*]+$/, 'không được có số và ký tự đặc biệt');
                }

                if (name === 'email') {
                    isValid = isValid &&
                        kiemTraDinhDang(value, errors, name, title, /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, 'không hợp lệ');
                }

                if (name === 'phoneNumber') {
                    isValid = isValid &&
                        kiemTraDinhDang(value, errors, name, title, /^[0-9]+$/, 'phải là số') &&
                        kiemTraDoDai(value, errors, name, title, 10, 10);
                }
            });

            return errors;
        },
        onSubmit: (value) => {
            dispatch(ThemNguoiDung(value));
        }
    });

    return (
        <div className='addFilmAdmin'>
            <h2 className='text-xl uppercase font-bold mb-4'>Thêm người dùng</h2>
            <Form
                onSubmitCapture={formik.handleSubmit}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 10 }}
            >
                <Form.Item label="Tài khoản" validateStatus={formik.errors.username && 'error'} help={formik.errors.username}>
                    <Input name="username" onChange={formik.handleChange} />
                </Form.Item>

                <Form.Item label="Mật khẩu" validateStatus={formik.errors.password && 'error'} help={formik.errors.password}>
                    <Input.Password name="password" onChange={formik.handleChange} />
                </Form.Item>

                <Form.Item label="Nhập lại mật khẩu" validateStatus={formik.errors.checkPassword && 'error'} help={formik.errors.checkPassword}>
                    <Input.Password name="checkPassword" onChange={formik.handleChange} />
                </Form.Item>

                <Form.Item label="Họ" validateStatus={formik.errors.firstName && 'error'} help={formik.errors.firstName}>
                    <Input name="firstName" onChange={formik.handleChange} />
                </Form.Item>

                <Form.Item label="Tên" validateStatus={formik.errors.lastName && 'error'} help={formik.errors.lastName}>
                    <Input name="lastName" onChange={formik.handleChange} />
                </Form.Item>

                <Form.Item label="Ngày sinh" validateStatus={formik.errors.dateOfBirth && 'error'} help={formik.errors.dateOfBirth}>
                    <DatePicker format="YYYY-MM-DD" placeholder="YYYY-MM-DD" onChange={(date, dateString) => formik.setFieldValue('dateOfBirth', dateString)} />
                </Form.Item>

                <Form.Item label="Email" validateStatus={formik.errors.email && 'error'} help={formik.errors.email}>
                    <Input name="email" onChange={formik.handleChange} />
                </Form.Item>

                <Form.Item label="Số điện thoại" validateStatus={formik.errors.phoneNumber && 'error'} help={formik.errors.phoneNumber}>
                    <Input name="phoneNumber" onChange={formik.handleChange} />
                </Form.Item>

                <Form.Item label="Giới tính">
                    <Select defaultValue={1} onChange={(value) => formik.setFieldValue('gender', value)}>
                        <Option value={1}>Nam</Option>
                        <Option value={0}>Nữ</Option>
                    </Select>
                </Form.Item>

                <Form.Item label="Loại người dùng">
                    <Select defaultValue="USER" onChange={(value) => formik.setFieldValue('roles', value)}>
                        {danhSachLoaiNguoiDung?.map((item, index) => (
                            <Option key={index} value={item.roles}>{item.tenLoai}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item label="Tác vụ">
                    <button type='submit' className='border-2 border-orange-300 px-4 py-2 rounded-md hover:border-orange-500'>
                        Thêm người dùng
                    </button>
                </Form.Item>
            </Form>
        </div>
    );
};
