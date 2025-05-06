import { http } from "../utils/baseUrl";

export const LayThongTinTaiKhoan = () => http.get('/users/myInfo')

export const LayThongTinPhimNguoiDungEdit = (username) => http.get(`/user/${username}`)

export const DangNhap = userLogin => http.post('/auth/login', userLogin)

export const DangKy = userRegister => http.post('/users/sign-up', userRegister)

export const LayDanhSachNguoiDung = () => http.get(`/users`)

export const XoaNguoiDung = (ID) => http.delete(`/users/${ID}`)
// export const XoaNguoiDung = (taiKhoan) => http.delete(`/QuanLyNguoiDung/XoaNguoiDung?taiKhoan=${taiKhoan}`)

export const LayDanhSachLoaiNguoiDung = () => http.get(`/QuanLyNguoiDung/LayDanhSachLoaiNguoiDung`)

export const CapNhatThongTinNguoiDung = (user) => http.put(`/users/${user.ID}`, user)

export const ThemNguoiDungService = (user) => http.post(`/QuanLyNguoiDung/ThemNguoiDung`, user)

export const sendOtpEmail = (data) => http.post('/auth/forget-password', data);

export const resetPasswordWithOtp = (otp, data) => http.post(`/auth/reset-password/${otp}`, data);