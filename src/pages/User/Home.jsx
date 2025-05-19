import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MovieList from '../../components/Home/MovieList';
import HomeCarousel from '../../components/Home/HomeCarousel';
import MenuCinema from '../../components/Home/MenuCinema';
import LoadingPage from '../LoadingPage';
import { callApiFilm } from '../../redux/reducers/FilmReducer';
import { LayHeThongRapChieu } from '../../redux/reducers/CinemaReducer';
import { history } from '../../utils/history';
import { LayThongTinLichChieu } from '../../services/CinemaService';

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const { arrFilm } = useSelector(state => state.FilmReducer);
    const { heThongRapChieu } = useSelector(state => state.CinemaReducer);

    const dispatch = useDispatch();

    useEffect(() => {
        // Scroll to top on route change
        const unlisten = history.listen(() => {
            window.scrollTo(0, 0);
        });

        dispatch(callApiFilm);

        const getApiHeThongRapChieu = async () => {
            try {
                const apiHeThongRap = await LayThongTinLichChieu();
                dispatch(LayHeThongRapChieu(apiHeThongRap.data));
                setIsLoading(false);
            } catch (error) {
                console.log(error);
            }
        };
        getApiHeThongRapChieu();
        return () => {
            unlisten();
        };
    }, [dispatch]);

    return (
        <div>
            {isLoading ? (
                <LoadingPage />
            ) : (
                <>
                    <HomeCarousel />
                    <MovieList arrFilm={arrFilm} />
                    <MenuCinema heThongRapChieu={heThongRapChieu} />
                </>
            )}
        </div>
    );
}
