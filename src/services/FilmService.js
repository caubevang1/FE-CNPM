import { http } from "../utils/baseUrl";


export const LayDanhSachPhim = () => http.get(`/movies`)

export const LayThongTinPhimChiTiet = (id) => http.get(`/movies/${id}`)

export const themPhim = (formData) => http.post(`/movies`, formData)

export const capNhatPhim = (formData, id) => http.put(`/movies/${id}`, formData)

export const xoaPhim = (id) => http.delete(`/movies/${id}`)

