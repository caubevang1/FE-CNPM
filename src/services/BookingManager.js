import { http } from "../utils/baseUrl";
import { ThongTinDatVe } from "../_core/models/ThongTinDatVe";


export const LayDanhSachPhongVeService = (movieId) => http.get(`QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=${movieId}`)

// export const DatVe = (thongTinDatVe = new ThongTinDatVe()) => http.post(`QuanLyDatVe/DatVe`, thongTinDatVe)

export const TaoLichChieu = (dataLichChieu) => http.post(`schedule`, dataLichChieu)