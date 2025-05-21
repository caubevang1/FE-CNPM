import React, { useState, useEffect, useCallback } from 'react';
import { Table, Input, Button, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import Swal from 'sweetalert2';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChair } from '@fortawesome/free-solid-svg-icons';
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
            title: 'Số hàng',
            dataIndex: 'numRow',
            sorter: (a, b) => a.numRow - b.numRow,
            width: 100,
        },
        {
            title: 'Số cột',
            dataIndex: 'numCol',
            render: (text, room) => room.numCol,
            sorter: (a, b) => a.numCol - b.numCol,
            width: 100,
        },
        {
            title: 'Hành động',
            dataIndex: 'hanhDong',
            render: (text, room) => (
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <Tooltip title="Chỉnh sửa phòng">
                        <NavLink
                            className="text-blue-600 text-2xl"
                            to={`/admin/room/edit/${room.roomId}`}
                            style={{ display: 'flex', alignItems: 'center', width: 32, height: 32, justifyContent: 'center' }}
                        >
                            <EditOutlined />
                        </NavLink>
                    </Tooltip>

                    <Tooltip title="Quản lý ghế">
                        <NavLink
                            className="text-green-600 text-2xl"
                            to={`/admin/room/${room.roomId}/seats`}
                            style={{ display: 'flex', alignItems: 'center', width: 32, height: 32, justifyContent: 'center' }}
                        >
                            <FontAwesomeIcon icon={faChair} />
                        </NavLink>
                    </Tooltip>

                    <Tooltip title="Xóa phòng">
                        <Button
                            type="text"
                            danger
                            className="text-2xl"
                            style={{ padding: 0, border: 'none', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
