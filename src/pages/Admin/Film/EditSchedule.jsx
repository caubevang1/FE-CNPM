import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, TimePicker, Select, Spin, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import {
    fetchSchedules,
    updateSchedule,
} from '../../../redux/reducers/ScheduleReducer';

const { Option } = Select;

export default function EditSchedule() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { scheduleId } = useParams();
    const { schedules, loading } = useSelector((state) => state.ScheduleReducer);
    const [form] = Form.useForm();
    const [currentSchedule, setCurrentSchedule] = useState(null);

    useEffect(() => {
        if (!schedules || schedules.length === 0) {
            dispatch(fetchSchedules());
        }
    }, [dispatch, schedules]);

    useEffect(() => {
        const found = schedules.find((s) => s.scheduleId === parseInt(scheduleId));
        if (found) {
            setCurrentSchedule(found);
            form.setFieldsValue({
                movieId: found.movieId,
                cinemaId: found.cinemaId,
                roomId: found.roomId,
                scheduleDate: dayjs(found.scheduleDate),
                scheduleStart: dayjs(found.scheduleStart, 'HH:mm'),
                scheduleEnd: dayjs(found.scheduleEnd, 'HH:mm'),
            });
        }
    }, [schedules, scheduleId, form]);

    const onFinish = (values) => {
        const data = {
            ...values,
            scheduleDate: values.scheduleDate.format('YYYY-MM-DD'),
            scheduleStart: values.scheduleStart.format('HH:mm'),
            scheduleEnd: values.scheduleEnd.format('HH:mm'),
        };

        dispatch(updateSchedule({ data, scheduleId }))
            .then(() => {
                message.success('Cập nhật lịch chiếu thành công!');
                navigate('/admin/schedule');
            })
            .catch(() => {
                message.error('Cập nhật thất bại!');
            });
    };

    if (loading || !currentSchedule) {
        return (
            <div className="flex justify-center mt-10">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto mt-8 p-4 bg-white shadow rounded">
            <h2 className="text-2xl font-bold mb-6 text-center">Chỉnh sửa lịch chiếu</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item label="Mã phim" name="movieId" rules={[{ required: true, message: 'Vui lòng nhập mã phim' }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Rạp chiếu (cinemaId)" name="cinemaId" rules={[{ required: true, message: 'Vui lòng nhập mã rạp' }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Phòng chiếu (roomId)" name="roomId" rules={[{ required: true, message: 'Vui lòng nhập mã phòng' }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Ngày chiếu" name="scheduleDate" rules={[{ required: true, message: 'Vui lòng chọn ngày chiếu' }]}>
                    <DatePicker format="YYYY-MM-DD" className="w-full" />
                </Form.Item>

                <Form.Item label="Giờ bắt đầu" name="scheduleStart" rules={[{ required: true, message: 'Vui lòng chọn giờ bắt đầu' }]}>
                    <TimePicker format="HH:mm" className="w-full" />
                </Form.Item>

                <Form.Item label="Giờ kết thúc" name="scheduleEnd" rules={[{ required: true, message: 'Vui lòng chọn giờ kết thúc' }]}>
                    <TimePicker format="HH:mm" className="w-full" />
                </Form.Item>

                <Form.Item>
                    <div className="flex justify-between">
                        <Button type="primary" htmlType="submit">
                            Cập nhật
                        </Button>
                        <Button onClick={() => navigate('/admin/schedule')}>
                            Quay lại
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
}
