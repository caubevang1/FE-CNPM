import { createSlice } from '@reduxjs/toolkit'
import {
    CapNhatThongTinNguoiDung, LayDanhSachLoaiNguoiDung, LayDanhSachNguoiDung,
    LayThongTinPhimNguoiDungEdit, LayThongTinTaiKhoan, XoaNguoiDung, LayThongTinBooking
} from '../../services/UserService';
import { removeLocalStorage, SwalConfig } from '../../utils/config';
import { LOCALSTORAGE_USER } from '../../utils/constant';
import { history } from '../../utils/history';

const thongTinTaiKhoan = {
    ID: '',
    username: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phoneNumber: '',
    gender: 0,
    avatar: '',
    point: 0,
    roles: [],
    hoTen: '',
}

const initialState = {
    isLogin: false,
    thongTinNguoiDung: thongTinTaiKhoan,
    arrayUser: [],
    thongTinNguoiDungEdit: {},
    danhSachLoaiNguoiDung: [],
    bookings: [], // Thêm state mới để lưu thông tin booking của người dùng
};

const UserReducer = createSlice({
    name: "UserReducer",
    initialState,
    reducers: {
        setStatusLogin: (state, { type, payload }) => {
            state.isLogin = payload;
        },
        setUserInfor: (state, { type, payload }) => {
            state.thongTinNguoiDung = payload;
        },
        getUserList: (state, { type, payload }) => {
            state.arrayUser = payload;
            if (payload.length > 0) {
                const { firstName, lastName } = payload[0];
                state.hoTen = `${firstName} ${lastName}`;
            }
        },
        layThongTinNguoiDungEdit: (state, { type, payload }) => {
            state.thongTinNguoiDungEdit = payload;
        },
        layDanhSachLoaiNguoiDungAction: (state, { type, payload }) => {
            state.danhSachLoaiNguoiDung = payload;
        },
        setBookings: (state, { type, payload }) => {
            state.bookings = payload; // Lưu thông tin booking vào state
        },
    },
});

export const {
    setStatusLogin,
    setUserInfor,
    getUserList,
    layThongTinNguoiDungEdit,
    layDanhSachLoaiNguoiDungAction,
    setBookings // Export action mới
} = UserReducer.actions;

export default UserReducer.reducer;

export const callApiThongTinNguoiDung = async (dispatch) => {
    try {
        const apiNguoiDung = await LayThongTinTaiKhoan()
        dispatch(setStatusLogin(true))
        dispatch(setUserInfor(apiNguoiDung.data.body))
    } catch (error) {
        removeLocalStorage(LOCALSTORAGE_USER)
    }
}


export const callApiUser = async (dispatch) => {
    try {
        const apiUser = await LayDanhSachNguoiDung()
        dispatch(getUserList(apiUser.data.body))
    } catch (error) {
        console.log(error)
    }
}

export const callApiDeleteUser = (id) => async (dispatch) => {
    try {
        const result = await XoaNguoiDung(id)
        dispatch(callApiUser)
        SwalConfig("Xóa thành công", 'success', false)
        history.push('/admin/user')
    } catch (error) {
        SwalConfig(error.response.data.content, 'error', false)
        history.push('/admin/user')
    }
}

export const callApiThongTinNguoiDungEdit = (user) => async (dispatch) => {
    try {
        const result = await LayThongTinPhimNguoiDungEdit(user)
        dispatch(layThongTinNguoiDungEdit(result.data.body))
    } catch (error) {
        console.log(error)
    }
}

export const capNhatNguoiDung = (user) => async (dispatch) => {
    try {
        await CapNhatThongTinNguoiDung(user)
        SwalConfig('Cập nhật thành công', 'success', true)
        dispatch(callApiUser)
        if (window.location.pathname.includes('/admin')) {
            history.push('/admin/user');
        }
    } catch (error) {
        console.log(error)
        SwalConfig(`${error?.response?.data?.content || 'Lỗi hệ thống'}`, 'error', true, 3000)
    }
}

export const layDanhSachLoaiNguoiDung = async (dispatch) => {
    try {
        const result = await LayDanhSachLoaiNguoiDung()
        dispatch(layDanhSachLoaiNguoiDungAction(result.data.body))
    } catch (error) {
        console.log(error)
    }
}

export const callApiThongTinBooking = async (dispatch) => {
    try {
        const token = localStorage.getItem('accessToken') || '';
        const response = await LayThongTinBooking({
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (Array.isArray(response.data.body)) {
            dispatch(setBookings(response.data.body));
        } else {
            console.error('Dữ liệu không phải là mảng:', response.data);
            dispatch(setBookings([]));
        }
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        dispatch(setBookings([]));
    }
};


