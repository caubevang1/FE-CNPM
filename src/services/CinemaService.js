import { http } from "../utils/baseUrl";
import { GROUPID } from "../utils/constant";

export const LayThongTinLichChieuHeThongRap = () => http.get(`/schedule`)

export const LayThongTinLichChieu = () => http.get(`/schedule`)

// export const LayThongTinLichChieu = (movieId) => http.get(`/QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${movieId}`)

export const layThongTinHeThongRap = () => http.get(`/cinemas`)

export const layThongTinCumRap = () => http.get(`/cinemas`)

export const layThongTinCumRapTheoHeThong = (maHeThongRap) => http.get(`/QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${maHeThongRap}`)