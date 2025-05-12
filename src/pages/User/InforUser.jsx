import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { callApiThongTinNguoiDung, capNhatNguoiDung } from '../../redux/reducers/UserReducer';
import NotFound from '../NotFound';
import { Tabs } from 'antd';
import moment from 'moment';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';

// Thêm vào trong ThongTinNguoiDung
const ThongTinNguoiDung = ({ thongTinNguoiDung }) => {
    const [isEditing, setIsEditing] = useState({
        username: false,
        email: false,
        phoneNumber: false,
        gender: false,
        dateOfBirth: false,
        avatar: false,
        name: false,
    });

    const [editData, setEditData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phoneNumber: '',
        gender: 2,
        dateOfBirth: '',
    });

    const [avatarUrl, setAvatarUrl] = useState('');
    const dispatch = useDispatch();

    const refs = {
        username: useRef(null),
        email: useRef(null),
        phoneNumber: useRef(null),
        gender: useRef(null),
        dateOfBirth: useRef(null),
        avatar: useRef(null),
        save: useRef(null),
        firstName: useRef(null),  // ref riêng cho firstName
        lastName: useRef(null),   // ref riêng cho lastName
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAvatarChange = (e) => {
        setAvatarUrl(e.target.value);
    };

    const handleSave = () => {
        const updatedData = {
            ...editData,
            avatar: avatarUrl || thongTinNguoiDung?.avatar,
            id: thongTinNguoiDung?.id,
        };
        dispatch(capNhatNguoiDung(updatedData));
        setIsEditing({
            firstName: false,
            lastName: false,
            username: false,
            email: false,
            phoneNumber: false,
            gender: false,
            dateOfBirth: false,
            avatar: false,
            name: false,
        });
    };

    const handleEdit = (field) => {
        setIsEditing(prev => ({
            ...prev,
            [field]: true,
        }));
    };

    const GENDER = editData.gender === 0 ? 'Nữ' : editData.gender === 1 ? 'Nam' : 'Chưa xác định';

    useEffect(() => {
        dispatch(callApiThongTinNguoiDung);
    }, [dispatch]);

    useEffect(() => {
        if (thongTinNguoiDung) {
            setEditData({
                firstName: thongTinNguoiDung.firstName || '',
                lastName: thongTinNguoiDung.lastName || '',
                username: thongTinNguoiDung.username || '',
                email: thongTinNguoiDung.email || '',
                phoneNumber: thongTinNguoiDung.phoneNumber || '',
                gender: thongTinNguoiDung.gender ?? 2,
                dateOfBirth: thongTinNguoiDung.dateOfBirth || '',
            });
            setAvatarUrl(thongTinNguoiDung.avatar || '');
        }
    }, [thongTinNguoiDung]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            for (const field in isEditing) {
                if (isEditing[field]) {
                    // Nếu là "name", cần kiểm tra cả firstName và lastName
                    if (field === "name") {
                        const clickedInsideFirst = refs.firstName?.current?.contains(e.target);
                        const clickedInsideLast = refs.lastName?.current?.contains(e.target);
                        const clickedSave = refs.save?.current?.contains(e.target);
                        if (!clickedInsideFirst && !clickedInsideLast && !clickedSave) {
                            setIsEditing(prev => ({ ...prev, name: false }));
                        }
                    } else {
                        // Các trường khác xử lý như cũ
                        if (
                            refs[field]?.current &&
                            !refs[field].current.contains(e.target) &&
                            !(refs.save?.current?.contains(e.target))
                        ) {
                            setIsEditing(prev => ({ ...prev, [field]: false }));
                        }
                    }
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isEditing, refs]);

    return (
        <div className="profile-page theme-purple min-h-screen py-[6rem]">
            <div className="bg">
                <div></div><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
            </div>
            <div className="content relative max-w-5xl mx-auto px-6 py-6 bg-white rounded-2xl shadow-lg">
                <div className="absolute top-4 right-4 flex items-center gap-3 text-white text-sm">
                    <span style={{ padding: '6px 12px', fontSize: '25px', marginRight: '10px', marginTop: '12px' }}>
                        <span style={{ color: '#000' }}>Hello, </span>
                        <span style={{ color: '#3258F4' }}>{editData.username}</span>
                        <span style={{ color: '#000' }}> !</span>
                    </span>
                    <div className="bg-orange-500 px-3 py-[9px] rounded-full shadow mt-4 mr-2 font-bold text-[14px]">
                        🌟 {thongTinNguoiDung?.point || 0} ĐIỂM
                    </div>
                </div>

                <div className="content__cover">
                    <div className="content__bull">
                        <span></span><span></span><span></span><span></span><span></span>
                    </div>
                    <div
                        className="content__avatar"
                        onClick={() => handleEdit('avatar')}
                        style={{
                            backgroundImage: `url(${avatarUrl || "default-avatar-url"})`,
                            cursor: 'pointer',
                        }}
                        ref={refs.avatar}
                    >
                        {isEditing.avatar && (
                            <div className="absolute bottom-0 left-0 w-full bg-white p-2 flex items-center gap-2">
                                <input
                                    type="text"
                                    value={avatarUrl}
                                    onChange={handleAvatarChange}
                                    placeholder="Nhập URL avatar"
                                    className="flex-1 border border-gray-300 p-1"
                                    ref={refs.avatar}
                                />
                                <button ref={refs.save} onClick={handleSave} className="text-green-500">
                                    <SaveOutlined />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="content__title">
                    <h1>
                        {isEditing.name ? (
                            <div className="flex gap-2 justify-center items-center">
                                <input
                                    type="text"
                                    name="firstName"
                                    value={editData.firstName}
                                    onChange={handleInputChange}
                                    className="border-b border-gray-400"
                                    ref={refs.firstName}
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    value={editData.lastName}
                                    onChange={handleInputChange}
                                    className="border-b border-gray-400"
                                    ref={refs.lastName}
                                />
                                <button
                                    onClick={handleSave}
                                    className="ml-2 text-green-500"
                                    ref={refs.save}
                                >
                                    <SaveOutlined />
                                </button>
                            </div>
                        ) : (
                            `${editData.firstName} ${editData.lastName}`
                        )}
                        {!isEditing.name && (
                            <button onClick={() => handleEdit('name')} className="ml-3 text-blue-500">
                                <EditOutlined />
                            </button>
                        )}
                    </h1>
                </div>

                {/* Tách layout thành 2 cột */}
                <div className="flex justify-between gap-8 content__list mt-4">
                    {/* Cột trái */}
                    <ul className="flex-1 space-y-12 ">
                        <li>
                            <div className="flex items-center gap-2 border-b border-gray-200 pb-10">
                                <strong className="text-[20px]">Email:</strong>
                                <span className="flex-1">
                                    {isEditing.email ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={editData.email}
                                            onChange={handleInputChange}
                                            ref={refs.email}
                                            className="border-b border-gray-400 w-full text-gray-600"
                                        />
                                    ) : (
                                        <span className="text-gray-600">{editData.email}</span>
                                    )}
                                </span>
                                {!isEditing.email && (
                                    <button onClick={() => handleEdit('email')} className="text-blue-500">
                                        <EditOutlined />
                                    </button>
                                )}
                                {isEditing.email && (
                                    <button ref={refs.save} onClick={handleSave} className="text-green-500">
                                        <SaveOutlined />
                                    </button>
                                )}
                            </div>
                        </li>

                        <li>
                            <div className="flex items-center gap-2">
                                <strong className="text-[20px]">Giới tính:</strong>
                                <span className="flex-1">
                                    {isEditing.gender ? (
                                        <select
                                            name="gender"
                                            value={editData.gender}
                                            onChange={handleInputChange}
                                            ref={refs.gender}
                                            className="border-b border-gray-400 w-full text-gray-600"
                                        >
                                            <option value={0}>Nữ</option>
                                            <option value={1}>Nam</option>
                                        </select>
                                    ) : (
                                        <span className="text-gray-600">{GENDER}</span>
                                    )}
                                </span>
                                {!isEditing.gender && (
                                    <button onClick={() => handleEdit('gender')} className="text-blue-500">
                                        <EditOutlined />
                                    </button>
                                )}
                                {isEditing.gender && (
                                    <button ref={refs.save} onClick={handleSave} className="text-green-500">
                                        <SaveOutlined />
                                    </button>
                                )}
                            </div>
                        </li>
                    </ul>

                    {/* Cột phải */}
                    <ul className="flex-1 space-y-12">
                        <li>
                            <div className="flex items-center gap-2 border-b border-gray-200 pb-10">
                                <strong className="text-[20px]">Điện thoại:</strong>
                                <span className="flex-1">
                                    {isEditing.phoneNumber ? (
                                        <input
                                            type="text"
                                            name="phoneNumber"
                                            value={editData.phoneNumber}
                                            onChange={handleInputChange}
                                            ref={refs.phoneNumber}
                                            className="border-b border-gray-400 w-full text-gray-600"
                                        />
                                    ) : (
                                        <span className="text-gray-600">{editData.phoneNumber}</span>
                                    )}
                                </span>
                                {!isEditing.phoneNumber && (
                                    <button onClick={() => handleEdit('phoneNumber')} className="text-blue-500">
                                        <EditOutlined />
                                    </button>
                                )}
                                {isEditing.phoneNumber && (
                                    <button ref={refs.save} onClick={handleSave} className="text-green-500">
                                        <SaveOutlined />
                                    </button>
                                )}
                            </div>
                        </li>

                        <li>
                            <div className="flex items-center gap-2">
                                <strong className="text-[20px]">Ngày sinh:</strong>
                                <span className="flex-1">
                                    {isEditing.dateOfBirth ? (
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            value={editData.dateOfBirth ? moment(editData.dateOfBirth).format('YYYY-MM-DD') : ''}
                                            onChange={handleInputChange}
                                            ref={refs.dateOfBirth}
                                            className="border-b border-gray-400 w-full text-gray-600"
                                        />
                                    ) : (
                                        <span className="text-gray-600">
                                            {editData.dateOfBirth ? moment(editData.dateOfBirth).format('DD/MM/YYYY') : ''}
                                        </span>
                                    )}
                                </span>
                                {!isEditing.dateOfBirth && (
                                    <button onClick={() => handleEdit('dateOfBirth')} className="text-blue-500">
                                        <EditOutlined />
                                    </button>
                                )}
                                {isEditing.dateOfBirth && (
                                    <button ref={refs.save} onClick={handleSave} className="text-green-500">
                                        <SaveOutlined />
                                    </button>
                                )}
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="content__actions mt-[5px]">
                    <span
                        style={{
                            fontSize: '14px',
                            display: 'inline-block',
                            padding: '8px 16px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            borderRadius: '25px',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            transition: 'background-color 0.3s ease, transform 0.2s ease',
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
                    >
                        {thongTinNguoiDung?.roles?.[0]?.name}
                    </span>
                </div>
            </div>
        </div>
    );
};

const InforUser = () => {
    const { thongTinNguoiDung, isLogin } = useSelector(state => state.UserReducer);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(callApiThongTinNguoiDung);
    }, []);

    const items = [
        {
            label: <span className="text-[15px] sm:text-[20px] font-bold">Thông tin tài khoản</span>,
            key: 1,
            children: <ThongTinNguoiDung thongTinNguoiDung={thongTinNguoiDung} />,
        },
    ];

    return isLogin ? (
        <Tabs className="pt-[6rem] min-h-[100vh] booking" items={items} />
    ) : (
        <NotFound />
    );
};

export default InforUser;
