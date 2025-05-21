import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faUserTag } from '@fortawesome/free-solid-svg-icons';
import useRoute from '../../hooks/useRoute';
import { LOCALSTORAGE_USER } from '../../utils/constant';
import { getLocalStorage, SwalConfig } from '../../utils/config';
import LoadingPage from '../LoadingPage';
import { LayDanhSachPhongVeService, DatVe, LayDanhSachGheSchedule } from '../../services/BookingManager';
import { datGhe, layDanhSachPhongVe, xoaDanhSachGheDangDat } from '../../redux/reducers/BookingReducer';
import { callApiThongTinNguoiDung } from '../../redux/reducers/UserReducer';
import { layThongTinPhong } from '../../services/CinemaService';

const BookingTicketPage = () => {
    const dispatch = useDispatch();
    const { thongTinPhim, danhSachGhe } = useSelector(state => state.BookingReducer.chiTietPhongVe);
    const { danhSachGheDangDat } = useSelector(state => state.BookingReducer);
    const { thongTinNguoiDung } = useSelector(state => state.UserReducer);

    const { param, navigate } = useRoute();
    const [isLoading, setIsLoading] = useState(true);
    const [seatConfig, setSeatConfig] = useState({ maxSeatNumber: 9, maxSeatRow: 5 });

    useEffect(() => {
        if (!getLocalStorage(LOCALSTORAGE_USER)) return navigate('/login');
        dispatch(callApiThongTinNguoiDung);
        (async () => {
            try {
                const sch = (await LayDanhSachPhongVeService(param.id)).data;
                const allSeats = (await LayDanhSachGheSchedule()).data;
                const rooms = (await layThongTinPhong()).data;
                const room = rooms.find(r => r.roomId === sch.roomId);
                if (room) {
                    setSeatConfig({
                        maxSeatNumber: room.numCol,
                        maxSeatRow: room.numRow
                    });
                }

                const phim = {
                    movieId: sch.movieId,
                    movieName: sch.movieName,
                    cinemaName: sch.cinemaName,
                    roomName: room?.roomName,
                    scheduleDate: moment(sch.scheduleDate).format('DD-MM-YYYY'),
                    scheduleStart: sch.scheduleStart,
                    scheduleEnd: sch.scheduleEnd
                };

                const seats = allSeats
                    .filter(s => s.scheduleId === sch.scheduleId)
                    .map(s => ({
                        seatScheduleId: s.seatScheduleId || s.seatScheduleId || s.seatScheduleID || s.seatSchedule?.id || s.id,
                        seatId: s.seatId,
                        seatType: s.seatType,
                        seatRow: s.seatRow,
                        seatNumber: s.seatNumber,
                        seatPrice: s.seatPrice,
                        seatState: s.seatState,
                        username: ''
                    }));

                dispatch(layDanhSachPhongVe({ thongTinPhim: phim, danhSachGhe: seats }));
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        })();
        return () => dispatch(xoaDanhSachGheDangDat());
    }, [dispatch, navigate, param.id]);

    const renderSeats = () => {
        const { maxSeatNumber, maxSeatRow } = seatConfig;
        const seatRows = Array.from({ length: maxSeatRow }, (_, i) => String.fromCharCode(65 + i));
        const groupedSeats = _.groupBy(danhSachGhe, 'seatRow');

        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {seatRows.map((row) => {
                    const seats = groupedSeats[row] || [];
                    const rowSeats = Array.from({ length: maxSeatNumber }, (_, index) => {
                        return (groupedSeats[row] || []).find(s => Number(s.seatNumber) === index + 1);
                    });

                    return (
                        <div key={row} style={{ display: 'flex', alignItems: 'center', margin: '4px 0' }}>
                            <div style={{ width: 20, marginRight: 8, fontWeight: 'bold' }}>{row}</div>
                            {rowSeats.map((ghe, i) => {
                                if (!ghe) {
                                    return <div key={i} style={{ width: 40, height: 40, margin: 4 }} />;
                                }

                                const booked = ghe.seatState;
                                const selecting = danhSachGheDangDat.some(d => d.seatId === ghe.seatId);
                                const mine = thongTinNguoiDung.username === ghe.username;

                                let background = '#fff';
                                let border = 'none';
                                if (booked) {
                                    background = '#ccc';
                                } else if (selecting) {
                                    background = '#F97316';
                                } else if (ghe.seatType?.toLowerCase() === 'vip') {
                                    background = '#ffd700';
                                } else if (ghe.seatType?.toLowerCase() === 'couple') {
                                    background = '#ff69b4';
                                } else {
                                    background = '#008000';
                                }

                                if (mine) {
                                    background = '#fff';
                                    border = '2px solid #ffa500';
                                }

                                return (
                                    <button
                                        key={ghe.seatId}
                                        disabled={booked}
                                        onClick={() => dispatch(datGhe({ ...ghe, username: thongTinNguoiDung?.username || '' }))}
                                        style={{
                                            width: 40,
                                            height: 40,
                                            margin: 4,
                                            borderRadius: 8,
                                            fontWeight: 'bold',
                                            background,
                                            border,
                                            color: booked ? '#fff' : '#000',
                                            cursor: booked ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            transition: 'transform 0.2s ease',
                                        }}
                                    >
                                        {booked ? (mine ? <FontAwesomeIcon icon={faUserTag} /> : <FontAwesomeIcon icon={faXmark} />) : ghe.seatNumber}
                                    </button>
                                );
                            })}
                        </div>
                    );
                })}

                {/* Legend */}
                <div style={{ marginTop: 80, display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 24, height: 24, background: '#FF69B4', borderRadius: 4 }}></div>
                        <span>Ghế tình yêu</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 24, height: 24, background: '#008000', borderRadius: 4 }}></div>
                        <span>Ghế thường</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 24, height: 24, background: '#ffd700', borderRadius: 4 }}></div>
                        <span>Ghế VIP</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 24, height: 24, background: '#F97316', borderRadius: 4 }}></div>
                        <span>Đang chọn</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 24, height: 24, background: '#ccc', borderRadius: 4 }}></div>
                        <span>Đã đặt</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 24, height: 24, background: '#fff', border: '2px solid #ffa500', borderRadius: 4 }}></div>
                        <span>Ghế của bạn</span>
                    </div>
                </div>
            </div>
        );
    };

    const handleDatVe = async () => {
        if (!danhSachGheDangDat.length) {
            return SwalConfig('Vui lòng chọn ghế', 'warning', true);
        }

        setIsLoading(true);
        try {
            const payload = {
                scheduleId: parseInt(param.id),
                userId: thongTinNguoiDung?.id || '',
                seats: danhSachGheDangDat.map(ghe => ({
                    seatScheduleId: ghe.seatScheduleId
                })),
                foodAndDrinks: []
            };

            await DatVe(payload);

            SwalConfig('Đặt vé thành công', 'success');
            dispatch(xoaDanhSachGheDangDat());
            dispatch(callApiThongTinNguoiDung);
        } catch (error) {
            console.error('Lỗi đặt vé:', error);
            SwalConfig('Đặt vé thất bại', 'error');
        } finally {
            setIsLoading(false);
        }
    };




    const items = [
        {
            label: <span style={{ fontSize: '20px', fontWeight: 'bold' }}>01. Chọn ghế & Đặt vé</span>, key: '1',
            children: (
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, padding: 16 }}>
                    <div>
                        <div style={{ position: 'relative', textAlign: 'center', marginBottom: 16 }}>
                            <div style={{ width: '100%', height: 0, borderBottom: '40px solid #ccc', borderLeft: '60px solid transparent', borderRight: '60px solid transparent' }} />
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff', fontWeight: '600' }}>SCREEN</div>
                        </div>
                        {renderSeats()}
                    </div>
                    <div style={{ background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', fontSize: 20, fontWeight: '500', textAlign: 'left' }}>
                        <h3 style={{ fontSize: 30, fontWeight: '700', textAlign: 'center', color: '#f97316', marginBottom: 16, marginTop: 10, borderBottom: '2px solid #f97316' }}>
                            {_.sumBy(danhSachGheDangDat, 'seatPrice').toLocaleString()} VND
                        </h3>
                        <div style={{ marginBottom: 16, marginTop: 10, fontSize: 20, fontWeight: '350', textAlign: 'left' }}>
                            <h4 style={{ fontSize: 25, fontWeight: '600', textAlign: 'center' }}>{thongTinPhim.movieName}</h4>
                            <p style={{ marginBottom: 16, marginTop: 10, color: 'grey' }}><strong style={{ color: 'black' }}>Cụm rạp:</strong> {thongTinPhim.cinemaName}</p>
                            <p style={{ marginBottom: 16, marginTop: 10, color: 'grey' }}><strong style={{ color: 'black' }}>Phòng chiếu:</strong> {thongTinPhim.roomName}</p>
                            <p style={{ marginBottom: 16, marginTop: 10, color: 'grey' }}><strong style={{ color: 'black' }}>Ngày chiếu:</strong> {thongTinPhim.scheduleDate}</p>
                            <p style={{ marginBottom: 16, marginTop: 10, color: 'grey' }}><strong style={{ color: 'black' }}>Suất chiếu:</strong> {thongTinPhim.scheduleStart} ~ {thongTinPhim.scheduleEnd}</p>
                        </div>
                        <div>
                            <strong>Ghế đã chọn:</strong>
                            <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 8 }}>
                                {_.sortBy(danhSachGheDangDat, 'seatNumber').map(g => (
                                    <span key={g.seatId} style={{ padding: '4px 8px', margin: 4, background: '#ffedd5', borderRadius: 4, color: '#c2410c' }}>
                                        {g.seatRow}{g.seatNumber}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div style={{ margin: '16px 0', fontWeight: '350' }}>
                            <p style={{ marginBottom: 16, marginTop: 10, color: 'grey' }}><strong style={{ color: 'black' }}>Email:</strong> {thongTinNguoiDung.email}</p>
                            <p style={{ marginBottom: 50, marginTop: 10, color: 'grey' }}><strong style={{ color: 'black' }}>Phone:</strong> {thongTinNguoiDung.phoneNumber}</p>
                        </div>
                        <button
                            onClick={() => {
                                if (danhSachGheDangDat.length === 0) {
                                    SwalConfig('Vui lòng chọn ít nhất 1 ghế để chọn combo', 'warning', true);
                                    return;
                                }

                                const userId = thongTinNguoiDung?.id;
                                if (!userId) {
                                    SwalConfig('Thiếu thông tin người dùng', 'error', true);
                                    return;
                                }

                                const bookingInfo = {
                                    scheduleId: Number(param.id),
                                    userId: userId,
                                    cinemaName: thongTinPhim?.cinemaName,
                                    seats: danhSachGheDangDat.map(ghe => ({
                                        seatScheduleId: ghe.seatScheduleId
                                    }))
                                };

                                localStorage.setItem('booking_info', JSON.stringify(bookingInfo));
                                navigate('/foodanddrink');
                            }}
                            style={{
                                width: '100%',
                                padding: '12px 0',
                                background: '#10b981',
                                border: 'none',
                                borderRadius: 8,
                                color: '#fff',
                                fontWeight: '700',
                                cursor: 'pointer',
                                marginBottom: 12,
                            }}
                        >
                            CHỌN COMBO
                        </button>
                        <button className='dat_ve_button' onClick={handleDatVe} style={{ width: '100%', padding: '12px 0', background: '#f97316', border: 'none', borderRadius: 8, color: '#fff', fontWeight: '700', cursor: 'pointer' }}>
                            ĐẶT VÉ
                        </button>
                    </div>
                </div>
            )
        }
    ];

    return isLoading ? <LoadingPage /> : <Tabs items={items} style={{ marginTop: 80, padding: '0 16px' }} />;
};

export default BookingTicketPage;
