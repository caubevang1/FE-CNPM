import { http } from "../utils/baseUrl";

export const LayThongTinTaiKhoan = () => http.get('/users/myInfo')

export const LayThongTinPhimNguoiDungEdit = (user) => http.get(`/users/${user.id}`)

export const DangNhap = userLogin => http.post('/auth/login', userLogin)

export const DangKy = userRegister => http.post('/users/sign-up', userRegister)

export const LayDanhSachNguoiDung = () => http.get(`/users`)

export const XoaNguoiDung = (ID) => http.delete(`/users/${ID}`)

export const LayDanhSachLoaiNguoiDung = () => http.get(`/roles`)

export const CapNhatThongTinNguoiDung = (user) => http.put(`/users/${user.id}`, user)

export const sendOtpEmail = (data) => http.post('/auth/forget-password', data);

export const resetPasswordWithOtp = (otp, data) => http.post(`/auth/reset-password/${otp}`, data);

export const LayThongTinBooking = () => http.get('/booking/myBooking')