import React, { useEffect, useState, useCallback } from 'react';
import { Table, Input, Button, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { debounce } from 'lodash';
import { callApiCinema, callApiXoaCinema } from '../../../redux/reducers/CinemaReducer'; // 👈 Sửa path theo project của bạn
const { Search } = Input;

export default function Cinema() {
    const dispatch = useDispatch();
    const { arrCinema } = useSelector(state => state.CinemaReducer); // 👈 Thay đúng tên reducer của bạn
    const [data, setData] = useState([]);

    useEffect(() => {
        dispatch(callApiCinema);
    }, [dispatch]);

    useEffect(() => {
        setData(arrCinema);
    }, [arrCinema]);

    const searchKeyword = useCallback(
        debounce((value) => {
            setData(arrCinema.filter(item => {
                const key = value.toLowerCase();
                return (
                    item.cinemaName.toLowerCase().includes(key) ||
                    item.cinemaAddress.toLowerCase().includes(key)
                );
            }));
        }, 300),
        [arrCinema]
    );

    const columns = [
        {
            title: 'Tên rạp',
            dataIndex: 'cinemaName',
            sorter: (a, b) => a.cinemaName.localeCompare(b.cinemaName),
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'cinemaAddress',
            sorter: (a, b) => a.cinemaAddress.localeCompare(b.cinemaAddress),
        },
        {
            title: 'Hành động',
            dataIndex: 'actions',
            render: (text, cinema) => (
                <>
                    <Tooltip title="Chỉnh sửa rạp">
                        <NavLink to={`/admin/cinema/edit/${cinema.cinemaId}`} className='text-blue-600 mr-3 text-xl'>
                            <EditOutlined />
                        </NavLink>
                    </Tooltip>
                    <Tooltip title="Xóa rạp">
                        <button
                            onClick={() => {
                                Swal.fire({
                                    title: 'Bạn có chắc muốn xóa rạp này không?',
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonText: 'Xóa',
                                    cancelButtonText: 'Hủy',
                                    confirmButtonColor: '#f87171',
                                }).then(result => {
                                    if (result.isConfirmed) {
                                        dispatch(callApiXoaCinema(cinema.cinemaId));
                                    }
                                });
                            }}
                            className='text-red-600 text-xl hover:text-red-400'
                        >
                            <DeleteOutlined />
                        </button>
                    </Tooltip>
                </>
            ),
            width: 120,
        },
    ];

    return (
        <div className='adminCinema'>
            <h2 className='text-2xl uppercase font-bold mb-4'>Quản lý Rạp chiếu</h2>
            <Search
                className='mb-4'
                placeholder="Tìm theo tên hoặc địa chỉ"
                enterButton='Tìm kiếm'
                size="large"
                onChange={(e) => searchKeyword(e.target.value)}
            />
            <Table columns={columns} dataSource={data} rowKey='cinemaId' />
        </div>
    );
}
