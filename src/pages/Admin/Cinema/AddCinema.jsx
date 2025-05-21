import { Form, Input } from 'antd';
import React from 'react';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { SwalConfig } from '../../../utils/config';
import { themCumRapApi } from '../../../redux/reducers/CinemaReducer';

export default function AddCinema() {
    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
            cinemaName: '',
            cinemaAddress: '',
        },
        onSubmit: (values) => {
            const { cinemaName, cinemaAddress } = values;

            if (cinemaName && cinemaAddress) {
                dispatch(themCumRapApi(values));
                SwalConfig('Thêm rạp thành công!', 'success', true);
            } else {
                SwalConfig('Vui lòng điền đầy đủ thông tin', 'error', true);
            }
        }
    });

    return (
        <div className='addCinemaAdmin'>
            <h2 className='text-xl uppercase font-bold mb-4'>Thêm Rạp Chiếu Mới</h2>
            <Form
                onSubmitCapture={formik.handleSubmit}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 10 }}
            >
                <Form.Item label="Tên rạp">
                    <Input
                        name='cinemaName'
                        onChange={formik.handleChange}
                        placeholder="Nhập tên rạp"
                    />
                </Form.Item>
                <Form.Item label="Địa chỉ rạp">
                    <Input
                        name='cinemaAddress'
                        onChange={formik.handleChange}
                        placeholder="Nhập địa chỉ rạp"
                    />
                </Form.Item>
                <Form.Item label="Tác vụ">
                    <button
                        type='submit'
                        className='border-2 border-green-400 px-4 py-2 rounded-md hover:border-green-600'
                    >
                        Thêm rạp
                    </button>
                </Form.Item>
            </Form>
        </div>
    );
}
