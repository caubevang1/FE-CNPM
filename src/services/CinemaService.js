import { http } from "../utils/baseUrl";
import { GROUPID } from "../utils/constant";

export const LayThongTinLichChieuHeThongRap = () => http.get(`/schedule`)

export const LayThongTinLichChieu = () => http.get(`/schedule`)

export const LayThongTinLichChieuChiTiet = (scheduleId) => http.get(`/schedule/${scheduleId}`)

// export const layThongTinHeThongRap = () => http.get(`/cinemas`)

export const layThongTinCumRap = () => http.get(`/cinemas`)

export const layThongTinCumRapTheoHeThong = () => http.get(`/cinemas`)

export const layThongTinPhong = () => http.get(`/rooms`)