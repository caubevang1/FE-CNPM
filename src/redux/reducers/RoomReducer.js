import { createSlice } from '@reduxjs/toolkit'
import { SwalConfig } from '../../utils/config';
import { history } from '../../utils/history'
import { layThongTinPhong, layThongTinPhongChiTiet, xoaPhong, themPhong, capNhatPhong } from '../../services/CinemaService';

const initialState = {
    arrRoom: [],
    roomDetail: {},
}

const RoomReducer = createSlice({
    name: 'RoomReducer',
    initialState,
    reducers: {
        getRoomList: (state, { type, payload }) => {
            state.arrRoom = payload
        },
        getRoomDetail: (state, { type, payload }) => {
            state.roomDetail = payload
        }
    }
});

export const { getRoomList, getRoomDetail } = RoomReducer.actions
export default RoomReducer.reducer

export const callApiRoom = async (dispatch) => {
    try {
        const apiRoom = await layThongTinPhong();
        dispatch(getRoomList(apiRoom.data))
    } catch (error) {
        console.log(error)
    }
}

export const themPhongApi = async (formData) => {
    try {
        await themPhong(formData)
        SwalConfig('Thêm phòng thành công', 'success', true)
        history.push('/admin/room')
    } catch (error) {
        SwalConfig(`${error.response.data.content}`, 'error', true, 3000)
    }
}

export const xoaPhongApi = (roomId) => async (dispatch) => {
    try {
        const result = await xoaPhong(roomId)
        dispatch(callApiRoom)
        SwalConfig(result.data.content, 'success', false)
        history.push('/admin/room')
    } catch (error) {
        SwalConfig(`${error.response.data.content}`, 'error', true, 3000)
    }
}

export const capNhatPhongApi = async (formData, roomId) => {
    try {
        await capNhatPhong(formData, roomId)
        SwalConfig('Cập nhật phòng thành công', 'success', true)
        history.push('/admin/room')
    }
    catch (error) {
        SwalConfig(`${error.response.data.content}`, 'error', true, 3000)
    }
}

export const callApiRoomDetail = (roomId) => async (dispatch) => {
    try {
        const result = await layThongTinPhongChiTiet(roomId)
        dispatch(getRoomDetail(result.data))
    } catch (error) {
        console.log(error)
    }
}

