import { createSlice } from '@reduxjs/toolkit'
import {
    CapNhatThongTinNguoiDung, LayDanhSachLoaiNguoiDung, LayDanhSachNguoiDung,
    LayThongTinPhimNguoiDungEdit, LayThongTinTaiKhoan, XoaNguoiDung, ThemNguoiDungService
} from '../../services/UserService';
import { removeLocalStorage, SwalConfig } from '../../utils/config';
import { LOCALSTORAGE_USER } from '../../utils/constant';
import { history } from '../../utils/history';
import { first } from 'lodash';

const thongTinTaiKhoan = {
    // accessToken: '',
    // email: '',
    // hoTen: '',
    // maLoaiNguoiDung: '',
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
    maLoaiNguoiDung: 'QuanTri',
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
        console.log(apiNguoiDung.data.content)
        console.log(apiNguoiDung.data.body)
        dispatch(setStatusLogin(true))
        dispatch(setUserInfor(apiNguoiDung.data.body))
    } catch (error) {
        removeLocalStorage(LOCALSTORAGE_USER)
    }
}


export const callApiUser = async (dispatch) => {
    try {
        const apiUser = await LayDanhSachNguoiDung()
        dispatch(getUserList(apiUser.data.content))
    } catch (error) {
        console.log(error)
    }
}

export const callApiDeleteUser = (username) => async (dispatch) => {
    try {
        const result = await XoaNguoiDung(username)
        dispatch(callApiUser)
        SwalConfig(result.data.content, 'success', false)
        history.push('/admin/user')
    } catch (error) {
        SwalConfig(error.response.data.content, 'error', false)
        history.push('/admin/user')
    }
}

export const callApiThongTinNguoiDungEdit = (username) => async (dispatch) => {
    try {
        const result = await LayThongTinPhimNguoiDungEdit(username)
        dispatch(layThongTinNguoiDungEdit(result.data.content))
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
        SwalConfig(`${error.response.data.content}`, 'error', true, 3000)
    }
}

export const layDanhSachLoaiNguoiDung = async (dispatch) => {
    try {
        const result = await LayDanhSachLoaiNguoiDung()
        dispatch(layDanhSachLoaiNguoiDungAction(result.data.content))
    } catch (error) {
        console.log(error)
    }
}

export const ThemNguoiDung = (user) => async (dispatch) => {
    try {
        await ThemNguoiDungService(user)
        SwalConfig('Thêm thành công', 'success', true)
        dispatch(callApiUser)
        history.push('/admin/user')
    } catch (error) {
        SwalConfig(`${error.response.data.content}`, 'error', true, 3000)
    }
}