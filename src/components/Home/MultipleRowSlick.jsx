import React from 'react';
import { Card } from 'antd';
import Slider from "react-slick";
import useRoute from '../../hooks/useRoute';

export default function MultipleRowSlick({ arrFilm }) {
    const { navigate } = useRoute();

    const films = [...arrFilm];

    function SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{ ...style, background: "transparent" }}
                onClick={onClick}
            />
        );
    }

    function SamplePrevArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{ ...style, background: "transparent" }}
                onClick={onClick}
            />
        );
    }

    const settings = {
        className: "center",
        centerMode: true,
        infinite: true,
        centerPadding: "40px",
        slidesToShow: 4,
        speed: 500,
        rows: 2,
        slidesPerRow: 1,
        slidesToScroll: 1,
        initialSlide: 2,
        dots: false,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    centerPadding: "0",
                    rows: 2,
                    slidesPerRow: 1,
                }
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 2,
                    centerPadding: "0",
                    rows: 2,
                    slidesPerRow: 1,
                }
            },
        ],
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
    };

    return (
        <div className='animate__animated animate__fadeInUp animate__fast pb-4'>
            <Slider {...settings}>
                {films.map((film, index) => (
                    <Card className='slick-card' variant="outlined" key={index}>
                        <div className="flip-card">
                            <div className="flip-card-inner">
                                <div className="flip-card-front">
                                    <img
                                        src={film.moviePoster}
                                        className='w-full h-full'
                                        alt={film.moviePoster}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://www.elle.vn/app/uploads/2023/01/19/513311/Phim-dien-anh-Ant-Man-and-the-wasp.jpg';
                                        }}
                                    />
                                </div>
                                <div className="flip-card-back">
                                    <div className='overlay-card-back'></div>
                                    <img
                                        src={film.moviePoster}
                                        className='w-full h-full'
                                        alt={film.moviePoster}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://www.elle.vn/app/uploads/2023/01/19/513311/Phim-dien-anh-Ant-Man-and-the-wasp.jpg';
                                        }}
                                    />
                                    <button
                                        onClick={() => navigate(`/detail/${film.movieId}`, {
                                            state: { movieName: film.movieName }
                                        })}
                                        className='btn-card text-base uppercase'
                                    >
                                        Mua Vé
                                    </button>
                                </div>
                            </div>
                        </div>
                        <h2 className='film-name-card mt-3 uppercase font-medium'>
                            {film.movieName.length > 26 ? film.movieName.slice(0, 26) + '...' : film.movieName}
                        </h2>
                    </Card>
                ))}
            </Slider>
        </div>
    );
}
