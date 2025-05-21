import { Form, Input, InputNumber } from 'antd';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import { themPhimApi } from '../../../redux/reducers/FilmReducer';
import { useDispatch } from 'react-redux';
import { SwalConfig } from '../../../utils/config';

export default () => {
    const [imgSrc, setImgSrc] = useState(null);
    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
            movieName: '',
            movieDescription: '',
            movieLength: 0,
            movieReview: 0,
            moviePoster: '',
            movieGenre: '',
        },
        onSubmit: (value) => {
            const { movieName, movieDescription, movieLength, movieReview, moviePoster, movieGenre } = value;
            if (movieName && movieDescription && movieLength && movieReview && moviePoster && movieGenre) {
                const payload = {
                    ...value,
                };
                dispatch(themPhimApi(payload));

                setImgSrc('');
            } else {
                SwalConfig('Vui lòng điền đầy đủ thông tin', 'error', true);
            }
        }
    });

    const handleChangeImageURL = (e) => {
        const url = e.target.value;
        formik.setFieldValue('moviePoster', url);
        setImgSrc(url);
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
                <Form.Item label="Mô tả">
                    <Input name='movieDescription' onChange={formik.handleChange} />
                </Form.Item>
                <Form.Item label="Thời lượng (phút)">
                    <InputNumber onChange={value => formik.setFieldValue('movieLength', value)} min={1} />
                </Form.Item>
                <Form.Item label="Số sao">
                    <InputNumber onChange={value => formik.setFieldValue('movieReview', value)} min={1} max={5} />
                </Form.Item>
                <Form.Item label="Thể loại phim">
                    <Input
                        name='movieGenre'
                        onChange={formik.handleChange}
                        placeholder="Nhập thể loại phim"
                    />
                </Form.Item>
                <Form.Item label="Hình ảnh (URL)">
                    <Input
                        name="moviePoster"
                        onChange={handleChangeImageURL}
                        placeholder="Nhập URL hình ảnh"
                    />
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
