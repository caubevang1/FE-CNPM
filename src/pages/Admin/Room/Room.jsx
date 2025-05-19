import React, { useState, useEffect, useCallback } from 'react';
import { Table, Input, Button, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import Swal from 'sweetalert2';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Giả sử bạn đã viết sẵn RoomReducer và action creators
import {
    callApiRoom,
    xoaPhongApi
} from '../../../redux/reducers/RoomReducer';

const { Search } = Input;

export default function Room() {
    const dispatch = useDispatch();
    const { arrRoom } = useSelector(state => state.RoomReducer);
    const [data, setData] = useState([]);

    useEffect(() => {
        dispatch(callApiRoom);
    }, [dispatch]);

    useEffect(() => {
        setData(arrRoom);
    }, [arrRoom]);

    // Tìm kiếm theo tên phòng hoặc tên rạp
    const searchKeyword = useCallback(
        debounce((value) => {
            setData(arrRoom.filter(item => {
                const keyword = value.toLowerCase().trim();
                return (
                    item.roomName.toLowerCase().includes(keyword) ||
                    item.cinemaName.toLowerCase().includes(keyword)
                );
            }));
        }, 300),
        [arrRoom]
    );

    const columns = [
        {
            title: 'Mã phòng',
            dataIndex: 'roomId',
            sorter: (a, b) => a.roomId - b.roomId,
            width: 100,
        },
        {
            title: 'Tên phòng',
            dataIndex: 'roomName',
            sorter: (a, b) => a.roomName.localeCompare(b.roomName),
        },
        {
            title: 'Tên rạp',
            dataIndex: 'cinemaName',
            sorter: (a, b) => a.cinemaName.localeCompare(b.cinemaName),
        },
        {
            title: 'Số ghế',
            dataIndex: 'soGhe',
            render: (_, room) => room.numRow * room.numCol,
            sorter: (a, b) => (a.numRow * a.numCol) - (b.numRow * b.numCol),
            width: 120,
        },
        {
            title: 'Hành động',
            dataIndex: 'hanhDong',
            render: (text, room) => (
                <div style={{ display: 'flex', gap: 12 }}>
                    <Tooltip title="Chỉnh sửa phòng">
                        <NavLink className="text-blue-600 text-2xl" to={`/admin/room/edit/${room.roomId}`}>
                            <EditOutlined />
                        </NavLink>
                    </Tooltip>

                    <Tooltip title="Quản lý ghế">
                        <NavLink className="text-green-600 text-2xl" to={`/admin/room/${room.roomId}/seats`}>
                            🎟️
                        </NavLink>
                    </Tooltip>

                    <Tooltip title="Xóa phòng">
                        <Button
                            type="text"
                            danger
                            className="text-2xl"
                            onClick={() => {
                                Swal.fire({
                                    title: 'Bạn có chắc muốn xóa phòng này?',
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#d33',
                                    cancelButtonColor: '#3085d6',
                                    confirmButtonText: 'Xóa',
                                    cancelButtonText: 'Hủy'
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        dispatch(xoaPhongApi(room.roomId));
                                    }
                                });
                            }}
                        >
                            <DeleteOutlined />
                        </Button>
                    </Tooltip>
                </div>
            ),
            width: 180,
        },
    ];


    return (
        <div className="adminRoom">
            <h2 className="text-2xl uppercase font-bold mb-4">Quản lý Phòng</h2>
            <Search
                className="mb-4"
                placeholder="Tìm kiếm theo tên phòng hoặc rạp"
                enterButton="Tìm kiếm"
                size="large"
                onChange={(e) => searchKeyword(e.target.value)}
            />
            <Table columns={columns} dataSource={data} rowKey="roomId" />
        </div>
    );
}
