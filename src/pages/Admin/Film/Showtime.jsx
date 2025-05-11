import React, { useState, useEffect } from 'react';
import { DatePicker, TimePicker, Select, Button, Form, Input } from 'antd';
import { layThongTinCumRapTheoHeThong, layThongTinPhong } from '../../../services/CinemaService';
import { useFormik } from 'formik';
import useRoute from '../../../hooks/useRoute';
import dayjs from 'dayjs';
import { TaoLichChieu } from '../../../services/BookingManager';
import { SwalConfig } from '../../../utils/config';
import { LayThongTinPhimChiTiet } from '../../../services/FilmService';

export default function Showtime() {
    const { param, navigate } = useRoute();
    const [state, setState] = useState({
        cumRapChieu: [],
        phongChieu: [],
    });
    const [loading, setLoading] = useState(false);
    const [movieLength, setMovieLength] = useState(0); // Lưu độ dài phim

    const formik = useFormik({
        initialValues: {
            movieId: param.id,
            roomId: '',
            cinemaId: '',
            scheduleDate: '',
            scheduleStart: '', // Thời gian bắt đầu (chỉ giờ)
            scheduleEnd: '',    // Thời gian kết thúc (chỉ giờ)
        },

        onSubmit: async (values) => {
            try {
                const start = dayjs(values.scheduleStart);
                const end = start.add(movieLength + 10, 'minute'); // Cộng thêm 10 phút

                // Làm tròn phút đến bội số của 5
                const roundedEnd = end.minute(Math.round(end.minute() / 5) * 5);

                const requestData = {
                    movieId: values.movieId,
                    roomId: values.roomId,
                    cinemaId: values.cinemaId,
                    scheduleDate: dayjs(values.scheduleDate).format('YYYY-MM-DD'),
                    scheduleStart: dayjs.isDayjs(values.scheduleStart)
                        ? values.scheduleStart.format('HH:mm:ss')
                        : '00:00:00',
                    scheduleEnd: roundedEnd.format('HH:mm:ss'), // Sử dụng thời gian kết thúc đã làm tròn
                };

                const result = await TaoLichChieu(requestData);
                SwalConfig(result.data.content, 'success', true);
                navigate('/admin/film');
            } catch (error) {
                SwalConfig(error.response?.data?.content || 'Đã có lỗi xảy ra', 'error', true, 3000);
            }
        }
    });

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                setLoading(true);
                const result = await LayThongTinPhimChiTiet(param.id); // Lấy thông tin phim chi tiết từ API
                if (result?.data?.movieLength) {
                    setMovieLength(result.data.movieLength); // Lưu độ dài phim vào state
                } else {
                    console.error('Không lấy được độ dài phim');
                }
            } catch (error) {
                console.error('Lỗi khi lấy thông tin phim:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails(); // Gọi API lấy thông tin phim chi tiết
    }, [param.id]);

    useEffect(() => {
        const callApiCumRap = async () => {
            try {
                setLoading(true);
                const result = await layThongTinCumRapTheoHeThong();
                if (Array.isArray(result.data)) {
                    setState(prev => ({
                        ...prev,
                        cumRapChieu: result.data,
                    }));
                } else {
                    console.error('Dữ liệu cụm rạp không hợp lệ:', result.data);
                }
            } catch (error) {
                console.error('Lỗi lấy cụm rạp:', error);
            } finally {
                setLoading(false);
            }
        };

        callApiCumRap();
    }, []);

    const handleChangeCumRap = async (cinemaId) => {
        formik.setFieldValue('cinemaId', cinemaId);
        formik.setFieldValue('roomId', ''); // Reset roomId khi thay đổi cinemaId

        try {
            setLoading(true);
            const result = await layThongTinPhong();
            const rooms = Array.isArray(result.data) ? result.data : result.data.content || [];
            const filteredRooms = rooms.filter(room => room.cinemaId === cinemaId);
            setState(prev => ({
                ...prev,
                phongChieu: filteredRooms,
            }));
        } catch (error) {
            console.error('Lỗi lấy phòng chiếu:', error);
        } finally {
            setLoading(false);
        }
    };

    const convertSelectCr = () => {
        return state.cumRapChieu.map(cumRap => ({
            label: cumRap.cinemaName,
            value: cumRap.cinemaId,
        }));
    };

    const convertSelectRoom = () => {
        return state.phongChieu.map(room => ({
            label: room.roomName,
            value: room.roomId,
        }));
    };

    const handleScheduleStartChange = (value) => {
        formik.setFieldValue('scheduleStart', value);
        // Tính giờ kết thúc tự động khi giờ bắt đầu thay đổi
        if (value) {
            const start = dayjs(value);
            const end = start.add(movieLength + 10, 'minute');
            const roundedEnd = end.minute(Math.round(end.minute() / 5) * 5);
            formik.setFieldValue('scheduleEnd', roundedEnd);
        }
    };

    return (
        <div className="container">
            <Form
                onSubmitCapture={formik.handleSubmit}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 8 }}
                autoComplete="off"
            >
                <h3 className="text-2xl uppercase font-bold mb-4">Tạo lịch chiếu</h3>
                <Form.Item label="Tên phim">
                    <Input value={param.movieName} readOnly />
                </Form.Item>
                <Form.Item label="Mã phim">
                    <Input value={param.id} readOnly />
                </Form.Item>

                <Form.Item label="Chọn cụm rạp">
                    <Select
                        options={convertSelectCr()}
                        onChange={handleChangeCumRap}
                        placeholder="Vui lòng chọn cụm rạp"
                    />
                </Form.Item>

                <Form.Item label="Chọn phòng">
                    <Select
                        options={convertSelectRoom()}
                        onChange={(value) => formik.setFieldValue('roomId', value)}
                        placeholder="Vui lòng chọn phòng"
                    />
                </Form.Item>

                <Form.Item label="Ngày chiếu">
                    <DatePicker
                        format="YYYY-MM-DD"
                        onChange={(value) => formik.setFieldValue('scheduleDate', value)}
                        placeholder="Chọn ngày chiếu"
                    />
                </Form.Item>

                <Form.Item label="Giờ chiếu bắt đầu">
                    <TimePicker
                        format="HH:mm:ss"
                        onChange={handleScheduleStartChange}
                        placeholder="Chọn giờ bắt đầu"
                    />
                </Form.Item>

                <Form.Item label="Giờ chiếu kết thúc">
                    <TimePicker
                        format="HH:mm:ss"
                        value={formik.values.scheduleEnd ? dayjs(formik.values.scheduleEnd, 'HH:mm:ss') : null}
                        onChange={(value) => formik.setFieldValue('scheduleEnd', value)}
                        placeholder="Giờ kết thúc sẽ tự động tính toán"
                        disabled // Tắt chỉnh sửa giờ kết thúc
                    />
                </Form.Item>

                <Form.Item label="Tác vụ">
                    <Button htmlType="submit" loading={loading}>
                        Tạo lịch chiếu
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
