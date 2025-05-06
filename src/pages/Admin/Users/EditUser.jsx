import { Input, Form, DatePicker, Radio, Select } from 'antd';
import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import useRoute from '../../../hooks/useRoute';
import { callApiThongTinNguoiDungEdit, capNhatNguoiDung, layDanhSachLoaiNguoiDung } from '../../../redux/reducers/UserReducer';
import { SwalConfig } from '../../../utils/config';
import dayjs from 'dayjs';

export default () => {
    const { thongTinNguoiDungEdit, danhSachLoaiNguoiDung } = useSelector(state => state.UserReducer);
    const dispatch = useDispatch();
    const { param } = useRoute();

    useEffect(() => {
        dispatch(callApiThongTinNguoiDungEdit(param));
        dispatch(layDanhSachLoaiNguoiDung);
    }, []);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: thongTinNguoiDungEdit.id,
            username: thongTinNguoiDungEdit.username,
            firstName: thongTinNguoiDungEdit.firstName || '',
            lastName: thongTinNguoiDungEdit.lastName || '',
            password: '', // không đổi thì giữ trống
            email: thongTinNguoiDungEdit.email || '',
            phoneNumber: thongTinNguoiDungEdit.phoneNumber || '',
            dateOfBirth: thongTinNguoiDungEdit.dateOfBirth || '',
            gender: thongTinNguoiDungEdit.gender ?? 0,
            avatar: thongTinNguoiDungEdit.avatar || '',
            roles: thongTinNguoiDungEdit.roles?.map(role => role.name) || []
        },
        onSubmit: (values) => {
            const payload = {
                ...values,
                roles: Array.isArray(values.roles) ? values.roles : [values.roles]
            };

            if (!values.password) {
                delete payload.password; // nếu để trống thì xóa khỏi payload
            }

            const { username, firstName, lastName, email, phoneNumber } = values;
            if (username && firstName && lastName && email && phoneNumber) {
                dispatch(capNhatNguoiDung(payload));
            } else {
                SwalConfig('Vui lòng điền đầy đủ thông tin', 'error', true);
            }
        }
    });

    return (
        <div className='addFilmAdmin'>
            <h2 className='text-xl uppercase font-bold mb-4'>Edit User</h2>
            <Form
                onSubmitCapture={formik.handleSubmit}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 10 }}
            >
                <Form.Item label="Tài khoản">
                    <Input name='username' value={formik.values.username} readOnly />
                </Form.Item>
                <Form.Item label="Họ">
                    <Input name='firstName' onChange={formik.handleChange} value={formik.values.firstName} />
                </Form.Item>
                <Form.Item label="Tên">
                    <Input name='lastName' onChange={formik.handleChange} value={formik.values.lastName} />
                </Form.Item>
                <Form.Item label="Email">
                    <Input name='email' onChange={formik.handleChange} value={formik.values.email} />
                </Form.Item>
                <Form.Item label="Mật khẩu">
                    <Input
                        name='password'
                        type="password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        placeholder="Để trống nếu không thay đổi mật khẩu"
                    />
                </Form.Item>
                <Form.Item label="Số điện thoại">
                    <Input name='phoneNumber' onChange={formik.handleChange} value={formik.values.phoneNumber} />
                </Form.Item>
                <Form.Item label="Ngày sinh">
                    <DatePicker
                        format="YYYY-MM-DD"
                        value={formik.values.dateOfBirth ? dayjs(formik.values.dateOfBirth) : null}
                        onChange={(date, dateString) => formik.setFieldValue("dateOfBirth", dateString)}
                    />
                </Form.Item>
                <Form.Item label="Giới tính">
                    <Radio.Group
                        name="gender"
                        value={formik.values.gender}
                        onChange={(e) => formik.setFieldValue("gender", e.target.value)}
                    >
                        <Radio value={1}>Nam</Radio>
                        <Radio value={0}>Nữ</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="Avatar">
                    <Input
                        name='avatar'
                        onChange={formik.handleChange}
                        value={formik.values.avatar}
                        placeholder="URL ảnh đại diện"
                    />
                </Form.Item>
                <Form.Item label="Loại người dùng">
                    <Select
                        value={formik.values.roles}
                        onChange={(value) => formik.setFieldValue("roles", [value])}
                    >
                        {danhSachLoaiNguoiDung?.map((item, index) => (
                            <Select.Option key={index} value={item.maLoaiNguoiDung}>
                                {item.tenLoai}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Tác vụ">
                    <button
                        type='submit'
                        className='border-2 border-orange-300 px-4 py-2 rounded-md hover:border-orange-500'
                    >
                        Cập nhật người dùng
                    </button>
                </Form.Item>
            </Form>
        </div>
    );
};
