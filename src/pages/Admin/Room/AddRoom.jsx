import { Form, Input, InputNumber, Select } from 'antd';
import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { themPhongApi } from '../../../redux/reducers/RoomReducer';
import { callApiCinema } from '../../../redux/reducers/CinemaReducer'; // 👈 Thêm reducer này

const { Option } = Select;

export default function AddRoom() {
    const dispatch = useDispatch();
    const { arrCinema } = useSelector(state => state.CinemaReducer); // 👈 lấy danh sách rạp

    useEffect(() => {
        dispatch(callApiCinema); // 👈 gọi API lấy danh sách rạp khi load
    }, [dispatch]);

    const formik = useFormik({
        initialValues: {
            cinemaId: '',
            roomName: '',
            numRow: 1,
            numCol: 1,
            seatPrice: [0, 0, 0], // Couple, Normal, VIP
        },
        onSubmit: (values) => {
            dispatch(themPhongApi(values));
        }
    });

    return (
        <div className='addRoomAdmin'>
            <h2 className='text-xl uppercase font-bold mb-4'>Thêm Phòng Mới</h2>
            <Form
                onSubmitCapture={formik.handleSubmit}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 10 }}
            >
                <Form.Item label="Chọn rạp">
                    <Select
                        placeholder="Chọn rạp chiếu"
                        onChange={(value) => formik.setFieldValue('cinemaId', value)}
                        value={formik.values.cinemaId}
                    >
                        {arrCinema?.map(cinema => (
                            <Option key={cinema.cinemaId} value={cinema.cinemaId}>
                                {cinema.cinemaName}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item label="Tên phòng">
                    <Input
                        name="roomName"
                        onChange={formik.handleChange}
                        value={formik.values.roomName}
                    />
                </Form.Item>

                <Form.Item label="Số hàng ghế">
                    <InputNumber
                        min={1}
                        onChange={(value) => formik.setFieldValue('numRow', value)}
                        value={formik.values.numRow}
                    />
                </Form.Item>

                <Form.Item label="Số cột ghế">
                    <InputNumber
                        min={1}
                        onChange={(value) => formik.setFieldValue('numCol', value)}
                        value={formik.values.numCol}
                    />
                </Form.Item>

                <Form.Item label="Tổng số ghế">
                    <Input
                        value={formik.values.numRow * formik.values.numCol}
                        disabled
                    />
                </Form.Item>

                <Form.Item label="Giá ghế Normal">
                    <InputNumber
                        min={0}
                        onChange={(value) => {
                            const newPrices = [...formik.values.seatPrice];
                            newPrices[1] = value;
                            formik.setFieldValue('seatPrice', newPrices);
                        }}
                        value={formik.values.seatPrice[1]}
                    />
                </Form.Item>

                <Form.Item label="Giá ghế VIP">
                    <InputNumber
                        min={0}
                        onChange={(value) => {
                            const newPrices = [...formik.values.seatPrice];
                            newPrices[2] = value;
                            formik.setFieldValue('seatPrice', newPrices);
                        }}
                        value={formik.values.seatPrice[2]}
                    />
                </Form.Item>

                <Form.Item label="Giá ghế Couple">
                    <InputNumber
                        min={0}
                        onChange={(value) => {
                            const newPrices = [...formik.values.seatPrice];
                            newPrices[0] = value;
                            formik.setFieldValue('seatPrice', newPrices);
                        }}
                        value={formik.values.seatPrice[0]}
                    />
                </Form.Item>

                <Form.Item label="Tác vụ">
                    <button
                        type='submit'
                        className='border-2 border-blue-400 px-4 py-2 rounded-md hover:border-blue-600'
                    >
                        Thêm phòng
                    </button>
                </Form.Item>
            </Form>
        </div>
    );
}
