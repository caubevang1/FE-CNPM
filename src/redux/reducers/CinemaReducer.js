import { createSlice } from '@reduxjs/toolkit'
import { SwalConfig } from '../../utils/config';
import { history } from '../../utils/history'
import { themCumRap, xoaCumRap, capNhatCumRap, layThongTinCumRap, layThongTinCumRapChiTiet } from '../../services/CinemaService';

const initialState = {
    heThongRapChieu: [],
    arrCinema: [],
    thongTinCumRap: {},
}

const CinemaReducer = createSlice({
    name: 'CinemaReducer',
    initialState,
    reducers: {
        LayHeThongRapChieu: (state, { type, payload }) => {
            state.heThongRapChieu = payload
        },
        getCinemaList: (state, { type, payload }) => {
            state.arrCinema = payload
        },
        layThongTinCumRapDung: (state, { type, payload }) => {
            state.thongTinCumRap = payload
        }
    }
});

export const { LayHeThongRapChieu, getCinemaList, layThongTinCumRapDung } = CinemaReducer.actions

export default CinemaReducer.reducer

export const themCumRapApi = async (formData) => {
    try {
        await themCumRap(formData)
        SwalConfig('Thêm cụm rạp thành công', 'success', true)
        history.push('/admin/cinema')
    } catch (error) {
        SwalConfig(`${error.response.data.content}`, 'error', true, 3000)
    }
}

export const callApiCinema = async (dispatch) => {
    try {
        const apiCinema = await layThongTinCumRap();
        dispatch(getCinemaList(apiCinema.data))
    } catch (error) {
        console.log(error)
    }
}

export const callApiXoaCinema = (CinemaId) => async (dispatch) => {
    try {
        const result = await xoaCumRap(CinemaId)
        dispatch(callApiCinema)
        SwalConfig(result.data.content, 'success', false)
        history.push('/admin/cinema')
    } catch (error) {
        SwalConfig(`${error.response.data.content}`, 'error', true, 3000)
    }
}

export const capNhatCumRapApi = async (formData, id) => {
    try {
        await capNhatCumRap(formData, id)
        SwalConfig('Cập nhật thành công', 'success', true)
        history.push('/admin/cinema')
    } catch (error) {
        SwalConfig(`${error.response.data.content}`, 'error', true, 3000)
    }
}

export const callApiThongTinCumRap = (cinemaId) => async (dispatch) => {
    try {
        const result = await layThongTinCumRapChiTiet(cinemaId)
        dispatch(layThongTinCumRapDung(result.data))
    } catch (error) {
        console.log(error)
    }
}