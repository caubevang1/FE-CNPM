import { createSlice } from '@reduxjs/toolkit'
import {
    CapNhatThongTinNguoiDung, LayDanhSachLoaiNguoiDung, LayDanhSachNguoiDung,
    LayThongTinPhimNguoiDungEdit, LayThongTinTaiKhoan, XoaNguoiDung, ThemNguoiDungService
} from '../../services/UserService';
import { removeLocalStorage, SwalConfig } from '../../utils/config';
import { LOCALSTORAGE_USER } from '../../utils/constant';
import { history } from '../../utils/history';
import { first } from 'lodash';
import { current } from '@reduxjs/toolkit';

const thongTinTaiKhoan = {
    // accessToken: '',
    // email: '',
    // hoTen: '',
    // roles: '',
    // maNhom: '',
    // phoneNumber: '',
    // username: ''
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
    roles: 'ADMIN',
    roles: 'admin',
    hoTen: '',
}

const initialState = {
    isLogin: false,
    thongTinNguoiDung: thongTinTaiKhoan,
    arrayUser: [],
    thongTinNguoiDungEdit: {},
    danhSachLoaiNguoiDung: []
}

const UserReducer = createSlice({
    name: "UserReducer",
    initialState,
    reducers: {
        setStatusLogin: (state, { type, payload }) => {
            state.isLogin = payload
        },
        setUserInfor: (state, { type, payload }) => {
            state.thongTinNguoiDung = payload
        },
        getUserList: (state, { type, payload }) => {
            state.arrayUser = payload
            if (payload.length > 0) {
                const { firstName, lastName } = payload[0];
                state.hoTen = `${firstName} ${lastName}`;
            }
        },
        layThongTinNguoiDungEdit: (state, { type, payload }) => {
            state.thongTinNguoiDungEdit = payload
        },
        layDanhSachLoaiNguoiDungAction: (state, { type, payload }) => {
            state.danhSachLoaiNguoiDung = payload
        }
    }
});

export const { setStatusLogin, setUserInfor, getUserList, layThongTinNguoiDungEdit, layDanhSachLoaiNguoiDungAction } = UserReducer.actions

export default UserReducer.reducer

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
        history.push('/admin/user')
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

export const ThemNguoiDung = (user) => async (dispatch) => {
    try {
        console.log("Gọi ThemNguoiDung với:", user);
        const res = await ThemNguoiDungService(user);
        console.log("Kết quả ThemNguoiDungService:", res);
        SwalConfig('Thêm thành công', 'success', true)
        dispatch(callApiUser)
        history.push('/admin/user')
    } catch (error) {
        SwalConfig(`${error.response.data.content}`, 'error', true, 3000)
    }
}