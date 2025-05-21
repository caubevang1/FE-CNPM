import { Form, Input, InputNumber } from 'antd';
import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import useRoute from '../../../hooks/useRoute';
import { callApiRoomDetail, capNhatPhongApi } from '../../../redux/reducers/RoomReducer';

export default function EditRoom() {
    const dispatch = useDispatch();
    const { param } = useRoute();
    const { roomDetail } = useSelector(state => state.RoomReducer);

    useEffect(() => {
        if (param.roomId) {
            dispatch(callApiRoomDetail(param.roomId));
        }
    }, [dispatch, param.roomId]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            cinemaId: roomDetail?.cinemaId || '',
            roomName: roomDetail?.roomName || '',
            numRow: roomDetail?.numRow || 1,
            numCol: roomDetail?.numCol || 1,
            seatPrice: Array.isArray(roomDetail?.seatPrice) && roomDetail.seatPrice.length === 3
                ? roomDetail.seatPrice
                : [0, 0, 0],
        },
        onSubmit: (values) => {
            dispatch(capNhatPhongApi(values, param.roomId));
        }
    });

    return (
        <div className='editRoomAdmin'>
            <h2 className='text-xl uppercase font-bold mb-4'>Chỉnh sửa Phòng</h2>
            <Form
                onSubmitCapture={formik.handleSubmit}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 10 }}
            >
                <Form.Item label="Tên phòng">
                    <Input
                        name="roomName"
                        onChange={formik.handleChange}
                        value={formik.values.roomName}
                    />
                </Form.Item>

                <Form.Item label="ID Rạp">
                    <Input
                        value={formik.values.cinemaId}
                        disabled
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
                        className='border-2 border-green-400 px-4 py-2 rounded-md hover:border-green-600'
                    >
                        Cập nhật phòng
                    </button>
                </Form.Item>
            </Form>
        </div>
    );
}
