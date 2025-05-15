import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import moment from 'moment';
import { useLocation } from 'react-router-dom';
import useRoute from '../../hooks/useRoute';
import { layThongTinCumRap, LayThongTinLichChieu } from '../../services/CinemaService';

export default function ShowtimeDetail() {
    const { navigate } = useRoute();
    const location = useLocation();
    const movieName = location.state?.movieName || '';

    const [cumRapChieu, setCumRapChieu] = useState([]);
    const [lichChieu, setLichChieu] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const lichChieuRes = await LayThongTinLichChieu();
            const filteredLichChieu = lichChieuRes.data.filter(
                (lich) => lich.movieName === movieName
            );
            setLichChieu(filteredLichChieu);

            const cumRapRes = await layThongTinCumRap();
            setCumRapChieu(cumRapRes.data);
        };

        if (movieName) {
            fetchData();
        }
    }, [movieName]);

    const renderDanhSachLichChieu = (cinemaName) => {
        return lichChieu
            .filter(lich => lich.cinemaName === cinemaName)
            .map((itemLichChieu) => ({
                key: itemLichChieu.scheduleId,
                scheduleDate: itemLichChieu.scheduleDate,
                scheduleStart: itemLichChieu.scheduleStart,
                scheduleEnd: itemLichChieu.scheduleEnd,
                label: (
                    <button
                        onClick={() => {
                            navigate(`/booking/${itemLichChieu.scheduleId}`);
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                    >
                        Đặt vé
                    </button>
                ),
            }));
    };

    const renderCumRap = () => {
        return cumRapChieu
            .filter((itemRap) =>
                lichChieu.some((lich) => lich.cinemaName === itemRap.cinemaName)
            )
            .map((itemRap, iCumRap) => {
                const lichChieuItems = renderDanhSachLichChieu(itemRap.cinemaName);

                return {
                    label: (
                        <div className="text-left border-b pb-4">
                            <h2 className="text-green-500 font-bold text-base">{itemRap.cinemaName}</h2>
                        </div>
                    ),
                    key: iCumRap,
                    children: (
                        <Tabs
                            tabPosition="left"
                            defaultActiveKey="1"
                            items={lichChieuItems.map((itemLich) => ({
                                key: itemLich.key,
                                label: (
                                    <span>
                                        {moment(itemLich.scheduleDate).format('DD-MM-YYYY')} -{' '}
                                        {moment(`${itemLich.scheduleDate} ${itemLich.scheduleStart}`).format('HH:mm')}
                                    </span>
                                ),
                                children: (
                                    <button
                                        onClick={() => {
                                            navigate(`/booking/${itemLich.key}`);
                                        }}
                                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                                    >
                                        Đặt vé
                                    </button>
                                ),
                            }))}
                        />
                    ),
                };
            });
    };

    return (
        <>
            {lichChieu.length > 0 && cumRapChieu.length > 0 ? (
                <>
                    {/* Desktop view */}
                    <div id="showtime" className="container hidden lg:block bg-white showtimeTab mb-8 mt-24 scroll-mt-[11rem]">
                        <Tabs
                            className="shadow-xl pt-3"
                            tabPosition="left"
                            defaultActiveKey="1"
                            items={renderCumRap()}
                        />
                    </div>

                    {/* Mobile view */}
                    <div className="container block lg:hidden mt-4">
                        {renderCumRap().map((itemCumRap) => (
                            <div key={itemCumRap.key}>
                                <h2 className="text-white bg-orange-400 my-2">{itemCumRap.label}</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {itemCumRap.children.props.items.map((itemLich, iLich) => (
                                        <button
                                            key={iLich}
                                            onClick={() => {

                                                navigate(`/booking/${itemLich.key}`);
                                            }}
                                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition duration-300 w-full"
                                        >
                                            Đặt vé
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <h2 className="text-white text-center my-6 text-2xl">Hiện tại không có lịch chiếu</h2>
            )}
        </>
    );
}
