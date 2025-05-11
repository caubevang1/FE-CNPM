import { http } from "../utils/baseUrl";
import { GROUPID } from "../utils/constant";


export const LayDanhSachPhim = () => http.get(`/movies`)

export const LayThongTinPhimChiTiet = (id) => http.get(`/movies/${id}`)

export const themPhimUpload = (formData) => http.post(`/movies`, formData)

export const capNhatPhimUpload = (formData, id) => http.put(`/movies/${id}`, formData)

export const xoaPhim = (id) => http.delete(`/movies/${id}`)

