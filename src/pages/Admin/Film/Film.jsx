import React, { useState, useCallback } from 'react';
import { Table, Input, Button, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { callApiFilm, callApiXoaPhim } from '../../../redux/reducers/FilmReducer';
import { NavLink } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, CalendarOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { debounce } from 'lodash';

const { Search } = Input;

export default function Film() {
    const dispatch = useDispatch();
    const { arrFilm } = useSelector(state => state.FilmReducer);
    const [data, setData] = useState([]);

    useEffect(() => {
        dispatch(callApiFilm);
    }, [dispatch]);

    useEffect(() => {
        setData(arrFilm);
    }, [arrFilm]);

    const searchKeyword = useCallback(
        debounce((value) => {
            setData(arrFilm.filter(item => {
                if (value.trim() === '') {
                    return item;
                } else {
                    let keyLower = value.toLowerCase();
                    let itemLower = item.movieName.toLowerCase();
                    return itemLower.includes(keyLower);
                }
            }));
        }, 200),
        [arrFilm]
    );

    const columns = [
        {
            title: 'Mã phim',
            dataIndex: 'movieId',
            sorter: (a, b) => a.movieId - b.movieId,
            sortDirections: ['descend'],
            width: 150,
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'moviePoster',
            render: (text, film, index) => {
                return <img src={film.moviePoster} alt={film.moviePoster} width='50' height='50'
                    onError={(e) => { e.target.onError = null; e.target.src = `https://picsum.photos/id/${index}/50/50`; }} />;
            },
            width: 100,
        },
        {
            title: 'Tên phim',
            dataIndex: 'movieName',
            sorter: (a, b) => {
                let tenPhimA = a.movieName.toLowerCase().trim();
                let tenPhimB = b.movieName.toLowerCase().trim();
                if (tenPhimA > tenPhimB) {
                    return 1;
                }
                return -1;
            },
            render: (text, film) => {
                return film.movieName.length > 50 ? film.movieName.slice(0, 50) + '...' : film.movieName;
            },
            sortDirections: ['descend'],
        },
        {
            title: 'Mô tả',
            dataIndex: 'movieDescription',
            sorter: (a, b) => {
                let moTaA = a.movieDescription.toLowerCase().trim();
                let moTaB = b.movieDescription.toLowerCase().trim();
                if (moTaA > moTaB) {
                    return 1;
                }
                return -1;
            },
            render: (text, film) => {
                return film.movieDescription.length > 80 ? film.movieDescription.slice(0, 80) + '...' : film.movieDescription;
            },
            sortDirections: ['descend'],
        },
        {
            title: 'Hành động',
            dataIndex: 'hanhDong',
            render: (text, film) => {
                return <>
                    <Tooltip placement="leftBottom" title={'Chỉnh sửa phim'}>
                        <NavLink key={1} className='bg-dark text-blue-600 mr-3 text-2xl' to={`/admin/film/edit/${film.movieId}`}>
                            <EditOutlined />
                        </NavLink>
                    </Tooltip>
                    <Tooltip title="Xóa phim">
                        <Button
                            danger
                            type="text"
                            icon={<DeleteOutlined />}
                            className="text-2xl hover:text-red-400"
                            onClick={() => {
                                Swal.fire({
                                    title: 'Bạn có muốn xóa phim này không?',
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonText: 'Xóa',
                                    cancelButtonText: 'Hủy',
                                    confirmButtonColor: '#d33',
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        dispatch(callApiXoaPhim(film.movieId));
                                    }
                                });
                            }}
                        />
                    </Tooltip>
                    <Tooltip placement="topRight" title={'Tạo lịch chiếu'}>
                        <NavLink key={3} className='bg-dark text-orange-600 hover:text-orange-400 ml-3 text-2xl' to={`/admin/film/showtime/${film.movieId}/${film.movieName}`}>
                            <CalendarOutlined />
                        </NavLink>
                    </Tooltip>
                </>;
            },
            width: 150,
        },
    ];

    return (
        <div className='adminFilm'>
            <h2 className='text-2xl uppercase font-bold mb-4'>Quản lý Phim</h2>
            <Search
                className='mb-4'
                placeholder="Tìm kiếm theo tên"
                enterButton='Search'
                size="large"
                onChange={(e) => searchKeyword(e.target.value)}
            />
            <Table columns={columns} dataSource={data} rowKey='movieId' />
        </div>
    );
}
