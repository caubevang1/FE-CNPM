import { http } from "../utils/baseUrl";
import { GROUPID } from "../utils/constant";

export const LayThongTinLichChieuHeThongRap = () => http.get(`/schedule`)

export const LayThongTinLichChieu = () => http.get(`/schedule`)

export const LayThongTinLichChieuChiTiet = (scheduleId) => http.get(`/schedule/${scheduleId}`)

// export const layThongTinHeThongRap = () => http.get(`/cinemas`)

export const layThongTinCumRap = () => http.get(`/cinemas`)

export const layThongTinCumRapTheoHeThong = () => http.get(`/cinemas`)

export const layThongTinCumRapChiTiet = (id) => http.get(`/cinemas/${id}`)

export const layThongTinPhong = () => http.get(`/rooms`)

export const themCumRap = (data) => http.post(`/cinemas`, data)

export const capNhatCumRap = (data, id) => http.put(`/cinemas/${id}`, data)

export const xoaCumRap = (id) => http.delete(`/cinemas/${id}`)