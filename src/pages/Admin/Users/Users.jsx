import React, { useState, useEffect, useCallback } from 'react';
import { Table, Input, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { debounce } from 'lodash';
import { callApiDeleteUser, callApiUser } from '../../../redux/reducers/UserReducer';

const { Search } = Input;

export default function Users() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { arrayUser } = useSelector(state => state.UserReducer);
    const [data, setData] = useState([]);

    useEffect(() => {
        dispatch(callApiUser);
    }, [dispatch]);

    useEffect(() => {
        setData(arrayUser);
    }, [arrayUser]);

    // Debounced search
    const searchKeyword = useCallback(
        debounce((value) => {
            const keyword = value.trim().toLowerCase();
            if (keyword === '') {
                setData(arrayUser);
            } else {
                setData(arrayUser.filter(user =>
                    user.username?.toLowerCase().includes(keyword)
                ));
            }
        }, 300),
        [arrayUser]
    );

    const columns = [
        {
            title: 'Tài khoản',
            dataIndex: 'username',
            sorter: (a, b) => a.username.toLowerCase().localeCompare(b.username.toLowerCase()),
            render: (text, user) =>
                user.username.length > 80 ? user.username.slice(0, 80) + '...' : user.username,
            sortDirections: ['descend'],
        },
        {
            title: 'Tên người dùng',
            sorter: (a, b) => {
                const nameA = `${a.firstName ?? ''} ${a.lastName ?? ''}`.toLowerCase().trim();
                const nameB = `${b.firstName ?? ''} ${b.lastName ?? ''}`.toLowerCase().trim();
                return nameA.localeCompare(nameB);
            },
            render: (_, user) => {
                const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
                return fullName.length > 50 ? fullName.slice(0, 50) + '...' : fullName;
            },
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Email',
            dataIndex: 'email',
            render: (text, user) =>
                user.email.length > 80 ? user.email.slice(0, 80) + '...' : user.email,
        },
        {
            title: 'Loại người dùng',
            dataIndex: 'roles',
            render: (text, user) => {
                const roleNames = user.roles?.map(role => role.name?.toLowerCase());
                return roleNames?.includes('admin') ? 'ADMIN' : 'USER';
            },
            sorter: (a, b) => {
                const getPriority = (user) => {
                    const roleNames = user.roles?.map(role => role.name?.toLowerCase());
                    return roleNames?.includes('admin') ? 0 : 1;
                };
                return getPriority(a) - getPriority(b);
            },
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Hành động',
            dataIndex: 'hanhDong',
            render: (text, user) => (
                <>
                    <Tooltip placement="leftBottom" title={'Chỉnh sửa'}>
                        <NavLink
                            key={1}
                            className="bg-dark text-blue-600 mr-3 text-2xl"
                            to={`/admin/user/edit/${user.id}`}
                        >
                            <EditOutlined />
                        </NavLink>
                    </Tooltip>
                    <Tooltip placement="top" title={'Xóa'}>
                        <button
                            onClick={() => {
                                Swal.fire({
                                    title: 'Bạn có muốn xóa người này không?',
                                    showDenyButton: true,
                                    confirmButtonText: 'Đồng ý',
                                    denyButtonText: 'Hủy',
                                    icon: 'question',
                                    iconColor: 'rgb(104 217 254)',
                                    confirmButtonColor: '#f97316',
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        dispatch(callApiDeleteUser(user.id));
                                    }
                                });
                            }}
                            key={2}
                            className="bg-dark text-red-600 text-2xl hover:text-red-400"
                        >
                            <DeleteOutlined />
                        </button>
                    </Tooltip>
                </>
            ),
            width: 150,
        },
    ];

    return (
        <div className="adminFilm">
            <h2 className="text-2xl uppercase font-bold mb-4">Quản lý người dùng</h2>
            <Search
                className="mb-4"
                placeholder="Tìm kiếm theo tài khoản"
                size="large"
                onChange={(e) => searchKeyword(e.target.value)}
                onSearch={searchKeyword}
            />
            <Table columns={columns} dataSource={data} rowKey="username" />
        </div>
    );
}
