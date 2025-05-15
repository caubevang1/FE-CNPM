import { Form, Input } from 'antd';
import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import useRoute from '../../../hooks/useRoute';
import { callApiThongTinCumRap, capNhatCumRapApi } from '../../../redux/reducers/CinemaReducer';

export default function EditCinema() {
    const { thongTinCumRap } = useSelector(state => state.CinemaReducer);
    const dispatch = useDispatch();
    const { param } = useRoute();

    useEffect(() => {
        dispatch(callApiThongTinCumRap(param.cinemaId));
    }, [dispatch, param.cinemaId]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            cinemaId: thongTinCumRap?.cinemaId || '',
            cinemaName: thongTinCumRap?.cinemaName || '',
            cinemaAddress: thongTinCumRap?.cinemaAddress || '',
        },
        onSubmit: (values) => {
            const updatedCinema = {
                cinemaName: values.cinemaName,
                cinemaAddress: values.cinemaAddress,
            };

            dispatch(capNhatCumRapApi(updatedCinema, param.cinemaId));
        }
    });

    return (
        <div className='editCinemaAdmin'>
            <h2 className='text-xl uppercase font-bold mb-4'>Chỉnh sửa cụm rạp</h2>
            <Form
                onSubmitCapture={formik.handleSubmit}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
            >
                <Form.Item label="Mã rạp">
                    <Input
                        name="cinemaId"
                        value={formik.values.cinemaId}
                        disabled
                    />
                </Form.Item>

                <Form.Item label="Tên rạp">
                    <Input
                        name="cinemaName"
                        value={formik.values.cinemaName}
                        onChange={formik.handleChange}
                    />
                </Form.Item>

                <Form.Item label="Địa chỉ rạp">
                    <Input
                        name="cinemaAddress"
                        value={formik.values.cinemaAddress}
                        onChange={formik.handleChange}
                    />
                </Form.Item>

                <Form.Item label="Tác vụ">
                    <button
                        type="submit"
                        className="border-2 border-orange-300 px-4 py-2 rounded-md hover:border-orange-500"
                    >
                        Cập nhật rạp
                    </button>
                </Form.Item>
            </Form>
        </div>
    );
}
