import React, { useState } from 'react';
import moment from 'moment';
import { LayThongTinLichChieu } from '../../services/CinemaService';
import useRoute from '../../hooks/useRoute';
import { SwalConfig } from '../../utils/config';

export default function BookingTicketNow(props) {
    const { navigate } = useRoute();

    const [state, setState] = useState({
        danhSachDuLieu: {
            phim: props.arrFilm,
            rap: [],
            lichChieu: [],
        },
        lichChieuDangChon: '',
    });

    const layDanhSachCumRap = (lichChieu) => {
        if (!Array.isArray(lichChieu)) {
            console.error("Dữ liệu lịch chiếu không phải là mảng:", lichChieu);
            return [];
        }

        const rapMap = {};
        lichChieu.forEach(item => {
            if (!rapMap[item.cinemaName]) {
                rapMap[item.cinemaName] = [];
            }
            rapMap[item.cinemaName].push(item);
        });

        return Object.keys(rapMap).map(cinemaName => ({
            tenCumRap: cinemaName,
            lichChieuPhim: rapMap[cinemaName],
        }));
    };

    const callApiLichChieuTheoPhim = async (movieName) => {
        try {
            const res = await LayThongTinLichChieu(movieName);
            const lichChieu = res.data;

            if (!Array.isArray(lichChieu)) {
                console.error("❌ Lịch chiếu không phải là mảng:", lichChieu);
                return;
            }

            const filteredLichChieu = lichChieu.filter(item =>
                item.movieName.toLowerCase().trim() === movieName.toLowerCase().trim()
            );

            const danhSachRap = layDanhSachCumRap(filteredLichChieu);

            const danhSachDuLieu = {
                ...state.danhSachDuLieu,
                rap: danhSachRap,
                lichChieu: []
            };

            setState({
                danhSachDuLieu,
                lichChieuDangChon: ''
            });
        } catch (error) {
            console.error("🚨 Lỗi khi gọi API:", error);
            setState({
                danhSachDuLieu: {
                    ...state.danhSachDuLieu,
                    rap: [],
                    lichChieu: []
                },
                lichChieuDangChon: ''
            });
        }
    };

    const handleChange = (e) => {
        const { value, name } = e.target;
        const danhSachDuLieu = { ...state.danhSachDuLieu };

        if (name === 'phimDangChon') {
            callApiLichChieuTheoPhim(value);
            // Reset các select còn lại
            setState({
                danhSachDuLieu: {
                    phim: props.arrFilm,
                    rap: [],
                    lichChieu: []
                },
                lichChieuDangChon: ''
            });
        }

        if (name === 'rapDangChon') {
            if (value !== 'Rạp') {
                danhSachDuLieu.lichChieu = JSON.parse(value);
            } else {
                danhSachDuLieu.lichChieu = [];
            }
            setState({ danhSachDuLieu, lichChieuDangChon: '' });
        }

        if (name === 'lichChieuDangChon') {
            setState({ ...state, lichChieuDangChon: value });
        }
    };

    const handleOnSubmit = (e) => {
        e.preventDefault();
        if (state.lichChieuDangChon && state.lichChieuDangChon !== 'Ngày giờ chiếu') {
            navigate(`booking/${state.lichChieuDangChon}`);
        } else {
            SwalConfig('Vui lòng chọn đầy đủ thông tin', 'error', true);
        }
    };

    return (
        <div className='bg-white rounded-lg shadow-2xl text-white py-7 px-8 w-full xl:w-3/4 mx-auto translate-y-[-50%] hidden md:block'>
            <form onSubmit={handleOnSubmit} className="grid md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7 gap-2">
                <select name='phimDangChon' onChange={handleChange} className='text-black border-2 rounded-md border-slate-600 cursor-pointer 2xl:col-span-2 h-[2.5rem]'>
                    <option defaultValue='Phim'>Phim</option>
                    {state.danhSachDuLieu.phim?.map((item, index) => (
                        <option key={index} value={item.movieName}>{item.movieName}</option>
                    ))}
                </select>

                <select name='rapDangChon' onChange={handleChange} className='text-black border-2 rounded-md border-slate-600 cursor-pointer 2xl:col-span-2 h-[2.5rem]'>
                    <option defaultValue='Rạp'>Rạp</option>
                    {state.danhSachDuLieu.rap?.map((item, index) => (
                        <option key={index} value={JSON.stringify(item.lichChieuPhim)}>{item.tenCumRap}</option>
                    ))}
                </select>

                <select name='lichChieuDangChon' onChange={handleChange} className='text-black border-2 rounded-md border-slate-600 cursor-pointer 2xl:col-span-2 h-[2.5rem]'>
                    <option defaultValue='Ngày giờ chiếu'>Ngày giờ chiếu</option>
                    {state.danhSachDuLieu.lichChieu?.map((item, index) => {
                        const date = moment(item.scheduleDate).format("DD-MM-YYYY");
                        const start = moment(item.scheduleStart, "HH:mm:ss").format("hh:mm A");
                        const end = moment(item.scheduleEnd, "HH:mm:ss").format("hh:mm A");
                        return (
                            <option key={index} value={`${item.roomName}_${start}`}>{`${date} ~ ${start} - ${end}`}</option>
                        );
                    })}
                </select>

                <button className='p-2 bg-orange-400 rounded-md font-semibold tracking-wide h-[2.5rem]'>
                    Đặt Vé Nhanh
                </button>
            </form>
        </div>
    );
}
