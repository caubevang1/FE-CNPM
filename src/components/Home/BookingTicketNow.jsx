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
        const rapMap = {};
        lichChieu.forEach(item => {
            if (!rapMap[item.cinemaName]) {
                rapMap[item.cinemaName] = [];
            }
            rapMap[item.cinemaName].push(item);
        });

        return Object.keys(rapMap).map(tenCumRap => ({
            tenCumRap,
            lichChieuPhim: rapMap[tenCumRap],
        }));
    };

    const callApiLichChieuTheoPhim = async (movieId) => {
        try {
            const res = await LayThongTinLichChieu();
            const lichChieu = res.data || [];
            const filteredLichChieu = lichChieu.filter(item => item.movieId === Number(movieId));
            const danhSachRap = layDanhSachCumRap(filteredLichChieu);

            setState({
                danhSachDuLieu: {
                    phim: props.arrFilm,
                    rap: danhSachRap,
                    lichChieu: [],
                },
                lichChieuDangChon: '',
            });
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
            setState({
                danhSachDuLieu: {
                    phim: props.arrFilm,
                    rap: [],
                    lichChieu: [],
                },
                lichChieuDangChon: '',
            });
        }
    };

    const handleChange = async (e) => {
        const { name, value } = e.target;

        if (name === 'phimDangChon') {
            if (value !== '') {
                await callApiLichChieuTheoPhim(value);
            }
            return;
        }

        if (name === 'rapDangChon') {
            if (value === '') {
                setState(prev => ({
                    ...prev,
                    danhSachDuLieu: {
                        ...prev.danhSachDuLieu,
                        lichChieu: [],
                    },
                    lichChieuDangChon: '',
                }));
                return;
            }

            const selectedRap = state.danhSachDuLieu.rap[parseInt(value)];
            setState(prev => ({
                ...prev,
                danhSachDuLieu: {
                    ...prev.danhSachDuLieu,
                    lichChieu: selectedRap.lichChieuPhim,
                },
                lichChieuDangChon: '',
            }));
            return;
        }

        if (name === 'lichChieuDangChon') {
            setState(prev => ({
                ...prev,
                lichChieuDangChon: value,
            }));
        }
    };

    const handleOnSubmit = (e) => {
        e.preventDefault();

        if (state.lichChieuDangChon && state.lichChieuDangChon !== '') {
            navigate(`booking/${state.lichChieuDangChon}`);
        } else {
            SwalConfig('Vui lòng chọn đầy đủ thông tin', 'error', true);
        }
    };

    return (
        <div className='bg-white rounded-lg shadow-2xl text-white py-7 px-8 w-full xl:w-3/4 mx-auto translate-y-[-50%] hidden md:block'>
            <form onSubmit={handleOnSubmit} className="grid md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7 gap-2">
                {/* Dropdown phim */}
                <select name='phimDangChon' onChange={handleChange} className='text-black border-2 rounded-md border-slate-600 cursor-pointer 2xl:col-span-2 h-[2.5rem]'>
                    <option value="">Phim</option>
                    {state.danhSachDuLieu.phim?.map((item, index) => (
                        <option key={index} value={item.movieId}>{item.movieName}</option>
                    ))}
                </select>

                {/* Dropdown rạp */}
                <select name='rapDangChon' onChange={handleChange} className='text-black border-2 rounded-md border-slate-600 cursor-pointer 2xl:col-span-2 h-[2.5rem]'>
                    <option value="">Rạp</option>
                    {state.danhSachDuLieu.rap?.map((item, index) => (
                        <option key={index} value={index}>{item.tenCumRap}</option>
                    ))}
                </select>

                {/* Dropdown lịch chiếu */}
                <select name='lichChieuDangChon' onChange={handleChange} className='text-black border-2 rounded-md border-slate-600 cursor-pointer 2xl:col-span-2 h-[2.5rem]'>
                    <option value="">Ngày giờ chiếu</option>
                    {state.danhSachDuLieu.lichChieu?.map((item, index) => {
                        const date = moment(item.scheduleDate).format("DD-MM-YYYY");
                        const start = moment(item.scheduleStart, "HH:mm:ss").format("hh:mm A");
                        const end = moment(item.scheduleEnd, "HH:mm:ss").format("hh:mm A");
                        return (
                            <option key={index} value={item.scheduleId}>
                                {`${date} ~ ${start} - ${end}`}
                            </option>
                        );
                    })}
                </select>

                {/* Nút submit */}
                <button type='submit' className='p-2 bg-orange-400 rounded-md font-semibold tracking-wide h-[2.5rem]'>
                    Đặt Vé Nhanh
                </button>
            </form>
        </div>
    );
}
