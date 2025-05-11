import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import moment from 'moment';
import { useLocation } from 'react-router-dom';
import useRoute from '../../hooks/useRoute';
import { layThongTinCumRap, LayThongTinLichChieu } from '../../services/CinemaService';

export default function ShowtimeDetail() {
    const { navigate } = useRoute();
    const location = useLocation();
    const movieName = location.state?.movieName || ''; // Lấy movieName từ route state

    const [cumRapChieu, setCumRapChieu] = useState([]);
    const [lichChieu, setLichChieu] = useState([]);

    // Lấy dữ liệu khi có movieName
    useEffect(() => {
        const fetchData = async () => {
            const lichChieuRes = await LayThongTinLichChieu();
            const filteredLichChieu = lichChieuRes.data.filter(
                (lich) => lich.movieName === movieName // Chỉ lọc lịch chiếu của phim hiện tại
            );
            setLichChieu(filteredLichChieu);

            const cumRapRes = await layThongTinCumRap();
            setCumRapChieu(cumRapRes.data);
        };

        if (movieName) {
            fetchData();
        }
    }, [movieName]);

    // Render lịch chiếu cho từng rạp
    const renderDanhSachLichChieu = (cinemaName) => {
        return lichChieu
            .filter(lich => lich.cinemaName === cinemaName) // Chỉ lọc lịch chiếu của rạp đó
            .map((itemLichChieu) => ({
                key: itemLichChieu.scheduleId,
                scheduleDate: itemLichChieu.scheduleDate,
                scheduleStart: itemLichChieu.scheduleStart,
                scheduleEnd: itemLichChieu.scheduleEnd,
                label: (
                    <button
                        onClick={() => {
                            // In ra thông tin trước khi navigate
                            console.log(`Navigating to booking page with scheduleId: ${itemLichChieu.scheduleId}`);
                            console.log(`Movie Name: ${movieName}`);

                            // Chuyển hướng đến trang đặt vé
                            navigate(`/booking/${itemLichChieu.scheduleId}`);
                        }}
                        className="bg-gray-100 mt-[-1rem] hover:bg-gray-300 border-2 text-white font-bold py-2 px-4 rounded inline-block"
                    >
                        <span className="text-green-500">
                            {moment(itemLichChieu.scheduleDate).format('DD-MM-YYYY ~ ')}
                        </span>
                        <span className="text-orange-500">
                            {moment(`${itemLichChieu.scheduleDate} ${itemLichChieu.scheduleStart}`).format('HH:mm')} - {moment(`${itemLichChieu.scheduleDate} ${itemLichChieu.scheduleEnd}`).format('HH:mm')}
                        </span>
                    </button>
                ),
            }));
    };

    // Render các cụm rạp và lịch chiếu của chúng
    const renderCumRap = () => {
        return cumRapChieu
            .filter((itemRap) =>
                lichChieu.some((lich) => lich.cinemaName === itemRap.cinemaName) // Kiểm tra xem rạp có lịch chiếu cho phim này không
            )
            .map((itemRap, iCumRap) => {
                const lichChieuItems = renderDanhSachLichChieu(itemRap.cinemaName); // Lọc lịch chiếu của rạp

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
                                    <>
                                        <span className="text-green-500">
                                            {moment(itemLich.scheduleDate).format('DD-MM-YYYY ~ ')}
                                        </span>
                                        <span className="text-orange-500">
                                            {moment(`${itemLich.scheduleDate} ${itemLich.scheduleStart}`).format('HH:mm')} - {moment(`${itemLich.scheduleDate} ${itemLich.scheduleEnd}`).format('HH:mm')}
                                        </span>
                                    </>
                                ),
                                children: (
                                    <button
                                        onClick={() => {
                                            // In ra thông tin trước khi navigate
                                            console.log(`Navigating to booking page with scheduleId: ${itemLich.key}`);

                                            // Chuyển hướng đến trang đặt vé
                                            navigate(`/booking/${itemLich.key}`);
                                        }}
                                        className="bg-gray-100 mt-[-1rem] hover:bg-gray-300 border-2 text-white font-bold py-2 px-4 rounded inline-block"
                                    >
                                        {moment(`${itemLich.scheduleDate} ${itemLich.scheduleStart}`).format('HH:mm')} - {moment(`${itemLich.scheduleDate} ${itemLich.scheduleEnd}`).format('HH:mm')}
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
                                                // In ra thông tin trước khi navigate
                                                console.log(`Navigating to booking page with scheduleId: ${itemLich.key}`);

                                                // Chuyển hướng đến trang đặt vé
                                                navigate(`/booking/${itemLich.key}`);
                                            }}
                                            className="bg-gray-100 hover:bg-gray-300 border-2 text-white font-bold py-1 rounded"
                                        >
                                            <span className="text-green-500">
                                                {moment(itemLich.scheduleDate).format('DD-MM-YYYY ~ ')}
                                            </span>
                                            <span className="text-orange-500">
                                                {moment(`${itemLich.scheduleDate} ${itemLich.scheduleStart}`).format('HH:mm')} - {moment(`${itemLich.scheduleDate} ${itemLich.scheduleEnd}`).format('HH:mm')}
                                            </span>
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
