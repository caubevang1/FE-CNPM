import React, { useState, useEffect, useCallback } from 'react';
import { Table, Input, Button, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { debounce } from 'lodash';
import {
    fetchSchedules,
    deleteSchedule,
} from '../../../redux/reducers/ScheduleReducer';

const { Search } = Input;

export default function Schedule() {
    const dispatch = useDispatch();
    const { schedules } = useSelector((state) => state.ScheduleReducer);
    const [data, setData] = useState([]);

    useEffect(() => {
        dispatch(fetchSchedules());
    }, [dispatch]);

    useEffect(() => {
        setData(schedules);
    }, [schedules]);

    const searchKeyword = useCallback(
        debounce((value) => {
            setData(
                schedules.filter((item) => {
                    if (value.trim() === '') return item;
                    const keyLower = value.toLowerCase();
                    const nameLower = item.movieName.toLowerCase();
                    return nameLower.includes(keyLower);
                })
            );
        }, 200),
        [schedules]
    );

    const columns = [
        {
            title: 'Mã lịch',
            dataIndex: 'scheduleId',
            sorter: (a, b) => a.scheduleId - b.scheduleId,
            sortDirections: ['descend'],
            width: 100,
        },
        {
            title: 'Tên phim',
            dataIndex: 'movieName',
            sorter: (a, b) => a.movieName.toLowerCase().localeCompare(b.movieName.toLowerCase()),
            sortDirections: ['descend'],
        },
        {
            title: 'Rạp chiếu',
            dataIndex: 'cinemaName',
        },
        {
            title: 'Phòng chiếu',
            dataIndex: 'roomName',
        },
        {
            title: 'Ngày chiếu',
            dataIndex: 'scheduleDate',
            render: (text) => new Date(text).toLocaleDateString('vi-VN'),
        },
        {
            title: 'Giờ bắt đầu',
            dataIndex: 'scheduleStart',
            render: (text) => {
                return text;
            },
        },
        {
            title: 'Giờ kết thúc',
            dataIndex: 'scheduleEnd',
            render: (text) => {
                return text;
            },
        },
        {
            title: 'Hành động',
            dataIndex: 'hanhDong',
            render: (_, record) => {
                return (
                    <Tooltip title="Xóa lịch chiếu">
                        <Button
                            danger
                            type="text"
                            icon={<DeleteOutlined />}
                            className="text-2xl hover:text-red-400"
                            onClick={() => {
                                Swal.fire({
                                    title: 'Bạn có chắc muốn xóa lịch chiếu này?',
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonText: 'Xóa',
                                    cancelButtonText: 'Hủy',
                                    confirmButtonColor: '#d33',
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        dispatch(deleteSchedule(record.scheduleId));
                                    }
                                });
                            }}
                        />
                    </Tooltip>
                );
            },
            width: 150,
        },
    ];

    return (
        <div className="adminSchedule">
            <h2 className="text-2xl uppercase font-bold mb-4">Quản lý Lịch Chiếu</h2>
            <Search
                className="mb-4"
                placeholder="Tìm kiếm theo tên phim"
                enterButton="Search"
                size="large"
                onChange={(e) => searchKeyword(e.target.value)}
            />
            <Table columns={columns} dataSource={data} rowKey="scheduleId" />
        </div>
    );
}
