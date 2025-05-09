import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import moment from 'moment';
import { useLocation } from 'react-router-dom';
import useRoute from '../../hooks/useRoute';
import { layThongTinCumRap, LayThongTinLichChieu } from '../../services/CinemaService';
import { LayDanhSachPhim } from '../../services/FilmService';

export default function MenuCinema() {
    const location = useLocation();
    const { navigate } = useRoute();

    const [cumRapList, setCumRapList] = useState([]);
    const [phimList, setPhimList] = useState([]);
    const [lichChieuList, setLichChieuList] = useState([]);

    useEffect(() => {
        layThongTinCumRap().then(res => setCumRapList(res.data)).catch(console.error);
        LayDanhSachPhim().then(res => setPhimList(res.data)).catch(console.error);
        LayThongTinLichChieu().then(res => setLichChieuList(res.data)).catch(console.error);
    }, []);

    useEffect(() => {
        if (location.hash) {
            const elem = document.getElementById(location.hash.slice(1));
            if (elem) elem.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }
    }, [location]);

    // Hàm lọc các phim có lịch chiếu tại rạp cụ thể
    const renderDanhSachPhim = (itemCumRap) => {
        // Lọc ra các lịch chiếu của cụm rạp này
        const lichChieuCumRap = lichChieuList.filter(
            (schedule) => schedule.cinemaName === itemCumRap.cinemaName
        );

        // Lọc các phim có suất chiếu tại cụm rạp này và phim đang chiếu hoặc sắp chiếu
        const phimTabs = phimList.filter(itemPhim => {
            const lichChieuTheoPhim = lichChieuCumRap.filter(
                (lc) => lc.movieName === itemPhim.movieName
            );

            // Lọc phim sắp chiếu hoặc đang chiếu
            const releaseDate = moment(itemPhim.releaseDate);
            const currentDateTime = moment(); // Thời gian hiện tại

            // Kiểm tra nếu ngày phát hành sau ngày hiện tại
            const isPhimSapChieu = releaseDate.isAfter(currentDateTime, 'day');
            const isSameDayAndAfterTime = releaseDate.isSame(currentDateTime, 'day') && moment(itemPhim.releaseTime, 'HH:mm:ss').isAfter(currentDateTime, 'minute');

            // Phim sắp chiếu nếu ngày phát hành sau hôm nay hoặc nếu là ngày hôm nay và giờ phát hành sau giờ hiện tại
            return (lichChieuTheoPhim.length > 0 && !isPhimSapChieu && !isSameDayAndAfterTime);
        }).map((itemPhim, i) => {
            const lichChieuTheoPhim = lichChieuCumRap.filter(
                (lc) => lc.movieName === itemPhim.movieName
            );

            return {
                label: (
                    <div className="flex border-b pb-4">
                        <div className="mr-4">
                            <img
                                className='h-[130px] w-[100px] object-cover'
                                src={itemPhim.moviePoster}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://tophinhanhdep.com/wp-content/uploads/2021/10/Movie-Wallpapers.jpg';
                                }}
                            />
                        </div>
                        <div>
                            <h2 className="font-bold text-left mb-2 text-sm uppercase">
                                <span className="bg-red-600 p-1 rounded-md text-white text-sm">
                                    {itemPhim.hot === true ? 'C18' : 'C16'}
                                </span>{' '}{itemPhim.movieName}
                            </h2>
                            <div className="grid grid-cols-2 gap-1">
                                {lichChieuTheoPhim.slice(0, 4).map((lichChieu, index) => (
                                    <button
                                        key={index}
                                        onClick={() => navigate(`booking/${lichChieu.movieName}`)}
                                        className="bg-gray-100 hover:bg-gray-300 border-2 text-white font-bold py-2 px-4 rounded"
                                    >
                                        <span className="text-green-500">
                                            {moment(lichChieu.scheduleDate).format('DD-MM-YYYY ~ ')}
                                        </span>
                                        <span className="text-orange-500">
                                            {moment(lichChieu.scheduleStart, 'HH:mm:ss').format('hh:mm A')}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ),
                key: i.toString(),
                children: null,
            };
        });

        return (
            <Tabs
                tabPosition="left"
                defaultActiveKey="0"
                items={phimTabs}
            />
        );
    };

    return (
        <>
            {cumRapList.length ? (
                <div id="menuCinema" className="MenuCinemaTabs hidden lg:block my-8">
                    <Tabs
                        className="shadow-xl pt-3"
                        tabPosition="left"
                        defaultActiveKey="0"
                        items={cumRapList.map((itemCumRap, index) => ({
                            label: (
                                <div className="text-left border-b pb-4">
                                    <h2 className="text-green-500 font-bold text-base">
                                        {itemCumRap.cinemaName}
                                    </h2>
                                    <h3 className="text-gray-500 font-semibold text-sm">
                                        {itemCumRap.cinemaAddress}
                                    </h3>
                                </div>
                            ),
                            key: index.toString(),
                            children: renderDanhSachPhim(itemCumRap),
                        }))}
                    />
                </div>
            ) : (
                <h2 className="text-white text-center my-6 text-2xl">Hiện tại không có lịch chiếu</h2>
            )}
        </>
    );
}
