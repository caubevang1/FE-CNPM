import { createSlice } from '@reduxjs/toolkit'
// import { ThongTinLichChieu } from '../../_core/models/ThongTinPhongVe';

const ThongTinPhim = {
    movieId: '',
    tenCumRap: '',
    tenRap: '',
    diaChi: '',
    movieName: '',
    moviePoster: '',
    ngayChieu: '',
    gioChieu: ''
}

const Ghe = {
    seatState: false,
    seatPrice: '',
    seatType: '',
    seatId: '',
    maRap: '',
    seatNumber: '',
    taiKhoanNguoiDat: '',
    seatRow: ''
}

const initialState = {
    chiTietPhongVe: {
        thongTinPhim: ThongTinPhim,
        danhSachGhe: [],
    },
    danhSachGheDangDat: [],
    danhSachGheKhachDat: [{ seatId: 75561 },]
}

const BookingReducer = createSlice({
    name: 'BookingReducer',
    initialState,
    reducers: {
        layDanhSachPhongVe: (state, { type, payload }) => {
            state.chiTietPhongVe = payload
        },
        datGhe: (state, { type, payload }) => {
            let gheDangChon = state.danhSachGheDangDat.find(item => item.seatId === payload.seatId)
            if (!gheDangChon) {
                state.danhSachGheDangDat.push(payload)
            }
            else {
                state.danhSachGheDangDat = state.danhSachGheDangDat.filter(item => item.seatId !== payload.seatId)
            }
        },
        xoaDanhSachGheDangDat: (state, { type, payload }) => {
            state.danhSachGheDangDat = []
        },
    }
});

export const { layDanhSachPhongVe, datGhe, xoaDanhSachGheDangDat } = BookingReducer.actions

export default BookingReducer.reducer

