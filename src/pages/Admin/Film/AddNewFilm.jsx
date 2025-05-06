import { DatePicker, Form, Input, InputNumber, Switch } from 'antd';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import moment from 'moment';
import { themPhimApi } from '../../../redux/reducers/FilmReducer';
import { useDispatch } from 'react-redux';
import { GROUPID } from '../../../utils/constant';
import { SwalConfig } from '../../../utils/config';

export default () => {
    const [imgSrc, setImgSrc] = useState(null);
    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
            movieName: '',
            trailer: '',
            movieDescription: '',
            scheduleDate: '',
            dangChieu: false,
            sapChieu: false,
            movieLength: 0,
            movieReview: 0,
            moviePoster: {},
        },
        onSubmit: (value) => {
            value.maNhom = GROUPID;
            const { movieName, trailer, movieDescription, scheduleDate, movieReview } = value;
            if (movieName && trailer && movieDescription && scheduleDate && movieReview) {
                const formData = new FormData();
                for (let key in value) {
                    if (key !== 'moviePoster') {
                        formData.append(key, value[key]);
                    } else {
                        formData.append('File', value.moviePoster, value.moviePoster.name);
                    }
                }
                dispatch(themPhimApi(formData));
                setImgSrc('');
            } else {
                SwalConfig('Vui lòng điền đầy đủ thông tin', 'error', true);
            }
        }
    });

    const handleChangeSwitch = (name) => {
        return (value) => {
            formik.setFieldValue(name, value);
        }
    };

    const handleChangeDatePicker = (value) => {
        const scheduleDate = moment(value).format('DD/MM/YYYY');
        formik.setFieldValue('scheduleDate', scheduleDate);
    };

    const handleChangeFile = async (e) => {
        const file = e.target.files[0];
        if (file && ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type)) {
            await formik.setFieldValue('moviePoster', file);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                setImgSrc(e.target.result);
            };
        }
    };

    return (
        <div className='addFilmAdmin'>
            <h2 className='text-xl uppercase font-bold mb-4'>Thêm Phim Mới</h2>
            <Form
                onSubmitCapture={formik.handleSubmit}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 10 }}
            >
                <Form.Item label="Tên phim">
                    <Input name='movieName' onChange={formik.handleChange} />
                </Form.Item>
                <Form.Item label="Trailer">
                    <Input name='trailer' onChange={formik.handleChange} />
                </Form.Item>
                <Form.Item label="Mô tả">
                    <Input name='movieDescription' onChange={formik.handleChange} />
                </Form.Item>
                <Form.Item label="Ngày khởi chiếu">
                    <DatePicker format={'DD/MM/YYYY'} name='scheduleDate' onChange={handleChangeDatePicker} />
                </Form.Item>
                <Form.Item label="Đang chiếu" valuePropName="checked">
                    <Switch onChange={handleChangeSwitch('dangChieu')} />
                </Form.Item>
                <Form.Item label="Sắp chiếu" valuePropName="checked">
                    <Switch onChange={handleChangeSwitch('sapChieu')} />
                </Form.Item>
                <Form.Item label="Thời lượng (phút)">
                    <InputNumber onChange={value => formik.setFieldValue('movieLength', value)} min={1} />
                </Form.Item>
                <Form.Item label="Số sao">
                    <InputNumber onChange={value => formik.setFieldValue('movieReview', value)} min={1} max={10} />
                </Form.Item>
                <Form.Item label="Hình ảnh">
                    <input type="file" onChange={handleChangeFile} accept='image/png, image/jpeg, image/jpg, image/gif' />
                    <br />
                    {imgSrc && <img src={imgSrc} alt="poster preview" style={{ width: 150, height: 150 }} />}
                </Form.Item>
                <Form.Item label="Tác vụ">
                    <button type='submit' className='border-2 border-orange-300 px-4 py-2 rounded-md hover:border-orange-500'>
                        Thêm phim
                    </button>
                </Form.Item>
            </Form>
        </div>
    );
};
