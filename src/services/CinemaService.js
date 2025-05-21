import { http } from "../utils/baseUrl";

export const LayThongTinLichChieu = () => http.get(`/schedule`)

export const LayThongTinLichChieuChiTiet = (scheduleId) => http.get(`/schedule/${scheduleId}`)

export const XoaLichChieu = (scheduleId) => http.delete(`/schedule/${scheduleId}`)

export const CapNhatLichChieu = (data, scheduleId) => http.put(`/schedule/${scheduleId}`, data)

export const layThongTinPhong = () => http.get(`/rooms`)

export const layThongTinPhongChiTiet = (id) => http.get(`/rooms/${id}`)

export const themPhong = (data) => http.post(`/rooms`, data)

export const capNhatPhong = (data, id) => http.put(`/rooms/${id}`, data)

export const xoaPhong = (id) => http.delete(`/rooms/${id}`)

export const layThongTinCumRap = () => http.get(`/cinemas`)

export const layThongTinCumRapChiTiet = (id) => http.get(`/cinemas/${id}`)

export const themCumRap = (data) => http.post(`/cinemas`, data)

export const capNhatCumRap = (data, id) => http.put(`/cinemas/${id}`, data)

export const xoaCumRap = (id) => http.delete(`/cinemas/${id}`)
