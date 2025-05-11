import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Progress, Modal } from 'antd';
import moment from 'moment';
import useRoute from '../../hooks/useRoute';
import { getfilmDetail } from '../../redux/reducers/FilmReducer';
import LoadingPage from '../LoadingPage';
import { history } from '../../utils/history';
import { getModalVideo } from '../../redux/reducers/BannerReducer';
import { LayThongTinLichChieuChiTiet, LayThongTinLichChieu } from '../../services/CinemaService';
import { layThongTinCumRap } from '../../services/CinemaService';
import { layThongTinPhong } from '../../services/CinemaService';
import ShowtimeDetail from '../../components/Detail/ShowtimeDetail';
import { LayThongTinPhimChiTiet } from '../../services/FilmService';

export default function Detail() {
    const [isLoadingDetail, setIsLoadingDetail] = useState(true);
    const [percent, setPercent] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cinemas, setCinemas] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [showtimes, setShowtimes] = useState([]);

    const { filmDetail } = useSelector((state) => state.FilmReducer);
    const dataVideoModal = useSelector((state) => state.BannerReducer.modalData);

    const { param } = useRoute();
    const dispatch = useDispatch();

    useEffect(() => {
        const unlisten = history.listen(() => {
            window.scrollTo(0, 0);
        });

        // Fetch movie details and schedules
        const fetchData = async (id) => {
            try {
                // Fetching movie details
                const apiChiTiet = await LayThongTinPhimChiTiet(id);
                dispatch(getfilmDetail(apiChiTiet.data));
                setIsLoadingDetail(false);
                setPercent(apiChiTiet.data.movieReview * 20);

                // Fetch cinema details
                const apiCinemas = await layThongTinCumRap();
                setCinemas(apiCinemas.data); // Store cinema details

                // Fetch room details
                const apiRooms = await layThongTinPhong();
                setRooms(apiRooms.data); // Store room details

                // Fetching schedules for the movie
                const apiSchedule = await LayThongTinLichChieu();
                setShowtimes(apiSchedule.data); // Store showtimes
            } catch (error) {
                history.replace('/notfound');
            }
        };

        fetchData(param.id);

        return () => {
            unlisten();
        };
    }, [dispatch, param.id]);

    const showModal = (link) => {
        dispatch(getModalVideo(link));
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // Filter showtimes based on movie id
    const filteredShowtimes = showtimes.filter(
        (showtime) => showtime.movieName === filmDetail.movieName
    );

    return (
        <div>
            {isLoadingDetail ? (
                <LoadingPage />
            ) : (
                <div className="relative film-detail">
                    <img
                        src={filmDetail.moviePoster}
                        alt=""
                        className="w-full h-[90rem] lg:h-[80rem] object-cover object-top blur-md"
                    />
                    <div className="container absolute z-[5] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[100%] p-4">
                        <div className="md:flex">
                            <img
                                className="w-[300px] md:w-[300px] h-full"
                                src={filmDetail.moviePoster}
                                alt={filmDetail.movieName}
                            />
                            <div className="md:pl-8">
                                <h2 className="text-white tracking-wide text-[1rem] md:text-[1.3rem] lg:text-[1.5rem] uppercase mb-3 font-semibold">
                                    {filmDetail.movieName}
                                </h2>
                                <div className="flex items-center text-gray-300 mb-2">
                                    <p className="mr-4">{moment(filmDetail.scheduleDate).format('DD-MM-YYYY')}</p>
                                    <p className="mr-4">{filmDetail.movieGenre}</p>
                                    <p>{filmDetail.movieLength} phút</p>
                                </div>

                                <div className="mt-4 xl:mt-0 flex items-center">
                                    {/* Wrapper for Progress, User, and Score */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',  // Sắp xếp theo hàng ngang
                                            alignItems: 'center',
                                        }}
                                    >
                                        {/* Vòng Progress */}
                                        <Progress
                                            trailColor="#e6f4ff"
                                            status="success"
                                            type="circle"
                                            percent={percent}
                                            format={(percent) => `${percent} Điểm`}
                                            style={{ marginRight: '10px' }} // Khoảng cách giữa vòng progress và các chữ
                                        />

                                        {/* Dòng "User" và "Score" */}
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <p
                                                style={{
                                                    fontSize: '22px',
                                                    fontWeight: 'bold',
                                                    color: 'white',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                User
                                            </p>
                                            <p
                                                style={{
                                                    fontSize: '22px',
                                                    fontWeight: 'bold',
                                                    color: 'white',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                Score
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-white font-bold text-xl mb-3">Description</h3>
                                    <p className="text-gray-300 tracking-wide text-justify">
                                        {filmDetail.movieDescription.length > 300
                                            ? filmDetail.movieDescription.slice(0, 300) + '...'
                                            : filmDetail.movieDescription}
                                    </p>
                                </div>
                                <div className="mt-4 xl:hidden">
                                    <a
                                        href="#showtime"
                                        className="bg-transparent tracking-widest text-[16px] hover:bg-orange-400 text-white font-semibold hover:text-white border-orange-500 border-[3px] hover:border-transparent rounded uppercase px-[5rem] py-[0.7rem]"
                                    >
                                        Đặt vé
                                    </a>
                                </div>
                            </div>

                            <div className="overlayDetail"></div>
                        </div>

                        {/* Render Cinemas and Rooms */}
                        <div id="cinemas-rooms" className="mt-6">
                            {filteredShowtimes.length > 0 ? (
                                <ShowtimeDetail heThongRapChieu={filteredShowtimes} />
                            ) : (
                                <p className="text-white">Không có lịch chiếu cho bộ phim này.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
