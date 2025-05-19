import { Form, Input, InputNumber } from 'antd';
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { callApiThongTinPhim, upDateFilm } from '../../../redux/reducers/FilmReducer';
import { useDispatch, useSelector } from 'react-redux';
import useRoute from '../../../hooks/useRoute';

export default () => {

    const { thongTinPhim } = useSelector(state => state.FilmReducer);
    const [imgSrc, setImgSrc] = useState('');
    const dispatch = useDispatch();
    const { param } = useRoute();

    useEffect(() => {
        dispatch(callApiThongTinPhim(param.movieId));
    }, [dispatch, param.movieId]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            movieId: thongTinPhim.movieId,
            movieName: thongTinPhim.movieName,
            movieDescription: thongTinPhim.movieDescription,
            movieReview: thongTinPhim.movieReview,
            moviePoster: thongTinPhim.moviePoster || '', // Lưu URL ảnh
            movieGenre: thongTinPhim.movieGenre || '',
            movieLength: thongTinPhim.movieLength || '',
        },
        onSubmit: (value) => {
            // Gửi trực tiếp dữ liệu JSON thay vì FormData
            const updatedMovie = {
                movieId: value.movieId,
                movieName: value.movieName,
                movieDescription: value.movieDescription,
                movieReview: value.movieReview,
                moviePoster: value.moviePoster,  // URL của ảnh
                movieGenre: value.movieGenre,
                movieLength: value.movieLength,
            };

            // Cập nhật phim
            dispatch(upDateFilm(updatedMovie, value.movieId));
        }
    });

    // Hệ thống tự động lấy ảnh từ URL khi người dùng nhập
    const handleChangeImageURL = (e) => {
        const url = e.target.value;
        setImgSrc(url);  // Lưu URL ảnh vào state
        formik.setFieldValue('moviePoster', url); // Lưu URL vào formik
    };

    return (
        <div className='addFilmAdmin'>
            <h2 className='text-xl uppercase font-bold mb-4'>Edit Phim</h2>
            <Form
                onSubmitCapture={formik.handleSubmit}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 10 }}
            >
                <Form.Item label="Tên phim">
                    <Input name='movieName' onChange={formik.handleChange} value={formik.values.movieName} />
                </Form.Item>

                <Form.Item label="Mô tả">
                    <Input name='movieDescription' onChange={formik.handleChange} value={formik.values.movieDescription} />
                </Form.Item>

                <Form.Item label="Thể loại">
                    <Input name='movieGenre' onChange={formik.handleChange} value={formik.values.movieGenre} />
                </Form.Item>

                <Form.Item label="Độ dài phim (phút)">
                    <InputNumber
                        name="movieLength"
                        onChange={value => formik.setFieldValue('movieLength', value)}
                        value={formik.values.movieLength}
                    />
                </Form.Item>

                <Form.Item label="Số sao">
                    <InputNumber
                        onChange={value => formik.setFieldValue('movieReview', value)}
                        min={1}
                        max={5}
                        value={formik.values.movieReview}
                    />
                </Form.Item>

                {/* Nhập URL ảnh */}
                <Form.Item label="URL Hình ảnh">
                    <Input
                        name="moviePoster"
                        value={formik.values.moviePoster}
                        onChange={handleChangeImageURL}
                        placeholder="Nhập URL ảnh"
                    />
                    {/* Hiển thị ảnh từ URL */}
                    {imgSrc && (
                        <img
                            src={imgSrc}
                            alt="Movie Poster"
                            style={{ width: 150, height: 150, marginTop: 10 }}
                        />
                    )}
                </Form.Item>

                <Form.Item label="Tác vụ">
                    <button
                        type='submit'
                        className='border-2 border-orange-300 px-4 py-2 rounded-md hover:border-orange-500'
                    >
                        Cập nhật phim
                    </button>
                </Form.Item>
            </Form>
        </div>
    );
};
