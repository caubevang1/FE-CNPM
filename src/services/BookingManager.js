import { http } from "../utils/baseUrl";
import { ThongTinDatVe } from "../_core/models/ThongTinDatVe";


export const LayDanhSachPhongVeService = (scheduleId) => http.get(`schedule/${scheduleId}`)

export const DatVe = (thongTinDatVe = new ThongTinDatVe()) => http.post(`booking`, thongTinDatVe)

export const TaoLichChieu = (dataLichChieu) => http.post(`schedule`, dataLichChieu)

export const LayDanhSachGhe = () => http.get(`seats`)